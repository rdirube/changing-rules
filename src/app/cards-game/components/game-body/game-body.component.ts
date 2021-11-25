import {Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, EventEmitter} from '@angular/core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {OxTextInfo, ScreenTypeOx, ExerciseData, OxImageInfo} from 'ox-types';
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
  public answer: CardComponent[] = [];
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
        this.exercise = exercise.exerciseData;
        this.stateByCards = exercise.exerciseData.currentCards.map(z => 'card-neutral');
        timer(1000).subscribe(z => {
          this.cardComponent.toArray().forEach(x => x.cardSvg = 'svg/reglas_cambiantes/elementos/frente.svg');
        });
        this.answer = [];
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.countDownImageInfo = {data: this.preloaderService.getResourceData('mini-lessons/executive-functions/svg/buttons/saltear.svg')};
          // this.exercise.cards = exercise.exerciseData.currentCards;
        } else {
          this.deckClass = 'filled';
          // this.answer.forEach((z, i) => {
          //   this.exercise.cardsInTable.splice(this.exercise.cardsInTable.indexOf(z.card), 1, exercise.exerciseData.lastCards[i]);
          // });
          // this.exercise.rule = exercise.exerciseData.rule;
        }
      });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      // const ruleToApply = ALL_RULES.find((z: Rule) => z.id === this.exercise.rule);
      const ruleToApply = this.exercise.rule;
      if (ruleToApply?.allSatisfyRule(this.answer.map(z => z.card))) {
        this.cardsToDeckAnimation();
        this.soundService.playSoundEffect('sounds/rightAnswer.mp3', ScreenTypeOx.Game);
      } else {
        this.answer.forEach(z => z.cardState = 'card-wrong');
        this.soundService.playSoundEffect('sounds/wrongAnswer.mp3', ScreenTypeOx.Game);
        timer(20).subscribe(x => {
          anime({
            targets: '.card-wrong',
            rotate: [
              {value: 2, duration: 50},
              {value: -2, duration: 50},
              {value: 2, duration: 50},
              {value: -2, duration: 50},
              {value: 2, duration: 50},
              {value: -2, duration: 50},
              {value: 2, duration: 50},
              {value: 0, duration: 1}
            ]
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
      if (this.answer.length <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !cardComponentArray[i].isSelected) {
        this.answer.push(cardComponentArray[i]);
        cardComponentArray[i].cardState = 'card-selected';
        cardComponentArray[i].isSelected = true;
        if (this.answer.length === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
          this.answerService.currentAnswer = {
            parts: [
              {correctness: 'correct', parts: []}
            ]
          };
          this.answerService.onTryAnswer();
        }
      } else {
        this.answer.splice(this.answer.indexOf(cardComponentArray[i]), 1);
        cardComponentArray[i].isSelected = false;
        cardComponentArray[i].cardState = 'card-neutral';
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
    console.log('cardsAppearenceNew');
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
    this.answer.forEach((answerCard, i) => {
      answerCard.cardState = 'card-correct';
      anime({
        targets: answerCard.elementRef.nativeElement,
        translateX: convertPXToVH(181) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().x) + 'vh',
        translateY: convertPXToVH(322) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().y) + 'vh',
        delay: 700,
        duration: 600,
        begin: () => {
          timer(700).subscribe(a => {
            answerCard.cardSvg = 'svg/reglas_cambiantes/elementos/dorso.svg';
            answerCard.cardState = 'card-neutral';
            answerCard.isSelected = false;
          });
          anime({
            targets: '.card-correct',
            zIndex: 200,
            duration: 1,
            delay: 700
          });
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
              // const cardAnswers = this.answer.map(x => x.card);
              // this.challengeService.cards = this.exercise.cardsInTable.filter(x => isNotRepeated(x, cardAnswers));
              if (i + 1 === 1) {
                this.gameActions.showNextChallenge.emit();
                this.cardsAppearenceNew();
              }
            }
          });
        }
      });
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
      finalStatus: 'to-answer',
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
