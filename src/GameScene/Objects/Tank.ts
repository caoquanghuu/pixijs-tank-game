// Tank class
import { Point } from '@pixi/core';
import { RandomEngine } from '../Engine/RandomEngine';
import { BaseObject } from './BaseObject';
import { AddToSceneFn, Direction, FireBulletFn, TankDieFn } from '../type';
import { ControlEngine } from '../Engine/ControlEngine';
import { getRandomArbitrary, keyboard } from '../util';
import { HP } from './HP';

export class Tank extends BaseObject {

    // this tank is player or bot
    private _isPlayerTank: boolean;

    // hp of this tank
    private _HPBar: HP;
    private _fireBulletCallBack: FireBulletFn;
    private _tankDieCall: TankDieFn;
    private _fireBulletTime: number;

    constructor(isPlayer: boolean, fireBulletCallBack: FireBulletFn, tankDieCallBack: TankDieFn, addToSceneCallBack: AddToSceneFn) {

        // set image of tank is player tank or bot tank
        super('tank-stand-up');
        this._fireBulletCallBack = fireBulletCallBack;
        this._tankDieCall = tankDieCallBack;

        // set speed of tank
        this.speed = 100;

        // set size of tank
        this.size = { w: 20, h: 20 };

        this._isPlayerTank = isPlayer;

        this._HPBar = new HP(isPlayer, addToSceneCallBack.bind(this));

        // set move engine and type trigger fire bullet for tank base on is player or not
        if (isPlayer) {

            //set control move
            this.moveEngine = new ControlEngine();

            // set hp
            this._HPBar.HP = 5;

            // set control fire
            const fire = keyboard(' ');
            fire.press = () => {
                this.fire(this.position, this.lastDirection, true);
            };
        } else {

            // set random move
            this.moveEngine = new RandomEngine();

            //set hp
            this._HPBar.HP = 1;

            //change color for bot tank
            this.sprite.tint = 'F02468';

            // set time for fire bullet
            this._fireBulletTime = 5000;
        }
    }

    /**
     * tank start to fire bullet
     */
    public fire(position: Point, direction: Direction, isPlayer: boolean) {

        // call fire bullet to tank controller
        this._fireBulletCallBack(position, direction, isPlayer);
    }

    /**
     *  tank hp reduce to 0 and tank will be destroy
     */
    public destroy() {
        if (this.HPBar.HP === 0) {
            // call tank die to tank controller
            this._tankDieCall(this);
        }
    }
    /**
     * change texture and size of tank when direction of tank change
     * @param direction new direction changed
     */
    private changeTextureFollowDirection(direction: Direction) {

        // when tank moving:
        switch (direction) {
            case Direction.UP: {
                this.sprite = 'tank-move-up';
                break;
            }
            case Direction.DOWN: {
                this.sprite = 'tank-move-down';
                break;
            }
            case Direction.RIGHT: {
                this.sprite = 'tank-move-right';
                break;
            }
            case Direction.LEFT: {
                this.sprite = 'tank-move-left';
                break;
            }
        }

        // when tank stop move:
        if (direction === Direction.STAND) {
            switch (this.lastDirection) {
                case Direction.UP: {
                    this.sprite = 'tank-stand-up';
                    break;
                }
                case Direction.DOWN: {
                    this.sprite = 'tank-stand-down';
                    break;
                }
                case Direction.LEFT: {
                    this.sprite = 'tank-stand-left';
                    break;
                }
                case Direction.RIGHT: {
                    this.sprite = 'tank-stand-right';
                    break;
                }
            }
        }
    }

    /**
     * Update tank
     * @param dt delta time from ticker
     */
    update(dt: number): void {

        // move
        this.move(dt, false);

        // check hp tank and destroy it if hp = 0
        this.destroy();

        // update new direction for random move
        this.moveEngine.update(dt);

        // update this HP
        this._HPBar.update(this.position);

        // change texture when direction of tank change
        this.changeTextureFollowDirection(this.moveEngine.direction);

        // set fire bullet call for bot tank
        if (!this._isPlayerTank) {
            this._fireBulletTime -= dt;
            if (this._fireBulletTime <= 0) {
                this.fire(this.position, this.lastDirection, false);
                this._fireBulletTime = getRandomArbitrary(3000, 5000);
            }
        }
    }

    get HPBar() {
        return this._HPBar;
    }

    get isPlayerTank(): boolean {
        return this._isPlayerTank;
    }
}