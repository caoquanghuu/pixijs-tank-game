import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../AssetsLoader';
import { TankController } from './Controller/TankController';
import { BulletController } from './Controller/BulletController';
import { EnvironmentController } from './Controller/EnvironmentController';
import { Direction, Size } from './type';
import { Point, Rectangle } from '@pixi/core';
import { CollisionController } from './Controller/CollisionController';
import { Tank } from './Objects/Tank';
import { Bullet } from './Objects/Bullet';
import { BaseObject } from './Objects/BaseObject';

export class GameScene extends Container {
    private _playerScore: number;
    private _tankController: TankController;
    private _bulletController: BulletController;
    private _environmentController: EnvironmentController;
    private _collisionController: CollisionController;
    constructor() {
        super();
        const bg = new Sprite(AssetsLoader.getTexture('game-back-ground'));
        this.addChild(bg);
        bg.width = 800;
        bg.height = 600;
        // constructor controller
        this._collisionController = new CollisionController(this.getTankList.bind(this), this.getBulletList.bind(this), this.getEnvironmentList.bind(this), this.removeBulletCall.bind(this), this.handleTankMoveCall.bind(this));

        this._bulletController = new BulletController(this.addToScene.bind(this), this.removeFromScene.bind(this));

        this._tankController = new TankController(this.addToScene.bind(this), this.removeFromScene.bind(this), this.createBulletCall.bind(this), this.createNewRandomPositionCall.bind(this));

        this._environmentController = new EnvironmentController(this.addToScene.bind(this), this.createNewRandomPositionCall.bind(this));
    }

    public getTankList(): Tank[] {
        return this._tankController.usingTankList;
    }

    public getBulletList(): Bullet[] {
        return this._bulletController.bullets;
    }

    public getEnvironmentList(): BaseObject[] {
        return this._environmentController.environmentObjects;
    }

    public removeBulletCall(bullet: Bullet) {
        this._bulletController.removeBullet(bullet);
    }

    public handleTankMoveCall(tank: Tank) {
        this._tankController.handleTankMove(tank);
    }

    public createNewRandomPositionCall(size: Size): Rectangle {
        return this._collisionController.createNewRandomPosition(size);
    }


    /**
     * function to send request to bullet controller create a bullet
     * @param position position start of bullet which get from tank
     * @param direction direction of bullet which get from tank last direction
     * @param isPlayerBullet this bullet is player bullet or bot bullet
     */
    public createBulletCall(position: Point, direction: Direction, isPlayerBullet: boolean) {
        this._bulletController.createBullet(position, direction, isPlayerBullet);
    }

    public init() {
        console.log('GameScene init');

        const img = new Sprite(AssetsLoader.getTexture('tank'));

        this.addChild(img);

        img.position.set(100, 100);
    }

    private addToScene(sprite: Sprite) {
        this.addChild(sprite);
    }

    private removeFromScene(sprite: Sprite) {
        this.removeChild(sprite);
    }

    private time = 0;
    public update(deltaTime: number) {
        this.time += deltaTime;
        if (this.time > 1000) {
            this.time -= 1000;
            console.log('GameScene update');
        }
        this._tankController.update(deltaTime);
        this._bulletController.update(deltaTime);
        this._collisionController.update();
    }

    public destroy() {
        console.log('GameScene destroy');
    }
}