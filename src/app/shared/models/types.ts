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