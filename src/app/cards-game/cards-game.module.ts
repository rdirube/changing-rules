import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import {SharedModule} from '../shared/shared.module';
import { RulesComponent } from './components/rules/rules.component';
import { CardComponent } from './components/card/card.component';
import { DeckComponent } from './components/deck/deck.component';
import { OxComponentsModule } from 'ox-components';



@NgModule({
  declarations: [
    GameBodyComponent,
    RulesComponent,
    CardComponent,
    DeckComponent,

  ],
  exports: [
    GameBodyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OxComponentsModule
  ]
})
export class CardsGameModule { }
