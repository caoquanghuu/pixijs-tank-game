import { Container, DisplayObject } from '@pixi/display';
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
import { Text } from '@pixi/text';

export class GameScene extends Container {
    private _playerScore: number = 0;
    private _scoreSpriteArray: Sprite[];
    private _tankController: TankController;
    private _bulletController: BulletController;
    private _environmentController: EnvironmentController;
    private _collisionController: CollisionController;

    constructor() {
        super();

        this.displayMainMenuGame();
        // this.displayGameOver();
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

    public getRewardList(): BaseObject[] {
        return this._environmentController.rewardObjects;
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


    public setNewScore(newScore: number) {
        this._playerScore += newScore;

        // call display score on changed score
        const positionDisplayScore = new Point(760, 10);
        this.displayScore(positionDisplayScore);
    }

    /**
     * method to display main menu game
     */
    public displayMainMenuGame() {
        // create a main game back ground
        const mainBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        mainBg.width = 800;
        mainBg.height = 600;

        const title = new Sprite(AssetsLoader.getTexture('title'));
        title.anchor.set(0.5);

        // create a text for start button
        const textStart = new Text('start', {
            fontSize: 14,
            fill: 0xff1010,
            align: 'center'
        });
        textStart.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnSprite = new Sprite(AssetsLoader.getTexture('button-sprite'));
        btnSprite.anchor.set(0.5);

        // add text to sprite
        btnSprite.addChild(textStart);

        // when player tap start game will start
        btnSprite.eventMode = 'static';
        btnSprite.cursor = 'pointer';

        // player tap on start button to start play game
        btnSprite.on('pointertap', this.startPlayGame.bind(this));

        // set title and button in side main bg
        mainBg.addChild(title, btnSprite);
        title.position.x = 180;
        title.position.y = 60;

        btnSprite.position.x = 180;
        btnSprite.position.y = 180;

        this.addToScene(mainBg);
    }

    /**
     * method to call start the game
     */
    public startPlayGame() {

        // set a back ground of game
        const bg = new Sprite(AssetsLoader.getTexture('game-back-ground'));
        this.addChild(bg);
        bg.width = 800;
        bg.height = 600;

        // set position where will display score
        const positionDisplayScore = new Point(760, 10);

        // display score
        this.displayScore(positionDisplayScore);

        // constructor controller
        this._collisionController = new CollisionController(this.getTankList.bind(this), this.getBulletList.bind(this), this.getEnvironmentList.bind(this), this.removeBulletCall.bind(this), this.handleTankMoveCall.bind(this), this.removeEnvironmentCall.bind(this), this.removeRewardObjectCall.bind(this), this.getRewardList.bind(this));

        this._bulletController = new BulletController(this.addToScene.bind(this), this.removeFromScene.bind(this));

        this._tankController = new TankController(this.addToScene.bind(this), this.removeFromScene.bind(this), this.createBulletCall.bind(this), this.createNewRandomPositionCall.bind(this), this.setNewScore.bind(this), this.displayGameOver.bind(this));

        this._environmentController = new EnvironmentController(this.addToScene.bind(this), this.createNewRandomPositionCall.bind(this), this.removeFromScene.bind(this));
    }

    // method game over will be call when player tank die
    public displayGameOver() {
        // create a bg for display option when end game

        // game over back ground
        const overBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        overBg.width = 800;
        overBg.height = 600;

        // create text content which will be display on game over bg
        const textGameOver = new Text('Game Over', {
            fontSize: 24,
            fill: 0xff1010,
            align: 'center'
        });
        textGameOver.anchor.set(0.5);

        const textYourScore = new Text('your score:', {
            fontSize: 14,
            fill: 0xff1010
        });
        textYourScore.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnReplay = new Sprite(AssetsLoader.getTexture('button-sprite'));
        btnReplay.anchor.set(0.5);

        const textReplay = new Text('replay', {
            fontSize: 11,
            fill: 0xff1010
        });
        textReplay.anchor.set(0.5);

        btnReplay.addChild(textReplay);

        // when player tap start game will start
        btnReplay.eventMode = 'static';
        btnReplay.cursor = 'pointer';

        // player tap on start button to start play game
        btnReplay.on('pointertap', () => {
            // this.destroy({ children: true, texture: false, baseTexture: false });

            this.displayMainMenuGame();
        });

        // add there text to game over back ground and set position for it
        overBg.addChild(textGameOver, textYourScore, btnReplay);
        textGameOver.x = 180;
        textGameOver.y = 80;

        textYourScore.x = 180;
        textYourScore.y = 110;

        btnReplay.x = 180;
        btnReplay.y = 180;

        // add bg game to game scene
        this.addChild(overBg);

        // display score at position
        const positionDisplayScore = new Point(400, 340);
        this.displayScore(positionDisplayScore);
    }

    /**
     * method for display score of player
     * @param positionDisplay position which score will be display
     */
    public displayScore(positionDisplay: Point) {

        // remove old sprite of score if have
        if (this._scoreSpriteArray) {
            this._scoreSpriteArray.forEach(sprite => {
                this.removeFromScene(sprite);
            });
        }

        // convert this score to array contain element
        const scoreArray: string[] = `${this._playerScore}`.split('').reverse();

        // create a start position
        const position = positionDisplay;

        // which each element will be convert to a sprite display number of that element
        const scoreSpriteArray: Sprite[] = scoreArray.map(score => {

            // get sprite match with number element
            const scoreSprite = new Sprite(AssetsLoader.getTexture(`score-number-${score}`));

            scoreSprite.width = 30;
            scoreSprite.height = 30;

            this.addToScene(scoreSprite);

            scoreSprite.position.set(position.x, position.y);

            position.x -= 17;

            return scoreSprite;
        });

        // add new score array sprite
        this._scoreSpriteArray = scoreSpriteArray;
    }

    public init() {
        console.log('GameScene init');

        //
        const img = new Sprite(AssetsLoader.getTexture('tank'));
        img.position.set(100, 100);

        //
        this.addChild(img);
    }

    private addToScene(displayObject: DisplayObject) {
        this.addChild(displayObject);
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

        if (this._tankController && this._bulletController && this._collisionController) {
            this._tankController.update(deltaTime);
            this._bulletController.update(deltaTime);
            this._collisionController.update();
        }
    }

    // public destroy(children) {
    //     console.log('GameScene destroy');
    // }
}