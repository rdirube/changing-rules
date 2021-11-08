export type CardColor = 'rojo' | 'celeste' | 'amarillo' | 'verde'| 'violeta';
export type CardShape = 'circulo'| 'cuadrado'|'triangulo'|'estrella'|'rombo';
export type CardFill = 'vacio' | 'relleno' | 'rallado' | 'moteado';
export type GameRule = 'forma' | 'color' | 'relleno';
export type GameSetting = 'igual' | 'distinto' | 'aleatorio';
export type GameMode = 'limpiar la mesa' | 'Set convencional';


export interface ChangingRulesExercise {
  cards: ChangingRulesCard[];
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