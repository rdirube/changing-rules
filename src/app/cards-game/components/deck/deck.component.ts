import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FeedbackOxService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {ChangingRulesChallengeService} from '../../../shared/services/changing-rules-challenge.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangingRulesAnswerService } from 'src/app/shared/services/changing-rules-answer.service';


@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent extends SubscriberOxDirective implements OnInit {

  // @Input() deckClass!:string;
  // @Input('cardsPlayed') cardsPlayed!:number;

  @Input() public deckWidth: string = '15vh';
  @Input() public deckHeight: string = '27.5vh';
  @Input() cardsPlayed!: number;
  @Input() auxArray: number[] = [];
  public deckClass = 'empty';
  private addCardToDeckValidator:number = 0;

  constructor(public elementRef: ElementRef,
              private gameActions: GameActionsService<any>,
              private feedBack: FeedbackOxService,
              private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private answerService:ChangingRulesAnswerService) {
    super();
    this.addSubscription(this.feedBack.endFeedback, z => {
      if (this.metricsService.currentMetrics.expandableInfo !== undefined) {
        if(this.challengeService.cardsPlayed >= 9*this.challengeService.addCardToDeckValidator && this.challengeService.cardsPlayed < 45) {
          this.challengeService.addCardToDeckValidator+=1;
          this.auxArray.push(0);
        }
      }      
    }
  );
   

  
    this.addSubscription(this.answerService.correctCards, z=> {
      this.challengeService.addCardToDeckValidator+=1;
      this.auxArray.push(0);
    })
  }



  ngOnInit(): void {
  }

}
