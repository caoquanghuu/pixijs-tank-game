import 'pixi-spine';
import '@pixi-spine/loader-3.8';
import { Container, Sprite, Rectangle, IPointData, DisplayObject } from '../pixi';
import { AssetsLoader } from '../AssetsLoader';
import { TankController } from './Controller/TankController';
import { BulletController } from './Controller/BulletController';
import { EnvironmentController } from './Controller/EnvironmentController';
import { Size } from './type';
import { Tank } from './Objects/Tank';
import { Bullet } from './Objects/Bullet';
import { BaseObject } from './Objects/BaseObject';
import { SpineObject } from './Objects/SpineObject';
import { UIController } from './Controller/UIController';
import { AppConstants } from './Constants';
import Emitter, { Bunker, CollisionHelper, Environment, Reward, createNewRandomPosition } from './util';

export class GameScene extends Container {
    private _time = 0;
    private _playerScore: number = 0;
    private _scoreSpriteArray: Sprite[];
    private _tankController: TankController;
    private _bulletController: BulletController;
    private _environmentController: EnvironmentController;
    private _UIController: UIController;

    private _inGameObjects: BaseObject[] = [];
    private _collisionObjects: BaseObject[] = [];

    constructor() {
        super();
        // create event effect
        this._useEventEffect();

        // create controller
        this.init.bind(this);

        // test spine object
        const spine = new SpineObject();
        spine.loadBundle('assets/units/spine2d/spine-boy/spine-boy-pro.json').then(() => {
            spine.setAnimation({ trackIndex:0, animationName: AppConstants.animationName.idle, loop: true });
            spine.addAnimation({ trackIndex:0, animationName: AppConstants.animationName.aim, loop: false, delay:0.5 });
            spine.addAnimation({ trackIndex:1, animationName: AppConstants.animationName.shoot, loop: false, delay:0.75 });
            spine.addAnimation({ trackIndex:0, animationName: AppConstants.animationName.walk, loop: true, delay:1.1 });
            spine.addAnimation({ trackIndex:0, animationName: AppConstants.animationName.run, loop: true, delay:1.5 });
            spine.addAnimation({ trackIndex:0, animationName: AppConstants.animationName.idle, loop: true, delay:1.65 });
            spine.addAnimation({ trackIndex:1, animationName: AppConstants.animationName.shoot, loop: false, delay:4.5 });
            spine.spine.scale = { x:-0.2, y:0.2 };
            const position: IPointData = { x: 400, y: 400 };
            spine.position = position;
            this.addChild(spine.spine);
        }
        );
    }

    private _useEventEffect() {
        Emitter.on(AppConstants.eventEmitter.addToScene, this.addToScene.bind(this));
        Emitter.on(AppConstants.eventEmitter.removeFromScene, this.removeFromScene.bind(this));
        Emitter.on(AppConstants.displayScore, this.displayScore.bind(this));
        Emitter.on(AppConstants.eventEmitter.addObjectToScene, this._addObjectToScene.bind(this));
        Emitter.on(AppConstants.eventEmitter.removeObjectFromScene, this._removeObjectFromScene.bind(this));
    }

    /**
     * method to reset controller
     */
    private _resetGameScene() {
        this._tankController.reset();

        this._environmentController.reset();

        this._bulletController.reset();

        this._playerScore = 0;
    }

    /**
     * method to create object to game scene
     */
    private _createObjects() {
        this._tankController.init();
        this._environmentController.init();
    }

    public plusScore(score: number) {
        this._playerScore += score;

        // call display score on changed score
        const positionDisplayScore: IPointData = { x: AppConstants.defaultScoreDisplayPosition.x, y: AppConstants.defaultScoreDisplayPosition.y };
        this.displayScore(positionDisplayScore);
    }

    /**
     * method to call start the game
     */
    public startPlayGame() {

        // set a back ground of game
        const bg = new Sprite(AssetsLoader.getTexture(AppConstants.textureName.backGround));
        this.addChild(bg);
        bg.width = AppConstants.screenWidth;
        bg.height = AppConstants.screenHeight;

        // set position where will display score
        const positionDisplayScore = AppConstants.defaultScoreDisplayPosition;

        // display score
        this.displayScore(positionDisplayScore);

        this._createObjects();

        Emitter.emit(AppConstants.eventEmitter.startUpDate, null);
    }

    /**
     * method for display score of player
     * @param positionDisplay position which score will be display
     */
    public displayScore(positionDisplay: IPointData) {

        // remove old sprite of score if have
        if (this._scoreSpriteArray) {
            this._scoreSpriteArray.forEach(sprite => {
                this.removeFromScene(sprite);
            });
        }

        // convert this score to array contain element
        const scoreArray: string[] = `${this._playerScore}`.split('').reverse();

        // create a start position
        const position: IPointData = { x: positionDisplay.x, y: positionDisplay.y };

        // which each element will be convert to a sprite display number of that element
        const scoreSpriteArray: Sprite[] = scoreArray.map(score => {

            // get sprite match with number element
            const scoreSprite = new Sprite(AssetsLoader.getTexture(`score-number-${score}`));

            scoreSprite.width = AppConstants.scoreSpriteWidth;
            scoreSprite.height = AppConstants.scoreSpriteHeight;

            this.addChild(scoreSprite);

            scoreSprite.position.set(position.x, position.y);

            position.x -= AppConstants.spaceBetweenScoresNumber;

            return scoreSprite;
        });

        // add new score array sprite
        this._scoreSpriteArray = scoreSpriteArray;
    }

    private async _checkCollision() {
        CollisionHelper.checkCollisionHelp(this._inGameObjects, this._onCollision.bind(this));
    }

    private _onCollision(object: BaseObject, otherObject: BaseObject) {
        if (object instanceof Tank && otherObject instanceof Bullet) {
            if (object.isPlayerTank !== otherObject.isPlayerBullet) {
                object.HP -= 1;
                this._collisionObjects.push(otherObject);
            }
        }

        if (object instanceof Tank && otherObject instanceof Tank) {
            this.handleTankMoveCall(object);
        }

        if (object instanceof Tank && otherObject instanceof Environment) {
            this.handleTankMoveCall(object);
        }

        if (object instanceof Tank && otherObject instanceof Reward) {
            if (object.isPlayerTank) object.HP += 1;

            this._collisionObjects.push(otherObject);
        }

        if (object instanceof Tank && otherObject instanceof Bunker) {
            this.handleTankMoveCall(object);
        }

        if (object instanceof Bullet && otherObject instanceof Environment) {
            this._collisionObjects.push(object);
            this._collisionObjects.push(otherObject);
        }

        if (object instanceof Bullet && otherObject instanceof Bunker) {
            Emitter.emit(AppConstants.eventEmitter.displayGameOver, null);
        }
    }

    public removeEnvironmentCall(environment: BaseObject) {
        this._environmentController.removeEnvironmentObject(environment);
    }

    public removeRewardObjectCall(rewardObject: BaseObject) {
        this._environmentController.removeObject(rewardObject, this._environmentController.rewardObjects);
    }

    public removeBulletCall(bullet: Bullet) {
        this._bulletController.removeBullet(bullet);
    }

    public handleTankMoveCall(tank: Tank) {
        this._tankController.handleTankMove(tank);
    }

    public createNewRandomPositionCall(size: Size): Rectangle {
        return createNewRandomPosition(size, this._inGameObjects);
    }

    private addToScene(displayObject: DisplayObject) {
        this.addChild(displayObject);
    }

    private _addObjectToScene(object: BaseObject) {
        this.addChild(object.sprite);

        this._inGameObjects.push(object);
    }

    private removeFromScene(sprite: Sprite) {
        this.removeChild(sprite);
    }

    private _removeObjectFromScene(object: BaseObject) {
        this.removeChild(object.sprite);

        const p = this._inGameObjects.findIndex(objects => objects === object);

        this._inGameObjects.splice(p, 1);
    }

    public async init() {
        console.log('GameScene init');

        this._UIController = new UIController({
            startPlayGameCallBack: this.startPlayGame.bind(this),
            resetGameSceneCallBack: this._resetGameScene.bind(this)
        });

        // constructor controllers
        this._bulletController = new BulletController();

        this._tankController = new TankController(this.createNewRandomPositionCall.bind(this), this.plusScore.bind(this));

        this._environmentController = new EnvironmentController(this.createNewRandomPositionCall.bind(this));

        this._UIController.displayMainMenuGame();
    }

    public update(deltaTime: number) {
        this._time += deltaTime;
        if (this._time > 1000) {
            this._time -= 1000;
            console.log('GameScene update');
        }

        if (this._tankController && this._bulletController) {
            this._tankController.update(deltaTime);
            this._bulletController.update(deltaTime);
        }

        this._checkCollision().then(() => {
            const objectsToRemove: BaseObject[] = this._collisionObjects.filter((item, index) => {
                return this._collisionObjects.indexOf(item) === index;
            });
            objectsToRemove.forEach(object => {
                if (object instanceof Environment) this.removeEnvironmentCall(object);
                if (object instanceof Bullet) this.removeBulletCall(object);
                if (object instanceof Reward) this.removeRewardObjectCall(object);
            });
        }).then(() => {
            this._collisionObjects = [];
        });

    }
}