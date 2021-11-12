import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
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
import { ChangingRulesExercise, GameRule, Rule, FillRule, ColorRule, ShapeRule, ALL_RULES } from 'src/app/shared/models/types';
import { filter, take, toArray } from 'rxjs/operators';
import { CardComponent } from '../card/card.component';
import { timer } from 'rxjs';
import anime from 'animejs';



@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {



  @ViewChildren(CardComponent) cardComponent!: QueryList<CardComponent>;

  public gameInstruction = new OxTextInfo();
  public gameInstructionText: string = "Igual";
  // public cardQuantity: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public exercise!: ChangingRulesExercise;
  showCountDown: boolean | undefined;
  public answer: CardComponent[] = [];
  public answerCounter: number = 0;
  public cardComponentArray: CardComponent[] = [];
  public deckClass:string  = "empty";


  constructor(private challengeService: ChangingRulesChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
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
        console.log('OTRO EJERCICIOS  ');
        timer(500).subscribe(z => {
          this.cardComponentArray = this.cardComponent.toArray();
        })
        this.hintService.checkHintAvailable();
        if(this.challengeService.turn > 1) {
        this.deckClass = 'filled';
         this.answer.forEach((z,i)=> {
           this.exercise.cards.splice(this.exercise.cards.indexOf(z.card),1,exercise.exerciseData.cards[i])
         })
         this.exercise.rule = exercise.exerciseData.rule;
         console.log(this.exercise);
         console.log(this.exercise.rule);
        } else {
        this.exercise = exercise.exerciseData;
        console.log(this.exercise);
        }
        console.log(this.challengeService.turn);
  
        // this.replaceBirds3and4(this.exercise?.optionsBirds);
        // this.setNests(this.exercise.optionsBirds);
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.showCountDown = true;
          // this.correctAnswerCounter = 0;
          // this.challengeService.exerciseConfig.bonusRequirmentsAndTimeEarn.forEach(z => z.isAble = true);
          // if (this.birdToSelectComponent)
          //   this.birdToSelectComponent.birdToSelectOut();
          // this.animeHeaderButtons(false);
          // this.birdsDownAnimation();
        }
      });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      const ruleToApply = ALL_RULES.find(z => z.id === this.exercise.rule);
      if (ruleToApply?.satisfyRule(this.answer.map(z => z.card))) {
        this.answer.forEach(z => {
          z.cardState = 'card-correct';
          z.cardsToDeckAnimation();
        })
        this.gameActions.showNextChallenge.emit();
        this.answerCounter = 0;
      } else {
        this.answer.forEach(z => z.cardState = 'card-wrong');
      }
    })
  }




  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
  }



  answerVerificationMethod(card: CardComponent, rule: GameRule) {
    if (this.answerCounter <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !card.isSelected) {
      this.answer.push(card);
      this.answerCounter++;
      card.cardState = 'card-selected';
      card.isSelected = true;
      if (this.answerCounter === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
        this.gameActions.checkedAnswer.emit();
      }
    }
    else {
      this.answer.splice(this.answer.indexOf(card), 1);
      card.isSelected = false;
      card.cardState = 'card-neutral';
      this.answerCounter--;
    }
  }


  // cardsToDeckAnimation() {
  //   anime({
  //     targets: this.answer,
  //     translateX:162,
  //     translateY: 315,
  //     delay:500,
  //     duration:1000,
  //     easing: 'easeOutExpo',
  //     complete:() => this.gameActions.showNextChallenge.emit()
  //   })
  //   }



}
