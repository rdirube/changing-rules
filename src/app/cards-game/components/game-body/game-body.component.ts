import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {
  FeedbackOxService,
  GameActionsService,
  HintService, MicroLessonCommunicationService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {ScreenTypeOx, ExerciseData, OxImageInfo, isEven, GameAskForScreenChangeBridge} from 'ox-types';
import {ChangingRulesChallengeService} from 'src/app/shared/services/changing-rules-challenge.service';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {
  ChangingRulesExercise, GameRule
} from 'src/app/shared/models/types';
import {filter, take} from 'rxjs/operators';
import {CardComponent} from '../card/card.component';
import {ChangingRulesAnswerService} from 'src/app/shared/services/changing-rules-answer.service';
import {GameBodyDirective} from 'src/app/shared/directives/game-body.directive';
import {interval, Subscription, timer} from 'rxjs';
import {sameCard} from 'src/app/shared/models/functions';
import anime from 'animejs';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})

export class GameBodyComponent extends GameBodyDirective implements OnInit {

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
    this.addSubscription(this.gameActions.microLessonCompleted, z => {
      timer(1000).subscribe(zzz => {
        this.microLessonCommunication.sendMessageMLToManager(GameAskForScreenChangeBridge,
          ScreenTypeOx.GameComplete);
      });
    });
    this.addSubscription(this.gameActions.showHint, x => this.showHint());

    this.addSubscription(this.gameActions.checkedAnswer, z => {
      const ruleToApply = this.exercise.rule;
      if (ruleToApply?.allSatisfyRule(this.answerComponents.map(z => z.card))) {
        super.cardsToDeckAnimation(this.feedbackService.endFeedback);
        // super.cardsToDeckAnimation(this.gameActions.showNextChallenge);
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
    console.log('answerVerificationMethod');
    this.updateAnswer(i, this.challengeService.exerciseConfig.cardsForCorrectAnswer, () => {
      this.answerService.currentAnswer = {
        parts: [
          {correctness: 'correct', parts: []}
        ]
      };
      this.answerService.onTryAnswer();
    });
    // const cardComponentArray = this.cardComponentQueryList.toArray();
    // if (cardComponentArray) {
    //   this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game);
    //   if (this.answerComponents.length <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !cardComponentArray[i].isSelected) {
    //     this.answerComponents.push(cardComponentArray[i]);
    //     cardComponentArray[i].cardClasses = 'card-selected';
    //     cardComponentArray[i].isSelected = true;
    //     if (this.answerComponents.length === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
    //     }
    //   } else {
    //     this.answerComponents.splice(this.answerComponents.indexOf(cardComponentArray[i]), 1);
    //     cardComponentArray[i].isSelected = false;
    //     cardComponentArray[i].cardClasses = 'card-neutral';
    //   }
    // }
  }


  startGame() {
    this.countDownImageInfo = undefined;
    this.deckComponent.auxArray = [];
    if (this.challengeService.exerciseConfig.totalTimeInSeconds) {
      this.setClock(this.challengeService.exerciseConfig.totalTimeInSeconds, () => {
        console.log('Clock finish.');
        this.gameActions.microLessonCompleted.emit();
      })
    }
    this.cardsAppearenceAnimation();
  }

  private addMetric(): void {
    const myMetric = {
      schemaType: 'generic-schema',
      schemaData: {},
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answerComponents',
      maxHints: 0, // TODO SET MAX HINTS
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: new Date(), // TODO SET fnish time
      firstInteractionTime: new Date() // TODO first interacion time
    };
    // this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
    //     myMetric.firstInteractionTime = new Date();
    // });
    // this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
    //     z => {
    //         myMetric.finishTime = new Date();
    //         console.log('Finish metric time, it means checkAnswer');
    //     });
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
        this.addMetric();
        this.exercise = exercise.exerciseData;
        this.stateByCards = exercise.exerciseData.currentCards.map(z => 'card-neutral');
        this.answerComponents = [];
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.countDownImageInfo = {data: this.preloaderService.getResourceData('mini-lessons/executive-functions/svg/buttons/saltear.svg')};
        } else {
          this.deckClass = 'filled';

        }
        if (this.cardComponentQueryList) {
          this.cardComponentQueryList.toArray().forEach((z, i) => {
            z.updateCard();
          });
        }
        this.gridClass = this.getGridClassToUse();
        this.ruleComponent.setNewRule(this.exercise.rule.id as GameRule);
      });
  }

}

