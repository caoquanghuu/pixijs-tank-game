import { BaseObject } from '../Objects/BaseObject';
import { Point, Rectangle } from '@pixi/core';
import Emitter, { getRandomBoolean } from '../util';
import { AppConstants } from '../constants';

export class EnvironmentController {

    // list of environment objects which will be create on map
    private _environmentObjects: BaseObject[] = [];
    private _rewardObjects: BaseObject[] = [];
    private _bunker: BaseObject;
    private _randomRectangle: Rectangle;

    constructor() {

        this._useEventEffect();

        // create a bunker
        this._bunker = new BaseObject('base-bunker');
        this._bunker.position = AppConstants.positionOfBunker;
        this._bunker.setImageSize(AppConstants.bunkerSpriteSize);
        Emitter.emit('add-to-scene', this._bunker.sprite);
        this._bunker.size = AppConstants.bunkerSpriteSize;

        // create rock like fence around bunker
        const pos1 = AppConstants.fenceOfBunkerPosition1;
        const pos2 = AppConstants.fenceOfBunkerPosition2;
        const pos3 = AppConstants.fenceOfBunkerPosition3;
        for (let i = 0; i < 6; i++) {
            this.createEnvironmentObject('rock', pos1);
            this.createEnvironmentObject('rock', pos2);
            this.createEnvironmentObject('rock', pos3);
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

    private _useEventEffect() {
        Emitter.on('remove-environment', (environment: BaseObject) => {
            this.removeEnvironmentObject(environment);
        });
        Emitter.on('remove-reward', (rewardObject: BaseObject) => {
            this.removeObject(rewardObject, this._rewardObjects);
        });
        Emitter.on('get-environment-list', () => {
            Emitter.emit('return-environment-list', this.environmentObjects);
        });
        Emitter.on('get-reward-list', () => {
            Emitter.emit('return-reward-list', this.rewardObjects);
        });
        Emitter.on('get-bunker', () => {
            Emitter.emit('return-bunker', this.bunker);
        });
        Emitter.on('return-random-position', (rectangle: Rectangle) => {
            this._randomRectangle = rectangle;
        });
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
            Emitter.emit('create-random-position', object.size);

            // object.rectangle = this._position;
            object.rectangle = this._randomRectangle;

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
        const randomBoolean = getRandomBoolean(AppConstants.ratioCreateReward);

        // if random is true
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

}