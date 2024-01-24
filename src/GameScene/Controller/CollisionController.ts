import { Point, Rectangle } from "@pixi/core";
import { BaseObject } from "../Objects/BaseObject";
import { GetBulletList, GetObjectList, GetTankList, HandleTankMove, RemoveBullet } from "../type";

export class CollisionController {
    private _getTankListCall: GetTankList;
    private _getBulletListCall: GetBulletList;
    private _getEnvironmentListCall: GetObjectList;
    private _removeBulletCall: RemoveBullet;
    private _handleTankMoveCall: HandleTankMove;

    constructor(getTankListCallBack: GetTankList, getBulletListCallBack: GetBulletList, getEnvironmentListCallBack: GetObjectList, removeBulletCallBack: RemoveBullet, handleTankMoveCallBack: HandleTankMove) {
        this._getTankListCall = getTankListCallBack;
        this._getBulletListCall = getBulletListCallBack;
        this._getEnvironmentListCall = getEnvironmentListCallBack;
        this._removeBulletCall = removeBulletCallBack;
        this._handleTankMoveCall = handleTankMoveCallBack;
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
        const tanksClone = tanks;
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
                    this._handleTankMoveCall(tank);
                }
            });
            // handle tank with other tank
            tanksClone.forEach(tankClone => {
                if (tankClone === tank) return;
                const isCollision = this.checkCollision(tankClone, tank);
                if (isCollision) {
                    this._handleTankMoveCall(tank);
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

        const aBox = new Rectangle(object1.sprite.x - object1.size.w / 2, object1.sprite.y - object1.size.h / 2, object1.size.w, object1.size.h);
        const bBox = new Rectangle(object2.sprite.x - object2.size.w / 2, object2.sprite.y - object2.size.h / 2, object2.size.w, object2.size.h);

        return aBox.x + aBox.width >= bBox.x &&
                aBox.x <= bBox.x + bBox.width &&
                aBox.y + aBox.height >= bBox.y &&
                aBox.y <= bBox.y + bBox.height;
    }

    public update() {
        this.handleCollision();
    }
}