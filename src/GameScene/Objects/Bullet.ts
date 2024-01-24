import { extend } from "lodash";
import { BaseObject } from "./BaseObject";
import { BaseEngine } from "../Engine/BaseEngine";

export class Bullet extends BaseObject {
    /** property define this bullet belong to player or bot tank */
    private _isPlayerBullet: boolean;

    /**
     * create a bullet object with image and speed and move engine
     * @param isPlayer is this bullet is belong to player tank
     */
    constructor(isPlayer: boolean) {
        /**set id is bullet to get image of bullet */
        super('bullet');

        /**set speed of bullet */
        this.speed = 200;

        /** set move engine for bullet */
        this.moveEngine = new BaseEngine();

        /** set property for this bullet */
        this._isPlayerBullet = isPlayer;
    }

    update(dt: number) {
        /**bullet move */
        this.move(dt, true);
    }

    get isPlayerBullet(): boolean {
        return this._isPlayerBullet;
    }
}