import { BaseObject } from "../Objects/BaseObject"
import { AddToScene } from "../type";
import { getRandomArbitrary } from "../util";
import { PositionMap } from "../Map/PositionMap";
import { Rectangle } from "@pixi/core";

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
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     */
    private createEnvironmentObject(name: string) {
        /**use name to get image from asset */
        const object = new BaseObject(name);

        /** add sprite to game scene */
        this._addToSceneCall(object.sprite);

        /** set size */
        object.sprite.width = 15;
        object.sprite.height = 15;

        /** set size property */
        object.size = { w: 15, h: 15 };

        /** create a position and check that position is available */
        object.rectangle = PositionMap.createNewPosition(object.size);
        object.sprite.position.set(object.rectangle.x, object.rectangle.y);

        /** add this object position to position map */
        const positionMap = new PositionMap();
        PositionMap.setPositionMap(object.rectangle, positionMap.keyInArrayRectangle);

        /** set anchor point */
        object.sprite.anchor.set(0.5);

        /**push it to this.environmentObject array */
        this._environmentObjects.push(object);
    }

    /** method for collision controller can access to get position of environment objects*/
    get environmentObjects(): BaseObject[] {
        return this._environmentObjects;
    }

}