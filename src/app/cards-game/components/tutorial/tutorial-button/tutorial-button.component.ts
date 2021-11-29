import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial-button',
  templateUrl: './tutorial-button.component.html',
  styleUrls: ['./tutorial-button.component.scss']
})
export class TutorialButtonComponent implements OnInit {


  constructor() { }

  @Input() tutorialText!:string; 
  @Input() buttonClass!:string;
  public buttonRoute = 'colorful-heights/svg/Elementos fondo/tutorial/tutorial_botón.svg';

  ngOnInit(): void {
  }

}
