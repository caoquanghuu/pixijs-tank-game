// Tank class
import { Point } from "@pixi/core";
import { BaseEngine } from "../Engine/BaseEngine";
import { RandomEngine } from "../Engine/RandomEngine";
import { BaseObject } from "./BaseObject";
import { Direction } from "../type";
import { TankController } from "../Controller/TankController";
import { methodOf } from "lodash";

export class Tank extends BaseObject {
    /**this tank is player or bot */
    readonly _isPlayerTank: boolean;
    /**hp of this tank */
    private _HP: number;
    private _fireBulletCallBack: Function;

    constructor(isPlayer: boolean, fireBulletCallBack: Function) {
        /**set image of tank is player tank or bot tank*/
        super('tank');

        this._fireBulletCallBack = fireBulletCallBack;
        /**set hp of tank */
        isPlayer ? this._HP = 5 : this._HP = 1;

        /** set speed of tank*/
        this.speed = 100;

        /** set random move engine for tank */
        this.moveEngine = new RandomEngine();

        /**set move engine and type trigger fire bullet for tank base on is player or not*/
        if(isPlayer) {
            /**add event listener to fire */
        } else {
            /** set random fire */
            this.fire(this.sprite.position, this.lastDirection, this._isPlayerTank);
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

    // private _fireCallback: (position, direction) => void = null;

    /**
     * Update tank
     * @param dt delta time from ticker
     */
    update(dt: number):void {
        // move
        this.move(dt, false);

        // destroy
        this.destroy();
    }

    set HP(newHp: number) {
        this._HP = newHp;
    }
}