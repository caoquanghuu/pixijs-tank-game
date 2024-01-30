import { BaseObject } from '../Objects/BaseObject';
import { AddToSceneFn, CreateNewRandomPositionFn, RemoveFromSceneFn } from '../type';
import { Point } from '@pixi/core';
import { getRandomArbitrary } from '../util';

export class EnvironmentController {

    // list of environment objects which will be create on map
    private _environmentObjects: BaseObject[] = [];
    private _rewardObjects: BaseObject[] = [];
    private _addToSceneCall: AddToSceneFn;
    private _createNewRandomPositionCall: CreateNewRandomPositionFn;
    private _removeFromSceneCall: RemoveFromSceneFn;

    constructor(addToSceneCallBack: AddToSceneFn, createNewRandomPositionCallBack: CreateNewRandomPositionFn, removeFromSceneCallBack: RemoveFromSceneFn) {

        this._addToSceneCall = addToSceneCallBack;
        this._removeFromSceneCall = removeFromSceneCallBack;
        this._createNewRandomPositionCall = createNewRandomPositionCallBack;

        //create environment object with define from begin*/
        for (let i = 0; i < 30; i++) {
            this.createEnvironmentObject('tree-1');
            this.createEnvironmentObject('tree-2');
            this.createEnvironmentObject('rock');
        }
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     */
    private createEnvironmentObject(name: string) {

        // use name to get image from asset
        const object = new BaseObject(name);

        // add sprite to game scene
        this._addToSceneCall(object.sprite);

        // set size */
        object.sprite.width = 15;
        object.sprite.height = 15;

        // set size property
        object.size = { w: 15, h: 15 };

        // create a rectangle and check that position is available */
        object.rectangle = this._createNewRandomPositionCall(object.size);

        // create new position based on rectangle
        const position = new Point(object.rectangle.x, object.rectangle.y);

        // set position for object
        object.position = position;

        // push it to this.environmentObject array
        this._environmentObjects.push(object);
    }

    private createRewardRandomly(position: Point) {

        // get a random number
        const randomNumber = getRandomArbitrary(1, 5);

        // if random number === 1
        if (randomNumber === 1) {

            // create new object is hp bag
            const rewardObject = new BaseObject('hp-bag');

            // set position of it where it be call
            rewardObject.position = position;

            // add hp bag to game scene
            this._addToSceneCall(rewardObject.sprite);

            // push mid hp bag to list
            this._rewardObjects.push(rewardObject);
        }
    }

    public removeEnvironmentObject(environment: BaseObject) {

        this._removeFromSceneCall(environment.sprite);

        const p = this._environmentObjects.findIndex(environments => environment === environments);
        this._environmentObjects.splice(p, 1);
    }

    get rewardObjects(): BaseObject[] {
        return this._rewardObjects;
    }

    // method for collision controller can access to get position of environment objects*/
    get environmentObjects(): BaseObject[] {
        return this._environmentObjects;
    }

}