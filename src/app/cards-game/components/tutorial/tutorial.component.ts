import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
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
import {OxTextInfo, ScreenTypeOx} from 'ox-types';
import {Observable, Subscription, timer} from 'rxjs';
import {TutorialService} from 'src/app/shared/services/tutorial.service';
import {
  CardInfo,
  MagnifierPosition,
  TutorialStep,
  ALL_RULES,
  Rule, ChangingRulesExercise
} from 'src/app/shared/models/types';
import {MAGNIFIER_POSITIONS} from 'src/app/shared/models/const';
import anime from 'animejs';
import {take} from 'rxjs/operators';
import {GameBodyDirective} from 'src/app/shared/directives/game-body.directive';
import {sameCard} from '../../../shared/models/functions';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent extends GameBodyDirective implements OnInit {


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
    super(soundService);
    this.tutorialService.tutorialCardGenerator();
    this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
    this.tutorialExercise = {
      rule: this.tutorialService.currentRule,
      currentCards: this.tutorialService.cardInTable.cards
    };
    console.log(this.tutorialExercise);
    this.setSteps();
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
      // });
      this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
      this.answerComponents.forEach(z => z.card.hasBeenUsed = true);
      this.tutorialService.tutorialCardGenerator();
      this.tutorialExercise.rule = this.tutorialService.currentRule;
      console.log('Genere desdepues de correct cards.');
    });
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setMagnifierReference('initial-state');
    this.executeCurrentStep();
  }

  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({text, actions, completedSub});
  }

  private setMagnifierReference(ref: string) {
    this.magnifier = this.magnifierPositions.find(z => z.reference === ref);
  }

  public answerVerificationTutorial(i: number): void {
    // super.answerVerification(i, this.tutorialAnswer, 3, this.checkAnswerTutorial);
    super.updateAnswer(i, 3, () => this.checkAnswerTutorial.emit());
  }

  public setSteps() {
    this.addStep('Buenas, bienvenidos al tutorial', () => {
    }, timer(3500));
    this.addStep('El objetivo del juego consiste en seleccionar las cartas que compartan la regla que figura en el panel de reglas', () => {
      this.setMagnifierReference('rule-panel');
      this.buttonOkActivate = true;
    }, this.okButtonHasBeenClick);
    this.addStep('Selecciona tres cartas que cumplan con la regla que indica panel', () => {
      this.setMagnifierReference('cards-in-table');
      this.buttonOkActivate = false;
      this.clicksOn = true;
      this.cardsToSelect();
    }, this.correctCards);
    this.addStep('Selecciona las tres cartas una ultima vez', () => {
      this.cardsToSelect();
    }, this.correctCards);
    this.addStep('Y por última vez!', () => {
      this.cardsToSelect();
    }, this.correctCards);
  }


  cardsToSelect(): void {
    this.answerComponents = [];
    // const rule: Rule = this.tutorialService.cardInTable.curentRuleFinder(this.tutorialExercise.rule) as Rule;
    // const anchorCard = this.tutorialService.cardInTable.cards.find(z => z.isAnchorForRule) as CardInfo;
    // const possibleCorrectCards: CardInfo[] = this.tutorialService.cardInTable.cards
    //   .filter(z => rule.satisfyRule(z, anchorCard)).slice(0, 3);
    // this.stateByCards = this.tutorialService.cardInTable.cards.map(z =>
    //   possibleCorrectCards.some(ca => sameCard(z, ca)) ? 'card-to-select-tutorial' : 'card-neutral');]
    const answer = this.tutorialService.cardInTable.currentPossibleAnswerCards;
    timer(300).subscribe(z => {
      this.stateByCards = (this.cardComponentQueryList.toArray() as CardComponent[])
        .map(cardComp => answer.some(a => sameCard(cardComp.card, a)) ? 'card-to-select-tutorial' : 'card-neutral');
    });
    // this.stateByCards = this.tutorialService.cardInTable.currentPossibleAnswerCards.map(z =>
    //   this.cardComponentQueryList.toArray().find(ca => sameCard(z, (ca as CardComponent).card)) as CardComponent);
    // ? 'card-to-select-tutorial' : 'card-neutral'
  }

  // answerVerification(i: number) {
  //   const cardComponentArray = this.cardComponentQueryList.toArray() as CardComponent[];
  //   if (cardComponentArray) {
  //     this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game)
  //     if (this.tutorialAnswer.length <= this.tutorialService.lastCards.length && !cardComponentArray[i]?.isSelected) {
  //       this.tutorialAnswer.push(cardComponentArray[i] as CardComponent);
  //       cardComponentArray[i].cardClasses = 'card-selected';
  //       cardComponentArray[i].isSelected = true;
  //       if (this.tutorialAnswer.length === this.tutorialService.lastCards.length) {
  //         this.checkAnswerTutorial.emit();
  //       }
  //     }
  //     else {
  //       this.tutorialAnswer.splice(this.tutorialAnswer.indexOf(cardComponentArray[i] as CardComponent), 1);
  //       cardComponentArray[i].isSelected = false;
  //       cardComponentArray[i].cardClasses = 'neutral-card';;
  //     }
  //   }
  // }


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
    else
      console.log('tutorialComplete');
  }


  onOkButtonClicked(): void {
    this.okButtonHasBeenClick.emit();
  }


}
