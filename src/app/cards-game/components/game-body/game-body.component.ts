import {Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, EventEmitter} from '@angular/core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {ScreenTypeOx, ExerciseData, OxImageInfo, isEven} from 'ox-types';
import {ChangingRulesChallengeService} from 'src/app/shared/services/changing-rules-challenge.service';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {
  ChangingRulesExercise,
} from 'src/app/shared/models/types';
import {filter, take, toArray} from 'rxjs/operators';
import {CardComponent} from '../card/card.component';
import anime from 'animejs';
import {ChangingRulesAnswerService} from 'src/app/shared/services/changing-rules-answer.service';
import {GameBodyDirective} from 'src/app/shared/directives/game-body.directive';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})

export class GameBodyComponent extends GameBodyDirective {

  @ViewChildren(CardComponent) cardComponent!: QueryList<CardComponent>;
  @ViewChildren('cardContainer') cardContainer!: QueryList<ElementRef>;

  public exercise!: ChangingRulesExercise;
  public answerComponents: CardComponent[] = [];
  public deckClass: string = "empty";
  public countDownImageInfo: OxImageInfo | undefined;

  constructor(private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private hintService: HintService,
              protected soundService: SoundOxService,
              private answerService: ChangingRulesAnswerService,
              private feedbackService: FeedbackOxService,
              private preloaderService: PreloaderOxService) {
    super(soundService);
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ChangingRulesExercise>) => {
        console.log(exercise);
        this.hintService.checkHintAvailable();
        this.addMetric();
        this.exercise = exercise.exerciseData;
        this.stateByCards = exercise.exerciseData.currentCards.map(z => 'card-neutral');
        this.answerComponents = [];
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.countDownImageInfo = {data: this.preloaderService.getResourceData('mini-lessons/executive-functions/svg/buttons/saltear.svg')};
        } else {
          this.deckClass = 'filled';
          this.cardComponent.toArray().forEach((z, i) => {
            z.updateCard();
          });
        }
      });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      const ruleToApply = this.exercise.rule;
      if (ruleToApply?.allSatisfyRule(this.answerComponents.map(z => z.card))) {
        super.cardsToDeckAnimation(this.gameActions.showNextChallenge);
        this.soundService.playSoundEffect('sounds/rightAnswer.mp3', ScreenTypeOx.Game);
      } else {
        this.answerComponents.forEach(z => z.cardClasses = 'card-wrong');
        this.soundService.playSoundEffect('sounds/wrongAnswer.mp3', ScreenTypeOx.Game);
        this.playWrongAnimation();
      }
    });
  }

  answerVerificationMethod(i: number) {
    super.updateAnswer(i, this.challengeService.exerciseConfig.cardsForCorrectAnswer, () => {
      this.answerService.currentAnswer = {
        parts: [
          {correctness: 'correct', parts: []}
        ]
      };
      this.answerService.onTryAnswer();
    });
    // const cardComponentArray = this.cardComponent.toArray();
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


  private playWrongAnimation() {
    const rotate = Array.from(Array(8).keys()).map((z, i) => {
      return {value: isEven(i) ? 2 : -2, duration: 50};
    }).concat([{value: 0, duration: 50}]);
    anime({
      targets: this.answerComponents.map( z => z.elementRef.nativeElement),
      rotate
    });
  }
}
