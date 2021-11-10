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
    // public cardQuantity: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
  
        console.log(this.exercise);
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

  
 


}
