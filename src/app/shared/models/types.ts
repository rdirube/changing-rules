export type CardColor = 'naranja' | 'celeste' | 'amarillo' | 'verde'| 'violeta';
export type CardShape = 'circulo'| 'cuadrado'|'triangulo'|'estrella'|'rombo';
export type CardFill = 'vacio' | 'relleno' | 'rallado' | 'moteado';
export type GameRule = 'forma' | 'color' | 'relleno';
export type GameSetting = 'igual' | 'distinto' | 'aleatorio';
export type GameMode = 'limpiar la mesa' | 'Set convencional';
export interface CardType  {
  color:CardColor;
  shape:CardShape;
  fill:CardFill;
}

export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}

export interface ChangingRulesExercise {
  rule:GameRule;
  cards: CardType[];
}


export interface ChangingRulesCard {
  svg: string;
}



export interface ChangingRulesNivelation {
  gameRules:GameRule[];
  shapesAvaiable:CardShape[];
  colorsAvaiable: CardColor[];
  fillsAvaiable: CardFill[];
  cardsInTable: number;
  cardQuantityDeck:number;
  cardsForCorrectAnswer:number;
  gameSetting:GameSetting;
  totalTimeSeconds:number;
  wildcardOn:boolean;
  minWildcardQuantity:number;
  maxWildcardQuantity:number;
  gameMode:GameMode;
  rulesForAnswer:number;
}


export abstract class Rule {
  abstract id: GameRule;
  abstract satisfyRule(cards: CardType[]): boolean;
}


export class ShapeRule extends Rule {
  id = 'forma' as GameRule;
  satisfyRule(cards: CardType[]): boolean {
    return cards.every(card => card.shape === cards[0].shape)
  }
  // ruleOnMethod(path:string,svg:string ){
  //   path = 'svg/reglas_cambiantes/indicación/' + 
  // }
  
}


export class ColorRule extends Rule {
  id = 'color' as GameRule;
  satisfyRule(cards: CardType[]): boolean {
    return cards.every(card => card.color === cards[0].color)
  }
}


export class FillRule extends Rule {
  id = 'relleno' as GameRule;
  satisfyRule(cards: CardType[]): boolean {
    return cards.every(card => card.fill === cards[0].fill)
  }
}



export function allSatisfyRule(cards: CardType[], rule: GameRule): boolean {
    return cards.every(card => satisfyRule(card, cards[0], rule))
}


export function satisfyRule(c1: CardType, c2: CardType, rule: GameRule): boolean {
  switch(rule){
    case "forma": return c1.shape === c2.shape;
    case "color": return c1.color === c2.color;
    case "relleno": return c1.fill === c2.fill;
  }
  throw new Error('unknow rule');
}

export const ALL_RULES: Rule[] = [new ShapeRule(), new FillRule(), new ColorRule()];
