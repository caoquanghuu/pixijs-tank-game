// Tank class
import { BaseEngine } from "../Engine/BaseEngine";
import { BaseObject } from "./BaseObject";

export class Tank extends BaseObject {
    /**this tank is player or bot */
    private _isPlayerTank: boolean;
    /**hp of this tank */
    private _HP: number;

    constructor(isPlayer: boolean) {
        /**set image of tank is player tank or bot tank*/
        super(isPlayer ? 'tank' : 'tank');

        /**set hp of tank */
        isPlayer ? this._HP = 5 : this._HP = 1;

        /** set speed of tank*/
        this.speed = 100;

        /** set move engine for tank */
        this.moveEngine = new BaseEngine (isPlayer);

        /**set move engine and type trigger fire bullet for tank base on is player or not*/
        if(isPlayer) {
            /**add event listener to fire */
        } else {
            /** set random fire */
        }

    }

    /**
     * tank start to fire bullet
     */
    public fire() {
        // fire bullet
        // call fire bullet from controller

        // this._fireCallback?.(this.position, this.direction);
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

    private _fireCallback: (position, direction) => void = null;

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
}