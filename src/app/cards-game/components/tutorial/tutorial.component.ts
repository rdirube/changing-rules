import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { PreloaderOxService } from 'ox-core';
import { ChangingRulesAnswerService } from 'src/app/shared/services/changing-rules-answer.service';
import { ChangingRulesChallengeService } from 'src/app/shared/services/changing-rules-challenge.service';
import { OxTextInfo } from 'ox-types';
import { Observable, timer } from 'rxjs';
import { TutorialService } from 'src/app/shared/services/tutorial.service';
import { CardInfo, MagnifierPosition, TutorialStep } from 'src/app/shared/models/types';
import { TutorialExercise } from 'src/app/shared/models/types';
import { MAGNIFIER_POSITIONS } from 'src/app/shared/models/const';
import { FlexModule } from '@angular/flex-layout';


@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent implements OnInit {


  public swiftCardOn:boolean = true;
  public tutorialExercise!:TutorialExercise;
  private currentStep = 0;
  public magnifier!: MagnifierPosition | undefined;
  text: string = '';
  private steps: TutorialStep[] = [];
  readonly magnifierPositions = MAGNIFIER_POSITIONS;
  private okButtonHasBeenClick = new EventEmitter();
  



  constructor(private challengeService: ChangingRulesChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private answerService: ChangingRulesAnswerService,
    private soundService: SoundOxService,
    private feedbackService: FeedbackOxService,
    private preloaderService: PreloaderOxService,
    private elementRef: ElementRef,
    private tutorialService:TutorialService) { 
      this.tutorialExercise = {
        rule: this.tutorialService.tutorialRule(),
        cardsInTable: this.tutorialService.tutorialCardGenerator()
      }
      console.log("hola soy bob el constructor");
      console.log(this.tutorialExercise.rule)
    }


  ngOnInit(): void {
   
  }


  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({ text, actions, completedSub });
  }


  private setMagnifierReference(ref: string) {
    this.magnifier = this.magnifierPositions.find(z => z.reference === ref);
  }


  public setStep() {
    this.addStep('Buenas, bienvenidos al tutorial', ()=>  {}, timer(4000));
    this.addStep('El objetivo del juego consiste en seleccionar las cartas que compartan la regla que figura en el panel de la derecha', ()=> {     
    }, this.okButtonHasBeenClick);
    
  }

}
