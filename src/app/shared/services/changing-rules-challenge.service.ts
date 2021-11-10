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
  CardColor,
  CardFill,
  CardShape,
  GameRule,
  GameSetting,
  GameMode,
  CardType
} from '../models/types';
import {anyElement, ExpandableInfo, Showable, shuffle, equalArrays, randomBool} from 'ox-types';
import {zip} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangingRulesChallengeService extends ChallengeService<any, any> {

  public exerciseConfig!: ChangingRulesNivelation; // TODO definy type
  public cardColors: CardColor[] = ['naranja', 'celeste', 'amarillo', 'verde', 'violeta'];
  public cardShapes: CardShape[] = ['circulo', 'cuadrado', 'triangulo', 'estrella', 'rombo'];
  public cardFillers: CardFill[] = ['relleno', 'rallado', 'moteado', 'vacio'];
  public gameRules: GameRule[] = ['color', 'forma', 'relleno'];

  public totalCards: CardType[] = [];
  public remainingCards: CardType[] = [];
  public turn: number = 0;

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
              subLevelService: SubLevelService,
              private preloaderService: PreloaderOxService,
              private feedback: FeedbackOxService,
              private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
    for (let i = 0; i < this.cardColors.length; i++) {
      this.checkBucle();
      for (let t = 0; t < this.cardShapes.length; t++) {
        this.checkBucle();
        for (let p = 0; p < this.cardFillers.length; p++) {
          this.checkBucle();
          let card: CardType = {
            color: this.cardColors[i],
            shape: this.cardShapes[t],
            fill: this.cardFillers[p]
          };
          this.totalCards.push(card);
        }
      }
    }
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


  private check = 0;

  private checkBucle() {
    console.log(this.check);
    if (this.check++ > 1000) {
      throw new Error('Check crash');
    }

  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<ChangingRulesExercise> {
    console.log('Chequing generate  exercose...');
    const currentExerciseRule: GameRule = anyElement(this.gameRules);
    const shuffledTotalCards = shuffle(this.totalCards);
    const firstCards: CardType[] = [];
    for (let i = 0; i < this.exerciseConfig.cardsInTable - this.exerciseConfig.cardsForCorrectAnswer; i++) {
      this.remainingCards = shuffledTotalCards.filter((z, t) => z !== firstCards[t]);
      firstCards.push(this.remainingCards[i]);
      this.checkBucle();
    }
    const lastCards = this.setLastCards(firstCards, this.remainingCards, this.exerciseConfig.cardsForCorrectAnswer, currentExerciseRule);
    const currentCards = firstCards.concat(lastCards);
    this.turn++;
    return new ExerciseOx({
      rule: currentExerciseRule,
      cards: this.turn === 1 ? currentCards : lastCards
    } as ChangingRulesExercise, 1, {maxTimeToBonus: 0, freeTime: 0}, []);
  }


  beforeStartGame(): void {
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    console.log('JAJAJAJ');
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        // this.exerciseConfig = this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo.properties;JSON.parse()
        this.exerciseConfig = JSON.parse('{"gameRules":["forma","color","relleno"],"shapesAvaiable":["circulo","cuadrado","triangulo","estrella","rombo"],"colorsAvaiable":["rojo","celeste","amarillo","verde","violeta"],"fillsAvaiable":["vacio","relleno","rallado","moteado"],"cardsInTable":9,"cardsForCorrectAnswer":3,"gameSetting":"igual","totalTimeInSeconds":30,"wildcardOn":true,"minWildcardQuantity":2,"GameMode":"limpiar la mesa","rulesForAnswer":1}');
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


  private countOfEqualProperty(randomCard: CardType, currentsCard: CardType[], rule: GameRule, compareFunc = (a: any, b: any) => a === b): number {
    switch (rule) {
      case 'color':
        return currentsCard.filter(z => compareFunc(z.color, randomCard.color)).length;
      case 'forma':
        return currentsCard.filter(z => compareFunc(z.shape, randomCard.shape)).length;
      case 'relleno':
        return currentsCard.filter(z => compareFunc(z.fill, randomCard.fill)).length;
    }
  }


  private setLastCardsEqualProp(rule: GameRule, randomCard: CardType): CardType {
    switch (rule) {
      case 'color':
        let card1: CardType = {
          color: randomCard.color,
          shape: anyElement(this.cardShapes),
          fill: anyElement(this.cardFillers)
        };
        return card1;
      case 'forma':
        let card2: CardType = {
          color: anyElement(this.cardColors),
          shape: randomCard.shape,
          fill: anyElement(this.cardFillers)
        };
        return card2;
      case 'relleno':
        let card3: CardType = {
          color: anyElement(this.cardColors),
          shape: anyElement(this.cardShapes),
          fill: randomCard.fill
        };
        return card3;
    }

  }


  private setLastCards(cardsInTable: CardType[], shuffleTotalCards: CardType[], cardsForCorrect: number, rule: GameRule): CardType[] {
    const randomCard = anyElement(cardsInTable);
    const lastCards: CardType[] = [];
    console.log(randomCard);
    const propertyEqualQuantity = this.countOfEqualProperty(randomCard, cardsInTable, rule);
    console.log(propertyEqualQuantity);
    for (let i = 0; i < cardsForCorrect - propertyEqualQuantity; i++) {
      this.checkBucle();
      const cardToAdd = this.setLastCardsEqualProp(rule, randomCard);
      console.log(cardToAdd);
      lastCards.push(cardToAdd);
    }
    while (cardsInTable.length < this.exerciseConfig.cardsInTable) {
      this.checkBucle();
      let card: CardType = {
        color: anyElement(this.cardColors),
        shape: anyElement(this.cardShapes),
        fill: anyElement(this.cardFillers)
      };
      lastCards.push(card);
    }
    return lastCards;
  }


  getNotUnique(array: CardType[]) {
    const map = new Map();
    array.forEach(a => map.set(a.color, (map.get(a.color) || 0) + 1));
    return array.filter(a => map.get(a.color) > 1);
  }

  // private generateDifferentsFigures(cardsInTable:CardType[]):CardType {

  // }


}
