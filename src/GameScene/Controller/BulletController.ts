import { Point } from "@pixi/core";
import { Bullet } from "../Objects/Bullet"
import { AddToScene, Direction, RemoveFromScene} from "../type";
import { BaseEngine } from "../Engine/BaseEngine";

export class BulletController {
    // bullets which display on game sense
    private _bullets: Bullet [] = [];
    private _addBulletToSceneCallBack: AddToScene;
    private _removeBulletFromSceneCallback: RemoveFromScene;

    constructor(addBulletToSceneCallBack: AddToScene, removeBulletFromSceneCallBack: RemoveFromScene) {
        this._addBulletToSceneCallBack = addBulletToSceneCallBack;
        this._removeBulletFromSceneCallback = removeBulletFromSceneCallBack;
    }

    get bullets(): Bullet[] {
        return this._bullets;
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
        this._bullets.push(bullet);

        // set position and direction for this bullet
        bullet.sprite.position = tankPosition;
        bullet.moveEngine = new BaseEngine;
        bullet.moveEngine.direction = tankDirection;
        //rotate sprite of bullet
        this.rotateSpriteFollowDirection(bullet);

        // append bullet to game sense
        this._addBulletToSceneCallBack(bullet.sprite);
    }

    /**
     * remove bullet when require
     * @param bullet bullet which need to remove
     */
    public removeBullet(bullet: Bullet) {
        /** remove bullet in array list*/
        const p = this._bullets.findIndex(bullets => bullets === bullet);
        this._bullets.splice(p, 1);

        /** remove bullet in game sense */
        this._removeBulletFromSceneCallback(bullet.sprite);
    }
    /**
     * rotate sprite follow direction
     * @param bullet bullet which is's sprite will be rotate
     */
    private rotateSpriteFollowDirection(bullet: Bullet) {
        switch (bullet.moveEngine.direction) {
            case Direction.UP: {
                bullet.sprite.angle = 180;
                break;
            }
            case Direction.DOWN: {
                bullet.sprite.angle = 0;
                break;
            }
            case Direction.LEFT: {
                bullet.sprite.angle = 90;
                break;
            }
            case Direction.RIGHT: {
                bullet.sprite.angle = -90;
                break;
            }
        }
    }


    /**
     * check position of bullet, if if go out of game sense then remove it
     * @param dt
     */
    public update(dt: number) {
        /**check bullet position out of map yet then: */
        this._bullets.forEach(bullet => {
            // check bullet position out of map yet?
            // if is it.
            if ((bullet.sprite.position.x === 10 || bullet.sprite.position.x === 790) || ((bullet.sprite.position.y === 10) || (bullet.sprite.position.y === 590))) {
                this.removeBullet(bullet);
            }
            bullet.update(dt);

        });
    }

}