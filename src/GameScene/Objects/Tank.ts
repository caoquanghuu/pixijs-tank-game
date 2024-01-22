// Tank class
import { Point } from "@pixi/core";
import { RandomEngine } from "../Engine/RandomEngine";
import { BaseObject } from "./BaseObject";
import { Direction, FireBullet } from "../type";
import { ControlEngine } from "../Engine/ControlEngine";
import { keyboard } from "../util";

export class Tank extends BaseObject {
    /**this tank is player or bot */
    readonly _isPlayerTank: boolean;
    /**hp of this tank */
    private _HP: number;
    private _fireBulletCallBack: FireBullet;

    constructor(isPlayer: boolean, fireBulletCallBack: FireBullet) {
        /**set image of tank is player tank or bot tank*/
        super('tank-up');
        this._fireBulletCallBack = fireBulletCallBack;
        /** set speed of tank*/
        this.speed = 100;

        /**set move engine and type trigger fire bullet for tank base on is player or not*/
        if (isPlayer) {
            /**add event listener to fire */
            //set control move
            this.moveEngine = new ControlEngine();
            // set hp
            this.HP = 5;
            //control fire
            const fire = keyboard(' ');
            fire.press = () => {
                this.fire(this.sprite.position, this.lastDirection, true);
            };
        } else {
            // set random move
            this.moveEngine = new RandomEngine();
            //set hp
            this.HP = 1;
            //change color for bot tank
            this.sprite.tint = 'F02468';
            /** set random fire */
            setInterval(() => { this.fire(this.sprite.position, this.lastDirection, false); }, 5000);
        }

    }

    /**
     * tank start to fire bullet
     */
    public fire(position: Point, direction: Direction, isPlayer: boolean) {

        this._fireBulletCallBack(position, direction, isPlayer);
        // fire bullet
        // call fire bullet from controller
        // this._fireBulletCallBack(this.sprite.position, this.lastDirection)
        // this._fireCallback?.(this.sprite.position, this.moveEngine.direction);
    }

    /**
     * tank has been hit by the bullet
     */
    public onHit() {
        //reduce HP
        this._HP -= 1;
    }

    /**
     *  tank hp reduce to 0 and tank will be destroy
     */
    public destroy() {
        //check hp if it is 0
        if (this._HP === 0) {
            // call tank die to tank controller
        }
    }

    private changeTextureFollowDirection(direction: Direction) {
        switch (direction) {
            case Direction.UP: {
                this.sprite = 'tank-up';
                break;
            }
            case Direction.DOWN: {
                this.sprite = 'tank-down';
                break;
            }
            case Direction.RIGHT: {
                this.sprite = 'tank-right';
                break;
            }
            case Direction.LEFT: {
                this.sprite = 'tank-left';
                break;
            }
        }
    }

    // private _fireCallback: (position, direction) => void = null;

    /**
     * Update tank
     * @param dt delta time from ticker
     */
    update(dt: number):void {
        // move
        this.move(dt, false);
        //update new direction for random move
        this.moveEngine.update(dt);
        // destroy
        this.destroy();
        this.changeTextureFollowDirection(this.moveEngine.direction);
    }

    set HP(newHp: number) {
        this._HP = newHp;
    }
}