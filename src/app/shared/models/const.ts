import { Rule, ShapeRule, FillRule, ColorRule, CardColor, CardShape, CardFill, GameRule, MagnifierPosition } from "./types";


export const cardColors: CardColor[] = ['naranja', 'celeste', 'amarillo', 'violeta', 'verde'];
export const cardShapes: CardShape[] = ['circulo', 'cuadrado', 'triangulo', 'estrella'];
export const cardFillers: CardFill[] = ['relleno', 'rallado', 'moteado', 'vacio'];
export const gameRules: GameRule[] = ['color', 'forma', 'relleno'];




export const MAGNIFIER_POSITIONS: MagnifierPosition[] = [
    {
      width: '150vh',
      height: '100vh',
      transform: 'translate(0vh, 0vh)',
      borderRadius: '0%',
      flexPosition: 'center center',
      reference: 'initial-state'
    },
    {
      width: '32vh',
      height: '29vh',
      transform: 'translate(-2vh, 9vh)',
      borderRadius: '20%',
      flexPosition: 'end start',
      buttonInfo: {horizontal: 'left', vertical: 'bottom'},
      reference: 'bird-to-select'
    },
    {
      width: '32vh',
      height: '29vh',
      transform: 'translate(-41.5vh, 8.7vh)',
      borderRadius: '20%',
      flexPosition: 'center center',
      reference: 'bird-0',
      buttonInfo: {horizontal: 'center', vertical: 'top'},
    },
    {
      width: '32vh',
      height: '29vh',
      transform: 'translate(0vh, 12vh)',
      borderRadius: '20%',
      flexPosition: 'center center',
      reference: 'bird-1',
      buttonInfo: {horizontal: 'center', vertical: 'top'},
    },
    {
      width: '32vh',
      height: '29vh',
      transform: 'translate(41.5vh, 8.7vh)',
      borderRadius: '20%',
      flexPosition: 'center center',
      reference: 'bird-2',
      buttonInfo: {horizontal: 'center', vertical: 'top'},
    },
    {
      width: '131vh',
      height: '33vh',
      transform: 'translate(0vh, 9vh)',
      borderRadius: '10px',
      flexPosition: 'center center',
      reference: 'all-birds',
      buttonInfo: {horizontal: 'center', vertical: 'top'},
    },
    {
      width: '27vh',
      height: '25vh',
      transform: 'translate(0vh, -14vh)',
      borderRadius: '20%',
      flexPosition: 'center center',
      buttonInfo: {horizontal: 'right', vertical: 'bottom', offsetX: 2, offsetY: 2},
      reference: 'clock'
    }];