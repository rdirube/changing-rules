import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from './transloco-root.module';
import {AnswerService, ChallengeService} from 'micro-lesson-core';
import {ChangingRulesChallengeService} from './shared/services/changing-rules-challenge.service';
import {ChangingRulesAnswerService} from './shared/services/changing-rules-answer.service';
import {CardsGameModule} from './cards-game/cards-game.module';
import {SharedModule} from './shared/shared.module';
import { GameBodyDirective } from './shared/directives/game-body.directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslocoRootModule,
    CardsGameModule,
    SharedModule,
    
  ],
  providers: [
    {
      provide: ChallengeService,
      useExisting: ChangingRulesChallengeService
    },
    {
      provide: AnswerService,
      useExisting: ChangingRulesAnswerService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
