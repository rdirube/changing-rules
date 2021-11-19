import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { CardInfo, Replaces } from 'src/app/shared/models/types';
import { colorsParseFunction, convertPXToVH } from 'src/app/shared/models/functions'
import anime from 'animejs';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { anyElement, OxImageInfo } from 'ox-types';
import { PreloaderOxService } from 'ox-core';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {

  public oxImageInfo!: OxImageInfo;
  public isSelected: boolean = false;
  public cardPathWithReplaces!: Replaces;
  
  @Input() swiftCardOn!: boolean;

  @Input('cardInfo')
  set setCardInfo(c: CardInfo) {
    this.card = c;
    this.setCard();
    this.elementRef.nativeElement.style.transform = '';
  }


  public cardState!: string;
  card!: CardInfo;


  public cardsSvg = ['circulo_rallado.svg', 'circulo_relleno.svg', 'circulo_vacio.svg', 'circulo_moteado.svg', 'cuadrado_rallado.svg', 'cuadrado_moteado.svg', 'cuadrado_vacio.svg', 'cuadrado_relleno.svg', 'estrella_rallado.svg', 'estrella_moteado.svg',
    'estrella_vacio.svg', 'estrella_relleno.svg', 'triangulo_moteado.svg', 'triangulo_relleno.svg', 'triangulo_vacio.svg', 'triangulo_rallado.svg']


  constructor(public elementRef: ElementRef, private gameActions: GameActionsService<any>,
    private preloader: PreloaderOxService) {
    this.cardState = 'card-neutral';

    
  }


  ngOnInit(): void {
  }


  ngAfterViewInit(): void {

  }


  setCard(): void {
    const cardSvgNocolor = 'svg/reglas_cambiantes/formas_sin_cara/' + this.cardsSvg.find(z => z.includes(this.card.shape) && z.includes(this.card.fill))
    const replaces = new Map<string, string>();
    replaces.set("#4a90d6", colorsParseFunction(this.card.color).toLowerCase());
    this.cardPathWithReplaces = { path: cardSvgNocolor, replaces: replaces };
  }

  swiftToggle() {
    this.swiftCardOn = !this.swiftCardOn ;
   
  }

  // cardsToDeckAnimation() {
  //   anime({
  //     targets: this.elementRef.nativeElement,
  //     translateX: convertPXToVH(162) - convertPXToVH(this.elementRef.nativeElement.getBoundingClientRect().x) + 'vh' ,
  //     translateY: convertPXToVH(315) - convertPXToVH(this.elementRef.nativeElement.getBoundingClientRect().y) + 'vh',
  //     delay: 100,
  //     duration: 4000,
  //     easing: 'easeOutExpo',
  //   })
  // }



}
