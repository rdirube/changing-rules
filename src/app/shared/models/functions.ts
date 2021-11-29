import {CardColor, CardFill, CardInfo, CardShape} from "./types";
import {anyElement} from "ox-types";


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
      return "#52be44";
    default:
      throw new Error('A color not listed came in ' + color);
  }
}


export function sameCard(c1: CardInfo, c2: CardInfo): boolean {
  return (c1.color === c2.color && c1.shape === c2.shape && c1.fill === c2.fill);
}


export function generateRandomCard(cardColors: CardColor[], cardShapes: CardShape[], cardFillers: CardFill[]): CardInfo {
  return {
    color: anyElement(cardColors),
    shape: anyElement(cardShapes),
    fill: anyElement(cardFillers),
    hasBeenUsed: false
  };
}


export function isNotRepeated(card: CardInfo, cards: CardInfo[]): boolean {
  return !cards.some(x => sameCard(x, card));
}

export function convertPXToVH(px: number): number {
  return px * (100 / document.documentElement.clientHeight);
}

export function getCardSvg(card: CardInfo): string {
  // const cardsSvg = ['circulo_rallado.svg', 'circulo_relleno.svg', 'circulo_vacio.svg', 'circulo_moteado.svg', 'cuadrado_rallado.svg', 'cuadrado_moteado.svg', 'cuadrado_vacio.svg', 'cuadrado_relleno.svg', 'estrella_rallado.svg', 'estrella_moteado.svg',
  //   'estrella_vacio.svg', 'estrella_relleno.svg', 'triangulo_moteado.svg', 'triangulo_relleno.svg', 'triangulo_vacio.svg', 'triangulo_rallado.svg'];
  // return 'changing_rules/svg/formas_sin_cara/' + cardsSvg.find(z => z.includes(card.shape) && z.includes(card.fill));
  return 'mini-lessons/executive-functions/changing-rules/svg/figures/' + card.shape + '-' + card.fill + '.svg';
}
