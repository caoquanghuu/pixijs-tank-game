import { BaseObject } from '../Objects/BaseObject';
import { CreateNewRandomPositionFn } from '../type';
import { IPointData } from '../../pixi';
import { Bunker, Environment, Reward, getRandomBoolean } from '../util';
import { AppConstants } from '../Constants';
import { EnvironmentPool } from '../ObjectPool/EnvironmentPool';

export class EnvironmentController {
    private _environmentPool: EnvironmentPool;

    // list of environment objects which will be create on map
    private _usingEnvironmentObjects: Environment[] = [];
    private _rewardObjects: Reward[] = [];
    private _bunker: Bunker;
    private _createNewRandomPositionCall: CreateNewRandomPositionFn;

    constructor(createNewRandomPositionCallBack: CreateNewRandomPositionFn) {

        this._createNewRandomPositionCall = createNewRandomPositionCallBack;

        this._environmentPool = new EnvironmentPool();

        this._bunker = new Bunker('base-bunker');
        this._bunker.setImageSize(AppConstants.bunkerSpriteSize);
        this._bunker.size = AppConstants.bunkerSpriteSize;
    }

    get rewardObjects(): Reward[] {
        return this._rewardObjects;
    }

    // method for collision controller can access to get position of environment objects*/
    get environmentObjects(): Environment[] {
        return this._usingEnvironmentObjects;
    }

    get bunker(): Bunker {
        return this._bunker;
    }

    public init() {
        const position: IPointData = { x: 400, y: 580 };
        this._bunker.position = position;
        this.bunker.show();

        // create tree around bunker
        const pos1: IPointData = { x: 370, y: 600 };
        const pos2: IPointData = { x: 430, y: 600 };
        const pos3: IPointData = { x: 381, y: 560 };
        for (let i = 0; i < 6; i++) {
            const object1 = this._environmentPool.releaseObject();
            const object2 = this._environmentPool.releaseObject();
            const object3 = this._environmentPool.releaseObject();
            object1.position = pos1;
            object2.position = pos2;
            object3.position = pos3;
            pos1.y -= AppConstants.spaceBetweenFences;
            pos2.y -= AppConstants.spaceBetweenFences;
            pos3.x += AppConstants.spaceBetweenFences;
            this._usingEnvironmentObjects.push(object1);
            this._usingEnvironmentObjects.push(object2);
            this._usingEnvironmentObjects.push(object3);
            object1.show();
            object2.show();
            object3.show();
        }

        for (let i = 0; i < AppConstants.numbersOfEnvironmentObjects * 2; i ++) {
            const object = this._environmentPool.releaseObject();
            object.show();
            const rectangle = this._createNewRandomPositionCall(object.size);
            object.rectangle = rectangle;
            const position: IPointData = { x: rectangle.x, y: rectangle.y };
            object.position = position;
            this._usingEnvironmentObjects.push(object);
        }

    }

    public reset() {

        this._usingEnvironmentObjects.forEach(object => {
            object.remove();
            this._environmentPool.getObject(object);
        });

        this._rewardObjects.forEach(rewardObject => {
            rewardObject.remove();
        });

        this._bunker.remove();

        this._usingEnvironmentObjects = [];
        this._rewardObjects = [];
    }


    private _createRewardRandomly(position: IPointData): void {

        // get a random number
        const randomBoolean = getRandomBoolean(10);

        // if random number === 1
        if (randomBoolean) {

            // create new object is hp bag
            const rewardObject = new Reward('medical-bag');

            // set position of it where it be call
            rewardObject.position = position;

            // set size
            rewardObject.setImageSize(AppConstants.rewardSpriteSize);

            rewardObject.size = AppConstants.rewardSpriteSize;

            // add hp bag to game scene
            rewardObject.show();

            // push mid hp bag to list
            this._rewardObjects.push(rewardObject);
        }
    }

    public removeEnvironmentObject(environment: BaseObject): void {

        this._environmentPool.getObject(environment);

        this.removeObject(environment, this._usingEnvironmentObjects);

        const position: IPointData = environment.position;

        // create reward randomly
        this._createRewardRandomly(position);
    }

    public removeObject(object: BaseObject, objectList: BaseObject[]): void {
        object.remove();

        const p = objectList.findIndex(objects => objects === object);
        objectList.splice(p, 1);
    }
}