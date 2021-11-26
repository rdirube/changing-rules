import {Component, Input, ElementRef, QueryList, ViewChildren, HostListener} from '@angular/core';
import {GameRule, RuleArray} from 'src/app/shared/models/types';
import anime from 'animejs';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent {

  @ViewChildren('rules') allRules!: QueryList<ElementRef>;
  currentRule!: string;
  public lowerCaseTrue: boolean = true;

  public rulesArray: RuleArray[] = [
    {
      iconSvg: this.iconAutocomplete(false, 'colores'),
      auxForSvg: 'colores',
      class: this.classAutocomplete(false),
      id: 'color',
      isOn: false
    },
    {
      iconSvg: this.iconAutocomplete(false, 'formas'),
      auxForSvg: 'formas',
      class: this.classAutocomplete(false),
      id: 'forma',
      isOn: false
    },
    {
      iconSvg: this.iconAutocomplete(false, 'relleno'),
      auxForSvg: 'relleno',
      class: this.classAutocomplete(false),
      id: 'relleno',
      isOn: false
    }
  ];

  // @Input('currentRule')
  // set setCurrentRule(r: GameRule | undefined) {
  //   if (r === undefined) return;
  //   this.currentRule = r;
  //   this.ruleSelectionAnimation();
  // }
  setNewRule(r: GameRule) {
    this.currentRule = r;
    this.updateRuleStates();
    this.ruleSelectionAnimation();
  }


  constructor(private elementRef: ElementRef) {
  }


  iconAutocomplete(isOn: boolean, rule: string): string {
    return isOn ? this.concatRuteSvg(rule + '_igual.svg') : this.concatRuteSvg(rule + '_igual_block.svg');
  }

  classAutocomplete(isOn: boolean): any {
    return isOn ? 'rule-container-on' : 'rule-container-off';
  }

  concatRuteSvg(svg: string): string {
    return 'changing_rules/svg/indicación/' + svg;
  }


  updateRuleStates() {
    this.rulesArray.forEach(z => {
      z.isOn = this.currentRule === z.id;
      z.iconSvg = this.iconAutocomplete(z.isOn, z.auxForSvg);
      z.class = this.classAutocomplete(z.isOn);
    });
  }

  ruleSelectionAnimation() {
    if (!this.allRules) return;
    this.allRules.toArray().forEach( (z: any) => anime.remove(z.nativeElement));
    anime({
      targets: this.allRules.toArray()[this.rulesArray.findIndex(z => z.isOn)].nativeElement,
      duration: 400,
      easing: 'easeInOutExpo',
      keyframes: [{
        scale: 1
      }, {
        scale: 0.75
      }, {
        scale: 1
      }]
    });
  }


}
