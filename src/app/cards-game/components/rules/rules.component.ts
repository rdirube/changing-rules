import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { OxTextInfo, ScreenTypeOx} from 'ox-types';
import { GameRule } from 'src/app/shared/models/types';
import { SubscriberOxDirective } from 'micro-lesson-components';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  @Input() colorRulePath!:string;
  @Input() shapeRulePath!:string;
  @Input() fillerRulePath!:string;
  @Input() currentRule!:string;
  public colorInstructionText = new OxTextInfo();
  public shapeInstructionText = new OxTextInfo();
  public instructionText = new OxTextInfo();
  public rulesSvg:string[] = ['colores_igual.svg', 'colores_igual_block.svg', 'formas_igual.svg','formas_igual_block.svg','relleno_igual.svg','relleno_igual_block.svg'];
  public containerClass:string[] = ['rule-container-off', 'rule-container-off', 'rule-container-off']

  @Input('currentRule')
  set setCurrentRule(r: GameRule) {
    this.currentRule = r;
    this.ruleOnMethod();
  }



  constructor(private elementRef:ElementRef) {
    this.colorRulePath = this.concatRuteSvg(this.rulesSvg[1]) ;
    this.shapeRulePath = this.concatRuteSvg(this.rulesSvg[3]);
    this.fillerRulePath = this.concatRuteSvg(this.rulesSvg[5]);
  
   }

  


  ngOnInit(): void {
   
  }

  ngAfterViewInit():void {
  }



  concatRuteSvg(svg:string):string{
  return 'svg/reglas_cambiantes/indicación/'+ svg
  }



  ruleOnMethod() {
    this.containerClass.forEach(c => c = 'rule-container-off');
    switch(this.currentRule){
      case 'color':
        this.colorRulePath = this.concatRuteSvg(this.rulesSvg[0]);
        this.containerClass[0] = 'rule-container-on';
        break;
        case 'forma':
        this.shapeRulePath = this.concatRuteSvg(this.rulesSvg[2]);
        this.containerClass[1] = 'rule-container-on';
        break;
        case 'relleno':
        this.fillerRulePath = this.concatRuteSvg(this.rulesSvg[4]);
        this.containerClass[2] = 'rule-container-on';
        break;
    }
    console.log(this.currentRule);
  }


}
