import { Injectable } from '@angular/core';
import {
  Rule,
  GameRule,
  GameMode,
  GameSetting,
  CardColor,
  CardFill,
  CardInfo,
  CardShape,
  CardsInTable,
  ALL_RULES
} from '../models/types';
import { CARD_COLORS, CARD_SHAPES, CARD_FILLERS, GAME_RULES } from '../models/const';
import { anyElement, shuffle } from 'ox-types';




@Injectable({
  providedIn: 'root'
})
export class TutorialService {


  public currentRule!: Rule;
  public cardInTable;

  public rulesAvaiables = ALL_RULES;

  constructor() {
    this.cardInTable = new CardsInTable(CARD_COLORS, CARD_SHAPES, CARD_FILLERS);
    this.cardInTable.setInitialCards(9, 3);
  }





  tutorialCardGenerator():void {
  this.currentRule = anyElement(this.rulesAvaiables);
  this.rulesAvaiables = this.rulesAvaiables.filter(z => z !== this.currentRule);
  this.cardInTable.updateCards(this.currentRule, 3);
  // if(isFirst){
  //   // this.cardInTable.setInitialCards(CARD_COLORS,CARD_SHAPES,CARD_FILLERS,9,3);
  //   // this.tutorialCards = ;
  //   // this.cardInTable.modifyInitialCards(this.currentRule,3,this.tutorialCards,CARD_COLORS,CARD_SHAPES,CARD_FILLERS,this.lastCards,9);
  //   // this.tutorialCards = shuffle(this.tutorialCards.concat(this.lastCards));
  // } else {
  //   // this.cardInTable.modifyInitialCards(this.currentRule,3,this.tutorialCards,CARD_COLORS,CARD_SHAPES,CARD_FILLERS,this.lastCards,9);
  // }
}



}
