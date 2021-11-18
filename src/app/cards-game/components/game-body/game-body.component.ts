import { Component, OnInit, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { OxTextInfo, ScreenTypeOx } from 'ox-types';
import { ChangingRulesChallengeService } from 'src/app/shared/services/changing-rules-challenge.service';
import { ExerciseOx } from 'ox-core';
import { ChangingRulesExercise, GameRule, Rule, FillRule, ColorRule, ShapeRule, ALL_RULES,CardInfo } from 'src/app/shared/models/types';
import { filter, take, toArray } from 'rxjs/operators';
import { CardComponent } from '../card/card.component';
import { timer } from 'rxjs';
import anime from 'animejs';
import { sameCard , isNotRepeated} from 'src/app/shared/models/functions';
import { ChangingRulesAnswerService } from 'src/app/shared/services/changing-rules-answer.service';



@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {



  @ViewChildren(CardComponent) cardComponent!: QueryList<CardComponent>;

  public gameInstruction = new OxTextInfo();
  public gameInstructionText: string = "Igual";
  public exercise!: ChangingRulesExercise;
  showCountDown: boolean | undefined;
  public answer: CardComponent[] = [];
  public deckClass:string  = "empty";
  public lastCards:CardInfo[] = [];

  constructor(private challengeService: ChangingRulesChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private answerService: ChangingRulesAnswerService,
    private soundService: SoundOxService,
    private feedbackService: FeedbackOxService) {
    
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
          if(this.challengeService.turn > 1) {
            this.deckClass = 'filled';
            this.lastCards = exercise.exerciseData.cards;
            this.answer.forEach((z,i) => {
            this.exercise.cards.splice(this.exercise.cards.indexOf(z.card),1, this.lastCards[i])})           
            this.exercise.rule = exercise.exerciseData.rule;
            } else {
            this.exercise = exercise.exerciseData;
            }
           
           if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
           this.showCountDown = true;
           // this.challengeService.exerciseConfig.bonusRequirmentsAndTimeEarn.forEach(z => z.isAble = true);
           // if (this.birdToSelectComponent)
           //   this.birdToSelectComponent.birdToSelectOut();
           // this.animeHeaderButtons(false);
           // this.birdsDownAnimation();
        }
      });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      const ruleToApply = ALL_RULES.find((z:Rule) => z.id === this.exercise.rule);
      if (ruleToApply?.allSatisfyRule(this.answer.map(z => z.card))) {
        this.answer.forEach(z => {
          z.cardState = 'card-neutral';
          z.isSelected = false;
          // z.cardsToDeckAnimation();
        })
        const cardAnswers = this.answer.map(x => x.card)
        this.challengeService.cardsInTable = this.exercise.cards.filter(x => isNotRepeated(x,cardAnswers))
        this.gameActions.showNextChallenge.emit();
        this.answer = [];
      } else {
        this.answer.forEach(z => z.cardState = 'card-wrong');
      }
    })
    
  }




  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
  

  }





  answerVerificationMethod(i:number) {
    const cardComponentArray = this.cardComponent.toArray();
    if(cardComponentArray){
    if (this.answer.length <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !cardComponentArray[i].isSelected) {
      this.answer.push(cardComponentArray[i]);
      cardComponentArray[i].cardState = 'card-selected';
      cardComponentArray[i].isSelected = true;
      if (this.answer.length === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
        this.gameActions.checkedAnswer.emit();
        // this.answerService.onTryAnswer();
      }
    }
    else  {
      this.answer.splice(this.answer.indexOf(cardComponentArray[i]), 1);
      cardComponentArray[i].isSelected = false;
      cardComponentArray[i].cardState = 'card-neutral';
    }
  }}



  public endFedbackEmitter() {
    this.feedbackService.endFeedback.emit();
  }



  cardsToDeckAnimation() {
    anime({
      targets: '.card-correct',
      translateX:162,
      translateY: 315,
      delay:500,
      duration:1000,
      easing: 'easeOutExpo',
      complete:() => this.gameActions.showNextChallenge.emit()
    })
    }



}
