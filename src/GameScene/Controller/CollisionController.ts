import { Point } from "@pixi/core";
import { BaseObject } from "../Objects/BaseObject";
import { GetBulletList, GetObjectList, GetTankList, RemoveBullet } from "../type";
import { getDistanceOfTwoPosition } from "../util";
import { Sprite } from "@pixi/sprite";

export class CollisionController {
    /**position of tanks which be using on map */
    private _tanksPosition: Point[] = [];
    /**position of bullet which displaying on map */
    private _bulletsPosition: Point[] = [];
    /**position of environment displaying on map */
    private _environmentsPosition: Point [] = [];

    private _getTankListCall: GetTankList;
    private _getBulletListCall: GetBulletList;
    private _getEnvironmentListCall: GetObjectList;
    private _removeBulletCall: RemoveBullet;

    constructor(getTankListCallBack: GetTankList, getBulletListCallBack: GetBulletList, getEnvironmentListCallBack: GetObjectList, removeBulletCallBack: RemoveBullet) {
        this._getTankListCall = getTankListCallBack;
        this._getBulletListCall = getBulletListCallBack;
        this._getEnvironmentListCall = getEnvironmentListCallBack;
        this._removeBulletCall = removeBulletCallBack;
    }

    /**
     * calculate distance of 2 object on map
     * @param pos1 position of object 1
     * @param pos2 position of object 2
     */
    private getDistanceOfTwoObject(pos1: Point, pos2: Point) {
        /**calculate distance of 2 position */

        /**return distance */
    }

    /**
     * handle collision of tank and bullet.
     */
    private handleCollision() {
        const tanks = this._getTankListCall();
        const bullets = this._getBulletListCall();
        const environments = this._getEnvironmentListCall();

        tanks.forEach(tank => {
            // handle tank vs bullets
            bullets.forEach(bullet => {
                // check collision with tank and bullet
                if (tank.isPlayerTank != bullet.isPlayerBullet) {
                    const isCollision = this.checkCollision(tank, bullet);
                    if (isCollision) {
                        tank.onHit();
                        this._removeBulletCall(bullet);
                    }
                }
                // check collision with bullet and environment
                environments.forEach(environment => {
                    const isCollision = this.checkCollision(bullet, environment);
                    if (isCollision) {
                        this._removeBulletCall(bullet);
                    }
                });
            });
            // handle tank vs environment
            environments.forEach(environment => {
                const isCollision = this.checkCollision(tank, environment);
                if (isCollision) {
                    // handle tank move
                }
            });

        });
    }

    /**
     * check collision of 2 object list
     * @param object1 object list 1
     * @param object2 object list 2
     */
    private checkCollision(object1: BaseObject, object2: BaseObject) {
        /**loop to check collision of this objects to other */

        const aBox = object1.sprite.getBounds();
        const bBox = object2.sprite.getBounds();

        return aBox.x + aBox.width > bBox.x &&
                aBox.x < bBox.x + bBox.width &&
                aBox.y + aBox.height > bBox.y &&
                aBox.y < bBox.y + bBox.height;
    }

    public update() {
        this.handleCollision();
    }
}