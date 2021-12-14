import { Component, OnInit, Input, ElementRef, EventEmitter, ViewChild, HostListener, Renderer2 } from '@angular/core';
import anime from 'animejs';
import { LoadedSvgComponent, SubscriberOxDirective } from 'micro-lesson-components';
import { FeedbackOxService, GameActionsService, SoundOxService } from 'micro-lesson-core';
import { isEven, ScreenTypeOx } from 'ox-types';
import { timer } from 'rxjs';
import { cancelAnimation, convertPXToVH } from 'src/app/shared/models/functions';
import { CardInfo } from 'src/app/shared/models/types';
import { ChangingRulesAnswerService } from 'src/app/shared/services/changing-rules-answer.service';
import { ChangingRulesChallengeService } from 'src/app/shared/services/changing-rules-challenge.service';
import { CardComponent } from '../card/card.component';




@Component({
  selector: 'app-deck-per-card',
  templateUrl: './deck-per-card.component.html',
  styleUrls: ['./deck-per-card.component.scss']
})
export class DeckPerCardComponent extends SubscriberOxDirective implements OnInit {

  @ViewChild('cardComponent') cardComponent!: CardComponent;
  @ViewChild('cardPlaceholder') cardPlaceholder!: LoadedSvgComponent;
  @Input() cardInfo!: CardInfo;
  @Input() cardClass!: string;
  @Input() deckComponent!: ElementRef | undefined;
  @Input() answerComponent!: CardComponent;
  @Input() cardsInteractable!: boolean;
  @Input() isSelected!: boolean;
  @Input() cardsPlayed!: number;
  @Input() firstSwiftCard!: boolean;
  @Input() swiftCardOn!: boolean;
  @Input() position!:number;


  public deckWidth: string = '15vh';
  public deckHeight: string = '27.5vh';
  public deck: string = 'empty';
  public cardsUp: boolean = false;
  public cardGeneratorStopper:number = 0;
  private currentAnimation: anime.AnimeInstance | undefined;

  constructor(public elementRef: ElementRef,
    private feedbackService: FeedbackOxService,
    private answerService: ChangingRulesAnswerService,
    private soundService: SoundOxService,
    private render: Renderer2,
    private gameActions:GameActionsService<any>,
    public challengeService: ChangingRulesChallengeService
  ){
    super()
    this.addSubscription(this.answerService.cardsToDeckAnimationEmitter, x => {
      this.cardsToDeckAnimation(this.feedbackService.endFeedback);
      this.cardsPlayed = this.challengeService.cardsPlayed;

    })
  this.addSubscription(this.answerService.cardsToDeckAnimationEmitterTutorial, f => {
  this.cardsToDeckAnimation(f)
  })
  this.swiftCardOn = true;
  this.render.setStyle(this.elementRef.nativeElement, 'position', 'relative');
  }



  ngOnInit(): void {
  }




  cardsToDeckAnimation(nextStepEmitter?: EventEmitter<any>) {
  const duration = 123;
  const scale = Array.from(Array(5).keys()).map((z, i) => {
  return { value: isEven(i) ? 1 : 1.15, duration };
    }).concat([{ value: 1, duration }]);
    if (this.cardComponent.card.hasBeenUsed) {
      this.swiftCardOn = true;
      this.elementRef.nativeElement.style.zIndex = 5000;
      this.cardClass = 'card-correct';
      if(this.position < 3) {
        this.elementRef.nativeElement.style.zIndex = 7000;
      }
      const deckRect = this.deckComponent?.nativeElement.getBoundingClientRect();
      const answerRect = this.cardComponent.elementRef.nativeElement.getBoundingClientRect();
      anime.remove(this.cardComponent.elementRef.nativeElement);
      this.currentAnimation = anime({
        targets: this.cardComponent.elementRef.nativeElement,
        zIndex: 1000,
        easing: 'easeInOutExpo',
        scale,
        complete: () => {
          this.currentAnimation = anime({
            targets: this.cardComponent.elementRef.nativeElement,
            translateX: convertPXToVH(deckRect.x) - convertPXToVH(answerRect.x) + 'vh',
            translateY: convertPXToVH(deckRect.y) - convertPXToVH(answerRect.y) - 5.5  + 'vh',
            delay: 700,
            duration: 1000,
            begin: () => {
              this.cardComponent.cardSvg = 'changing_rules/svg/elementos/dorso.svg';
              this.cardComponent.cardClass = 'card-neutral';
              this.cardComponent.isSelected = false;
              this.swiftCardOn = false;
            },
            easing: 'easeOutExpo',
            complete: () => {
              this.currentAnimation = anime({
                targets: this.cardComponent.elementRef.nativeElement,
                translateX: 0,
                translateY: 0,
                opacity: 0,
                zIndex:0,
                duration: 1,
                complete: () => {
                  nextStepEmitter?.emit();
                  this.swiftCardOn = true;
                  this.cardsAppearenceNew();
                  this.cardsPlayed = this.challengeService.cardsPlayed;
                  this.elementRef.nativeElement.style.zIndex = 0;
               }})
          }});
        }
      });
    }}




  cardsAppearenceNew() {
    this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game);
    anime.remove(this.cardComponent.elementRef.nativeElement);
      this.currentAnimation = anime({
        targets: this.cardComponent.elementRef.nativeElement,
        opacity: 1,
        duration: 1,
        complete: () => {
          this.cardClass = 'neutral-card';
          this.cardsInteractable = true;
        }
      });
  }













}