import { Directive } from '@angular/core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { ScreenTypeOx } from 'ox-types';



@Directive({
  selector: '[appGameBody]'
})
export class GameBodyDirective extends SubscriberOxDirective  {

  constructor() { 
    super();
  }

  

  // answerVerificationMethod(i: number) {
  //   const cardComponentArray = this.cardComponent.toArray();
  //   if (cardComponentArray) {
  //     this.soundService.playSoundEffect('sounds/bubble.mp3', ScreenTypeOx.Game)
  //     if (this.answer.length <= this.challengeService.exerciseConfig.cardsForCorrectAnswer && !cardComponentArray[i].isSelected) {
  //       this.answer.push(cardComponentArray[i]);
  //       cardComponentArray[i].cardState = 'card-selected';
  //       cardComponentArray[i].isSelected = true;
  //       if (this.answer.length === this.challengeService.exerciseConfig.cardsForCorrectAnswer) {
  //         this.answerService.currentAnswer = {
  //           parts: [
  //             { correctness: 'correct', parts: [] }
  //           ]
  //         }
  //         this.answerService.onTryAnswer();
  //       }
  //     }
  //     else {
  //       this.answer.splice(this.answer.indexOf(cardComponentArray[i]), 1);
  //       cardComponentArray[i].isSelected = false;
  //       cardComponentArray[i].cardState = 'card-neutral';
  //     }
  //   }
  // }




}
