import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TypographyOxModule} from 'typography-ox';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {NgoxPostMessageModule} from 'ngox-post-message';
import { OxComponentsModule } from 'ox-components';
import { GameBodyDirective } from './directives/game-body.directive';


@NgModule({
  declarations: [
    GameBodyDirective
  ],
  imports: [
    CommonModule,
    NgoxPostMessageModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
    FlexLayoutModule,
    OxComponentsModule
  ],
  exports: [
    FlexLayoutModule,
    NgoxPostMessageModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
    OxComponentsModule
  ]
})
export class SharedModule {
}
