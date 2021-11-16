import { Injectable } from '@angular/core';
import {
  AppInfoOxService,
  ChallengeService,
  FeedbackOxService,
  GameActionsService,
  LevelService,
  SubLevelService
} from 'micro-lesson-core';
import { ExerciseOx, PreloaderOxService } from 'ox-core';
import {
  ChangingRulesExercise,
  ChangingRulesNivelation,
  CardColor,
  CardFill,
  CardShape,
  GameRule,
  GameSetting,
  GameMode,
  CardInfo,
  CardsInTable,
  Rule,
  ALL_RULES
} from '../models/types';
import { anyElement, ExpandableInfo, Showable, shuffle, equalArrays, randomBool, } from 'ox-types';
import { zip } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangingRulesChallengeService extends ChallengeService<any, any> {

  public resources = new Map<string, string>();
  public exerciseConfig!: ChangingRulesNivelation; // TODO definy type
  public cardColors: CardColor[] = ['naranja', 'celeste', 'amarillo', 'violeta'];
  public cardShapes: CardShape[] = ['circulo', 'cuadrado', 'triangulo', 'estrella'];
  public cardFillers: CardFill[] = ['relleno', 'rallado', 'moteado', 'vacio'];
  public gameRules: GameRule[] = ['color', 'forma', 'relleno'];
  public cardsInTable: CardInfo[] = [];
  public lastCards: CardInfo[] = [];
  public initialCards: CardInfo[] = [];
  public turn: number = 0;
  public quantityOfCardsPlayed: number = 0;

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

    // this.exerciseConfig = JSON.parse('{"gameRules":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella","rombo"],"colorsAvaiable":["rojo","celeste","amarillo","verde","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardsInTable":9,"cardsForCorrectAnswer":3,"gameSetting":"igual","totalTimeInSeconds":30,"wildcardOn":true,"minWildcardQuantity":2,"GameMode":"limpiar la mesa","rulesForAnswer":1}');
  }

  nextChallenge(): void {
    this.cachedExercises.push(this.generateNextChallenge(0));
  }


  protected equalsExerciseData(exerciseData: ChangingRulesExercise, exerciseDoneData: ChangingRulesExercise): boolean {
    console.log('Chequing equal exercose...');
    return equalArrays(exerciseData.cards, exerciseDoneData.cards);
  }


  protected generateNextChallenge(subLevel: number): ExerciseOx<ChangingRulesExercise> {
    const currentExerciseRule: GameRule = anyElement(this.gameRules);
    const ruleClass = ALL_RULES.find(z => z.id === currentExerciseRule);
    const cardsInTableClassInstance = new CardsInTable(ruleClass!);
    if (this.turn < 1) {
      this.cardsInTable = cardsInTableClassInstance.setInitialCards(this.cardColors, this.cardShapes, this.cardFillers, this.exerciseConfig.cardsInTable, this.exerciseConfig.cardsForCorrectAnswer);
    }
    this.lastCards = [];
    cardsInTableClassInstance.modifyInitialCards(currentExerciseRule, this.exerciseConfig.cardsForCorrectAnswer, this.cardsInTable, this.cardColors, this.cardShapes, this.cardFillers, this.lastCards, this.exerciseConfig.cardsInTable);
    this.turn++;
    console.log(this.lastCards);
    return new ExerciseOx({
      rule: currentExerciseRule,
      cards: this.turn === 1 ? this.cardsInTable.concat(this.lastCards) : shuffle(this.lastCards)
    } as ChangingRulesExercise, 1, { maxTimeToBonus: 0, freeTime: 0 }, []);
  }



  beforeStartGame(): void {
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        // this.exerciseConfig = this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo.properties;
        this.exerciseConfig = JSON.parse('{"gameRules":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella"],"colorsAvaiable":["rojo","celeste","amarillo","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardsInTable":9,"cardQuantityDeck":32, "cardsForCorrectAnswer":3,"gameSetting":"igual","totalTimeInSeconds":30,"wildcardOn":true,"minWildcardQuantity":2,"GameMode":"limpiar la mesa","rulesForAnswer":1}');
        // this.exerciseConfig = JSON.parse('{"backupReferences":"","ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","libraryItemType":"resource","properties":{"customConfig":{"creatorInfo":{"creatorType":"changing-rules","screenTheme":"executive-functions","type":"challenges","microLessonGameInfo":{"exerciseCount":2,"properties":{"gameRules":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella","rombo"],"colorsAvaiable":["rojo","celeste","amarillo","verde","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardInTable":9,"cardsForCorrectAnswer":3,"gameSetting":"igual","totalTimeInSeconds":30,"wildcardOn":true,"minWildcardQuantity":2,"GameMode":"limpiar la mesa","rulesForAnswer":1}},"exerciseCount":"infinite","metricsType":"results"},"extraInfo":{"gameUrl":"TODO when ","exerciseCase":"created-config"}},"format":"custom-ml-nivelation","miniLessonUid":"Answer hunter","miniLessonVersion":"with-custom-config-v2","url":"https://ml-screen-manager.firebaseapp.com"},"tagIds":{},"inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"description":{"text":"asda"},"name":{"text":"Testing 23/2/2021"},"previewData":{"path":"library/items/RC9MNGIAKo8dRmGbco57/preview-image-es"}}},"uid":"RC9MNGIAKo8dRmGbco57","isPublic":false,"supportedLanguages":{"en":false,"es":true},"type":"mini-lesson"}');
        this.setInitialExercise();
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
  }


  public getMetricsInitialExpandableInfo(): ExpandableInfo {
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: 'infinite',
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'between-interactions',
      },
    };
  }



  private setInitialExercise(): void {
    console.log('setInitialExercise');
  }



  private countOfEqualProperty(randomCard: CardInfo, cardsInTable: CardInfo[], rule: GameRule, compareFunc = (a: any, b: any) => a === b): number {
    switch (rule) {
      case 'color':
        return cardsInTable.filter(z => compareFunc(z.color, randomCard.color)).length;
      case 'forma':
        return cardsInTable.filter(z => compareFunc(z.shape, randomCard.shape)).length;
      case 'relleno':
        return cardsInTable.filter(z => compareFunc(z.fill, randomCard.fill)).length;
    }
  }



  private setLastCardsEqualProp(rule: GameRule, randomCard: CardInfo): void {

  }




  // private setLastCards(cardsInTable: CardInfo[], shuffleTotalCards: CardInfo[], cardsForCorrect: number, rule: GameRule): CardInfo[] {
  //   const randomCard = anyElement(cardsInTable);
  //   const lastCards: CardInfo[] = [];
  //   const propertyEqualQuantity = this.countOfEqualProperty(randomCard, cardsInTable, rule);
  //   for (let i = 0; i < cardsForCorrect - propertyEqualQuantity; i++) {
  //     const cardToAdd = this.setLastCardsEqualProp(rule, randomCard);
  //     lastCards.push(cardToAdd);
  //   }
  //   while (lastCards.length < cardsForCorrect) {
  //     let randomCardToAdd: CardInfo = {
  //       color: anyElement(this.cardColors),
  //       shape: anyElement(this.cardShapes),
  //       fill: anyElement(this.cardFillers)
  //     };
  //     lastCards.push(randomCardToAdd);
  //   }
  //   return lastCards;
  // }




  // private generateDifferentsFigures(cardsInTable:CardType[]):CardType {

  // }


}
