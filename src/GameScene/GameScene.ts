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

        this.mainMenuGame();
        // this.gameOver();
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

    public setNewScore(newScore: number) {
        this._playerScore += newScore;

        // call display score on changed score
        const positionDisplayScore = new Point(700, 10);
        this.displayScore(positionDisplayScore);
    }

    public mainMenuGame() {
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

    public startPlayGame() {
        const bg = new Sprite(AssetsLoader.getTexture('game-back-ground'));
        this.addChild(bg);
        bg.width = 800;
        bg.height = 600;

        const positionDisplayScore = new Point(760, 10);
        this.displayScore(positionDisplayScore);
        // constructor controller
        this._collisionController = new CollisionController(this.getTankList.bind(this), this.getBulletList.bind(this), this.getEnvironmentList.bind(this), this.removeBulletCall.bind(this), this.handleTankMoveCall.bind(this));

        this._bulletController = new BulletController(this.addToScene.bind(this), this.removeFromScene.bind(this));

        this._tankController = new TankController(this.addToScene.bind(this), this.removeFromScene.bind(this), this.createBulletCall.bind(this), this.createNewRandomPositionCall.bind(this), this.setNewScore.bind(this), this.gameOver.bind(this));

        this._environmentController = new EnvironmentController(this.addToScene.bind(this), this.createNewRandomPositionCall.bind(this));
    }

    public gameOver() {
        // create a bg for display option when end game

        // game over back ground
        const overBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        overBg.width = 800;
        overBg.height = 600;

        // button to display play again option

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


        // add there text to game over back ground and set position for it
        overBg.addChild(textGameOver, textYourScore);
        textGameOver.x = 180;
        textGameOver.y = 80;

        textYourScore.x = 180;
        textYourScore.y = 110;

        // add bg game to game scene
        this.addChild(overBg);

        // display score at position
        const positionDisplayScore = new Point(400, 340);
        this.displayScore(positionDisplayScore);
    }

    public displayScore(positionDisplay: Point) {
        // convert this score to array contain element
        const scoreArray: string[] = String(this._playerScore).split('').map((numberToString) => {
            return numberToString;
        });

        // which each element will be convert to a sprite display number of that element
        const scoreSpriteArray: Sprite[] = scoreArray.map(score => {

            // get sprite match with number element
            const scoreSprite = new Sprite(AssetsLoader.getTexture('score-number-' + score));

            scoreSprite.width = 30;
            scoreSprite.height = 30;

            return scoreSprite;
        });

        // create a start position
        // const position = new Point(770, 10);
        const position = positionDisplay;

        // remove old sprite of score if have
        if (this._scoreSpriteArray) {
            this._scoreSpriteArray.forEach(sprite => {
                this.removeFromScene(sprite);
            });
        }

        // loop from end to start there sprites and render it to game scene with the position of last element is top right of game scene
        // and the next sprites will be place left of last sprite
        for (let i = scoreSpriteArray.length; i > 0 ; i--) {

            // the last of number will have start position
            scoreSpriteArray[i - 1].position.set(position.x, position.y);

            // add this sprite to game scene
            this.addToScene(scoreSpriteArray[i - 1]);

            // next left score number will have a new position
            position.x -= 17;
        }

        // add new score array sprite
        this._scoreSpriteArray = scoreSpriteArray;
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

    public destroy() {
        console.log('GameScene destroy');
    }
}