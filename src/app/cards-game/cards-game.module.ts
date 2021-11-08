import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [
    GameBodyComponent
  ],
  exports: [
    GameBodyComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CardsGameModule { }
