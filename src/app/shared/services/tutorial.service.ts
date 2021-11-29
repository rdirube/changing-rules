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
  ALL_RULES, ChangingRulesExercise
} from '../models/types';
import { CARD_COLORS, CARD_SHAPES, CARD_FILLERS, GAME_RULES } from '../models/const';
import { anyElement, shuffle } from 'ox-types';
import {ChangingRulesChallengeService} from './changing-rules-challenge.service';




@Injectable({
  providedIn: 'root'
})
export class TutorialService {


  public currentRule!: Rule;
  public cardInTable;

  constructor(private challengeService: ChangingRulesChallengeService) {
    const aux = this.challengeService.getExerciseConfig();
    this.cardInTable = new CardsInTable(aux.colorsAvaiable, aux.shapesAvaiable, aux.fillsAvaiable);
    this.cardInTable.setInitialCards(9, 3);
  }

  tutorialCardGenerator(gameRule: GameRule): ChangingRulesExercise {
  this.currentRule = ALL_RULES.find( z => gameRule === z.id) as Rule;
  // this.rulesAvaiables = this.rulesAvaiables.filter(z => z !== this.currentRule.id);
  this.cardInTable.updateCards(this.currentRule, this.challengeService.getExerciseConfig().cardsForCorrectAnswer);
  return  {
    currentCards: this.cardInTable.cards,
    rule: this.currentRule,
    currentSetting: 'igual'
  }
}



}
