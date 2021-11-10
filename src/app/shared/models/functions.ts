import { CardColor } from "./types";


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



