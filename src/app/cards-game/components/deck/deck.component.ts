import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FeedbackOxService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {ChangingRulesChallengeService} from '../../../shared/services/changing-rules-challenge.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  public auxArray: number[] = [];
  public deckClass = 'empty';
  private addCardToDeckValidator:number = 0;

  constructor(public elementRef: ElementRef,
              private gameActions: GameActionsService<any>,
              private feedBack: FeedbackOxService,
              private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>) {
    super();
    this.addSubscription(this.feedBack.endFeedback, z => {
      if (this.metricsService.currentMetrics.expandableInfo !== undefined) {
        console.log(this.challengeService.cardsPlayed);
        if(this.challengeService.cardsPlayed >= 6*this.challengeService.addCardToDeckValidator && this.challengeService.cardsPlayed < 42) {
          this.challengeService.addCardToDeckValidator+=1;
          this.auxArray.push(0);
        }
      }      
    });
  }

  ngOnInit(): void {
  }

}
