import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit, Output, ViewChild,
} from '@angular/core';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { PreloaderOxService } from 'ox-core';
import { ChangingRulesAnswerService } from 'src/app/shared/services/changing-rules-answer.service';
import { ChangingRulesChallengeService } from 'src/app/shared/services/changing-rules-challenge.service';
import { ScreenTypeOx, OxTextInfo, anyElement } from 'ox-types';
import { Observable, Subscription, timer } from 'rxjs';
import { TutorialService } from 'src/app/shared/services/tutorial.service';
import {
  CardInfo,
  MagnifierPosition,
  TutorialStep,
  ALL_RULES,
  Rule, ChangingRulesExercise, GameRule, CardsInTable
} from 'src/app/shared/models/types';
import { CARD_COLORS, CARD_FILLERS, CARD_SHAPES, GAME_RULES, MAGNIFIER_POSITIONS } from 'src/app/shared/models/const';
import anime from 'animejs';
import { take } from 'rxjs/operators';
import { GameBodyDirective } from 'src/app/shared/directives/game-body.directive';
import { sameCard, satisfyRuleCardsNew } from '../../../shared/models/functions';
import { CardComponent } from '../card/card.component';
import { RulesComponent } from '../rules/rules.component';
import { DeckPerCardComponent } from '../deck-per-card/deck-per-card.component';
import { TextComponent } from 'typography-ox';
import { MagnifierGlassComponent } from 'ox-components';



@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})


export class TutorialComponent extends GameBodyDirective implements OnInit {


  @ViewChild(RulesComponent) ruleComponet!: RulesComponent;
  @Output() tutorialEnd = new EventEmitter<{ completed: boolean }>();


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
  public checkAnswerTutorial = new EventEmitter();
  public checkAnswerTutorialConv = new EventEmitter();
  public exerciseConfig!: any;


  constructor(public challengeService: ChangingRulesChallengeService,
    private answerService: ChangingRulesAnswerService,
    protected soundService: SoundOxService,
    public tutorialService: TutorialService) {
    super(soundService, challengeService);

    this.tutorialService.cardInTable = new CardsInTable(CARD_COLORS, CARD_SHAPES, CARD_FILLERS);
    this.tutorialService.cardInTable.setInitialCards(9, 3);


    this.exerciseConfig = this.challengeService.getExerciseConfig();
    this.exerciseConfig.gameMode === "Set convencional" ? this.setStepConventional() : this.setSteps();
    // this.tutorialExercise = this.tutorialService.tutorialCardGenerator(this.challengeService.getExerciseConfig().gameRules[0]);
    this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
    this.gridConfig = this.getGridClassToUse();
    this.clicksOn = false;
    this.addSubscription(this.checkAnswerTutorial, z => {
      const ruleToApply = ALL_RULES.find((z: Rule) => z.id === this.tutorialExercise.rule.id);
      if (ruleToApply?.allSatisfyRule(this.answerComponents.map(z => z.cardInfo))) {
        this.answerRight();
      } else {
        this.answerWrong();
      }
    });

    this.addSubscription(this.answerService.correctCards, z => {
      // this.tutorialService.tutorialCardGenerator();
      // this.answerComponents.forEach((z, i) => {
      //   this.tutorialExercise.currentCards.splice(this.tutorialExercise.currentCards.indexOf(z.card), 1,
      //     this.tutorialService.lastCards[i]);
      //       // });
      this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
      this.answerComponents.forEach(z => z.cardInfo.hasBeenUsed = true);
      // this.tutorialExercise.rule = this.tutorialService.currentRule;
      console.log('Genere desdepues de correct cardInTable.');
    });
    this.setMagnifierReference('initial-state');

    this.addSubscription(this.checkAnswerTutorialConv, __ => {
      if (satisfyRuleCardsNew(this.answerComponents.map(z => z.cardInfo), GAME_RULES)) {
        this.answerRight();
      } else {
        this.answerComponents.forEach((z, i) => {
          i === 0 ? this.answerService.wrongCards.emit() : undefined
        });
        this.answerWrong();
      }
    })



  }



  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
    this.executeCurrentStep();
  }



  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({ text, actions, completedSub });
  }



  private setMagnifierReference(ref: string) {
    this.magnifier = this.magnifierPositions.find(z => z.reference === ref);
  }



  public answerVerificationTutorial(i: number, checkTutorial: EventEmitter<any>): void {
    if (!this.clicksOn) return;
    super.updateAnswer(i, this.challengeService.exerciseConfig.cardsForCorrectAnswer,
      () => checkTutorial.emit(this.cardDeckComponentQueryList.toArray()[i]));
  }



  public answerRight() {
    this.answerComponents.forEach(z => z.cardInfo.hasBeenUsed = true);
    this.soundService.playSoundEffect('sounds/rightAnswer.mp3', ScreenTypeOx.Game);
    this.answerComponents.forEach((z, i) => {
      z.cardsToDeckAnimation(i === 0 ? this.answerService.correctCards : undefined);
    });
  }


  public answerWrong() {
    this.answerComponents.forEach(z => z.cardClass = 'card-wrong');
    this.soundService.playSoundEffect('sounds/wrongAnswer.mp3', ScreenTypeOx.Game);
    this.playWrongAnimation();
  }




  public setSteps() {
    this.destroyClock();
    this.swiftCardOn = true;
    this.firstSwiftCard = true;

    const aux = this.challengeService.getExerciseConfig();
    const rulesToEjemplify = aux.gameRules;
    this.tutorialExercise = this.tutorialService.tutorialCardGenerator(GAME_RULES[0]);
    console.log(rulesToEjemplify);
    this.addStep('¡Buenas! El objetivo del juego consiste en seleccionar las cartas que compartan la regla que figura en el panel de reglas', () => {
    }, timer(4000));
    for (let i = 0; i < rulesToEjemplify.length; i++) {
      this.addStep('Observa la regla del panel.', () => {
        if (i > 0) {
          this.tutorialExercise = this.tutorialService.tutorialCardGenerator(rulesToEjemplify[i]);
          this.ruleComponet.ruleSelectionAnimation();
        }
        this.clicksOn = false;
        // this.ruleComponent.setNewRule(this.tutorialExercise.rule.id as GameRule);
        this.setMagnifierReference('rule-panel');
        this.buttonOkActivate = true;
      }, this.okButtonHasBeenClick);
      this.addStep('Selecciona las cartas que cumplan con la regla', () => {
        this.setMagnifierReference('initial-state');
        this.buttonOkActivate = false;
        this.clicksOn = true;
        this.cardsToSelect(this.tutorialService.cardInTable.currentPossibleAnswerCards);
      }, this.answerService.correctCards);
    }
    if (aux.totalTimeInSeconds) {
      this.addStep('¡Presta atencion, el tiempo corre!', () => {
        this.setMagnifierReference('clock');
        this.clicksOn = false;
        this.tutorialExercise = this.tutorialService.tutorialCardGenerator(anyElement(rulesToEjemplify));
        this.buttonOkActivate = true;
        this.totalTime = 1;
        this.recursiviblySetClock();
      }, this.okButtonHasBeenClick);
    }
    this.addStep('', () => {
      this.destroyClock();
      timer(500).subscribe(z => {
        this.setMagnifierReference('initial-state');
        this.buttonOkActivate = false;
        this.isTutorialComplete = true;
      })
    }, this.tutorialEnd);
  }


    


  public setStepConventional() {
    this.swiftCardOn = true;
    this.firstSwiftCard = true;
    this.tutorialService.tutorialCardGeneratorSetConv(1);
    this.destroyClock();
    console.log(this.challengeService.exerciseConfig.gameMode);
    this.addStep('¡Buenas! El objetivo del juego consiste en seleccionar cartas que compartan entre todas una o mas propiedades o bien que no compartan ninguna propiedad', () => {
    }, timer(4500));
    this.addStep('Observa que las cartas iluminadas comparten la propiedad ' + this.tutorialService.property[0] as string + ', seleccionalas para formar la respuesta correcta', () => {
      this.cardsToSelect(this.tutorialService.cardInTable.currentPossibleAnswerCards);
      console.log(this.tutorialService.cardInTable.currentPossibleAnswerCards)
      this.buttonOkActivate = false;
      this.clicksOn = true;
    },
      this.answerService.correctCards);
    this.addStep('', () => {
      this.setConventionalStepGen(2, () => this.tutorialService.tutorialCardGeneratorSetConv(2));
      this.textChangeAnimation('Ahora revisa que las cartas iluminadas comparten las propiedades ' + this.tutorialService.property[0] as string + ' y ' + this.tutorialService.property[1] as string + ', seleccionalas')
      this.challengeService.cardsGeneratorStopper = 0;
      this.cardsToSelect(this.tutorialService.cardInTable.currentPossibleAnswerCards);
    }, this.answerService.correctCards);
    this.addStep('Observa que las cartas iluminadas no comparten ninguna propiedad, en este caso, tambien son correctas', () => {
      this.setConventionalStepGen(0, () => this.tutorialService.tutorialCardGeneratorSetConv(0))
      this.cardsToSelect(this.tutorialService.cardInTable.currentPossibleAnswerCards);
    }, this.answerService.correctCards);
    this.addStep('En caso de seleccionar un grupo de cartas que comparten alguna propiedad que no es poseída por todas como en el ejemplo en pantalla, se generará una respuesta incorrecta', () => {
      this.setConventionalStepGen(1, () => this.tutorialService.tutorialWrongCardGenerator())
      this.cardsToSelect(this.tutorialService.cardInTable.currentPossibleAnswerCards);
    }, this.answerService.wrongCards);
    if (this.exerciseConfig.totalTimeInSeconds) {
      this.addStep('¡Presta atencion, el tiempo corre!', () => {
        timer(1000).subscribe(z => {
          this.setMagnifierReference('clock');
          this.clicksOn = false;
          this.buttonOkActivate = true;
          this.totalTime = 1;
          this.recursiviblySetClock();
        })
      }, this.okButtonHasBeenClick);
    }
    this.addStep('', () => {
      this.destroyClock();
      timer(800).subscribe(z => {
        this.isTutorialComplete = true;
      })
    }, this.tutorialEnd)
  }



  setConventionalStepGen(quant: number, cardsGenerator: () => void) {
    this.buttonOkActivate = false;
    this.clicksOn = true;
    cardsGenerator();
  }



  cardsToSelect(answerCards: CardInfo[]): void {
    this.answerComponents = [];
    timer(300).subscribe(z => {
      this.stateByCards = (this.cardDeckComponentQueryList.toArray() as DeckPerCardComponent[])
        .map(cardComp => answerCards.some(a => sameCard(cardComp.cardInfo, a)) ? 'card-to-select-tutorial' : 'card-neutral');
    });
  }


  checkAnswerByCurrentTutorialMode(): EventEmitter<any> {
    if (this.exerciseConfig.gameMode === 'Set convencional') {
      return this.checkAnswerTutorialConv;
    } else {
      return this.checkAnswerTutorial;
    }
  }



  // export function satisfyRuleCardsNew(cards:CardInfo[], allProperties: GameRule[]) {
  //   return allProperties.every(prop => {
  //     const properties = cards.map(card => auxGetPropertyValue(card, prop));
  //     return properties.every(anchorProperty => {
  //       const length = properties.filter(aProperty => aProperty === anchorProperty).length;
  //       return length === 1 || length === properties.length
  //     })
  //   });
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



  public repeatTutorialComplete() {
    this.gridConfig = this.getGridClassToUse();
    this.tutorialService.propertiesAvaiable = GAME_RULES;
    this.setMagnifierReference('initial-state');
    this.stateByCards = this.tutorialService.cardInTable.cards.map(z => 'card-neutral');
    this.tutorialService.cardInTable.setInitialCards(9, 3);
    this.currentStep = 0;
    this.clicksOn = false;
    this.isTutorialComplete = false;
    this.challengeService.exerciseConfig.gameMode === "Set convencional" ? this.setStepConventional() : this.setSteps();
    this.destroyEndStepSubscription();
    this.executeCurrentStep();
    this.challengeService.cardsPlayed = 0;
    this.challengeService.cardDecksPivot = 0;
    this.challengeService.addCardToDeckValidator = 0;
    this.deckClass = 'empty';
    this.auxArray = [];
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


  onTutorialEndTrue(): void {
    this.onTutorialEnd(true);
  }


  onTutorialEnd(completed: boolean): void {
    this.tutorialEnd.emit({ completed });
  }


  onSkipTutorial(): void {
    this.onTutorialEnd(false);


  }



}
