import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {CardInfo, Replaces} from 'src/app/shared/models/types';
import {colorsParseFunction} from 'src/app/shared/models/functions';
import {
  GameActionsService,
} from 'micro-lesson-core';
import {PreloaderOxService} from 'ox-core';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {

  public isSelected: boolean = false;
  public cardPathWithReplaces!: Replaces;
  public cardSvg: string = 'svg/reglas_cambiantes/elementos/frente.svg';

  @Input() swiftCardOn!: boolean;

  @Input('cardInfo')
  set setCardInfo(c: CardInfo) {
    this.card = c;
    this.setCard();
    this.updateCard();
    this.elementRef.nativeElement.style.transform = '';
  }


  @Input() cardClasses: string = 'card-neutral';
  card!: CardInfo;


  public cardsSvg = ['circulo_rallado.svg', 'circulo_relleno.svg', 'circulo_vacio.svg', 'circulo_moteado.svg', 'cuadrado_rallado.svg', 'cuadrado_moteado.svg', 'cuadrado_vacio.svg', 'cuadrado_relleno.svg', 'estrella_rallado.svg', 'estrella_moteado.svg',
    'estrella_vacio.svg', 'estrella_relleno.svg', 'triangulo_moteado.svg', 'triangulo_relleno.svg', 'triangulo_vacio.svg', 'triangulo_rallado.svg'];
  faceDown = false;


  constructor(public elementRef: ElementRef, private gameActions: GameActionsService<any>,
              private preloader: PreloaderOxService) {
    this.cardClasses = 'card-neutral';
  }


  ngOnInit(): void {
  }


  setCard(): void {
    const cardSvgNocolor = 'svg/reglas_cambiantes/formas_sin_cara/' + this.cardsSvg.find(z => z.includes(this.card.shape) && z.includes(this.card.fill));
    const replaces = new Map<string, string>();
    replaces.set("#4a90d6", colorsParseFunction(this.card.color).toLowerCase());
    this.cardPathWithReplaces = {path: cardSvgNocolor, replaces: replaces};
  }

  public updateCard(): void {
    this.cardSvg = 'svg/reglas_cambiantes/elementos/frente.svg';
    this.faceDown = false;
  }


}
