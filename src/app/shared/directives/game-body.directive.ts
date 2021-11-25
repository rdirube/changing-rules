import { Directive, QueryList, ViewChild, ViewChildren, EventEmitter } from '@angular/core';
import anime from 'animejs';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { SoundOxService } from 'micro-lesson-core';
import { ScreenTypeOx } from 'ox-types';
import { Observable, timer } from 'rxjs';
import { CardComponent } from 'src/app/cards-game/components/card/card.component';
import { TextComponent } from 'typography-ox';
import { convertPXToVH, isNotRepeated } from '../models/functions';
import { CardInfo } from '../models/types';



@Directive({
  selector: '[appGameBody]'
})


export class GameBodyDirective extends SubscriberOxDirective  {
  
  @ViewChildren(CardComponent) cardComponent!: QueryList<CardComponent | undefined>;
  @ViewChild('tutorialText') tutorialText!: TextComponent;
  
 
  

  constructor(protected soundService:SoundOxService) { 
    super();
  }

  

  // answerVerification(i: number,answer:CardComponent[], cardsForCorrect:number, emit: () => void) {
    answerVerification(i: number,answer:CardComponent[], cardsForCorrect:number, emitter: EventEmitter<any>) {
    const cardComponentArray = this.cardComponent.toArray() as CardComponent[];
    if (cardComponentArray) {
      this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game)
      if (answer.length < cardsForCorrect && !cardComponentArray[i]?.isSelected) {
        answer.push(cardComponentArray[i]);
        cardComponentArray[i].cardState  = 'card-selected';
        cardComponentArray[i].isSelected = true;
        console.log(answer);
        if (answer.length === cardsForCorrect) {
          // this.answerService.currentAnswer = {
          //   parts: [
          //     { correctness: 'correct', parts: [] }
          //   ]
          // }
          emitter.emit();
        }
      }
      else {
        answer.splice(answer.indexOf(cardComponentArray[i]), 1);
        cardComponentArray[i].isSelected = false;
        cardComponentArray[i].cardState = 'card-neutral';
      }
    }
  }





  cardsToDeckAnimation(answer:CardComponent[], cardsInTable:CardInfo[], nextStepEmitter:EventEmitter<any>, deck:string) {
    answer.forEach((answerCard, i) => {
      answerCard.cardState = 'card-correct';
      anime({
        targets: answerCard.elementRef.nativeElement,
        translateX: convertPXToVH(181) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().x) + 'vh',
        translateY: convertPXToVH(322) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().y) + 'vh',
        delay: 700,
        duration: 600,
        begin: () => {
          timer(700).subscribe(a => {
            answerCard.cardSvg = 'svg/reglas_cambiantes/elementos/dorso.svg';
            answerCard.cardState = 'card-neutral';
            answerCard.isSelected = false;
          })
          anime({
            targets: '.card-correct',
            zIndex: 200,
            duration: 1,
            delay: 700
          })
        },
        easing: 'easeOutExpo',
        complete: () => {
          anime({
            targets: answerCard.elementRef.nativeElement,
            translateX: 0,
            translateY: 0,
            opacity: 0,
            duration: 1,
            complete: () => {
              const cardAnswers = answer.map(x => x.card)
              cardsInTable = cardsInTable.filter(x => isNotRepeated(x, cardAnswers))
              if (i + 1 === answer.length) {
                deck = 'filled';
                nextStepEmitter.emit();
                this.cardsAppearenceNew(answer);
                answer = [];
              }
            }
          })
        }
      })
    })
  }



  cardsAppearenceNew(answer:CardComponent[]) {
    this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game)
    answer.forEach(
      (answerCard, i) => {
        anime({
          targets: answerCard.elementRef.nativeElement,
          opacity: 1,
          duration: 1,
          delay: 200,
          complete: () => {
            if(i + 1 === 1){
            }
          }
        })
      })
  }





}
