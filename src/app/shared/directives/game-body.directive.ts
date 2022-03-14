import { Directive, QueryList, ViewChild, ViewChildren, EventEmitter } from '@angular/core';
import anime from 'animejs';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { SoundOxService } from 'micro-lesson-core';
import { isEven, ScreenTypeOx } from 'ox-types';
import { CardComponent } from 'src/app/cards-game/components/card/card.component';
import { TextComponent } from 'typography-ox';
import { convertPXToVH, isNotRepeated } from '../models/functions';
import { DeckComponent } from '../../cards-game/components/deck/deck.component';
import { RulesComponent } from '../../cards-game/components/rules/rules.component';
import { ChangingRulesChallengeService } from '../services/changing-rules-challenge.service';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GameSetting, gridConfig } from '../models/types';
import { DeckPerCardComponent } from 'src/app/cards-game/components/deck-per-card/deck-per-card.component';

@Directive({
  selector: '[appGameBody]'
})


export class GameBodyDirective extends SubscriberOxDirective {

  @ViewChildren(DeckPerCardComponent) cardDeckComponentQueryList!: QueryList<DeckPerCardComponent>;
  @ViewChild('tutorialText') tutorialText!: TextComponent;
  @ViewChild(RulesComponent) ruleComponent!: RulesComponent;
  @ViewChild(DeckComponent) deckComponent!: DeckComponent | undefined;
  stateByCards: string[] = [];
  public answerComponents: DeckPerCardComponent[] = [];
  public deckClass: string = "empty";
  public deckWidth: string = '15vh';
  public deckHeight: string = '20vh';
  public gridConfig:gridConfig = {class:'cards-grid-9',
   numberForZIndex:3};
  public currentSetting!: GameSetting;
  public firstSwiftCard!: boolean;
  public swiftCardOn!: boolean;
  public currentTime = 0;
  public totalTime = 0;
  public clockAnimation!: any;
  public color = 'rgb(0,255,0)';
  timeFormatted: string = '';
  private clockSubs!: Subscription;
  cardsInteractable: boolean = false;
  public faceDown: boolean = false;
  public auxArray: number[] = [];

  

  constructor(protected soundService: SoundOxService, private cs: ChangingRulesChallengeService) {
    super();
    this.firstSwiftCard = false;
    this.swiftCardOn = false;
  }



  updateAnswer(i: number, cardsForCorrect: number, cardsForCheckReached: () => void) {
    const cardDeckComponentArray = this.cardDeckComponentQueryList.toArray() as DeckPerCardComponent[];
    if (cardDeckComponentArray) {
      this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game);
      if (this.answerComponents.length < cardsForCorrect && !cardDeckComponentArray[i]?.isSelected) {
        this.answerComponents.push(cardDeckComponentArray[i]);
        cardDeckComponentArray[i].cardClass = 'card-selected';
        cardDeckComponentArray[i].isSelected = true;
        if (this.answerComponents.length === cardsForCorrect) {
          cardsForCheckReached();
        }
      } else if (cardDeckComponentArray[i].isSelected) {
        this.answerComponents.splice(this.answerComponents.indexOf(cardDeckComponentArray[i]), 1);
        cardDeckComponentArray[i].isSelected = false;
        cardDeckComponentArray[i].cardClass = 'card-neutral';
      }
    }
  }





  protected setClock(totalTime: number, onFinish: () => void): void {
    this.totalTime = totalTime;
    this.currentTime = totalTime;
    anime.remove(this);
    this.clockAnimation = anime({
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


  getGridClassToUse(): gridConfig {
    console.log(this.cs.exerciseConfig.cardInTable);
    if (this.cs.exerciseConfig.cardInTable <= 4) {
      return {
        class: 'cards-grid-4',
        numberForZIndex: 2
      };
    } else if (this.cs.exerciseConfig.cardInTable <= 6) {
      return {
        class: 'cards-grid-6',
        numberForZIndex: 2
      };
    } else if (this.cs.exerciseConfig.cardInTable <= 9) {
      return {
        class: 'cards-grid-9',
        numberForZIndex: 3
      }
    } else if (this.cs.exerciseConfig.cardInTable <= 12) {
      return {
        class: 'cards-grid-12',
        numberForZIndex: 4
      }
    } else {
      return {
        class: 'cards-grid-16',
        numberForZIndex: 4
      }    }
  }


  public cantClickSound() {
    this.soundService.playSoundEffect('sounds/cantClick.mp3', ScreenTypeOx.Game)
  }




  cardsAppearenceAnimation() {
  anime.remove('.card-component');
  anime({
      targets: '.card-component',
      rotateY: '180',
      duration: 300,
      easing: 'linear',
      complete: () => {
       this.cardsInteractable = true;
      }
    });
  anime({
      targets: '.card-component',
      duration:150,
      complete: ()=> {
        this.firstSwiftCard = true;
        this.swiftCardOn = true;
      }
    })

  }




  protected playWrongAnimation() {
    const rotate = Array.from(Array(8).keys()).map((z, i) => {
      return { value: isEven(i) ? 2 : -2, duration: 50 };
    }).concat([{ value: 0, duration: 50 }]);
    anime({
      targets: this.answerComponents.map(z => z.elementRef.nativeElement),
      rotate,
      complete: () => {
        this.cardsInteractable = true;
        this.answerComponents.forEach(z => {
          z.isSelected = false;
          z.cardClass = 'card-neutral';
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



function toToDigitStringNumber(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}
