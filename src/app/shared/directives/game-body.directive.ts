import {Directive, QueryList, ViewChild, ViewChildren, EventEmitter} from '@angular/core';
import anime from 'animejs';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {SoundOxService} from 'micro-lesson-core';
import {isEven, ScreenTypeOx} from 'ox-types';
import {CardComponent} from 'src/app/cards-game/components/card/card.component';
import {TextComponent} from 'typography-ox';
import {convertPXToVH, isNotRepeated} from '../models/functions';
import {DeckComponent} from '../../cards-game/components/deck/deck.component';
import {RulesComponent} from '../../cards-game/components/rules/rules.component';
import {ChangingRulesChallengeService} from '../services/changing-rules-challenge.service';
import {interval, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';


@Directive({
  selector: '[appGameBody]'
})


export class GameBodyDirective extends SubscriberOxDirective {

  @ViewChildren(CardComponent) cardComponentQueryList!: QueryList<CardComponent>;
  @ViewChild('tutorialText') tutorialText!: TextComponent;
  @ViewChild(RulesComponent) ruleComponent!: RulesComponent;
  @ViewChild(DeckComponent) deckComponent!: DeckComponent;
  stateByCards: string[] = [];
  public answerComponents: CardComponent[] = [];
  public swiftCardOn: boolean = false;
  public deckClass: string = "empty";
  public cardsPlayed: number = 0;
  public deckWidth: string = '15vh';
  public deckHeight: string = '20vh';
  public gridClass = 'cards-grid-9';


  public currentTime = 0;
  public totalTime = 0;
  public color = 'rgb(0,255,0)';
  timeFormatted: string = '';
  private clockSubs!: Subscription;
  cardsInteractable: boolean = false;

  constructor(protected soundService: SoundOxService, private cs: ChangingRulesChallengeService) {
    super();
  }


  // answerVerification(i: number,answerComponents:CardComponent[], cardsForCorrect:number, emit: () => void) {
  updateAnswer(i: number, cardsForCorrect: number, cardsForCheckReached: () => void) {
    const cardComponentArray = this.cardComponentQueryList.toArray() as CardComponent[];
    if (cardComponentArray) {
      this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game);
      if (this.answerComponents.length < cardsForCorrect && !cardComponentArray[i]?.isSelected) {
        this.answerComponents.push(cardComponentArray[i]);
        cardComponentArray[i].cardClasses = 'card-selected';
        cardComponentArray[i].isSelected = true;
        // console.log(this.answerComponents);
        if (this.answerComponents.length === cardsForCorrect) {
          cardsForCheckReached();
        }
      } else if (cardComponentArray[i].isSelected) {
        this.answerComponents.splice(this.answerComponents.indexOf(cardComponentArray[i]), 1);
        cardComponentArray[i].isSelected = false;
        cardComponentArray[i].cardClasses = 'card-neutral';
      }
      // console.log(this.answerComponents.length);
    }
  }


  cardsAppearenceNew() {
    this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game);
    this.answerComponents.forEach(
      (answerCard, i) => {
        anime.remove(answerCard.elementRef.nativeElement);
        anime({
          targets: answerCard.elementRef.nativeElement,
          opacity: 1,
          duration: 1,
          delay: 200,
          complete: () => {
            console.log('Cards are now Interactable.');
            this.cardsInteractable = true;
          }
        });
      });
  }

  protected setClock(totalTime: number, onFinish: () => void): void {
    this.totalTime = totalTime;
    this.currentTime = totalTime;
    anime.remove(this);
    anime({
      targets: this,
      color: ['rgb(0,255,0)', 'rgb(255,0,0)'],
      duration: this.totalTime * 1000,
      easing: 'linear',
    });
    this.destroyClockSubs();
    this.clockSubs = interval(1000).pipe(take(this.totalTime)).subscribe(z => {
      this.currentTime--;
      const mins = Math.floor(this.currentTime / 60);
      const seconds = this.currentTime - mins * 60;
      this.timeFormatted = toToDigitStringNumber(mins) + ':' + toToDigitStringNumber(seconds);
      if (z === this.totalTime - 1) {
        onFinish();
      }
    });
  }

  protected destroyClockSubs() {
    if (this.clockSubs) {
      this.clockSubs.unsubscribe();
    }
    this.clockSubs = undefined as any;
  }

  getGridClassToUse(): string {
    if (this.cs.getExerciseConfig().cardInTable <= 4) {
      return 'cards-grid-4';
    } else if (this.cs.getExerciseConfig().cardInTable <= 6) {
      return 'cards-grid-6';
    } else if (this.cs.getExerciseConfig().cardInTable <= 9) {
      return 'cards-grid-9';
    } else if (this.cs.getExerciseConfig().cardInTable <= 12) {
      return 'cards-grid-12';
    } else {
      return 'cards-grid-16';
    }
  }

  cardsToDeckAnimation(nextStepEmitter: EventEmitter<any>) {
    const duration = 123;
    const scale = Array.from(Array(5).keys()).map((z, i) => {
      return {value: isEven(i) ? 1 : 1.15, duration};
    }).concat([{value: 1, duration}]);
    this.answerComponents.forEach((answerCard, i) => {
      answerCard.card.hasBeenUsed = true;
      answerCard.cardClasses = 'card-correct';
      const deckRect = this.deckComponent.elementRef.nativeElement.getBoundingClientRect();
      const answerRect = answerCard.elementRef.nativeElement.getBoundingClientRect();
      anime.remove(answerCard.elementRef.nativeElement);
      anime({
          targets: answerCard.elementRef.nativeElement,
          easing: 'easeInOutExpo',
          scale,
          complete: () => {
            anime({
              targets: answerCard.elementRef.nativeElement,
              translateX: convertPXToVH(deckRect.x) - convertPXToVH(answerRect.x) + 'vh',
              translateY: convertPXToVH(deckRect.y * (1 - this.deckComponent.auxArray.length * 0.023)) - convertPXToVH(answerRect.y) + 'vh',
              delay: 700,
              duration: 600,
              begin: () => {
                answerCard.cardSvg = 'changing_rules/svg/elementos/dorso.svg';
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
                      this.deckWidth = answerCard.cardPlaceholder.elementRef.nativeElement.offsetWidth;
                      this.deckHeight = answerCard.cardPlaceholder.elementRef.nativeElement.offsetHeight;
                      this.deckWidth = convertPXToVH(+this.deckWidth) + 'vh';
                      this.deckHeight = convertPXToVH(+this.deckHeight) + 'vh';
                      // this.deck = 'filled';
                      nextStepEmitter.emit();
                      this.cardsAppearenceNew();
                      this.cardsPlayed += 3;
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
    anime.remove('.card-component');
    anime({
      targets: '.card-component',
      rotateY: '180',
      duration: 300,
      opacity: 1, // TODO validate added
      easing: 'linear',
      complete: () => {
        this.swiftToggle();
        console.log('Cards are now Interactable.');
        this.cardsInteractable = true;
      }
    });
    // anime({
    //   targets: '.card-component',
    //   delay: 150,
    //   opacity: 1,
    //   duration: 1,
    //   complete: () => this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game)
    // });
  }

  swiftToggle() {
    this.swiftCardOn = !this.swiftCardOn;
  }

  protected playWrongAnimation() {
    const rotate = Array.from(Array(8).keys()).map((z, i) => {
      return {value: isEven(i) ? 2 : -2, duration: 50};
    }).concat([{value: 0, duration: 50}]);
    anime({
      targets: this.answerComponents.map(z => z.elementRef.nativeElement),
      rotate,
      complete: () => {
        this.cardsInteractable = true;
        this.answerComponents.forEach(z => {
          z.isSelected = false;
          z.cardClasses = 'card-neutral';
        });
        this.answerComponents = [];
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyClockSubs();
  }


}


// cardsToDeckAnimation(answer:CardComponent[], cardInTable:CardInfo[], nextStepEmitter:EventEmitter<any>, deck:string) {
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
//             cardInTable = cardInTable.filter(x => isNotRepeated(x, cardAnswers))
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


function toToDigitStringNumber(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}
