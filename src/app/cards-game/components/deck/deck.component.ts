import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FeedbackOxService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {ChangingRulesChallengeService} from '../../../shared/services/changing-rules-challenge.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent extends SubscriberOxDirective implements OnInit {

  // @Input() deckClass!:string;
  // @Input('cardsPlayed') cardsPlayed!:number;

  @Input() public deckWidth: string = '';
  @Input() public deckHeight: string = '';
  public auxArray: any[] = [];

  constructor(public elementRef: ElementRef,
              private gameActions: GameActionsService<any>,
              private feedBack: FeedbackOxService,
              private challengeService: ChangingRulesChallengeService,
              private metricsService: MicroLessonMetricsService<any>) {
    super();
    this.addSubscription(this.feedBack.endFeedback, z => {
      if (this.metricsService.currentMetrics.expandableInfo !== undefined)
        this.auxArray = Array.from(Array(Math.min(8, this.auxArray.length + this.challengeService.exerciseConfig.cardsForCorrectAnswer)).keys()) as any[];
    });
  }

  ngOnInit(): void {
  }

}
