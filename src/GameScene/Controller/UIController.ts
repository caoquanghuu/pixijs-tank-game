
import { Sprite, IPointData, Text } from '../../pixi';
import { AssetsLoader } from '../../AssetsLoader';
import { ResetGameSceneFn, StartPlayGameFn } from '../type';
import { AppConstants } from '../Constants';
import Emitter from '../util';
import { sound } from '@pixi/sound';


export class UIController {
    private _startPlayGameCall: StartPlayGameFn;
    private _resetGameSceneCall: ResetGameSceneFn;


    constructor({
        startPlayGameCallBack,
        resetGameSceneCallBack
    }: {
        startPlayGameCallBack: StartPlayGameFn,
        resetGameSceneCallBack: ResetGameSceneFn
    }) {

        this._useEventEffect();

        this._startPlayGameCall = startPlayGameCallBack;
        this._resetGameSceneCall = resetGameSceneCallBack;
    }

    private _useEventEffect(): void {
        Emitter.on(AppConstants.eventEmitter.displayGameOver, this.displayGameOver.bind(this));
    }

    /**
     * method to display main menu game
     */
    public displayMainMenuGame(): void {
        // create a main game back ground
        const mainBg = new Sprite(AssetsLoader.getTexture(AppConstants.textureName.mainBackGround));
        mainBg.width = AppConstants.screenWidth;
        mainBg.height = AppConstants.screenHeight;

        const title = new Sprite(AssetsLoader.getTexture(AppConstants.textureName.title));
        title.anchor.set(0.5);

        // create a text for start button
        const textStart = new Text(AppConstants.text.start, {
            fontSize: AppConstants.fontSizeOfStartButton,
            fill: AppConstants.colorOfStartButton,
            align: 'center'
        });
        textStart.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnSprite = new Sprite(AssetsLoader.getTexture(AppConstants.textureName.button));
        btnSprite.anchor.set(0.5);

        // add text to sprite
        btnSprite.addChild(textStart);

        // when player tap start game will start
        btnSprite.eventMode = 'static';
        btnSprite.cursor = 'pointer';

        // player tap on start button to start play game
        btnSprite.on('pointertap', this._startPlayGameCall.bind(this));

        // set title and button in side main bg
        mainBg.addChild(title, btnSprite);
        title.position = AppConstants.mainMenuTitlePosition;

        btnSprite.position = AppConstants.mainMenuButtonPosition;

        Emitter.emit(AppConstants.eventEmitter.addToScene, mainBg);

        // stop update
        Emitter.emit(AppConstants.eventEmitter.stopUpdate, null);

        // play game music
        sound.play(AppConstants.soundCfg.mainMusic, { volume: AppConstants.volumeMainMenuMusic, loop: true });
    }

    public displayGameOver(): void {
        // stop update
        Emitter.emit(AppConstants.eventEmitter.stopUpdate, null);

        // game over back ground
        const overBg = new Sprite(AssetsLoader.getTexture(AppConstants.textureName.mainBackGround));
        overBg.width = AppConstants.screenWidth;
        overBg.height = AppConstants.screenHeight;

        // create text content which will be display on game over bg
        const textGameOver = new Text(AppConstants.text.gameOver, {
            fontSize: AppConstants.fontSizeOfGameOverText,
            fill: AppConstants.colorOfGameOverText,
            align: 'center'
        });
        textGameOver.anchor.set(0.5);

        const textYourScore = new Text(AppConstants.text.yourScore, {
            fontSize: AppConstants.fontSizeOfYourScoreText,
            fill: AppConstants.colorOfYourScoreText
        });
        textYourScore.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnReplay = new Sprite(AssetsLoader.getTexture(AppConstants.textureName.button));
        btnReplay.anchor.set(0.5);

        const textReplay = new Text(AppConstants.text.playAgain, {
            fontSize: AppConstants.fontSizeOfReplayText,
            fill: AppConstants.colorOfReplayText
        });
        textReplay.anchor.set(0.5);

        btnReplay.addChild(textReplay);

        // when player tap start game will start
        btnReplay.eventMode = 'static';
        btnReplay.cursor = 'pointer';

        // player tap on start button to start play game
        btnReplay.on('pointertap', () => {
            // remove bg
            Emitter.emit(AppConstants.eventEmitter.removeFromScene, overBg);

            // call reset game
            this._resetGameSceneCall();

            // call start game
            this._startPlayGameCall();
        });

        // add there text to game over back ground and set position for it
        overBg.addChild(textGameOver, textYourScore, btnReplay);
        textGameOver.position = AppConstants.textGameOverPosition;

        textYourScore.position = AppConstants.textYourScorePosition;

        btnReplay.position = AppConstants.buttonReplayPosition;

        // add bg game to game scene
        Emitter.emit(AppConstants.eventEmitter.addToScene, overBg);

        // display score at position
        const positionDisplayScore: IPointData = { x: AppConstants.scoreDisplayPositionOnGameOver.x, y: AppConstants.scoreDisplayPositionOnGameOver.y };
        Emitter.emit(AppConstants.displayScore, positionDisplayScore);
    }

}