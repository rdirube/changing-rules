import {Component, Input, ElementRef, QueryList, ViewChildren, HostListener, OnInit, AfterViewInit} from '@angular/core';
import {GameRule, RuleArray} from 'src/app/shared/models/types';
import anime from 'animejs';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {GameActionsService} from 'micro-lesson-core';
import {ChangingRulesChallengeService} from '../../../shared/services/changing-rules-challenge.service';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  @ViewChildren('rules') allRules!: QueryList<ElementRef>;
  private _rule: GameRule | undefined;
  

  @Input()
  public set rule(value: GameRule | undefined) {
    this._rule = value;
    this.updateRuleStates();
    this.ruleSelectionAnimation();
  }
  public lowerCaseTrue: boolean = true;

  private readonly allRuleArray:{
    iconSvg: string,
    auxForSvg: string,
    class: string,
    id: GameRule,
    isOn: boolean
  }[] = [
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

  public rulesArray: RuleArray[] = [];

  // @Input('currentRule')
  // set setCurrentRule(r: GameRule | undefined) {
  //   if (r === undefined) return;
  //   this.currentRule = r;
  //   this.ruleSelectionAnimation();
  // }
  // @Input()
  // get rule(): GameRule | undefined {
  //   return this._rule;
  // }
  // set rule(r: GameRule | undefined) {
  //   console.log('llego rule', r);
  //   if (r === undefined) return;
  //   this._rule = r;
  //   this.updateRuleStates();
  //   this.ruleSelectionAnimation();
  // }


  constructor(private challengeService: ChangingRulesChallengeService,
              private gameActions: GameActionsService<any>) {
    super();
    this.addSubscription(this.gameActions.startGame, z => {
      this.rulesArray = this.allRuleArray.filter( x => this.challengeService.exerciseConfig.gameRules.includes(x.id));
    });
    this.rulesArray = this.allRuleArray.filter( x => this.challengeService.getExerciseConfig().gameRules.includes(x.id));
  }
 
  ngAfterViewInit(): void {
    // this.ruleSelectionAnimation();
  }
 
  ngOnInit(): void {
    console.log('Rule component instaciated')
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
      z.isOn = this._rule === z.id;
      z.iconSvg = this.iconAutocomplete(z.isOn, z.auxForSvg);
      z.class = this.classAutocomplete(z.isOn);
    });
  }



  ruleSelectionAnimation() {
    if (!this.allRules) return;
    this.allRules.toArray().forEach((z: any) => anime.remove(z.nativeElement));
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
