import { Application } from "@pixi/app";
import { Direction } from "../type";
import { BaseEngine } from "./BaseEngine";

export class ControlEngine extends BaseEngine {
    /**
     * constructor to create event listener to player control
     */
    constructor() {
        super()
        /** add event listener for keydown */

    }

    /**
     * method to return direction base on player control
     * @returns return direction
     */

    private onKeyDown() {
        /** create a direction base on key down */
        /** assign direction to this _direction */
    }

    private onKeyUp() {
        /**set direction to stand because key up mean that player was stop control move */
    }
}