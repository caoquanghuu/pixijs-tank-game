
import { AppConstants } from '../Constants';
import { BaseObject } from '../Objects/BaseObject';
import { Environment } from '../util';
import { ObjectsPool } from './ObjectPool';

export class EnvironmentPool extends ObjectsPool {

    constructor() {

        super();
        this.maxObjects = AppConstants.numbersOfEnvironmentObjects;

        // create environment object with define from begin*/
        for (let i = 0; i < this.maxObjects; i++) {
            this.createEnvironmentObject(AppConstants.textureName.tree1);
            this.createEnvironmentObject(AppConstants.textureName.tree2);
            this.createEnvironmentObject(AppConstants.textureName.rock);
        }
    }

    get objectList(): BaseObject[] {
        return this.objectPool;
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     * @param position set position for object if require
     */
    private createEnvironmentObject(name: string): void {

        // use name to get image from asset
        const object = new Environment(name);

        // set size */
        object.setImageSize(AppConstants.environmentSpriteSize);

        // set size property
        object.size = AppConstants.environmentSpriteSize;

        this.objectPool.push(object);
    }
}