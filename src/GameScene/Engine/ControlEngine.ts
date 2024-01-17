import { Application } from "@pixi/app";
import { Direction } from "../type";

export class ControlEngine {
    private _direction: Direction;
    /**
     * constructor to create event listener to player control
     */
    constructor() {
        /** add event listener for keydown */

    }

    /**
     * method to return direction base on player control
     * @returns return direction
     */
    public getDirection(): Direction {
        return this._direction;
    }

    private onKeyDown() {
        /** create a direction base on key down */
        /** assign direction to this _direction */
    }

    private onKeyUp() {
        /**set direction to stand because key up mean that player was stop control move */
    }
}