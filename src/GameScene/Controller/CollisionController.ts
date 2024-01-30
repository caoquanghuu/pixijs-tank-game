import { Point, Rectangle } from '@pixi/core';
import { BaseObject } from '../Objects/BaseObject';
import { GetBulletListFn, GetObjectListFn, GetTankListFn, HandleTankMoveFn, RemoveBulletFn, RemoveEnvironmentFn, Size } from '../type';
import { getDistanceOfTwoPosition, getRandomArbitrary } from '../util';

export class CollisionController {
    private _getTankListCall: GetTankListFn;
    private _getBulletListCall: GetBulletListFn;
    private _getEnvironmentListCall: GetObjectListFn;
    private _removeBulletCall: RemoveBulletFn;
    private _handleTankMoveCall: HandleTankMoveFn;
    private _removeEnvironmentCall: RemoveEnvironmentFn;
    private _usingObjectsList: BaseObject[] = [];

    constructor(getTankListCallBack: GetTankListFn, getBulletListCallBack: GetBulletListFn, getEnvironmentListCallBack: GetObjectListFn,
        removeBulletCallBack: RemoveBulletFn, handleTankMoveCallBack: HandleTankMoveFn, removeEnvironmentCallBack: RemoveEnvironmentFn) {
        this._getTankListCall = getTankListCallBack;
        this._getBulletListCall = getBulletListCallBack;
        this._getEnvironmentListCall = getEnvironmentListCallBack;
        this._removeBulletCall = removeBulletCallBack;
        this._handleTankMoveCall = handleTankMoveCallBack;
        this._removeEnvironmentCall = removeEnvironmentCallBack;
    }

    private getUsingObjectsList() {
        const tanksList = this._getTankListCall();
        const environmentsList = this._getEnvironmentListCall();
        this._usingObjectsList = environmentsList.concat(tanksList);
    }

    private checkCollisionBetweenTwoRectangle(r1: Rectangle, r2: Rectangle) {

        if (r1.x + r1.width / 2 >= r2.x - r2.width / 2 &&
            r1.x - r1.width / 2 <= r2.x + r2.width / 2 &&
            r1.y + r1.height / 2 >= r2.y - r2.height / 2 &&
            r1.y - r1.height / 2 <= r2.y + r2.height / 2) {
            return true;
        }
        return false;
    }

    /**
     * method to return a new rectangle which have no collision with other objects on map
     * @param size size of object want to get rectangle
     * @returns return rectangle calculated base on size
     */
    public createNewRandomPosition(size: Size): Rectangle {

        // create a new rectangle
        const rectangle = new Rectangle(null, null, size.w, size.h);

        // ulimit loop until can get rectangle which have no collision with other objects
        for (let i = 0; i < 999; i++) {

            // create a test position which will be compare
            const pos1: Point = new Point(getRandomArbitrary(0, 790), getRandomArbitrary(0, 590));

            //try assign test position to rectangle
            rectangle.x = pos1.x;
            rectangle.y = pos1.y;

            // check this test rectangle is collision with other objects
            const isPositionAvailable = this._usingObjectsList.some(object => {

                // use calculate distance to get random position
                const pos2 = new Point(object.rectangle.x, object.rectangle.y);
                const distance = getDistanceOfTwoPosition(pos1, pos2);
                if (distance > 100) {
                    return true;
                }

                // use collision to get random position
                // const isCollisionWithOther = this.checkCollisionBetweenTwoRectangle(rectangle, object.rectangle);
                // if (!isCollisionWithOther) {
                //     return true;
                // }
            });

            // if this rectangle is available to use then break out of loop
            if (isPositionAvailable) {
                break;
            }
        }

        // return that rectangle which will ready to use
        return rectangle;
    }

    /**
     * handle collision between objects.
     */
    private handleCollision() {
        // get using tanks list from tank controller
        const tanks = this._getTankListCall();

        // copy tanks list use for compare collision between tanks
        const tanksClone = tanks;

        // get bullets list from bullet controller
        const bullets = this._getBulletListCall();

        // get environments list from environment controller
        const environments = this._getEnvironmentListCall();

        tanks.forEach(tank => {

            // handle tank vs bullets
            bullets.forEach(bullet => {

                // check collision with tank and bullet
                if (tank.isPlayerTank != bullet.isPlayerBullet) {
                    const isCollision = this.checkCollision(tank, bullet);
                    if (isCollision) {
                        tank.HPBar.HP -= 1;
                        this._removeBulletCall(bullet);
                    }
                }
            });

            // handle tank vs environment and other tank
            [...environments, ...tanksClone].forEach(object => {

                // avoid tank is it self
                if (object === tank) return;

                // start check 2 object have collision or not?
                const isCollision = this.checkCollision(tank, object);

                if (isCollision) {

                    // handle move of tank
                    this._handleTankMoveCall(tank);
                }
            });
        });


        // check collision with bullet and environment
        bullets.forEach(bullet => {
            environments.forEach(environment => {
                const isCollision = this.checkCollision(bullet, environment);
                if (isCollision) {
                    this._removeBulletCall(bullet);
                    this._removeEnvironmentCall(environment);
                }
            });
        });
    }

    /**
     * check collision of 2 object
     * @param object1 object list 1
     * @param object2 object list 2
     */
    private checkCollision(object1: BaseObject, object2: BaseObject) {

        const aBox = new Rectangle(object1.sprite.x, object1.sprite.y, object1.size.w, object1.size.h);
        const bBox = new Rectangle(object2.sprite.x, object2.sprite.y, object2.size.w, object2.size.h);

        return this.checkCollisionBetweenTwoRectangle(aBox, bBox);
    }

    public update() {
        this.handleCollision();
        this.getUsingObjectsList();
    }
}