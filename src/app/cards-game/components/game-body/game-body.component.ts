import {Component, OnInit, AfterViewInit} from '@angular/core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {OxTextInfo, ScreenTypeOx} from 'ox-types';
import {ChangingRulesChallengeService} from 'src/app/shared/services/changing-rules-challenge.service';
import {ExerciseOx} from 'ox-core';
import {ChangingRulesExercise} from 'src/app/shared/models/types';
import {filter, take} from 'rxjs/operators';


@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  public gameInstruction = new OxTextInfo();
  public gameInstructionText: string = "Igual";
  public cardQuantity: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public exercise: ChangingRulesExercise | undefined;
  showCountDown: boolean | undefined;


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
        this.exercise = exercise.exerciseData;
        console.log(exercise);
        // this.addMetric();
        // this.hintService.usesPerChallenge = this.exercise.optionsBirds.length > 2 ? 1 : 0;
        this.hintService.checkHintAvailable();
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

  }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.challengeService.nextChallenge();
  }


  // private addMetric(): void {
  //   const myMetric: ExerciseData = {
  //     schemaType: 'multiple-choice',
  //     schemaData: {
  //       statement: {parts: []},
  //       additionalInfo: [],
  //       options: this.challengeService.currentExercise.value.exerciseData.optionsBirds.map(this.birdToOption.bind(this)),
  //       optionMode: 'independent',
  //       requiredOptions: 1
  //     } as MultipleChoiceSchemaData,
  //     userInput: {
  //       answers: [],
  //       requestedHints: 0,
  //       surrendered: false
  //     },
  //     finalStatus: 'to-answer',
  //     maxHints: 1,
  //     secondsInExercise: 0,
  //     initialTime: new Date(),
  //     finishTime: undefined as any,
  //     firstInteractionTime: undefined as any
  //   };
  //   this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
  //     myMetric.firstInteractionTime = new Date();
  //   });
  //   this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
  //     z => {
  //       myMetric.finishTime = new Date();
  //       console.log('Finish time');
  //     });
  //   this.metricsService.addMetric(myMetric as ExerciseData);
  //   this.metricsService.currentMetrics.exercises++;
  // }


}
