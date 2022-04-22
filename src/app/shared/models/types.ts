import { random } from "animejs";
import { anyElement, duplicateWithJSON, shuffle } from "ox-types";
import { Observable, zip } from "rxjs";
import { CARD_COLORS, CARD_FILLERS, CARD_SHAPES, GAME_RULES } from "./const";
import { allDifferentProperties, generateRandomCard, sameCard, satisfyRuleCardsNew, satisfyRuleFilter } from "./functions";

export type CardColor = 'naranja' | 'celeste' | 'amarillo' | 'verde' | 'violeta';
export type CardShape = 'circulo' | 'cuadrado' | 'triangulo' | 'estrella' | 'rombo';
export type CardFill = 'vacio' | 'relleno' | 'rallado' | 'moteado';
export type GameRule = 'forma' | 'color' | 'relleno';
export type GameSetting = 'igual' | 'distinto' | 'aleatorio';
export type GameMode = 'limpiar la mesa' | 'Set convencional';
export type PositionXAxis = "right" | "left" | "center";
export type PositionYAxis = "top" | "bottom" | "center";
export type ChangingRulesScoreCriteria = 'fácil' | 'media' | 'difícil' | 'lengendario';


// let colorsAvaiable = CARD_COLORS;
// const shapesAvaiable = CARD_SHAPES;
// const fillersAvaiable = CARD_FILLERS;


export interface CardInfo {
  color: CardColor;
  shape: CardShape;
  fill: CardFill;
  hasBeenUsed: boolean;
  // isAnchorForRule?: boolean;
  // cardClasses?: string;
}

export interface gridConfig {
  class:string;
  numberForZIndex:number;
}


export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}


export interface ChangingRulesExercise {
  rule: Rule;
  currentCards: CardInfo[],
  currentSetting: GameSetting
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
  cardInTable: number;
  // cardQuantityDeck: number;
  cardsForCorrectAnswer: number;
  gameSetting: GameSetting;
  totalExercises: number;
  totalTimeInSeconds: number;
  timeScoreCriteria: ChangingRulesScoreCriteria;

  // wildcardOn: boolean;
  // minWildcardQuantity: number;
  // maxWildcardQuantity: number;
  gameMode: GameMode;
  // rulesForAnswer: number;
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

  abstract uniqueRuleValue(cardForChecked: CardInfo, cards: CardInfo[]): boolean;

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



  uniqueRuleValue(cardForCheck: CardInfo, cards: CardInfo[]): boolean {
    return cards.filter(card => card.shape === cardForCheck.shape).length === 1;
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

  uniqueRuleValue(cardForCheck: CardInfo, cards: CardInfo[]): boolean {
    return cards.filter(card => card.color === cardForCheck.color).length === 1;
  }



}


export class FillRule extends Rule {
  id = 'relleno' as GameRule;



  satisfyRule(c1: CardInfo, c2: CardInfo): boolean {
    return c1.fill === c2.fill;
  }


  uniqueRuleValue(cardForCheck: CardInfo, cards: CardInfo[]): boolean {
    return cards.filter(card => card.fill === cardForCheck.fill).length === 1;
  }



  modifyToSatifyRule(primaryCard: CardInfo, toModifyCard: CardInfo): CardInfo {
    toModifyCard.fill = primaryCard.fill;
    return toModifyCard;
  }
}


export class CardsInTable {

  public cards: CardInfo[] = [];
  public currentPossibleAnswerCards: CardInfo[] = [];
  tutorialService: any;


  constructor(public cardColors: CardColor[], public cardShapes: CardShape[], public cardFillers: CardFill[]) {
  }



  setInitialCards(cardsInTableQuant: number, correctAnswerQuant: number): void {
    this.cards = [];
    for (let i = 0; i < cardsInTableQuant; i++) {
      this.cards.push(this.generateCard([]));
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
  //   const randomCardFromTable = anyElement(this.cardInTable);
  //   const rule = this.curentRuleFinder(currentRule) as Rule;
  //   const initialSatisfyingCards = rule.getSatisfyCards(randomCardFromTable, this.cardInTable);
  //   const equalPropertyQuantity = rule.countOfEqualProperty(randomCardFromTable, this.cardInTable);
  //   for (let i = 0; i < correctAnswerQuant; i++) {
  //     if (i < correctAnswerQuant - equalPropertyQuantity!)
  //       lastCards.push(this.generateCard(this.curentRuleFinder(currentRule), randomCardFromTable));
  //     else
  //       lastCards.push(this.generateCard());
  //   }
  //   // this.cardInTable.forEach(x => x.isAnchorForRule = false);
  //   // randomCardFromTable.isAnchorForRule = true;
  //   console.log('The initial satisfying cardInTable was', duplicateWithJSON(initialSatisfyingCards));
  //   // console.log('Current satisfying cardInTable was', duplicateWithJSON(rule.getSatisfyCards(randomCardFromTable)));
  // }




  generateCard(extraCardArray: CardInfo[], ruleToApply?: Rule, cardGuideRule?: CardInfo): CardInfo {
    const cardToAdd: CardInfo = generateRandomCard(this.cardColors, this.cardShapes, this.cardFillers);
    if (cardGuideRule && ruleToApply) {
      ruleToApply.modifyToSatifyRule(cardGuideRule, cardToAdd);
    }
    return this.isNotRepeated(cardToAdd, extraCardArray) ? cardToAdd :
      this.generateCard(extraCardArray, ruleToApply, cardGuideRule);
  }



  cardNotRepeatedLargeRandom(newCards: CardInfo[]): CardInfo {
    const randomCard = generateRandomCard(CARD_COLORS, CARD_SHAPES, CARD_FILLERS);
    return this.isNotRepeated(randomCard, newCards) ? randomCard : this.cardNotRepeatedLargeRandom(newCards);
  }


  cardNotRepeatedLargeForced(cardsForCheck: CardInfo[], newCards: CardInfo[], addForcedCard: () => CardInfo): CardInfo {
    const forcedCard = addForcedCard();
    return this.isNotRepeated(forcedCard, newCards) ? forcedCard : this.cardNotRepeatedLargeForced(cardsForCheck, newCards, addForcedCard);
  }


  isNotRepeated(card: CardInfo, extraCardArray: CardInfo[]): boolean {
    return !this.cards.concat(extraCardArray).some(x => !x.hasBeenUsed && sameCard(x, card));
  }






  updateCards(rule: Rule, minToCorrectAnswer: number): void {
    const indexesToReplace: number[] = this.cards.map((z, i) => z.hasBeenUsed ? i : undefined)
      .filter(z => z !== undefined) as number[];
    const cardsThatWillRemain = this.cards.filter(z => !z.hasBeenUsed);
    const anchorCard = anyElement(cardsThatWillRemain);
    this.currentPossibleAnswerCards = rule.getSatisfyCards(anchorCard, cardsThatWillRemain).slice(0, minToCorrectAnswer);
    const cardsToAddSatisyingRule = minToCorrectAnswer - this.currentPossibleAnswerCards.length;
    const newCards: CardInfo[] = [];
    for (let i = 0; i < indexesToReplace.length; i++) {
      if (newCards.length < cardsToAddSatisyingRule) {
        const card = this.generateCard(newCards, rule, anchorCard);
        newCards.push(card);
        this.currentPossibleAnswerCards.push(card);
      } else
        newCards.push(this.generateCard(newCards));
    }
    indexesToReplace.forEach((index, i) => {
      this.cards[index] = newCards[i];
    });
  }





  addForcedCard(cards: CardInfo[]): CardInfo {
    return {
      color: this.getValidProperty<CardColor>(cards.map(z => z.color), CARD_COLORS),
      shape: this.getValidProperty<CardShape>(cards.map(z => z.shape), CARD_SHAPES),
      fill: this.getValidProperty<CardFill>(cards.map(z => z.fill), CARD_FILLERS),
      hasBeenUsed: false
    }
  }



  getValidProperty<T>(currentPropeteries: T[], allProperties: T[]): T {
    const different = currentPropeteries.some(aProperty => aProperty !== currentPropeteries[0])
    return different ? anyElement(allProperties.filter(z => !currentPropeteries.includes(z)))
      : currentPropeteries[0]
  }



  addForcedCardConv(cards: CardInfo[], propertyFixed?: any): CardInfo {
    return {
      color: this.getValidPropertyConv<CardColor>(cards.map(z => z.color), CARD_COLORS, propertyFixed),
      shape: this.getValidPropertyConv<CardShape>(cards.map(z => z.shape), CARD_SHAPES, propertyFixed),
      fill: this.getValidPropertyConv<CardFill>(cards.map(z => z.fill), CARD_FILLERS, propertyFixed),
      hasBeenUsed: false
    }
  }



  getValidPropertyConv<T>(currentProperty: T[], allProperties: T[], propertyFixed: T[]): T {
    const isPropertyFixedInAll = allProperties.find(prop => propertyFixed.includes(prop));
    return isPropertyFixedInAll ? isPropertyFixedInAll : anyElement(allProperties.filter(z => !currentProperty.includes(z)));
  }




  setStepFixedProp(card: CardInfo, property: GameRule): any {
    let propertyFixed = '';
    switch (property) {
      case 'color': propertyFixed = card.color;
        break
      case 'forma': propertyFixed = card.shape;
        break
      case 'relleno': propertyFixed = card.fill;
        break
    }
    return propertyFixed
  }



  //  returnDifferentPropertiesCard(differentCards:CardInfo[]):CardInfo {
  //     return {
  //     color: anyElement(CARD_COLORS.filter(z => differentCards.map(z => z.color).includes(z))),
  //     shape: anyElement(CARD_SHAPES.filter(c => differentCards.map(z => z.shape).includes(c))),
  //     fill: anyElement(CARD_FILLERS.filter(m => differentCards.map(z => z.fill).includes(m))),
  //     hasBeenUsed: false
  //   }}



  returnEqualProperty(prop: Rule, randomCard: CardInfo): CardInfo {
    const cardToAdd: CardInfo = generateRandomCard(this.cardColors, this.cardShapes, this.cardFillers);
    return prop.modifyToSatifyRule(cardToAdd, randomCard)
  }




  updateCardsNewModel(cardsForCorrect: number, addForcedCard: () => CardInfo): void {
    const indexesToReplace: number[] = this.cards.map((z, i) => z.hasBeenUsed ? i : undefined)
      .filter(z => z !== undefined) as number[];
    const cardsThatRemain: CardInfo[] = this.cards.filter(z => !z.hasBeenUsed);
    const newCards: CardInfo[] = [];
    this.currentPossibleAnswerCards = [];
    for (let i = 0; i < 2; i++) {
      this.currentPossibleAnswerCards.push(anyElement(cardsThatRemain.filter(z => !this.currentPossibleAnswerCards.includes(z))))
    }
    for (let i = 0; i < cardsForCorrect - 2; i++) {
      const forcedCardsToAdd = addForcedCard();
      this.currentPossibleAnswerCards.push(forcedCardsToAdd);
      newCards.push(forcedCardsToAdd);
    }
    for (let i = 0; i < 2; i++) {
      const randomCardToAdd = this.cardNotRepeatedLargeRandom(cardsThatRemain.concat(newCards));
      newCards.push(randomCardToAdd);
    }
    indexesToReplace.forEach((index, i) => {
      this.cards[index] = newCards[i];
    })
  }




  generateWrongCards(property: GameRule, cardsForCorrect: number) {
  const indexesToReplace: number[] = this.cards.map((z, i) => z.hasBeenUsed ? i : undefined)
    .filter(z => z !== undefined) as number[];
  const cardsThatRemain: CardInfo[] = this.cards.filter(z => !z.hasBeenUsed);
  const newCards: CardInfo[] = [];
  this.currentPossibleAnswerCards = [];
  const anchorCard = anyElement(cardsThatRemain.filter(z => !this.currentPossibleAnswerCards.includes(z)));
  this.currentPossibleAnswerCards.push(anchorCard);
  const propertyFixed = this.setStepFixedProp(anchorCard, property);
  const forcedCardEqual = this.cardNotRepeatedLargeForced(this.currentPossibleAnswerCards, newCards,() =>  this.addForcedCardConv(this.currentPossibleAnswerCards, propertyFixed))
  this.currentPossibleAnswerCards.push(forcedCardEqual);
  newCards.push(forcedCardEqual);
  const forcedCardDifferent = this.cardNotRepeatedLargeForced(this.currentPossibleAnswerCards, newCards,() =>  this.addForcedCardConv(this.currentPossibleAnswerCards, "undefined"));
  this.currentPossibleAnswerCards.push(forcedCardDifferent);
  newCards.push(forcedCardDifferent);
  for(let i = 0; i < cardsForCorrect - 2; i++) {
    newCards.push(this.cardNotRepeatedLargeRandom(cardsThatRemain.concat(newCards)));
  }
  console.log(this.currentPossibleAnswerCards);
  indexesToReplace.forEach((index, i) => {
    this.cards[index] = newCards[i];
  })
}




  updateCardsTutorialConventional(cardsForCorrect: number, property: GameRule[], propertyFixed: any[], numberOfEqualProp:number) {
    const indexesToReplace: number[] = this.cards.map((z, i) => z.hasBeenUsed ? i : undefined)
      .filter(z => z !== undefined) as number[];
    const cardsThatRemain: CardInfo[] = this.cards.filter(z => !z.hasBeenUsed);
    const newCards: CardInfo[] = [];
    this.currentPossibleAnswerCards = [];
    const anchorCard = anyElement(cardsThatRemain);
    this.currentPossibleAnswerCards.push(anchorCard);
    for(let v = 0; v < numberOfEqualProp; v++) {
      propertyFixed.push(this.setStepFixedProp(anchorCard, property[v])) ;
    }
    for (let i = 0; i < cardsForCorrect - 1; i++) {
      const cardToAddAnswer =  this.cardNotRepeatedLargeForced(this.currentPossibleAnswerCards, newCards,() =>  this.addForcedCardConv(this.currentPossibleAnswerCards, propertyFixed))
      newCards.push(cardToAddAnswer);
      this.currentPossibleAnswerCards.push(cardToAddAnswer);
    }
    const randomCardFiller = this.generateCard(cardsThatRemain.concat(newCards));
    newCards.push(randomCardFiller);
    indexesToReplace.forEach((index, i) => {
      this.cards[index] = newCards[i];
    })
  }



}









export const ALL_RULES: Rule[] = [new ShapeRule(), new FillRule(), new ColorRule()];
