import { BaseObject } from "../Objects/BaseObject"

export class EnvironmentController {
    /**list of environment objects which will be create on map*/
    private _environmentObjects: BaseObject[] = [];

    constructor() {
        /**create environment object with define from begin*/
        this.createEnvironmentObject('tree');

        /**add there object to the game */
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     */
    private createEnvironmentObject(name: string) {
        /**use name to get image from asset */

        /** set random position for it*/

        /**push it to this.environmentObject array */
    }

    /** method for collision controller can access to get position of environment objects*/
    get environmentObjects(): BaseObject[] {
        return this._environmentObjects;
    }

}