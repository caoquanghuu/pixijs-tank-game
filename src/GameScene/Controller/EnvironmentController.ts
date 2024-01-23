import { BaseObject } from "../Objects/BaseObject"
import { AddToScene } from "../type";
import { getRandomArbitrary } from "../util";
import { PositionMap } from "../Map/PositionMap";

export class EnvironmentController {
    /**list of environment objects which will be create on map*/
    private _environmentObjects: BaseObject[] = [];
    private _addToSceneCall: AddToScene;

    constructor(addToSceneCallBack: AddToScene) {
        this._addToSceneCall = addToSceneCallBack;
        /**create environment object with define from begin*/
        for (let i = 0; i < 10; i++) {
            this.createEnvironmentObject('tree-1');
        }
        for (let i = 0; i < 10; i++) {
            this.createEnvironmentObject('tree-2');
        }
        for (let i = 0; i < 10; i++) {
            this.createEnvironmentObject('rock');
        }
        /**add there object to the game */
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     */
    private createEnvironmentObject(name: string) {
        /**use name to get image from asset */
        const object = new BaseObject(name);
        this._addToSceneCall(object.sprite);
        /** set random position for it*/
        object.sprite.position.set(getRandomArbitrary(10, 790), getRandomArbitrary(10, 590));
        /** set size */
        object.sprite.width = 15;
        object.sprite.height = 15;
        /** set anchor point */
        /**push it to this.environmentObject array */
        this._environmentObjects.push(object);
        PositionMap._positions.push(object.sprite.position);
    }

    /** method for collision controller can access to get position of environment objects*/
    get environmentObjects(): BaseObject[] {
        return this._environmentObjects;
    }

}