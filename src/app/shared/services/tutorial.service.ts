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
  public rulesAvaiables = gameRules;





  tutorialCardGenerator(isFirst:boolean):void {
  this.lastCards = [];
  this.currentRule = anyElement(this.rulesAvaiables);
  this.rulesAvaiables = this.rulesAvaiables.filter(z => z !== this.currentRule);
  console.log('Sovle the cards generationg')
  if(isFirst){
    // this.cardInTableObj.setInitialCards(cardColors,cardShapes,cardFillers,9,3);
    // this.tutorialCards = ;
    // this.cardInTableObj.modifyInitialCards(this.currentRule,3,this.tutorialCards,cardColors,cardShapes,cardFillers,this.lastCards,9);
    // this.tutorialCards = shuffle(this.tutorialCards.concat(this.lastCards));
  } else {
    // this.cardInTableObj.modifyInitialCards(this.currentRule,3,this.tutorialCards,cardColors,cardShapes,cardFillers,this.lastCards,9);
  }
}



}
