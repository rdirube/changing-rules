import { ALL_RULES, CardColor, CardFill, CardInfo, CardShape, ColorRule, GameRule, Rule } from "./types";
import { anyElement } from "ox-types";
import { CARD_COLORS, CARD_FILLERS, CARD_SHAPES } from "./const";
import anime from "animejs";


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


export function rulesAreAllDifferent(c: CardInfo, cards: CardInfo[]): boolean {
  return cards.every(card => card.color !== c.color && card.shape !== c.shape && card.fill !== c.fill)
}


export function allDifferentProperties(cards: CardInfo[]): boolean {
  return cards.every(cardTable => rulesAreAllDifferent(cardTable, cards.filter(cardsFiltered => cardsFiltered !== cardTable)))
}



export function satisfyRule(rule: GameRule, cards: CardInfo[], propertyApproved: GameRule[]): GameRule[] {
  switch (rule) {
    case 'color':
      if (cards.every(card => cards[0].color === card.color)) {
        propertyApproved.push('color');
      }
      break;
    case 'forma':
      if (cards.every(card => cards[0].color === card.color)) {
        propertyApproved.push('forma');
      } break;
    case 'relleno':
      if (cards.every(card => cards[0].color === card.color)) {
        propertyApproved.push('relleno');
      }
      break;
  }
  return propertyApproved;
}



export function checkForUniques(cards: CardInfo[]) {
  let valuesAlreadySeen = []
  for (let i = 0; i < cards.length; i++) {
    let value = cards[i]
    if (valuesAlreadySeen.indexOf(value) !== -1) {
      return false
    }
    valuesAlreadySeen.push(value)
  }
  return true
}


export function checkIfArrayIsUnique(cards: CardInfo[]) {
  return cards.length === new Set(cards).size;
}




export function uniqueValuePerRule(rulePossibleUnique: GameRule, cards: CardInfo[], cardChecked: CardInfo, areUnique: boolean[]): boolean[] {
  const ruleObject = ALL_RULES.find(z => z.id === rulePossibleUnique);
  areUnique.push(ruleObject?.uniqueRuleValue(cardChecked, cards) as boolean)
  return areUnique;

  // switch (rulePossibleUnique) {
  //   case 'color':
  //     if () {
  //       areUnique.push(true)       
  //     } else {
  //       areUnique.push(false)       
  //     }
  //     break;
  //   case 'forma':
  //     if (cards.every(card => cards[0].color !== card.color)) {
  //       areUnique.push(true)       
  //     } else {
  //       areUnique.push(false)       
  //     } break;
  //   case 'relleno':
  //     if (cards.every(card => cards[0].color !== card.color)) {
  //       areUnique.push(true)       
  //     } else {
  //       areUnique.push(false)       
  //     }
  //     break;      
  // }
}



// export function satisfyRuleCards(cards: CardInfo[], rules: GameRule[]): boolean {
//   const propertyApproved:GameRule[] = [];
//   const areUnique:boolean[] = [];
//   let notRepeatedUnique:boolean = false;
//   if (rulesAreEqualAllCards(cards)) {
//     const rulesNotRepeatedForAnswer = rules.filter(rule => !satisfyRule(rule, cards, propertyApproved).includes(rule))
//     notRepeatedUnique = rulesNotRepeatedForAnswer.every(rule => cards.every(card => uniqueValuePerRule(rule, cards, card, areUnique)))
//  }
//   return cards.every(card => rulesAreEqual(card, cards)) && notRepeatedUnique;
// }


export function auxGetPropertyValue(card: CardInfo, prop: GameRule) {
  switch (prop) {
    case "color": return card.color;
    case "forma": return card.shape;
    case "relleno": return card.fill;
  }
}



// export function equalPropertyArrayNew(cards: CardInfo[], allProperties: GameRule[]) {
//   return allProperties.every(prop => {
//     const properties = cards.map(card => auxGetPropertyValue(card, prop));
//     return properties.every(anchorProperty => {
//       const length = properties.filter(aProperty => aProperty === anchorProperty).length;
//       return length;
//     })
//   });
// }



export function satisfyRuleCardsNew(cards:CardInfo[], allProperties: GameRule[]) {
  return allProperties.every(prop => {
    const properties = cards.map(card => auxGetPropertyValue(card, prop));
    return properties.every(anchorProperty => {
      const length = properties.filter(aProperty => aProperty === anchorProperty).length;
      return length === 1 || length === properties.length
    })
  });
}

// export function satisfyRuleOneCardNew(anchorCard:CardInfo, cardsRemaining:CardInfo[], allProperties:GameRule[], cardsForCorrect:number):CardInfo[]{
//   const cardToAdd:CardInfo[] = []
//   if(satisfyRuleCardsNew(cardsRemaining, allProperties)) {
//     return cardsRemaining.filter(z => satisfyRuleCardsNew(cardsRemaining, allProperties))
//     } else {
           
//     }

//   } 

// }

export function cancelAnimation (animation: anime.AnimeInstance | undefined) {
  if (!animation) return;
  const activeInstances = anime.running;
  const index = activeInstances.indexOf(animation);
  activeInstances.splice(index, 1);
}


export function satisfyRuleFilter(card:CardInfo[], cards:CardInfo[], properties:GameRule[]) {
 return cards.filter(z => satisfyRuleCardsNew(card, properties))
}



// export function santiMode2(cards: CardInfo[], allProperties: GameRule[]) {
//   return allProperties.every(prop => {
//     const properties = cards.map(card => auxGetPropertyValue(card, prop));
//     return properties.map(anchorProperty => properties.filter(aProperty => aProperty === anchorProperty).length)
//       .every(quantity => quantity === 1 || quantity === properties.length)
//   });
// }


export function rulesAreEqual(c1: CardInfo, cards: CardInfo[]) {
  return cards.every(card => c1.color === card.color || c1.shape === card.shape || c1.fill === card.fill)
}


export function rulesAreEqualAllCards(cards: CardInfo[]): boolean {
  return cards.every(cardTable => rulesAreEqual(cardTable, cards.filter(cardsFiltered => cardsFiltered !== cardTable)))
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
  const cardsSvg = ['circulo-rallado.svg', 'circulo-relleno.svg', 'circulo-vacio.svg', 'circulo-moteado.svg', 'cuadrado-rallado.svg', 'cuadrado-moteado.svg', 'cuadrado-vacio.svg', 'cuadrado-relleno.svg', 'estrella-rallado.svg', 'estrella-moteado.svg',
    'estrella-vacio.svg', 'estrella-relleno.svg', 'triangulo-moteado.svg', 'triangulo-relleno.svg', 'triangulo-vacio.svg', 'triangulo-rallado.svg', 'rombo-vacio.svg', 'rombo-rallado.svg', 'rombo-relleno.svg', 'rombo-moteado.svg'];
  return 'mini-lessons/executive-functions/changing-rules/svg/figures/' + cardsSvg.find(z => z.includes(card.shape) && z.includes(card.fill));
}
