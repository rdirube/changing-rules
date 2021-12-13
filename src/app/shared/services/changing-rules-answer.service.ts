import { EventEmitter, Injectable } from '@angular/core';
import { AnswerService, GameActionsService, MicroLessonMetricsService } from 'micro-lesson-core';
import { ChangingRulesChallengeService } from './changing-rules-challenge.service';
import { ExpandedShowable, PartCorrectness, UserAnswer } from 'ox-types';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangingRulesAnswerService extends AnswerService {
   
  cardsToDeckAnimationEmitter:EventEmitter<void> = new EventEmitter();
  cardsToDeckAnimationEmitterTutorial:EventEmitter<any> = new EventEmitter();
  correctCards = new EventEmitter();
  wrongCards = new EventEmitter();


  constructor(private gameActionsService: GameActionsService<any>,
    m: MicroLessonMetricsService<any>,
    private challenge: ChangingRulesChallengeService) {
    super(gameActionsService, m);
    this.gameActionsService.showNextChallenge.subscribe(value => {
      this.cleanAnswer();
    });
    this.gameActionsService.finishedTimeOfExercise.subscribe(() => {
      console.log('finishedTimeOfExercise');
      this.onTryAnswer();
    });
  }

  protected isValidAnswer(answer: UserAnswer): boolean {
    return false;
  }


  public cleanAnswer(): void {
    this.currentAnswer = { parts: [] };
  }

}