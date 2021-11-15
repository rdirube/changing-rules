import { random } from "animejs";
import { anyElement } from "ox-types";
import { zip } from "rxjs";
import { sameCard } from "./functions";

export type CardColor = 'naranja' | 'celeste' | 'amarillo' | 'verde' | 'violeta';
export type CardShape = 'circulo' | 'cuadrado' | 'triangulo' | 'estrella' | 'rombo';
export type CardFill = 'vacio' | 'relleno' | 'rallado' | 'moteado';
export type GameRule = 'forma' | 'color' | 'relleno';
export type GameSetting = 'igual' | 'distinto' | 'aleatorio';
export type GameMode = 'limpiar la mesa' | 'Set convencional';
export interface CardInfo {
  color: CardColor;
  shape: CardShape;
  fill: CardFill;
}

export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}

export interface ChangingRulesExercise {
  rule: GameRule;
  cards: CardInfo[];
}


export interface ChangingRulesCard {
  svg: string;
}



export interface ChangingRulesNivelation {
  gameRules: GameRule[];
  shapesAvaiable: CardShape[];
  colorsAvaiable: CardColor[];
  fillsAvaiable: CardFill[];
  cardsInTable: number;
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


export abstract class Rule {
  abstract id: GameRule | undefined;
  abstract satisfyRule(c1: CardInfo, c2: CardInfo): boolean;
  abstract modifyToSatifyRule(randomCardFromTable: CardInfo, myCard: CardInfo): void;
  // abstract countOfEqualProperty(randomCard: CardInfo, cardsInTable: CardInfo[], rule: GameRule):number;
  
  allSatisfyRule(cards: CardInfo[]): boolean {
    return cards.every(card => this.satisfyRule(card, cards[0]))
  }
  countOfEqualProperty(randomCard: CardInfo, cardsInTable: CardInfo[]): number {
    return cardsInTable.filter(z => this.satisfyRule(z, randomCard)).length;
  }
}



export class ShapeRule extends Rule {
  id = 'forma' as GameRule;

  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.shape === c2.shape;
  }

 

  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): void {
    toModifyCard.shape = primaryCard.shape;
  }
}


export class ColorRule extends Rule {
  id = 'color' as GameRule;
  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.color === c2.color;
  }

  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): void {
    toModifyCard.color = primaryCard.color;
  }
}



export class FillRule extends Rule {
  id = 'relleno' as GameRule;
  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.fill === c2.fill;
  }

  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): void {
    toModifyCard.fill = primaryCard.fill;
  }

}



<<<<<<< HEAD
// export function allSatisfyRule(cards: CardInfo[], rule: GameRule): boolean {
//     return cards.every(card => satisfyRule(card, cards[0], rule))
// }


// export function satisfyRule(c1: CardInfo, c2: CardInfo, rule: GameRule): boolean {
=======
// export function allSatisfyRule(cards: CardType[], rule: GameRule): boolean {
//     return cards.every(card => satisfyRule(card, cards[0], rule))
// }
//
//
// export function satisfyRule(c1: CardType, c2: CardType, rule: GameRule): boolean {
>>>>>>> c7451e27bb8dd866d9ca194535e34d316881a9b6
//   switch(rule){
//     case "forma": return c1.shape === c2.shape;
//     case "color": return c1.color === c2.color;
//     case "relleno": return c1.fill === c2.fill;
//   }
//   throw new Error('unknow rule');
// }
<<<<<<< HEAD



// export function countOfEqualProperty(randomCard: CardInfo, cardsInTable: CardInfo[], rule: GameRule):number {
//   switch (rule) {
//     case 'color':                  
//       return cardsInTable.filter(z => z.color === randomCard.color).length;
//     case 'forma':
//       return cardsInTable.filter(z => z.shape === randomCard.shape).length;
//     case 'relleno':
//       return cardsInTable.filter(z => z.fill ===randomCard.fill).length;
//   }
// }



export const ALL_RULES: Rule[] = [new ShapeRule(), new FillRule(), new ColorRule()];



export class CardsInTable {

  constructor(private rule: Rule) {
  }
=======
>>>>>>> c7451e27bb8dd866d9ca194535e34d316881a9b6

  public cardsInTable: CardInfo[] = [];


  setInitialCards(colors: CardColor[], shapes: CardShape[], fillers: CardFill[], cardsInTableQuant: number, cardsInTable: CardInfo[]): void {
    const optionCards = this.optionCardsMethod(colors, shapes, fillers);
    for (let i = 0; i < cardsInTableQuant; i++) {
      const differentFromAnswer = optionCards.filter(z => !cardsInTable.some(randomCard => sameCard(z, randomCard)))
      cardsInTable.push(anyElement(differentFromAnswer));
    }
  }


  optionCardsMethod(colors: CardColor[], shapes: CardShape[], fillers: CardFill[]): CardInfo[] {
    const optioncards = colors.map(color => shapes.map(shape => fillers.map(
      fill => {
        return { color, shape, fill }
      }
    ))).reduce((a, b) => a.concat(b)).reduce((a, c) => a.concat(c));
    return optioncards;
  }


  modififyFinalCards(currentRule: GameRule, correctAnswerQuant: number, cardsInTable: CardInfo[], colors: CardColor[], shapes: CardShape[], fillers: CardFill[]): void {
    const randomCardFromTable = anyElement(cardsInTable);
    let equalPropertyQuantity = this.rule.countOfEqualProperty(randomCardFromTable, cardsInTable)
    while (equalPropertyQuantity < correctAnswerQuant) {
      const myCard = anyElement(cardsInTable.filter(z => z !== randomCardFromTable))
      const ruleApplied = ALL_RULES.find(z => z.id === currentRule);
      ruleApplied?.modifyToSatifyRule(myCard, randomCardFromTable);
      if (cardsInTable.find(x => x !== myCard)) {
        cardsInTable.push(myCard);
        equalPropertyQuantity++;
      }
    }
  }
}