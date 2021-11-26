import { Component, Input, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OxTextInfo, ScreenTypeOx } from 'ox-types';
import { GameRule, RuleArray } from 'src/app/shared/models/types';
import { SubscriberOxDirective } from 'micro-lesson-components';
import anime from 'animejs';
import { timer } from 'rxjs';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  @ViewChildren('rules') allRules!: QueryList<ElementRef>
  currentRule!: string;
  public isRuleOn = [false, false, false];
  public colorRulePath!: string;
  public shapeRulePath!: string;
  public fillerRulePath!: string;
  public lowerCaseTrue: boolean = true;

  public rulesArray!: RuleArray[];

  


  @Input('currentRule')
  set setCurrentRule(r: GameRule | undefined) {
    if (r === undefined) return;
    this.currentRule = r;
    this.ruleOnMethod();
    this.rulesArray = this.refreshRule();
    this.ruleSelectionAnimation();
  }



  constructor(private elementRef: ElementRef) {
   this.rulesArray = this.refreshRule();
  }


 iconAutocomplete(i:number, rule:string):any {
   return this.isRuleOn[i] ? this.concatRuteSvg(rule + '_igual.svg') : this.concatRuteSvg(rule + '_igual_block.svg');
 }

 classAutocomplete(i:number):any {
   return this.isRuleOn[i] ? 'rule-container-on': 'rule-container-off';
 }


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }



  refreshRule():RuleArray[]
  {
   return [{ iconSvg:this.iconAutocomplete(0,'colores') , class: this.classAutocomplete(0), id: 'color'}, 
   { iconSvg:this.iconAutocomplete(1,'formas')  , class: this.classAutocomplete(1), id: 'forma' }, 
   { iconSvg:this.iconAutocomplete(2,'relleno') , class: this.classAutocomplete(2), id: 'relleno' }]
  }


  concatRuteSvg(svg: string): string {
    return 'svg/reglas_cambiantes/indicación/' + svg
  }



  ruleOnMethod() {
    this.isRuleOn.fill(false);
    switch (this.currentRule) {
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



  ruleSelectionAnimation() {
    anime({
      targets: this.allRules.toArray()[this.rulesArray.findIndex(z => z.id === this.currentRule)].nativeElement,
      duration: 400,
      easing: 'easeInOutExpo',
      keyframes: [{
        scale: 1
      }, {
        scale: 0.75
      }, {
        scale: 1
      }]
    })
  }



}
