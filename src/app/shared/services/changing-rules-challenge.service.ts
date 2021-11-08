import { Injectable } from '@angular/core';
import {AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService} from 'micro-lesson-core';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {ChangingRulesExercise} from '../types/changing-rules';
import {ExpandableInfo, Showable} from 'ox-types';

@Injectable({
  providedIn: 'root'
})
export class ChangingRulesChallengeService extends ChallengeService<any, any> {

  public exerciseConfig: any; // TODO definy type

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
              subLevelService: SubLevelService,
              private preloaderService: PreloaderOxService,
              private feedback: FeedbackOxService,
              private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
    gameActionsService.restartGame.subscribe(z => {
      this.cachedExercises = [];
      this.setInitialExercise();
    });
  }

  nextChallenge(): void {
    this.cachedExercises.push(this.generateNextChallenge(0));
  }

  protected equalsExerciseData(a: any, b: any): boolean {
    return true;
  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<ChangingRulesExercise> {
    return new ExerciseOx(JSON.parse(JSON.stringify({})), 1, {maxTimeToBonus: 0, freeTime: 0}, []);
    // }
  }


  beforeStartGame(): void {
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        this.exerciseConfig = this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo.properties;
        // this.setInitialExercise();
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
  }

  public getMetricsInitialExpandableInfo(): ExpandableInfo {
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: 'infinite',
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'between-interactions',
      },
    };
  }

  private setInitialExercise(): void {
    console.log('setInitialExercise');
  }
}
