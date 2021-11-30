import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {
  ExerciseData,
  GameAskForScreenChangeBridge,
  MultipleChoiceSchemaData,
  OptionShowable,
  OxImageInfo,
  SchemaPart,
  ScreenTypeOx
} from 'ox-types';
import {ChangingRulesChallengeService} from 'src/app/shared/services/changing-rules-challenge.service';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {CardInfo, ChangingRulesExercise, GameRule} from 'src/app/shared/models/types';
import {take} from 'rxjs/operators';
import {CardComponent} from '../card/card.component';
import {ChangingRulesAnswerService} from 'src/app/shared/services/changing-rules-answer.service';
import {GameBodyDirective} from 'src/app/shared/directives/game-body.directive';
import {timer} from 'rxjs';
import {getCardSvg, sameCard} from 'src/app/shared/models/functions';
import anime from 'animejs';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})

export class GameBodyComponent extends GameBodyDirective implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    if (this.exercise)
      this.ruleComponent.setNewRule(this.exercise.rule.id as GameRule);
  }

  @ViewChildren(CardComponent) cardComponentQueryList!: QueryList<CardComponent>;
  @ViewChildren('cardContainer') cardContainer!: QueryList<ElementRef>;


  public exercise!: ChangingRulesExercise;
  public countDownImageInfo: OxImageInfo | undefined;

  constructor(private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private cdr: ChangeDetectorRef,
              private hintService: HintService,
              protected soundService: SoundOxService,
              private answerService: ChangingRulesAnswerService,
              private microLessonCommunication: MicroLessonCommunicationService<any>,
              private feedbackService: FeedbackOxService,
              private preloaderService: PreloaderOxService) {
    super(soundService, challengeService);
    // @ts-ignore
    anime.suspendWhenDocumentHidden = false;
    this.addSubscription(this.gameActions.microLessonCompleted, z => {
      this.destroyClockSubs();
      timer(100).subscribe(zzz => {
        this.microLessonCommunication.sendMessageMLToManager(GameAskForScreenChangeBridge,
          ScreenTypeOx.GameComplete);
      });
    });
    this.addSubscription(this.gameActions.showHint, x => this.showHint());

    this.addSubscription(this.gameActions.checkedAnswer, z => {
      const correct = z.correctness === 'correct';
      if (correct) {
        super.cardsToDeckAnimation(this.feedbackService.endFeedback);
        this.soundService.playSoundEffect('sounds/rightAnswer.mp3', ScreenTypeOx.Game);
      } else {
        this.answerComponents.forEach(z => z.cardClasses = 'card-wrong');
        this.soundService.playSoundEffect('sounds/wrongAnswer.mp3', ScreenTypeOx.Game);
        this.playWrongAnimation();
      }
    });
    this.addSubscription(this.feedbackService.endFeedback, x => this.gameActions.showNextChallenge.emit());
  }

  answerVerificationMethod(i: number) {
    if (!this.cardsInteractable) {
      return;
    }
    this.gameActions.actionToAnswer.emit();
    this.updateAnswer(i, this.challengeService.exerciseConfig.cardsForCorrectAnswer, () => {
      this.cardsInteractable = false;
      this.setAnswer();
      this.answerService.onTryAnswer();
    });
  }


  startGame() {
    this.soundService.playWoosh(ScreenTypeOx.Game);
    this.countDownImageInfo = undefined;
    this.deckComponent.auxArray = [];
    if (this.challengeService.exerciseConfig.totalTimeInSeconds) {
      this.setClock(this.challengeService.exerciseConfig.totalTimeInSeconds, () => {
        console.log('Clock finish.');
        this.gameActions.microLessonCompleted.emit();
      });
    }
    this.cardsAppearenceAnimation();
  }

  private addMetric(): void {
    const myMetric = {
      schemaType: 'multiple-choice',
      schemaData: {
        optionMode: 'dependent',
        requiredOptions: this.challengeService.getExerciseConfig().cardsForCorrectAnswer,
        options: this.exercise.currentCards.map(cardToOption)
      } as MultipleChoiceSchemaData,
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answerComponents',
      maxHints: 1, // TODO SET MAX HINTS
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: new Date(), // TODO SET fnish time
      firstInteractionTime: new Date() // TODO first interacion time
    };
    this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
      myMetric.firstInteractionTime = new Date();
    });
    this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
      z => {
        myMetric.finishTime = new Date();
        // console.log('Finish metric time, it means checkAnswer');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
    this.metricsService.currentMetrics.exercises++;
  }


  public showHint(): void {
    this.answerComponents = [];
    const answer = this.challengeService.cardsInTable.currentPossibleAnswerCards.slice(0, this.challengeService.exerciseConfig.cardsForCorrectAnswer - 1);
    timer(300).subscribe(z => {
      this.stateByCards = (this.cardComponentQueryList.toArray() as CardComponent[])
        .map(cardComp => answer.some(a => sameCard(cardComp.card, a)) ? 'card-to-select-tutorial' : 'card-neutral');
    });
  }

  ngOnInit(): void {
    // this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
    this.addSubscription(this.challengeService.currentExercise, //.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ChangingRulesExercise>) => {
        if (exercise === undefined) {
          this.swiftCardOn = false;
          this.answerComponents = [];
          if (this.exercise) {
            this.exercise.currentCards = [];
          }
          this.cdr.detectChanges();
          console.log('Undefined exercise.');
          return;
        }
        console.log('Setting real exercise.');
        this.hintService.usesPerChallenge = 1;
        this.hintService.checkHintAvailable();
        this.exercise = exercise.exerciseData;
        this.addMetric();
        this.stateByCards = exercise.exerciseData.currentCards.map(z => 'card-neutral');
        this.answerComponents = [];
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.countDownImageInfo = {data: this.preloaderService.getResourceData('mini-lessons/executive-functions/svg/buttons/saltear.svg')};
        } else {
          this.deckClass = 'filled';
          this.cardsInteractable = true;
        }
        if (this.cardComponentQueryList) {
          this.cardComponentQueryList.toArray().forEach((z, i) => {
            z.updateCard();
          });
        }
        this.gridClass = this.getGridClassToUse();
        if (this.ruleComponent)
          this.ruleComponent.setNewRule(this.exercise.rule.id as GameRule);
      });
  }

  private setAnswer(): void {
    const cards = this.answerComponents.map(z => z.card);
    const correctness = this.exercise.rule.allSatisfyRule(cards) ? 'correct' : 'wrong';
    this.answerService.currentAnswer = {
      parts: [
        {correctness, parts: cards.map(cardToSchemaPart)}
      ]
    };
  }

  onCountDownTimeUpdated() {
    this.soundService.playSoundEffect('sounds/bubble01.mp3', ScreenTypeOx.Game);
  }
}

function cardToOption(z: CardInfo): OptionShowable {
  return {
    showable: {
      image: getCardSvg(z)
    },
    customProperties: [
      {name: 'color', value: z.color},
      {name: 'shape', value: z.shape},
      {name: 'fill', value: z.fill}
    ]
  };
}

function cardToSchemaPart(z: CardInfo): SchemaPart {
  return {
    format: 'image',
    value: getCardSvg(z),
    customProperties: [
      {name: 'color', value: z.color},
      {name: 'shape', value: z.shape},
      {name: 'fill', value: z.fill}
    ]
  };
}

