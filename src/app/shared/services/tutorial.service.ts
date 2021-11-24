import { Injectable } from '@angular/core';
import { Rule, GameRule, GameMode, GameSetting, CardColor, CardFill, CardInfo, CardShape, CardsInTable } from '../models/types';
import { cardColors, cardShapes, cardFillers, gameRules } from '../models/const';
import { anyElement, shuffle } from 'ox-types';




@Injectable({
  providedIn: 'root'
})
export class TutorialService {


  public elementToChose!:any;
  public currentRule!:GameRule;
  public cardInTableObj = new CardsInTable();
  public lastCards:CardInfo[] = [];
  constructor() { }



  tutorialRule():GameRule {
   return anyElement(gameRules);
  }



  tutorialCardGenerator():CardInfo[] {
  this.lastCards = [];
  this.currentRule = anyElement(gameRules);
  const initialCards = this.cardInTableObj.setInitialCards(cardColors,cardShapes,cardFillers,9,3);
  this.cardInTableObj.modifyInitialCards(this.currentRule,3,initialCards,cardColors,cardShapes,cardFillers,this.lastCards,9);
  console.log(initialCards);
  console.log(this.lastCards);
  return shuffle(initialCards.concat(this.lastCards));
  
}



}
