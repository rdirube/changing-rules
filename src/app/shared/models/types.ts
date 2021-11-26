import {initTranslocoService} from "@ngneat/transloco/lib/transloco-testing.module";
import {random} from "animejs";
import {anyElement, duplicateWithJSON, shuffle} from "ox-types";
import {Observable, zip} from "rxjs";
import {generateRandomCard, sameCard} from "./functions";
import {cardColors, cardFillers, cardShapes, gameRules} from "./const";

export type CardColor = 'naranja' | 'celeste' | 'amarillo' | 'verde' | 'violeta';
export type CardShape = 'circulo' | 'cuadrado' | 'triangulo' | 'estrella' | 'rombo';
export type CardFill = 'vacio' | 'relleno' | 'rallado' | 'moteado';
export type GameRule = 'forma' | 'color' | 'relleno';
export type GameSetting = 'igual' | 'distinto' | 'aleatorio';
export type GameMode = 'limpiar la mesa' | 'Set convencional';
export type PositionXAxis = "right" | "left" | "center";
export type PositionYAxis = "top" | "bottom" | "center";

export interface CardInfo {
  color: CardColor;
  shape: CardShape;
  fill: CardFill;
  hasBeenUsed: boolean;
  // isAnchorForRule?: boolean;
  // cardClasses?: string;
}


export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}


export interface ChangingRulesExercise {
  rule: Rule;
  // lastCards: CardInfo[];
  currentCards: CardInfo[]
}

export interface TutorialStep {
  text: string;
  actions: () => void,
  completedSub: Observable<any>;
}

export interface RuleArray {
  auxForSvg: string,
  iconSvg: string,
  class: string,
  isOn: boolean,
  id: GameRule

}

export interface ChangingRulesCard {
  svg: string;
}


export interface ChangingRulesNivelation {
  gameRules: GameRule[];
  shapesAvaiable: CardShape[];
  colorsAvaiable: CardColor[];
  fillsAvaiable: CardFill[];
  cards: number;
  cardQuantityDeck: number;
  cardsForCorrectAnswer: number;
  gameSetting: GameSetting;
  totalTimeSeconds: number;
  wildcardOn: boolean;
  minWildcardQuantity: number;
  maxWildcardQuantity: number;
  gameMode: GameMode;
  rulesForAnswer: number;
}


export interface ButtonInfo {
  horizontal: PositionXAxis;
  vertical: PositionYAxis;
  offsetX?: number,
  offsetY?: number,
}


export interface MagnifierPosition {
  width: string,
  height: string,
  transform: string,
  borderRadius: string,
  flexPosition: string,
  buttonInfo?: ButtonInfo,
  reference: string,
}


export abstract class Rule {
  abstract id: GameRule | undefined;

  abstract satisfyRule(c1: CardInfo, c2: CardInfo): boolean;

  abstract modifyToSatifyRule(randomCardFromTable: CardInfo, myCard: CardInfo): CardInfo;

  allSatisfyRule(cards: CardInfo[]): boolean {
    return cards.every(card => this.satisfyRule(card, cards[0]));
  }

  countOfEqualProperty(anchorCard: CardInfo, cardsInTable: CardInfo[]): number {
    return this.getSatisfyCards(anchorCard, cardsInTable).length;
  }

  getSatisfyCards(randomCard: CardInfo, cardsInTable: CardInfo[]): CardInfo[] {
    return cardsInTable.filter(z => this.satisfyRule(z, randomCard));
  }
}


export class ShapeRule extends Rule {
  id = 'forma' as GameRule;

  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.shape === c2.shape;
  }


  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): CardInfo {
    toModifyCard.shape = primaryCard.shape;
    return toModifyCard;
  }
}


export class ColorRule extends Rule {
  id = 'color' as GameRule;

  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.color === c2.color;
  }

  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): CardInfo {
    toModifyCard.color = primaryCard.color;
    return toModifyCard;
  }


}


export class FillRule extends Rule {
  id = 'relleno' as GameRule;

  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.fill === c2.fill;
  }

  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): CardInfo {
    toModifyCard.fill = primaryCard.fill;
    return toModifyCard;
  }
}


export class CardsInTable {

  public cards: CardInfo[] = [];
  public currentPossibleAnswerCards: CardInfo[] = [];

  constructor() {
  }

  setInitialCards(cardsInTableQuant: number, correctAnswerQuant: number): void {
    this.cards = [];
    // for (let i = 0; i < cardsInTableQuant - correctAnswerQuant; i++) {
    for (let i = 0; i < cardsInTableQuant; i++) {
      this.cards.push(this.generateCard());
    }
    const indexes = shuffle(this.cards.map((z, i) => i)).slice(0, correctAnswerQuant);
    indexes.forEach(i => this.cards[i].hasBeenUsed = true);
  }

  curentRuleFinder(rule: GameRule): Rule | undefined {
    const ruleSelected = ALL_RULES.find(x => x.id === rule);
    return ruleSelected;
  }

  // modifyInitialCards(currentRule: GameRule, correctAnswerQuant: number,
  //                    colors: CardColor[], shapes: CardShape[], fillers: CardFill[],
  //                    lastCards: CardInfo[]): void {
  //   const randomCardFromTable = anyElement(this.cards);
  //   const rule = this.curentRuleFinder(currentRule) as Rule;
  //   const initialSatisfyingCards = rule.getSatisfyCards(randomCardFromTable, this.cards);
  //   const equalPropertyQuantity = rule.countOfEqualProperty(randomCardFromTable, this.cards);
  //   for (let i = 0; i < correctAnswerQuant; i++) {
  //     if (i < correctAnswerQuant - equalPropertyQuantity!)
  //       lastCards.push(this.generateCard(this.curentRuleFinder(currentRule), randomCardFromTable));
  //     else
  //       lastCards.push(this.generateCard());
  //   }
  //   // this.cards.forEach(x => x.isAnchorForRule = false);
  //   // randomCardFromTable.isAnchorForRule = true;
  //   console.log('The initial satisfying cards was', duplicateWithJSON(initialSatisfyingCards));
  //   // console.log('Current satisfying cards was', duplicateWithJSON(rule.getSatisfyCards(randomCardFromTable)));
  // }


  generateCard(ruleToApply?: Rule, cardGuideRule?: CardInfo): CardInfo {
    const cardToAdd: CardInfo = generateRandomCard();
    if (cardGuideRule && ruleToApply) {
      ruleToApply.modifyToSatifyRule(cardGuideRule, cardToAdd);
    }
    return this.isNotRepeated(cardToAdd) ? cardToAdd :
      this.generateCard(ruleToApply, cardGuideRule);
  }

  isNotRepeated(card: CardInfo): boolean {
    return !this.cards.some(x => sameCard(x, card));
  }


  updateCards(rule: Rule, minToCorrectAnswer: number): void {
    const indexesToReplace: number[] = this.cards.map((z, i) => z.hasBeenUsed ? i : undefined)
      .filter(z => z !== undefined) as number[];
    const cardsThatWillRemain = this.cards.filter(z => !z.hasBeenUsed);
    const randomCardFromTable = anyElement(cardsThatWillRemain);
    this.currentPossibleAnswerCards = rule.getSatisfyCards(randomCardFromTable, cardsThatWillRemain).slice(0, 3);
    const cardsToAddSatisyingRule = minToCorrectAnswer - this.currentPossibleAnswerCards.length;
    const newCards: CardInfo[] = [];
    for (let i = 0; i < indexesToReplace.length; i++) {
      if (newCards.length < cardsToAddSatisyingRule) {
        const card = this.generateCard(rule, randomCardFromTable);
        newCards.push(card);
        this.currentPossibleAnswerCards.push(card);
      } else
        newCards.push(this.generateCard());
    }
    indexesToReplace.forEach((index, i) => {
      this.cards[index] = newCards[i];
    });
  }
}


export const ALL_RULES: Rule[] = [new ShapeRule(), new FillRule(), new ColorRule()];
