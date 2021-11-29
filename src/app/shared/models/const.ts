import { CardColor, CardShape, CardFill, GameRule, MagnifierPosition } from "./types";


export const CARD_COLORS: CardColor[] = ['naranja', 'celeste', 'amarillo', 'violeta', 'verde'];
export const CARD_SHAPES: CardShape[] = ['circulo', 'cuadrado', 'triangulo', 'estrella', 'rombo'];
export const CARD_FILLERS: CardFill[] = ['relleno', 'rallado', 'moteado', 'vacio'];
export const GAME_RULES: GameRule[] = ['color', 'forma', 'relleno'];




export const MAGNIFIER_POSITIONS: MagnifierPosition[] = [
    {
      width: '180vh',
      height: '100vh',
      transform: 'translate(0vh, 0vh)',
      borderRadius: '0%',
      flexPosition: 'center center',
      reference: 'initial-state'
    },
    {
      width: '29vh',
      height: '44vh',
      transform: 'translate(-0.8vh, 24vh)',
      borderRadius: '20px',
      flexPosition: 'end start',
      buttonInfo: {horizontal: 'left', vertical: 'bottom'},
      reference: 'rule-panel'
    },
    {
      width: '86vh',
      height: '86vh',
      transform: 'translate(3.1vh, 0vh)',
      borderRadius: '50px',
      flexPosition: 'center center',
      reference: 'cardInTable-in-table',
      buttonInfo: {horizontal: 'center', vertical: 'top'},
    },
    {
      width: '20vh',
      height: '20vh',
      transform: 'translate(-8vh, 5.5vh)',
      borderRadius: '1vh',
      flexPosition: 'end start',
      reference: 'clock',
      buttonInfo: {horizontal: 'center', vertical: 'bottom'},
    }


];
