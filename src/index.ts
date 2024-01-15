import { Application } from './pixi';
import bundles from './bundles.json';
import { AssetsLoader } from './AssetsLoader';
import { GameScene } from './GameScene/GameScene';

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
        this._gameScene = new GameScene();
        this._gameScene.init();

        // Add scene to render stage
        this._pixiApp.stage.addChild(this._gameScene);

        // Update function
        this._pixiApp.ticker.add(this._update.bind(this));
    }

    private _update(deltaTime: number) {

        const dt = deltaTime / 60 * 1000;

        this._gameScene.update(dt);
    }
}


window.onload = () => {
    new Main();
};