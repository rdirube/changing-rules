import { Injectable } from '@angular/core';
import { Rule, GameRule, GameMode, GameSetting, CardColor, CardFill, CardInfo, CardShape, CardsInTable  } from '../models/types';
import { cardColors, cardShapes, cardFillers, gameRules } from '../models/const';
import { anyElement } from 'ox-types';




@Injectable({
  providedIn: 'root'
})
export class TutorialService {


  


  constructor() { }



  tutorialRule():GameRule {
   return anyElement(gameRules);
  }

  tutorialCardGenerator():CardInfo[] {
    const cardsTutorial:CardInfo[] = []
    for(let i=0; i<9; i++)
    {
      cardsTutorial.push({color:anyElement(cardColors), shape:anyElement(cardShapes), fill: anyElement(cardFillers)})
    }
    return cardsTutorial;
  }


}
