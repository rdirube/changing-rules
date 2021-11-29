import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import { SharedModule } from '../shared/shared.module';
import { RulesComponent } from './components/rules/rules.component';
import { CardComponent } from './components/card/card.component';
import { DeckComponent } from './components/deck/deck.component';
import { OxComponentsModule } from 'ox-components';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import {GameBodyDirective} from '../shared/directives/game-body.directive';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { ClockComponent } from './components/clock/clock.component';
import { TutorialButtonComponent } from './components/tutorial/tutorial-button/tutorial-button.component';


@NgModule({
  declarations: [
    GameBodyDirective,
    GameBodyComponent,
    RulesComponent,
    CardComponent,
    DeckComponent,
    TutorialComponent,
    ClockComponent,
    TutorialButtonComponent
  ],
  exports: [
    GameBodyComponent,
    TutorialComponent,
  ],
  imports: [
    RoundProgressModule,
    CommonModule,
    SharedModule,
    OxComponentsModule
  ]
})
export class CardsGameModule { }
