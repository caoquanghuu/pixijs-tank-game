import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../AssetsLoader';
import { TankController } from './Controller/TankController';
import { BulletController } from './Controller/BulletController';
import { EnvironmentController } from './Controller/EnvironmentController';
import { Tank } from './Objects/Tank';
import { BaseObject } from './Objects/BaseObject';

export class GameScene extends Container {
    private _playerScore: number;
    private _tankController: TankController;
    private _bulletController: BulletController;
    private _environmentController: EnvironmentController;
    constructor() {
        super();
        /**constructor controller */
        this._tankController = new TankController();
        this._bulletController = new BulletController();
        this._environmentController = new EnvironmentController();

    }

    public init() {
        console.log('GameScene init');


        const img = new Sprite(AssetsLoader.getTexture('tank'));

        this.addChild(img);

        img.position.set(100, 100);
        console.log(img);
    }

    private time = 0;
    public update(deltaTime: number) {
        this.time += deltaTime;
        if (this.time > 1000) {
            this.time -= 1000;
            console.log('GameScene update');
        }
    }

    public destroy() {
        console.log('GameScene destroy');
    }
}