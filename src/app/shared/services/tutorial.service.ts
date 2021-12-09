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
  public cardInTable;
  public propertyStep1!: GameRule;
  public propertyStep2A!: GameRule;
  public propertyStep2B!: GameRule;
  public propertyFixed: any[] = [];
  public stepAllCards: CardInfo[] = [];
  public stepAnswerCards: CardInfo[] = [];
  public property: GameRule[] = [];
  public propertiesAvaiable = GAME_RULES;

  constructor(private challengeService: ChangingRulesChallengeService) {
    const aux = this.challengeService.exerciseConfig;
    this.cardInTable = new CardsInTable(CARD_COLORS, CARD_SHAPES, CARD_FILLERS);
    this.cardInTable.setInitialCards(9, 3);
  }



  tutorialCardGenerator(gameRule: GameRule): ChangingRulesExercise {
    this.currentRule = ALL_RULES.find(z => gameRule === z.id) as Rule;
    // this.rulesAvaiables = this.rulesAvaiables.filter(z => z !== this.currentRule.id);
    this.cardInTable.updateCards(this.currentRule, this.challengeService.getExerciseConfig().cardsForCorrectAnswer);
    return {
      currentCards: this.cardInTable.cards,
      rule: this.currentRule,
      currentSetting: 'igual'
    }
  }




  tutorialCardGeneratorSetConv(numberOfEqualProp:number) {
    for(let y = 0; y < numberOfEqualProp; y++) {
      this.property.push(anyElement(this.propertiesAvaiable));
     this.propertiesAvaiable =  this.propertiesAvaiable.filter(prop => !this.property.includes(prop));
    }
    this.cardInTable.updateCardsTutorialConventional(3, this.property, this.propertyFixed, numberOfEqualProp);
    console.log(this.cardInTable.cards);
    this.property = [];
    this.propertyFixed = [];
  }


}



function getvalidProperty() {
  throw new Error('Function not implemented.');
}

