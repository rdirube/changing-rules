import { CardColor, CardInfo } from "./types";


export function colorsParseFunction(color: CardColor): string {
  switch (color) {
    case 'celeste':
      return "#449ed7";
    case 'naranja':
      return "#ef4c23";
    case 'amarillo':
      return "#f9b617";
    case 'violeta':
      return "#85203b";
    case 'verde':
      return "#73be44";
    default:
      throw new Error('A color not listed came in ' + color);
  }
}


export function sameCard(c1: CardInfo, c2: CardInfo): boolean {
  return (c1.color === c2.color && c1.shape === c2.shape && c1.fill === c2.fill);
}


