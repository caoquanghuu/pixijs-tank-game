
import 'pixi-spine';

import { Application } from './pixi';
import bundles from './bundles.json';
import { AssetsLoader } from './AssetsLoader';
import { GameScene } from './GameScene/GameScene';
import '@pixi-spine/loader-3.8';
import { sound } from '@pixi/sound';

class Main {

    private _gameScene: GameScene;
    private _pixiApp: Application;

    constructor() {

        // Create application
        this._pixiApp = new Application({
            width: 800,
            height: 600,
            backgroundColor: 0xE8EAED,
            antialias: true,
            resolution: 1
        });

        console.log(this._pixiApp);
        // @ts-ignore
        document.body.appendChild(this._pixiApp.view);

        this._pixiApp.start();

        this._init();
    }

    private async _init() {

        // load resources
        new AssetsLoader();
        await AssetsLoader.loadBundle(bundles);

        // create scene
        this.createNewGame();

        // Update function
        this._pixiApp.ticker.add(this._update.bind(this));

        sound.add('main-menu-music', 'sound/main-menu-music.mp3');

        // add sound collect reward effect
        sound.add('collect-reward-sound', 'sound/collect-reward-sound.mp3');

        // set moving sound
        sound.add('tank-moving-sound', 'sound/tank-moving.mp3');

        // add fire sound
        sound.add('bullet-fire', 'sound/bullet-fire.mp3');

        // add explosion sound
        sound.add('explosion', 'sound/explosion.mp3');
    }

    private createNewGame() {
        this._gameScene = new GameScene(this.createNewGame.bind(this));
        this._gameScene.init();
        this._pixiApp.stage.eventMode = 'static';

        // Add scene to render stage
        this._pixiApp.stage.addChild(this._gameScene);
    }

    private _update(deltaTime: number) {

        const dt = deltaTime / 60 * 1000;

        this._gameScene.update(dt);
    }
}


window.onload = () => {
    new Main();
};