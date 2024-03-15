import { IPointData, Rectangle } from '../../pixi';
import { BaseObject } from '../Objects/BaseObject';
import { GetBulletListFn, GetBunkerFn, GetObjectListFn, GetRewardObjectsFn, GetTankListFn, HandleTankMoveFn, RemoveBulletFn, RemoveEnvironmentFn, RemoveRewardObjectFn, Size } from '../type';
import Emitter, { checkCollision, getDistanceOfTwoPosition, getRandomArbitrary } from '../util';
import { sound } from '@pixi/sound';
import { AppConstants } from '../Constants';

export class CollisionController {
    private _getTankListCall: GetTankListFn;
    private _getBulletListCall: GetBulletListFn;
    private _getEnvironmentListCall: GetObjectListFn;
    private _getRewardListCall: GetRewardObjectsFn;
    private _getBunker: GetBunkerFn;
    private _removeBulletCall: RemoveBulletFn;
    private _handleTankMoveCall: HandleTankMoveFn;
    private _removeEnvironmentCall: RemoveEnvironmentFn;
    private _removeRewardObjectCall: RemoveRewardObjectFn;
    private _usingObjectsList: BaseObject[] = [];

    constructor({ getTankListCallBack,
        getBulletListCallBack,
        getEnvironmentListCallBack,
        removeBulletCallBack,
        handleTankMoveCallBack,
        removeEnvironmentCallBack,
        removeRewardObjectCallBack,
        getRewardListCallBack,
        getBunkerCallBack
    }: {
        getTankListCallBack: GetTankListFn,
        getBulletListCallBack: GetBulletListFn,
        getEnvironmentListCallBack: GetObjectListFn,
        removeBulletCallBack: RemoveBulletFn,
        handleTankMoveCallBack: HandleTankMoveFn,
        removeEnvironmentCallBack: RemoveEnvironmentFn,
        removeRewardObjectCallBack: RemoveRewardObjectFn,
        getRewardListCallBack: GetRewardObjectsFn,
        getBunkerCallBack: GetBunkerFn
    }) {

        this._getTankListCall = getTankListCallBack;
        this._getBulletListCall = getBulletListCallBack;
        this._getEnvironmentListCall = getEnvironmentListCallBack;
        this._getRewardListCall = getRewardListCallBack;
        this._getBunker = getBunkerCallBack;
        this._removeBulletCall = removeBulletCallBack;
        this._handleTankMoveCall = handleTankMoveCallBack;
        this._removeEnvironmentCall = removeEnvironmentCallBack;
        this._removeRewardObjectCall = removeRewardObjectCallBack;

    }

    private getUsingObjectsList() {
        const tanksList = this._getTankListCall();
        const environmentsList = this._getEnvironmentListCall();
        this._usingObjectsList = environmentsList.concat(tanksList);
    }

    /**
     * method to return a new rectangle which have no collision with other objects on map
     * @param size size of object want to get rectangle
     * @returns return rectangle calculated base on size
     */
    public createNewRandomPosition(size: Size): Rectangle {

        // create a new rectangle
        const rectangle = new Rectangle(null, null, size.w, size.h);

        let isPositionAvailable = true;

        do {
            // create a test position which will be compare
            const pos1: IPointData = { x: getRandomArbitrary(AppConstants.minScreenUseAbleWidth, AppConstants.maxScreenUseAbleWidth), y: getRandomArbitrary(AppConstants.minScreenUseAbleHeight, AppConstants.maxScreenUseAbleHeight) };

            // try assign test position to rectangle
            rectangle.x = pos1.x;
            rectangle.y = pos1.y;

            // check this test rectangle is collision with other objects
            isPositionAvailable = this._usingObjectsList.some(object => {

                // use calculate distance to get random position
                const pos2: IPointData = { x: object.position.x, y: object.position.y };
                const distance = getDistanceOfTwoPosition(pos1, pos2);

                if (distance < AppConstants.distanceOfObjectsWhenCreate) {
                    return false;
                }

                // use collision to get random position
                // const isCollisionWithOther = this.checkCollisionBetweenTwoRectangle(rectangle, object.rectangle);
                // if (!isCollisionWithOther) {
                //     return true;
                // }
            });

        } while (isPositionAvailable);

        // return that rectangle which will ready to use
        return rectangle;
    }

    /**
     * handle collision between objects.
     */
    private handleCollision() {
        // get using tanks list from tank controller
        const tanks = this._getTankListCall();

        // get bullets list from bullet controller
        const bullets = this._getBulletListCall();

        // get environments list from environment controller
        const environments = this._getEnvironmentListCall();

        // get reward list from environment controller
        const rewardObjects = this._getRewardListCall();

        // get bunker
        const bunker = this._getBunker();

        tanks.forEach(tank => {

            // handle tank vs bullets
            bullets.forEach(bullet => {

                // check collision with tank and bullet
                if (tank.isPlayerTank != bullet.isPlayerBullet) {
                    const isCollision = checkCollision(tank, bullet);
                    if (isCollision) {

                        // have collision then hp of tank will reduce by 1
                        tank.HP -= 1;

                        // remove the bullet
                        this._removeBulletCall(bullet);
                    }
                }
            });

            // handle tank vs environment and other tank
            [...environments, ...tanks].forEach(object => {

                // avoid tank is it self
                if (object === tank) return;

                // console.log('check', object instanceof Tank);

                // start check 2 object have collision or not?
                const isCollision = checkCollision(tank, object);

                if (isCollision) {

                    // handle move of tank
                    this._handleTankMoveCall(tank);
                }
            });

            // handle tank vs reward object
            rewardObjects.forEach(object => {
                if (!tank.isPlayerTank) return;
                const isCollision = checkCollision(tank, object);

                if (isCollision) {
                    this._removeRewardObjectCall(object);

                    sound.play('collect-reward-sound');

                    if (tank.HP < AppConstants.maxHpOfPlayerTank) {
                        tank.HP += 1;
                    }
                }
            });

            // handle tank vs game border
            if (!tank.isPlayerTank) {
                if (tank.position.x === AppConstants.minScreenUseAbleWidth || tank.position.x === AppConstants.maxScreenUseAbleWidth || tank.position.y === AppConstants.minScreenUseAbleHeight || tank.position.y === AppConstants.maxScreenUseAbleHeight) {
                    tank.moveEngine.forceChangeDirectionCall();
                }
            }
        });


        // check collision with bullet and environment
        bullets.forEach(bullet => {
            environments.forEach(environment => {
                const isCollision = checkCollision(bullet, environment);
                if (isCollision) {

                    // remove the bullet
                    this._removeBulletCall(bullet);

                    // remove the environment
                    this._removeEnvironmentCall(environment);
                }
            });

            // check collision with bullet and bunker
            const isCollision = checkCollision(bullet, bunker);
            if (isCollision) {
                Emitter.emit(AppConstants.displayGameOverEvent, null);
            }

        });
    }

    public update() {
        this.handleCollision();
        this.getUsingObjectsList();
    }
}