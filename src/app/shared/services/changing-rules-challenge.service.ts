import {Injectable} from '@angular/core';
import {
  AppInfoOxService,
  ChallengeService,
  FeedbackOxService,
  GameActionsService,
  LevelService,
  SubLevelService
} from 'micro-lesson-core';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {
  ChangingRulesExercise,
  ChangingRulesNivelation,
  GameRule,
  CardsInTable,
  Rule,
  ALL_RULES,
  GameSetting
} from '../models/types';
import {anyElement, ExpandableInfo, equalArrays} from 'ox-types';


@Injectable({
  providedIn: 'root'
})


export class ChangingRulesChallengeService extends ChallengeService<any, any> {

  public resources = new Map<string, string>();
  public exerciseConfig!: ChangingRulesNivelation;

  public cardsInTable!: CardsInTable;
  private lastRule!: GameRule;
  public cardsPlayed:number = 0;
  public cardDecksPivot:number = 1;
  public addCardToDeckValidator = 0;
  public cardsGeneratorStopper:number = 0;

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
              subLevelService: SubLevelService,
              private preloaderService: PreloaderOxService,
              private feedback: FeedbackOxService,
              private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
    gameActionsService.restartGame.subscribe(z => {
      this.cachedExercises = [];
      this.setInitialExercise();
    });
    gameActionsService.showNextChallenge.subscribe(z => {
      console.log('showNextChallenge');
    });
    this.exerciseConfig = JSON.parse('{"GAME_RULES":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella","rombo"],"colorsAvaiable":["rojo","celeste","amarillo","verde","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardInTable":9,"cardsForCorrectAnswer":3,"gameSetting":"igual","totalTimeInSeconds":30,"wildcardOn":true,"minWildcardQuantity":2,"gameMode":"limpiar la mesa","rulesForAnswer":1}');
  }



  nextChallenge(): void {
    this.cachedExercises.push(this.generateNextChallenge(0));
  }


  protected equalsExerciseData(exerciseData: ChangingRulesExercise, exerciseDoneData: ChangingRulesExercise): boolean {
    console.log('Chequing equal exercose...');
    // TODO re validate this
    return equalArrays(exerciseData.currentCards, exerciseDoneData.currentCards);
  }



  protected generateNextChallenge(subLevel: number): ExerciseOx<ChangingRulesExercise> {
    const currentExerciseRule: GameRule = anyElement(this.exerciseConfig.gameRules.filter( z => z !== this.lastRule));
    this.lastRule = currentExerciseRule;
    const ruleClass = ALL_RULES.find(z => z.id === currentExerciseRule) as Rule;
    if(this.exerciseConfig.gameMode === 'Set convencional') {
      this.cardsInTable.updateCardsNewModel(this.exerciseConfig.cardsForCorrectAnswer,() => this.cardsInTable.cardNotRepeatedLargeForced(this.cardsInTable.currentPossibleAnswerCards, this.cardsInTable.cards.filter(card => !card.hasBeenUsed),() => this.cardsInTable.addForcedCard(this.cardsInTable.currentPossibleAnswerCards)));
    } else {
      this.cardsInTable.updateCards(ruleClass, this.exerciseConfig.cardsForCorrectAnswer);
    }
    // TODO SOLVE THIS
    // this.cardInTable.modifyInitialCards(currentExerciseRule, this.exerciseConfig.cardsForCorrectAnswer
    //   , this.cardInTable, CARD_COLORS, CARD_SHAPES, CARD_FILLERS, lastCards, this.exerciseConfig.cardInTable);
    return new ExerciseOx({
      rule: ruleClass,
      currentCards: this.cardsInTable.cards,
      currentSetting: this.exerciseConfig.gameSetting
    } as ChangingRulesExercise, 1, {maxTimeToBonus: 0, freeTime: 0}, []);
  }




  beforeStartGame(): void {
    const gameCase = 'created-config';
    // this.appInfo.microLessonInfo.extraInfo.exerciseCase
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        this.exerciseConfig = this.getExerciseConfig();
        // this.exerciseConfig = JSON.parse('{"GAME_RULES":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella"],"colorsAvaiable":["rojo","celeste","amarillo","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardInTable":9,"cardQuantityDeck":32, "cardsForCorrectAnswer":3,"gameSetting":"igual","totalTimeInSeconds":30,"wildcardOn":true,"minWildcardQuantity":2,"GameMode":"limpiar la mesa","rulesForAnswer":1}');
        // this.cardInTable = 
        // this.exerciseConfig = JSON.parse('{"gameRules":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella","rombo"],"colorsAvaiable":["naranja","celeste","amarillo","verde","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardInTable":9,"cardsForCorrectAnswer":3,"gameSetting":["igual", "distinto", "aleatorio"],"totalTimeInSeconds":15  ,"wildcardOn":true,"minWildcardQuantity":2,"gameMode":"Set convencional","rulesForAnswer":1,"totalExercises":99}');
        this.setInitialExercise();
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
  }


  
  public getMetricsInitialExpandableInfo(): ExpandableInfo {
    const config = this.getExerciseConfig();
    const timeSettings = {} as any;
    if (config.totalTimeInSeconds){
      timeSettings.timeMode = 'total';
      timeSettings.timeMode = config.totalTimeInSeconds;
    } else {
      timeSettings.timeMode = 'no-time';
    }
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: this.exerciseConfig.totalExercises || 'infinite',
      },
      globalStatement: [],
      timeSettings,
    };
  }


  
  private setInitialExercise(): void {
    console.log('setInitialExercise');
    const isFirst = true;
    this.cardsInTable = new CardsInTable(this.exerciseConfig.colorsAvaiable, this.exerciseConfig.shapesAvaiable, this.exerciseConfig.fillsAvaiable);
    this.cardsInTable.setInitialCards(this.exerciseConfig.cardInTable, this.exerciseConfig.cardsForCorrectAnswer);
    // this.cardsInTable.updateCardsNewModel(this.exerciseConfig.cardsForCorrectAnswer);
  }



  public getExerciseConfig(): ChangingRulesNivelation {
    return this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo.properties;
  }
}
