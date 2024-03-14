import { BaseObject } from '../Objects/BaseObject';
import { CreateNewRandomPositionFn } from '../type';
import { Point, Rectangle } from '@pixi/core';
import Emitter, { getRandomBoolean } from '../util';
import { AppConstants } from '../Constants';

export class EnvironmentController {

    // list of environment objects which will be create on map
    private _environmentObjects: BaseObject[] = [];
    private _rewardObjects: BaseObject[] = [];
    private _bunker: BaseObject;
    private _createNewRandomPositionCall: CreateNewRandomPositionFn;

    constructor(createNewRandomPositionCallBack: CreateNewRandomPositionFn) {

        this._createNewRandomPositionCall = createNewRandomPositionCallBack;

        // create a bunker
        this._bunker = new BaseObject('base-bunker');
        const position = new Point(400, 580);
        this._bunker.position = position;
        this._bunker.setImageSize(AppConstants.bunkerSpriteSize);
        Emitter.emit('add-to-scene', this._bunker.sprite);
        this._bunker.size = AppConstants.bunkerSpriteSize;

        // create tree around bunker
        const pos1 = new Point(370, 590);
        const pos2 = new Point(430, 590);
        const pos3 = new Point(381, 550);
        for (let i = 0; i < 6; i++) {
            this.createEnvironmentObject('tree-1', pos1);
            this.createEnvironmentObject('tree-1', pos2);
            this.createEnvironmentObject('tree-1', pos3);
            pos1.y -= AppConstants.spaceBetweenFences;
            pos2.y -= AppConstants.spaceBetweenFences;
            pos3.x += AppConstants.spaceBetweenFences;
        }

        // create environment object with define from begin*/
        for (let i = 0; i < AppConstants.numbersOfEnvironmentObjects; i++) {
            this.createEnvironmentObject('tree-1');
            this.createEnvironmentObject('tree-2');
            this.createEnvironmentObject('rock');
        }
    }

    get rewardObjects(): BaseObject[] {
        return this._rewardObjects;
    }

    // method for collision controller can access to get position of environment objects*/
    get environmentObjects(): BaseObject[] {
        return this._environmentObjects;
    }

    get bunker(): BaseObject {
        return this._bunker;
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     * @param position set position for object if require
     */
    private createEnvironmentObject(name: string, position?: Point) {

        // use name to get image from asset
        const object = new BaseObject(name);

        // add sprite to game scene
        Emitter.emit('add-to-scene', object.sprite);

        // set size */
        object.setImageSize(AppConstants.environmentSpriteSize);

        // set size property
        object.size = AppConstants.environmentSpriteSize;

        // set position if para is define
        if (!position) {
            // create a rectangle and check that position is available */
            object.rectangle = this._createNewRandomPositionCall(object.size);

            // create new position based on rectangle
            const newPosition = new Point(object.rectangle.x, object.rectangle.y);

            // set position for object
            object.position = newPosition;
        } else {
            object.position = position;
            const rectangle = new Rectangle(position.x, position.y);
            object.rectangle = rectangle;
        }

        // push it to this.environmentObject array
        this._environmentObjects.push(object);
    }

    private createRewardRandomly(position: Point) {

        // get a random number
        const randomBoolean = getRandomBoolean(10);

        // if random number === 1
        if (randomBoolean) {

            // create new object is hp bag
            const rewardObject = new BaseObject('medical-bag');

            // set position of it where it be call
            rewardObject.position = position;

            // set size
            rewardObject.setImageSize(AppConstants.rewardSpriteSize);

            rewardObject.size = AppConstants.rewardSpriteSize;

            // add hp bag to game scene
            Emitter.emit('add-to-scene', rewardObject.sprite);

            // push mid hp bag to list
            this._rewardObjects.push(rewardObject);
        }
    }

    public removeEnvironmentObject(environment: BaseObject) {

        this.removeObject(environment, this._environmentObjects);

        const position: Point = environment.position;

        // create reward randomly
        this.createRewardRandomly(position);
    }

    public removeObject(object: BaseObject, objectList: BaseObject[]) {
        Emitter.emit('remove-from-scene', object.sprite);

        const p = objectList.findIndex(objects => objects === object);
        objectList.splice(p, 1);
    }
}