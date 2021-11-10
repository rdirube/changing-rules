import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { CardType, Replaces } from 'src/app/shared/models/types';
import { colorsParseFunction } from 'src/app/shared/models/functions'


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() isSelected: boolean = false;
  public cardPathWithReplaces!: Replaces;
  public cardCurrentFace!:string;
  @Input('cardInfo')
  set setCardInfo(c: CardType) {
    this.card = c;
    this.setCard();
    this.elementRef.nativeElement.style.transform = '';
  }
  
  card!:CardType;

  public cardsSvg = ['circulo_rallado.svg', 'circulo_relleno.svg', 'circulo_vacio.svg', 'circulo_moteado.svg', 'cuadrado_rallado.svg', 'cuadrado_moteado.svg', 'cuadrado_vacio.svg', 'cuadrado_relleno.svg', 'estrella_moteado.svg', 'estrella_moteado.svg',
    'estrella_vacio.svg', 'estrella_relleno.svg', 'triangulo_moteado.svg', 'triangulo_relleno.svg', 'triangulo_vacio.svg', 'triangulo_rallado.svg']


  constructor(private elementRef: ElementRef) {
    this.cardCurrentFace = "svg/reglas_cambiantes/elementos/dorso.svg"
  }


  ngOnInit(): void {
    this.setCard();
    this.cardCurrentFace = "svg/reglas_cambiantes/elementos/frente.svg"
  }


  setCard(): void {
    const cardSvgNocolor = 'svg/reglas_cambiantes/formas_sin_cara/' + this.cardsSvg.find(z => z.includes(this.card.shape) && z.includes(this.card.fill))
    const replaces = new Map<string, string>();
    replaces.set('#449ed7', colorsParseFunction(this.card.color));
    this.cardPathWithReplaces = { path: cardSvgNocolor, replaces: replaces };
  }


 


}
