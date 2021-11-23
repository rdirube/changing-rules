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

  
  currentRule!:string;
  public rulesSvgActive:string[] = [this.concatRuteSvg('colores_igual.svg'),this.concatRuteSvg('formas_igual.svg'),this.concatRuteSvg('relleno_igual.svg')];
  public rulesSvgBlock:string[] = [this.concatRuteSvg('colores_igual_block.svg'), this.concatRuteSvg('formas_igual_block.svg'),this.concatRuteSvg('relleno_igual_block.svg')];
  public isRuleOn = [false, false, false];
  public colorRulePath!:string;
  public shapeRulePath!:string;
  public fillerRulePath!:string;
  public lowerCaseTrue:boolean = true;


  @Input('currentRule')
  set setCurrentRule(r: GameRule) {
    this.currentRule = r;
    this.ruleOnMethod();
    this.colorRulePath = this.isRuleOn[0] ? this.rulesSvgActive[0] : this.rulesSvgBlock[0];
    this.shapeRulePath = this.isRuleOn[1] ? this.rulesSvgActive[1] : this.rulesSvgBlock[1];
    this.fillerRulePath = this.isRuleOn[2] ? this.rulesSvgActive[2] : this.rulesSvgBlock[2];
  }



  constructor(private elementRef:ElementRef) {
  
   }

  


  ngOnInit(): void {
   
  }

  ngAfterViewInit():void {
  }



  concatRuteSvg(svg:string):string{
  return 'svg/reglas_cambiantes/indicación/'+ svg
  }



  ruleOnMethod() {
    this.isRuleOn.fill(false);
    switch(this.currentRule){
      case 'color':
        this.isRuleOn[0] = true;
        break;
        case 'forma':
        this.isRuleOn[1] = true;
        break;
        case 'relleno':
        this.isRuleOn[2] = true;
        break;
    }
  }


}
