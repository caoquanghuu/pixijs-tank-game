import { Point } from "@pixi/core";
import { Bullet } from "../Objects/Bullet"
import { Direction } from "../type";

export class BulletController {
    // bullets which display on game sense
    private _bullet: Bullet [] = [];
    private _spawnBulletCallBack: Function;

    constructor(spawnBulletCallBack: Function) {
        this._spawnBulletCallBack = spawnBulletCallBack;
    }
    /**
     * fire a bullet when tank require
     * @param tankPosition position of tank require fire bullet
     * @param tankDirection direction of tank require fire bullet
     * @param isPlayerBullet define is player tank require fire bullet
     */
    public createBullet(tankPosition: Point, tankDirection: Direction, isPlayerBullet: boolean) {
        // create a new bullet
        const bullet = new Bullet (isPlayerBullet);
        this._bullet.push(bullet);

        // set position and direction for this bullet
        bullet.sprite.position = tankPosition;
        bullet.moveEngine.direction = tankDirection;

        // append bullet to game sense
        this._spawnBulletCallBack(bullet);
    }

    /**
     * remove bullet when require
     * @param bullet bullet which need to remove
     */
    private removeBullet(bullet: Bullet) {
        /** remove bullet in array list*/
        const p = this._bullet.findIndex(bullets => bullets === bullet);
        this._bullet.slice(p, 1);

        /** remove bullet in game sense */
    }

    /**
     * check position of bullet, if if go out of game sense then remove it
     * @param dt
     */
    public update(dt: number) {
        /**check bullet position out of map yet then: */
        this._bullet.forEach(bullet => {
            // check bullet position out of map yet?
            // if is it.
            this.removeBullet(bullet);
        })
    }

}