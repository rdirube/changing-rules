import {Component, ElementRef} from '@angular/core';
import {CommunicationOxService, I18nService, PreloaderOxService, ResourceOx, ResourceType} from 'ox-core';
import {ResourceFinalStateOxBridge, ScreenTypeOx, HasTutorialOxBridge} from 'ox-types';
import {environment} from '../environments/environment';
import {
  AppInfoOxService,
  BaseMicroLessonApp,
  EndGameService,
  GameActionsService,
  InWumboxService,
  LevelService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService,
  ProgressService,
  ResourceStateService,
  SoundOxService
} from 'micro-lesson-core';
import {TranslocoService} from '@ngneat/transloco';
import {HttpClient} from '@angular/common/http';
import {PostMessageBridgeFactory} from 'ngox-post-message';
import {ChangingRulesChallengeService} from './shared/services/changing-rules-challenge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseMicroLessonApp {
  title = 'changing-rules';

  public showingTutorial = false;

  constructor(preloader: PreloaderOxService, translocoService: TranslocoService, wumboxService: InWumboxService,
              communicationOxService: CommunicationOxService, microLessonCommunicationService: MicroLessonCommunicationService<any>,
              progressService: ProgressService, elementRef: ElementRef, gameActions: GameActionsService<any>,
              endGame: EndGameService, i18nService: I18nService, levelService: LevelService, http: HttpClient,
              challenge: ChangingRulesChallengeService, appInfo: AppInfoOxService,
              microLessonMetrics: MicroLessonMetricsService<any>, // Todo
              resourceStateService: ResourceStateService,
              sound: SoundOxService, bridgeFactory: PostMessageBridgeFactory,
              transloco: TranslocoService) {
    super(preloader, translocoService, wumboxService, communicationOxService, microLessonCommunicationService,
      progressService, elementRef, gameActions, endGame,
      i18nService, levelService, http, challenge, appInfo, microLessonMetrics, sound, bridgeFactory);
    microLessonCommunicationService.sendMessageMLToManager(HasTutorialOxBridge, true);
    gameActions.microLessonCompleted.subscribe(__ => {
      if (resourceStateService.currentState?.value) {
        microLessonCommunicationService.sendMessageMLToManager(ResourceFinalStateOxBridge, resourceStateService.currentState.value);
      }
    });
    preloader.addResourcesToLoad(this.getGameResourcesToLoad());
    preloader.loadAll().subscribe( z => this.loaded = true);
  }

  protected getGameResourcesToLoad(): ResourceOx[] {
    const svgElementos:string[] = ['mesa.svg', 'dorso.svg', 'frente.svg','mazo.svg'];
    const svgIndications:string[] = ['colores_igual.svg', 'colores_igual_block.svg', 'formas_igual.svg','formas_igual_block.svg','relleno_igual.svg','relleno_igual_block.svg'];
    const svgForms:string[] = ['circle_striped.svg', 'circle_filled.svg', 'circle_empty.svg', 'circle_dotted.svg', 'square_striped.svg', 'square_dotted.svg','square_empty.svg', 'square_filled.svg', 'star_dotted.svg', 'star_striped.svg',
    'star_empty.svg','star_filled.svg', 'triangle_dotted.svg','triangle_filled.svg', 'triangle_empty.svg','triangle_striped.svg']
    return ['bubble01.mp3', 'bubble02.mp3'].map(x => new ResourceOx('sounds/' + x, ResourceType.Audio,
      [ScreenTypeOx.Game], false))
      .concat(getResourceArrayFromUrlList([], ResourceType.Audio, false))
      .concat(getResourceArrayFromUrlList([], ResourceType.Svg, false))
      .concat(svgElementos.map(x => new ResourceOx('svg/reglas_cambiantes/elementos/' + x, ResourceType.Svg,
        [ScreenTypeOx.Game], false)))
      .concat(svgIndications.map(x => new ResourceOx('svg/reglas_cambiantes/indicación/' + x, ResourceType.Svg,
        [ScreenTypeOx.Game], false)))
      .concat(svgForms.map(x => new ResourceOx('svg/reglas_cambiantes/formas_sin_cara/' + x, ResourceType.Svg,
        [ScreenTypeOx.Game], false)))
      .concat(getResourceArrayFromUrlList(['mini-lessons/executive-functions/svg/buttons/Home.svg',
        'mini-lessons/executive-functions/svg/buttons/Hint.svg',
        'mini-lessons/executive-functions/svg/buttons/saltear.svg'], ResourceType.Svg, true));
  }



  protected getBasePath(): string {
    return environment.basePath;
  }

}


function getResourceArrayFromUrlList(urlList: string[], resourceType: ResourceType, isLocal: boolean): ResourceOx[] {
  return urlList.map(listElement => new ResourceOx(listElement, resourceType, [ScreenTypeOx.Game], isLocal));
}