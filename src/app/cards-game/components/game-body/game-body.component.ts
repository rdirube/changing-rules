import {Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, EventEmitter} from '@angular/core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {OxTextInfo, ScreenTypeOx, ExerciseData, OxImageInfo, isEven, duplicateWithJSON} from 'ox-types';
import {ChangingRulesChallengeService} from 'src/app/shared/services/changing-rules-challenge.service';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {
  ChangingRulesExercise,
} from 'src/app/shared/models/types';
import {filter, take, toArray} from 'rxjs/operators';
import {CardComponent} from '../card/card.component';
import {timer} from 'rxjs';
import anime from 'animejs';
import {sameCard, isNotRepeated, convertPXToVH} from 'src/app/shared/models/functions';
import {ChangingRulesAnswerService} from 'src/app/shared/services/changing-rules-answer.service';
import {GameBodyDirective} from 'src/app/shared/directives/game-body.directive';


@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})


export class GameBodyComponent extends GameBodyDirective implements OnInit, AfterViewInit {


  @ViewChildren(CardComponent) cardComponent!: QueryList<CardComponent>;
  @ViewChildren('cardContainer') cardContainer!: QueryList<ElementRef>;

  public gameInstruction = new OxTextInfo();
  public gameInstructionText: string = "IGUAL";
  public exercise!: ChangingRulesExercise;
  showCountDown: boolean | undefined;
  public answerComponents: CardComponent[] = [];
  public containerAnswer: any[] = [];
  public deckClass: string = "empty";
  public countDownImageInfo: OxImageInfo | undefined;
  public swiftCardOn: boolean = false;


  constructor(private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private hintService: HintService,
              protected soundService: SoundOxService,
              private answerService: ChangingRulesAnswerService,
              private feedbackService: FeedbackOxService,
              private preloaderService: PreloaderOxService,
              private elementRef: ElementRef) {

    super(soundService);
    this.gameInstructionText = "IGUAL";
    this.gameInstruction.color = 'white';
    this.gameInstruction.originalText = this.gameInstructionText;
    this.gameInstruction.font = 'dinnRegular';
    this.gameInstruction.fontSize = '4vh';
    this.gameInstruction.ignoreLowerCase = true;
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ChangingRulesExercise>) => {
        console.log(exercise);
        this.hintService.checkHintAvailable();
        this.addMetric();
        // console.log(duplicateWithJSON(exercise.exerciseData.currentCards));
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
      // const ruleToApply = ALL_RULES.find((z: Rule) => z.id === this.exercise.rule);
      const ruleToApply = this.exercise.rule;
      if (ruleToApply?.allSatisfyRule(this.answerComponents.map(z => z.card))) {
        this.cardsToDeckAnimation();
        this.soundService.playSoundEffect('sounds/rightAnswer.mp3', ScreenTypeOx.Game);
      } else {
        this.answerComponents.forEach(z => z.cardClasses = 'card-wrong');
        this.soundService.playSoundEffect('sounds/wrongAnswer.mp3', ScreenTypeOx.Game);
        const rotate = Array.from(Array(8).keys()).map((z, i) => {
          return {value: isEven(i) ? 2 : -2, duration: 50};
        }).concat([{value: 0, duration: 50}]);
        timer(20).subscribe(x => {
          anime({
            targets: '.card-wrong',
            rotate
          });
        });
      }
    });
  }


  ngOnInit(): void {
    console.log(convertPXToVH(50));
  }


  ngAfterViewInit(): void {

  }


  answerVerificationMethod(i: number) {
    const cardComponentArray = this.cardComponent.toArray();
    if (cardComponentArray) {
      this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game);
      if (this.answerComponents.length <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !cardComponentArray[i].isSelected) {
        this.answerComponents.push(cardComponentArray[i]);
        cardComponentArray[i].cardClasses = 'card-selected';
        cardComponentArray[i].isSelected = true;
        if (this.answerComponents.length === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
          this.answerService.currentAnswer = {
            parts: [
              {correctness: 'correct', parts: []}
            ]
          };
          this.answerService.onTryAnswer();
        }
      } else {
        this.answerComponents.splice(this.answerComponents.indexOf(cardComponentArray[i]), 1);
        cardComponentArray[i].isSelected = false;
        cardComponentArray[i].cardClasses = 'card-neutral';
      }
    }
  }


  public endFedbackEmitter() {
    this.feedbackService.endFeedback.emit();
  }


  swiftToggle() {
    this.swiftCardOn = !this.swiftCardOn;
    console.log(this.swiftCardOn);
  }


  startGame() {
    this.countDownImageInfo = undefined;
    this.cardsAppearenceAnimation();
  }


  cardsAppearenceAnimation() {
    anime({
      targets: '.card-component',
      rotateY: '180',
      duration: 300,
      easing: 'linear',
      complete: () =>
        this.swiftToggle()


    });
    anime({
      targets: '.card-component',
      delay: 150,
      opacity: 1,
      duration: 1,
      complete: () => this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game)
    });
  }


  cardsAppearenceNew() {
    this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game);
    this.cardComponent.toArray().forEach(
      (answerCard, i) => {
        anime({
          targets: answerCard.elementRef.nativeElement,
          opacity: 1,
          duration: 1,
          delay: 200
        });
      });
  }


  cardsToDeckAnimation() {
    const duration = 75;
    const scale = Array.from(Array(5).keys()).map((z, i) => {
      return {value: isEven(i) ? 1 : 1.15, duration};
    }).concat([{value: 1, duration}]);
    this.answerComponents.forEach((answerCard, i) => {
      answerCard.card.hasBeenUsed = true;
      answerCard.cardClasses = 'card-correct';
      anime({
          targets: answerCard.elementRef.nativeElement,
          easing: 'easeInBounce',
          // targets: '.card-correct',
          scale,
          complete: () => {
            anime({
              targets: answerCard.elementRef.nativeElement,
              translateX: convertPXToVH(181) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().x) + 'vh',
              translateY: convertPXToVH(322) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().y) + 'vh',
              delay: 700,
              duration: 600,
              begin: () => {
                // timer(700).subscribe(a => {
                answerCard.cardSvg = 'svg/reglas_cambiantes/elementos/dorso.svg';
                answerCard.cardClasses = 'card-neutral';
                answerCard.isSelected = false;
                // });
                answerCard.faceDown = true;
                // anime({
                //   targets: '.card-correct',
                //   zIndex: 5,
                //   duration: 1,
                //   delay: 700
                // });
              },
              easing: 'easeOutExpo',
              complete: () => {
                anime({
                  targets: answerCard.elementRef.nativeElement,
                  translateX: 0,
                  translateY: 0,
                  opacity: 0,
                  duration: 1,
                  complete: () => {
                    // const cardAnswers = this.answerComponents.map(x => x.card);
                    // this.challengeService.cards = this.exercise.cardsInTable.filter(x => isNotRepeated(x, cardAnswers));
                    if (i + 1 === 1) {
                      this.gameActions.showNextChallenge.emit();
                      this.cardsAppearenceNew();
                    }
                  }
                });
              }
            });


          }
        }
      );
    });
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


}
