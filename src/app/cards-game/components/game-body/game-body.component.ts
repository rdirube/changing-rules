import { Component, OnInit } from '@angular/core';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { OxTextInfo, ScreenTypeOx} from 'ox-types';


@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent implements OnInit {

  public gameInstruction = new OxTextInfo();
  public gameInstructionText:string = "Igual" 

  constructor() { 
    this.gameInstructionText = "Igual";
    this.gameInstruction.color = 'white';
    this.gameInstruction.originalText = this.gameInstructionText;
    this.gameInstruction.font = 'dinnRegular';
    this.gameInstruction.fontSize = '4vh';
    this.gameInstruction.ignoreLowerCase = true;
  }

  ngOnInit(): void {
  }

}
