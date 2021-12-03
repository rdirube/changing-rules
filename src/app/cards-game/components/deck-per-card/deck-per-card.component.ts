import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { CardInfo } from 'src/app/shared/models/types';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-deck-per-card',
  templateUrl: './deck-per-card.component.html',
  styleUrls: ['./deck-per-card.component.scss']
})
export class DeckPerCardComponent implements OnInit {

  @Input() swiftCardOn!:boolean;
  @Input() cardInfo!:CardInfo;
  @Input() faceDown!:boolean;
  @Input() cardClasses: string = 'card-neutral';
  @Input() deckComponent!: ElementRef;
  @Input() answerComponent!:CardComponent;

  constructor() { }

  ngOnInit(): void {
  }


  


}
