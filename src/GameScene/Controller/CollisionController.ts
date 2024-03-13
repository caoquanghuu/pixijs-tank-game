import { Point, Rectangle } from '@pixi/core';
import { BaseObject } from '../Objects/BaseObject';
import { Size } from '../type';
import Emitter, { getDistanceOfTwoPosition, getRandomArbitrary } from '../util';
import { sound } from '@pixi/sound';
import { Tank } from '../Objects/Tank';
import { Bullet } from '../Objects/Bullet';

export class CollisionController {
    private _usingObjectsList: BaseObject[] = [];
    private _tankList: Tank[];
    private _bulletList: Bullet[];
    private _environmentList: BaseObject[];
    private _rewardList: BaseObject[];
    private _bunker: BaseObject;

    constructor() {

        this._useEventEffect();
    }

    private _useEventEffect() {
        Emitter.on('return-tank-list', (tankList: Tank[]) => {
            this._tankList = tankList;
        });
        Emitter.on('return-bullet-list', (bulletList: Bullet[]) => {
            this._bulletList = bulletList;
        });
        Emitter.on('return-environment-list', (environmentList: BaseObject[]) => {
            this._environmentList = environmentList;
        });
        Emitter.on('return-reward-list', (rewardList: BaseObject[]) => {
            this._rewardList = rewardList;
        });
        Emitter.on('return-bunker', (bunker: BaseObject) => {
            this._bunker = bunker;
        });
        Emitter.on('create-random-position', (size: Size) => {

            Emitter.emit('return-random-position', this.createNewRandomPosition(size));
        });
    }

    private getUsingObjectsList() {
        const tanksList = this._tankList;
        const environmentsList = this._environmentList;
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

        let isPositionAvailable = true;

        do {
            // create a test position which will be compare
            const pos1: Point = new Point(getRandomArbitrary(0, 790), getRandomArbitrary(0, 590));

            // try assign test position to rectangle
            rectangle.x = pos1.x;
            rectangle.y = pos1.y;

            // check this test rectangle is collision with other objects
            isPositionAvailable = this._usingObjectsList.some(object => {

                // use calculate distance to get random position
                const pos2 = new Point(object.rectangle.x, object.rectangle.y);
                const distance = getDistanceOfTwoPosition(pos1, pos2);

                if (distance < 70) {
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
        // const tanks = this._getTankListCall();

        Emitter.emit('get-tank-list', null);

        const tanks = this._tankList;


        // get bullets list from bullet controller
        Emitter.emit('get-bullet-list', null);

        const bullets = this._bulletList;

        // get environments list from environment controller
        Emitter.emit('get-environment-list', null);

        const environments = this._environmentList;

        // get reward list from environment controller
        Emitter.emit('get-reward-list', null);

        const rewardObjects = this._rewardList;

        // get bunker
        Emitter.emit('get-bunker', null);
        const bunker = this._bunker;

        tanks.forEach(tank => {

            // handle tank vs bullets
            bullets.forEach(bullet => {

                // check collision with tank and bullet
                if (tank.isPlayerTank != bullet.isPlayerBullet) {
                    const isCollision = this.checkCollision(tank, bullet);
                    if (isCollision) {

                        // have collision then hp of tank will reduce by 1
                        tank.HP -= 1;

                        // remove the bullet
                        Emitter.emit('remove-bullet', bullet);
                    }
                }
            });

            // handle tank vs environment and other tank
            [...environments, ...tanks].forEach(object => {

                // avoid tank is it self
                if (object === tank) return;

                // console.log('check', object instanceof Tank);

                // start check 2 object have collision or not?
                const isCollision = this.checkCollision(tank, object);

                if (isCollision) {

                    // handle move of tank
                    Emitter.emit('handle-tank-move', tank);
                }
            });

            // handle tank vs reward object
            rewardObjects.forEach(object => {
                if (!tank.isPlayerTank) return;
                const isCollision = this.checkCollision(tank, object);

                if (isCollision) {
                    Emitter.emit('remove-reward', object);

                    sound.play('collect-reward-sound');

                    if (tank.HP < 5) {
                        tank.HP += 1;
                    }
                }
            });

            // handle tank vs game border
            if (!tank.isPlayerTank) {
                if (tank.position.x === 10 || tank.position.x === 790 || tank.position.y === 10 || tank.position.y === 590) {
                    tank.moveEngine.forceChangeDirectionCall();
                }
            }
        });


        // check collision with bullet and environment
        bullets.forEach(bullet => {
            environments.forEach(environment => {
                const isCollision = this.checkCollision(bullet, environment);
                if (isCollision) {

                    // remove the bullet
                    Emitter.emit('remove-bullet', bullet);

                    // remove the environment
                    Emitter.emit('remove-environment', environment);
                }
            });

            // check collision with bullet and bunker
            const isCollision = this.checkCollision(bullet, bunker);
            if (isCollision) {
                Emitter.emit('display-game-over', null);
            }

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
        // const aBox = object1.sprite.getBounds();
        // const bBox = object2.sprite.getBounds();

        return this.checkCollisionBetweenTwoRectangle(aBox, bBox);
    }

    public update() {
        this.handleCollision();
        this.getUsingObjectsList();
    }
}