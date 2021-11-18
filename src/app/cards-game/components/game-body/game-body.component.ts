import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { OxTextInfo, ScreenTypeOx, ExerciseData, MultipleChoiceSchemaData, OxImageInfo } from 'ox-types';
import { ChangingRulesChallengeService } from 'src/app/shared/services/changing-rules-challenge.service';
import { ExerciseOx, PreloaderOxService } from 'ox-core';
import { ChangingRulesExercise, GameRule, Rule, FillRule, ColorRule, ShapeRule, ALL_RULES, CardInfo } from 'src/app/shared/models/types';
import { filter, take, toArray } from 'rxjs/operators';
import { CardComponent } from '../card/card.component';
import { timer } from 'rxjs';
import anime from 'animejs';
import { sameCard, isNotRepeated } from 'src/app/shared/models/functions';
import { ChangingRulesAnswerService } from 'src/app/shared/services/changing-rules-answer.service';



@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {



  @ViewChildren(CardComponent) cardComponent!: QueryList<CardComponent>;
  @ViewChildren('cardContainer') cardContainer!: QueryList<ElementRef>;

  public gameInstruction = new OxTextInfo();
  public gameInstructionText: string = "Igual";
  public exercise!: ChangingRulesExercise;
  showCountDown: boolean | undefined;
  public answer: CardComponent[] = [];
  public deckClass: string = "empty";
  public countDownImageInfo: OxImageInfo | undefined;
  public swiftCardOn: boolean = false;


  constructor(private challengeService: ChangingRulesChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private answerService: ChangingRulesAnswerService,
    private soundService: SoundOxService,
    private feedbackService: FeedbackOxService,
    private preloaderService: PreloaderOxService) {

    super();
    this.gameInstructionText = "Igual";
    this.gameInstruction.color = 'white';
    this.gameInstruction.originalText = this.gameInstructionText;
    this.gameInstruction.font = 'dinnRegular';
    this.gameInstruction.fontSize = '4vh';
    this.gameInstruction.ignoreLowerCase = true;

    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ChangingRulesExercise>) => {
        this.hintService.checkHintAvailable();
        this.addMetric();
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.countDownImageInfo = { data: this.preloaderService.getResourceData('mini-lessons/executive-functions/svg/buttons/saltear.svg') }
          this.exercise = exercise.exerciseData;
          this.exercise.cardsInTable = exercise.exerciseData.initialCards;
        } else {
          this.deckClass = 'filled';
          this.answer.forEach((z, i) => {
            this.exercise.cardsInTable.splice(this.exercise.cardsInTable.indexOf(z.card), 1, exercise.exerciseData.lastCards[i])
          })
          console.log(this.exercise.cardsInTable);
          this.exercise.rule = exercise.exerciseData.rule;
        }
      });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      const ruleToApply = ALL_RULES.find((z: Rule) => z.id === this.exercise.rule);
      if (ruleToApply?.allSatisfyRule(this.answer.map(z => z.card))) {
        this.cardsAppearenceNew();
        // this.answer.forEach(z => {
        //   z.cardState = 'card-neutral';
        //   z.isSelected = false;
        //   // z.cardsToDeckAnimation();
        // })
        
        
      } else {
        this.answer.forEach(z => z.cardState = 'card-wrong');
      }
    })

  }




  ngOnInit(): void {
  }



  ngAfterViewInit(): void {

  }





  answerVerificationMethod(i: number) {
    const cardComponentArray = this.cardComponent.toArray();
    if (cardComponentArray) {
      if (this.answer.length <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !cardComponentArray[i].isSelected) {
        this.answer.push(cardComponentArray[i]);
        cardComponentArray[i].cardState = 'card-selected';
        cardComponentArray[i].isSelected = true;
        if (this.answer.length === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
          this.gameActions.checkedAnswer.emit();
        }
      }
      else {
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
    this.swiftCardOn = true;
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
      duration: 400,
      easing: 'linear',
      complete: () =>
        this.swiftToggle()

    })
    anime({
      targets: '.card-component',
      delay: 200,
      opacity: 1,
      duration: 1
    })
  }


  cardsAppearenceNew() {
    const cardContainerArray = this.cardContainer.toArray()[2];
    if(cardContainerArray){
    anime({
      targets: cardContainerArray.nativeElement,
      rotateY: '180',
      duration: 400,
      easing: 'linear',
      complete: () => {
        this.swiftToggle();
        this.answer.forEach(z => {
          z.cardState = 'card-neutral';
          z.isSelected = false;
        })
        const cardAnswers = this.answer.map(x => x.card)
        this.challengeService.cardsInTable = this.exercise.cardsInTable.filter(x => isNotRepeated(x, cardAnswers))
        this.gameActions.showNextChallenge.emit();   
        this.answer = [];    
      }
    })
    anime({
      targets:cardContainerArray.nativeElement,
      delay: 200,
      opacity: 1,
      duration: 1
    })
  }
}

  // cardAppearenceNew() {
  //   anime({
  //     targets:'.card-component',
  //     rotateY:'180',
  //     duration:400,
  //     easing:'linear',
  //     complete: () => this.swiftToggle() 
  //   })
  //   anime({
  //     targets:'.card-component',
  //     delay:200,
  //     opacity:1,
  //     duration:1
  //   })
  // }


  cardsToDeckAnimation() {
    anime({
      targets: '.card-correct',
      translateX: 162,
      translateY: 315,
      delay: 500,
      duration: 1000,
      easing: 'easeOutExpo',
      complete: () => this.gameActions.showNextChallenge.emit()
    })
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
