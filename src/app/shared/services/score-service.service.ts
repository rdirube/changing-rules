import {Injectable} from '@angular/core';
import {ChangingRulesScoreCriteria} from '../models/types';
import {ExerciseData, MiniLessonMetrics} from 'ox-types';
import {ChangingRulesChallengeService} from './changing-rules-challenge.service';
import {ScoreStarsService} from 'micro-lesson-core';

@Injectable({
  providedIn: 'root'
})
export class ScoreServiceService extends ScoreStarsService<any> {
  constructor(private challengeService: ChangingRulesChallengeService) {
    super();
  }

  calculateScore(metrics: MiniLessonMetrics, minScore?: number, maxScore?: number): void {
    console.log('Calculanting');
    const config = this.challengeService.getExerciseConfig();
    const maxValue = 10000;
    const maxCorrectExercises = (config.totalTimeInSeconds && config.totalExercises)
    || config.totalTimeInSeconds <= 0 ?
      config.totalExercises
      : config.totalTimeInSeconds / (config.cardsForCorrectAnswer * getStimatedTimeForCardByDifficulty(config.timeScoreCriteria));
    const correctExerciseValue = maxValue / maxCorrectExercises;
    const wrongExerciseValue = -correctExerciseValue / 2;

    (metrics.expandableInfo?.exercisesData as ExerciseData[]).forEach(z => {
      z.userInput.answers.forEach( answer => {
        metrics.pointsScore += answer.parts.every( x => x.correctness === 'correct') ? correctExerciseValue :
          answer.parts.every( x => x.correctness === 'wrong') ? wrongExerciseValue : 0;
        console.log('Metric was', z.finalStatus);
        console.log('New score...', metrics.pointsScore);
      })

    });
    metrics.pointsScore = Math.round(Math.max(500, metrics.pointsScore));
    metrics.bonusScore = 0;
    metrics.score = Math.round(metrics.pointsScore + metrics.bonusScore);
  }
}

function getStimatedTimeForCardByDifficulty(c: ChangingRulesScoreCriteria): number {
  switch (c) {
    case 'fácil':
      return 4;
    case 'media':
      return 3;
    case 'difícil':
      return 2;
    case 'lengendario':
      return 1;
    default:
      console.error('There was not difficulty to calculate the score. Using media.');
      return getStimatedTimeForCardByDifficulty('media');
    // throw new Error('There was not difficulty to calculate the score.')
  }
}
