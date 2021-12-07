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
  public propertyFixed: any;
  public stepAllCards: CardInfo[] = [];
  public stepAnswerCards: CardInfo[] = [];
  public property!: GameRule;


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








  tutorialCardGeneratorSetConv(cardsForCorrect: number, cardsInTableQuant: number) {
    this.property = anyElement(GAME_RULES);
    this.setStepArray();
    for (let i = 0; i < cardsForCorrect; i++) {
      const cardToAdd = this.addForcedCard(this.stepAllCards);
      this.stepAllCards.push(cardToAdd);
      this.stepAnswerCards.push(cardToAdd);
    }
    for (let i = 0; i < cardsInTableQuant - cardsForCorrect; i++) {
      const randomCardToAdd = this.cardInTable.generateCard(this.stepAllCards);
      this.stepAllCards.push(randomCardToAdd);
    }
    shuffle(this.stepAllCards);
  }




  setStepArray(): void {
    switch (this.property) {
      case 'color': this.propertyFixed = anyElement(CARD_COLORS);
        break
      case 'forma': this.propertyFixed = anyElement(CARD_SHAPES);
        break
      case 'relleno': this.propertyFixed = anyElement(CARD_FILLERS);
        break
    }
  }


  addForcedCard(cards: CardInfo[]): CardInfo {
    return {
      color: this.getValidProperty<CardColor>(cards.map(z => z.color), CARD_COLORS, this.propertyFixed),
      shape: this.getValidProperty<CardShape>(cards.map(z => z.shape), CARD_SHAPES, this.propertyFixed),
      fill: this.getValidProperty<CardFill>(cards.map(z => z.fill), CARD_FILLERS, this.propertyFixed),
      hasBeenUsed: false
    }
  }



  getValidProperty<T>(currentProperty: T[], allProperties: T[], propertyFixed: T): T {
    const isPropertyFixedInAll = allProperties.find(prop => prop === propertyFixed);
    return isPropertyFixedInAll ? propertyFixed : anyElement(allProperties.filter(z => !currentProperty.includes(z)));
  }




  //   }
  // }


  // tutorialConvCardGenerator():ChangingRulesExercise {
  // this.propertyStep1 = anyElement(GAME_RULES);


  // }
}



function getvalidProperty() {
  throw new Error('Function not implemented.');
}

