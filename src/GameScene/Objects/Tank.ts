// Tank class

import { extend } from "lodash";
import { BaseObject } from "./BaseObject";

export class Tank extend BaseObject{

    private _fireCallback: (position, direction) => void = null;

    constructor() {

    }

    fire() {
        // fire bullet
        // call fire bullet from controller

        // 
        // this._fireCallback?.(this.position, this.direction);
    }

    // onHit() {
    //     HP -1;
    // }

    destroy() {

    }

    /**
     * Update tank
     * @param dt delta time from ticker
     */
    update(dt: number):void {
        // move

        // --------------
        // get direction from engine
        // update move engine
        this.moveEngine.update(dt);
        
        // get direction property.

        // --------------
        // check possible move
        // call back to check. 

        // --------------
        // update position
    }
}