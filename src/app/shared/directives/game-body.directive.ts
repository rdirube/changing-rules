import { Directive, QueryList, ViewChild, ViewChildren, EventEmitter } from '@angular/core';
import anime from 'animejs';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { SoundOxService } from 'micro-lesson-core';
import {isEven, ScreenTypeOx} from 'ox-types';
import { Observable, timer } from 'rxjs';
import { CardComponent } from 'src/app/cards-game/components/card/card.component';
import { TextComponent } from 'typography-ox';
import { convertPXToVH, isNotRepeated } from '../models/functions';
import { CardInfo } from '../models/types';



@Directive({
  selector: '[appGameBody]'
})


export class GameBodyDirective extends SubscriberOxDirective  {
  
  @ViewChildren(CardComponent) cardComponentQueryList!: QueryList<CardComponent>;
  @ViewChild('tutorialText') tutorialText!: TextComponent;
  stateByCards: string[] = [];
  public answerComponents: CardComponent[] = [];
  public swiftCardOn: boolean = false;
  public deckClass: string = "empty";

  constructor(protected soundService:SoundOxService) { 
    super();
  }


  // answerVerification(i: number,answerComponents:CardComponent[], cardsForCorrect:number, emit: () => void) {
    updateAnswer(i: number, cardsForCorrect:number, cardsForCheckReached: () => void) {
    const cardComponentArray = this.cardComponentQueryList.toArray() as CardComponent[];
    if (cardComponentArray) {
      this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game)
      if (this.answerComponents.length < cardsForCorrect && !cardComponentArray[i]?.isSelected) {
        this.answerComponents.push(cardComponentArray[i]);
        cardComponentArray[i].cardClasses  = 'card-selected';
        cardComponentArray[i].isSelected = true;
        console.log(this.answerComponents);
        if (this.answerComponents.length === cardsForCorrect) {
          cardsForCheckReached();
        }
      }
      else if (cardComponentArray[i].isSelected) {
        this.answerComponents.splice(this.answerComponents.indexOf(cardComponentArray[i]), 1);
        cardComponentArray[i].isSelected = false;
        cardComponentArray[i].cardClasses = 'card-neutral';
      }
      console.log(this.answerComponents.length)
    }
  }


  cardsAppearenceNew() {
    this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game)
    this.answerComponents.forEach(
      (answerCard, i) => {
        anime({
          targets: answerCard.elementRef.nativeElement,
          opacity: 1,
          duration: 1,
          delay: 200,
        })
      })
  }




  cardsToDeckAnimation(nextStepEmitter: EventEmitter<any>) {
    const duration = 75;
    const scale = Array.from(Array(5).keys()).map((z, i) => {
      return {value: isEven(i) ? 1 : 1.15, duration};
    }).concat([{value: 1, duration}]);
    this.answerComponents.forEach((answerCard, i) => {
      answerCard.card.hasBeenUsed = true;
      answerCard.cardClasses = 'card-correct';
      anime({
          targets: answerCard.elementRef.nativeElement,
          easing: 'easeInBounce',
          scale,
          complete: () => {
            anime({
              targets: answerCard.elementRef.nativeElement,
              translateX: convertPXToVH(181) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().x) + 'vh',
              translateY: convertPXToVH(322) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().y) + 'vh',
              delay: 700,
              duration: 600,
              begin: () => {
                answerCard.cardSvg = 'svg/reglas_cambiantes/elementos/dorso.svg';
                answerCard.cardClasses = 'card-neutral';
                answerCard.isSelected = false;
                answerCard.faceDown = true;
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
                    if (i + 1 === 1) {
                      // this.deck = 'filled';
                      nextStepEmitter.emit();
                      this.cardsAppearenceNew();
                    }
                  }
                });
              }
            });
          }
        }
      );
    });
  }

  cardsAppearenceAnimation() {
    anime({
      targets: '.card-component',
      rotateY: '180',
      duration: 300,
      easing: 'linear',
      complete: () =>
        this.swiftToggle()
    });
    anime({
      targets: '.card-component',
      delay: 150,
      opacity: 1,
      duration: 1,
      complete: () => this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game)
    });
  }

  swiftToggle() {
    this.swiftCardOn = !this.swiftCardOn;
  }

  protected playWrongAnimation() {
    const rotate = Array.from(Array(8).keys()).map((z, i) => {
      return {value: isEven(i) ? 2 : -2, duration: 50};
    }).concat([{value: 0, duration: 50}]);
    anime({
      targets: this.answerComponents.map( z => z.elementRef.nativeElement),
      rotate
    });
  }


}








// cardsToDeckAnimation(answer:CardComponent[], cardsInTable:CardInfo[], nextStepEmitter:EventEmitter<any>, deck:string) {
//   answer.forEach((answerCard, i) => {
//     answerCard.cardClasses = 'card-correct';
//     anime({
//       targets: answerCard.elementRef.nativeElement,
//       translateX: convertPXToVH(181) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().x) + 'vh',
//       translateY: convertPXToVH(322) - convertPXToVH(answerCard.elementRef.nativeElement.getBoundingClientRect().y) + 'vh',
//       delay: 700,
//       duration: 600,
//       begin: () => {
//         timer(700).subscribe(a => {
//           answerCard.cardSvg = 'svg/reglas_cambiantes/elementos/dorso.svg';
//           answerCard.cardClasses = 'card-neutral';
//           answerCard.isSelected = false;
//         })
//         anime({
//           targets: '.card-correct',
//           zIndex: 200,
//           duration: 1,
//           delay: 700
//         })
//       },
//       easing: 'easeOutExpo',
//       complete: () => {
//         anime({
//           targets: answerCard.elementRef.nativeElement,
//           translateX: 0,
//           translateY: 0,
//           opacity: 0,
//           duration: 1,
//           complete: () => {
//             const cardAnswers = answer.map(x => x.card)
//             cardsInTable = cardsInTable.filter(x => isNotRepeated(x, cardAnswers))
//             if (i + 1 === answer.length) {
//               deck = 'filled';
//               nextStepEmitter.emit();
//               this.cardsAppearenceNew(answer);
//               answer = [];
//             }
//           }
//         })
//       }
//     })
//   })
// }


//
// cardsAppearenceNew() {
//   this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game);
//   this.cardComponentQueryList.toArray().forEach(
//     (answerCard, i) => {
//       anime({
//         targets: answerCard.elementRef.nativeElement,
//         opacity: 1,
//         duration: 1,
//         delay: 200
//       });
//     });
// }

