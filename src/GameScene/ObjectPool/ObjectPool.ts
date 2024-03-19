import { BaseObject } from '../Objects/BaseObject';

export class ObjectsPool {

    // a variable to limit objects pool
    protected maxObjects: number;

    // a array to contain objects
    protected objectPool: BaseObject[] = [];


    constructor() {
    }


    public releaseObject(): BaseObject {

        // get object from object  pool and return that tank
        const object = this.objectPool.pop();

        // return object;
        return object;
    }

    public getObject(object: BaseObject) {

        // get object die from controller
        // return object to object pool when object die
        this.objectPool.unshift(object);
    }
}
