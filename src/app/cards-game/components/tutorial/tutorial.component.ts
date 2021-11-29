import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit, ViewChild,
} from '@angular/core';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {PreloaderOxService} from 'ox-core';
import {ChangingRulesAnswerService} from 'src/app/shared/services/changing-rules-answer.service';
import {ChangingRulesChallengeService} from 'src/app/shared/services/changing-rules-challenge.service';
import {ScreenTypeOx} from 'ox-types';
import {Observable, Subscription, timer} from 'rxjs';
import {TutorialService} from 'src/app/shared/services/tutorial.service';
import {
  CardInfo,
  MagnifierPosition,
  TutorialStep,
  ALL_RULES,
  Rule, ChangingRulesExercise, GameRule
} from 'src/app/shared/models/types';
import {MAGNIFIER_POSITIONS} from 'src/app/shared/models/const';
import anime from 'animejs';
import {take} from 'rxjs/operators';
import {GameBodyDirective} from 'src/app/shared/directives/game-body.directive';
import {sameCard} from '../../../shared/models/functions';
import {CardComponent} from '../card/card.component';
import {RulesComponent} from '../rules/rules.component';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent extends GameBodyDirective implements OnInit {

  @ViewChild(RulesComponent) ruleComponet!: RulesComponent;

  public swiftCardOn: boolean = true;
  public tutorialExercise!: ChangingRulesExercise;
  private currentStep = 0;
  public magnifier!: MagnifierPosition | undefined;
  text: string = '';
  private steps: TutorialStep[] = [];
  readonly magnifierPositions = MAGNIFIER_POSITIONS;
  private okButtonHasBeenClick = new EventEmitter();
  private currentEndStepSubscription!: Subscription | undefined;
  public isTutorialComplete: boolean = false;
  public buttonOkActivate: boolean = false;
  public clicksOn: boolean = false;
  private correctCards = new EventEmitter();
  public checkAnswerTutorial = new EventEmitter();

  constructor(private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private hintService: HintService,
              private answerService: ChangingRulesAnswerService,
              protected soundService: SoundOxService,
              private feedbackService: FeedbackOxService,
              private preloaderService: PreloaderOxService,
              private elementRef: ElementRef,
              private tutorialService: TutorialService) {
    super(soundService, challengeService);
    this.tutorialExercise = this.tutorialService.tutorialCardGenerator(this.challengeService.getExerciseConfig().gameRules[0]);
    this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
    this.gridClass = this.getGridClassToUse();
    this.setSteps();
    this.clicksOn = false;
    this.addSubscription(this.checkAnswerTutorial, z => {
      const ruleToApply = ALL_RULES.find((z: Rule) => z.id === this.tutorialExercise.rule.id);
      if (ruleToApply?.allSatisfyRule(this.answerComponents.map(z => z.card))) {
        const cardsInTable = this.cardComponentQueryList.toArray().map(z => z?.card as CardInfo);
        // TODO fix me
        this.cardsToDeckAnimation(this.correctCards);
        this.answerComponents.forEach(z => z.cardClasses = 'card-correct');
        this.soundService.playSoundEffect('sounds/rightAnswer.mp3', ScreenTypeOx.Game);
      } else {
        this.answerComponents.forEach(z => z.cardClasses = 'card-wrong');
        this.soundService.playSoundEffect('sounds/wrongAnswer.mp3', ScreenTypeOx.Game);
        this.playWrongAnimation();
      }
    });

    this.addSubscription(this.correctCards, z => {
      // this.tutorialService.tutorialCardGenerator();
      // this.answerComponents.forEach((z, i) => {
      //   this.tutorialExercise.currentCards.splice(this.tutorialExercise.currentCards.indexOf(z.card), 1,
      //     this.tutorialService.lastCards[i]);
      //       // });
      this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
      this.answerComponents.forEach(z => z.card.hasBeenUsed = true);
      // this.tutorialExercise.rule = this.tutorialService.currentRule;
      console.log('Genere desdepues de correct cardInTable.');
    });
    this.setMagnifierReference('initial-state');
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.executeCurrentStep();
  }

  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({text, actions, completedSub});
  }

  private setMagnifierReference(ref: string) {
    this.magnifier = this.magnifierPositions.find(z => z.reference === ref);
  }

  public answerVerificationTutorial(i: number): void {
    if (!this.clicksOn) return;
    // super.answerVerification(i, this.tutorialAnswer, 3, this.checkAnswerTutorial);
    super.updateAnswer(i, 3, () => this.checkAnswerTutorial.emit());
  }

  public setSteps() {
    this.destroyClock();
    const aux = this.challengeService.getExerciseConfig();
    const rulesToEjemplify = aux.gameRules;
    this.addStep('¡Buenas! El objetivo del juego consiste en seleccionar las cartas que compartan la regla que figura en el panel de reglas', () => {
    }, timer(3500));
    for (let i = 0; i < rulesToEjemplify.length; i++) {
      this.addStep('Observa la regla del panel.', () => {
        this.clicksOn = false;
        if (i > 0)
          this.tutorialExercise = this.tutorialService.tutorialCardGenerator(rulesToEjemplify[i]);
        this.ruleComponent.setNewRule(this.tutorialExercise.rule.id as GameRule);
        this.setMagnifierReference('rule-panel');
        this.ruleComponet.ruleSelectionAnimation();
        this.buttonOkActivate = true;
      }, this.okButtonHasBeenClick);
      this.addStep('Selecciona las cartas que cumplan con la regla', () => {
        this.setMagnifierReference('initial-state');
        this.buttonOkActivate = false;
        this.clicksOn = true;
        this.cardsToSelect();
      }, this.correctCards);
    }
    // this.addStep('Selecciona las tres cartas una ultima vez', () => {
    //   this.tutorialService.tutorialCardGenerator(1);
    //   this.cardsToSelect();
    // }, this.correctCards);
    // this.addStep('¡Intenta completar la mayor cantidad de ejercicios antes de que el tiempo acabe!.', () => {
    //
    // });
    if (aux.totalTimeInSeconds) {
      this.addStep('¡Presta atencion, el tiempo corre!', () => {
        this.setMagnifierReference('clock');
        this.clicksOn = false;
        this.buttonOkActivate = true;
        this.totalTime = 1;
        this.recursiviblySetClock();
      }, this.okButtonHasBeenClick);
    }
    this.addStep('Listo!', () => {
      this.setMagnifierReference('initial-state');
      this.buttonOkActivate = false;
      // this.cardsToSelect();
    }, timer(3000));
  }


  cardsToSelect(): void {
    this.answerComponents = [];
    const answer = this.tutorialService.cardInTable.currentPossibleAnswerCards;
    timer(300).subscribe(z => {
      this.stateByCards = (this.cardComponentQueryList.toArray() as CardComponent[])
        .map(cardComp => answer.some(a => sameCard(cardComp.card, a)) ? 'card-to-select-tutorial' : 'card-neutral');
    });
  }

  textChangeAnimation(text: string): void {
    const duration = 500;
    const tl = anime.timeline({
      targets: this.tutorialText.textElement.nativeElement,
      easing: 'easeInOutExpo'
    });
    tl.add({
      translateY: {
        value: '8vh',
        duration,
      },
      complete: () => this.text = text
    }).add({
      translateY: {
        value: ['-8vh', 0],
        duration
      }
    });
  }


  private destroyEndStepSubscription(): void {
    if (this.currentEndStepSubscription) {
      this.currentEndStepSubscription.unsubscribe();
    }
    this.currentEndStepSubscription = undefined;
  }


  public repeatTutorialMethod(): void {
    this.isTutorialComplete = false;
    this.setSteps();
  }


  private executeCurrentStep() {
    this.destroyEndStepSubscription();
    const step = this.steps[this.currentStep];
    this.textChangeAnimation(step.text);
    step.actions();
    this.currentEndStepSubscription = step.completedSub.pipe(take(1)).subscribe(z => this.onCompleteStep());
  }


  private onCompleteStep() {
    if (this.steps[++this.currentStep])
      this.executeCurrentStep();
    else {
      this.destroyClock();
      console.log('tutorialComplete');
    }
  }


  private destroyClock() {
    this.destroyClockSubs();
    this.totalTime = undefined as any;
  }

  onOkButtonClicked(): void {
    this.okButtonHasBeenClick.emit();
  }


  private recursiviblySetClock(): void {
    if (this.totalTime)
      this.setClock(10, () => this.recursiviblySetClock());
  }
}
