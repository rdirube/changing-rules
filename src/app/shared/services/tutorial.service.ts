import { Injectable, EventEmitter } from '@angular/core';
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
  ALL_RULES, ChangingRulesExercise,
} from '../models/types';
import { CARD_COLORS, CARD_SHAPES, CARD_FILLERS, GAME_RULES } from '../models/const';
import { anyElement, shuffle } from 'ox-types';
import { ChangingRulesChallengeService } from './changing-rules-challenge.service';




@Injectable({
  providedIn: 'root'
})


export class TutorialService {
  public currentRule!: Rule;
  public cardInTable!:CardsInTable;
  public propertyFixed: any[] = [];
  public property: GameRule[] = [];
  public propertiesAvaiable = GAME_RULES;
  constructor(private challengeService: ChangingRulesChallengeService) {
  
  }



  tutorialCardGenerator(gameRule: GameRule): ChangingRulesExercise {
    this.currentRule = ALL_RULES.find(z => gameRule === z.id) as Rule;
    console.log('cantidad de cartas usadas', this.cardInTable.cards.map( z => z.hasBeenUsed).length)
    this.cardInTable.updateCards(this.currentRule, 3);
    return {
      currentCards: this.cardInTable.cards,
      rule: this.currentRule,
      currentSetting: 'igual'
    }
  }




  tutorialCardGeneratorSetConv(numberOfEqualProp:number): ChangingRulesExercise{
    this.property = [];
    this.propertyFixed = [];
    for(let y = 0; y < numberOfEqualProp; y++) {
      this.property.push(anyElement(this.propertiesAvaiable));
     this.propertiesAvaiable =  this.propertiesAvaiable.filter(prop => !this.property.includes(prop));
    }
    this.cardInTable.updateCardsTutorialConventional(3, this.property, this.propertyFixed, numberOfEqualProp);
    return {
      currentCards: this.cardInTable.cards,
      rule: this.currentRule,
      currentSetting: 'igual'
    }
  }

  

  tutorialWrongCardGenerator() {
    this.property = [];
    this.propertiesAvaiable = GAME_RULES;
    this.property.push(anyElement(this.propertiesAvaiable));
    this.cardInTable.generateWrongCards(this.property[0], 3);
  }


}



function getvalidProperty() {
  throw new Error('Function not implemented.');
}

