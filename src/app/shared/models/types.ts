import { initTranslocoService } from "@ngneat/transloco/lib/transloco-testing.module";
import { random } from "animejs";
import { anyElement } from "ox-types";
import { Observable, zip } from "rxjs";
import { generateRandomCard, sameCard } from "./functions";
import { cardColors, cardFillers, cardShapes, gameRules } from "./const";
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
}




export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}


export interface ChangingRulesExercise {
  rule: GameRule;
  lastCards: CardInfo[];
  cardsInTable: CardInfo[]
}


export interface TutorialExercise {
  rule:GameRule;
  cardsInTable:CardInfo[];
}


export interface TutorialStep {
  text: string;
  actions: () => void,
  completedSub: Observable<any>;
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


  constructor() {
  }


  public cardsInTable: CardInfo[] = [];
  public currentRule!: Rule;



  setInitialCards(colors: CardColor[], shapes: CardShape[], fillers: CardFill[], cardsInTableQuant: number, correctAnswerQuant: number): CardInfo[] {
    const cardToAdd = generateRandomCard();
    const firstCards: CardInfo[] = []
    for (let i = 0; i < cardsInTableQuant - correctAnswerQuant; i++) {
      firstCards.push(this.generateCard(firstCards))
    }
    console.log(firstCards);
    return firstCards;
  }



  curentRuleFinder(rule:GameRule):Rule | undefined {
    const ruleSelected = ALL_RULES.find(x => x.id === rule);
    return ruleSelected
  }



  modifyInitialCards(currentRule: GameRule, correctAnswerQuant: number, cardsInTable: CardInfo[], colors: CardColor[], shapes: CardShape[], fillers: CardFill[], lastCards:CardInfo[], exerciseCardQuant: number): void {
    const randomCardFromTable = anyElement(cardsInTable);
    console.log(currentRule);
    console.log(randomCardFromTable);
    const equalPropertyQuantity = this.curentRuleFinder(currentRule)?.countOfEqualProperty(randomCardFromTable, cardsInTable);
    console.log(equalPropertyQuantity)
    for(let i = 0; i < correctAnswerQuant; i++) {
      if (i < correctAnswerQuant - equalPropertyQuantity!)
        lastCards.push(this.generateCard(cardsInTable.concat(lastCards), this.curentRuleFinder(currentRule), randomCardFromTable))
      else
        lastCards.push(this.generateCard(cardsInTable.concat(lastCards)))
    }
    console.log(lastCards);
  }




  generateCard(cards: CardInfo[], ruleToApply?: Rule, cardGuideRule?: CardInfo): CardInfo {
    const cardToAdd: CardInfo = generateRandomCard();
    if (cardGuideRule) {
      ruleToApply?.modifyToSatifyRule(cardGuideRule, cardToAdd)
    }
    return this.isNotRepeated(cardToAdd, cards) ? cardToAdd :
    this.generateCard(cards, ruleToApply, cardGuideRule);
  }

  isNotRepeated(card: CardInfo, cards: CardInfo[]): boolean {
    return !cards.some(x => sameCard(x, card));
  }



}


export const ALL_RULES: Rule[] = [new ShapeRule(), new FillRule(), new ColorRule()];
