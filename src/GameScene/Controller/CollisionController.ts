import { Point } from "@pixi/core";
import { BaseObject } from "../Objects/BaseObject";

export class CollisionController {
    /**position of tanks which be using on map */
    private _tanksPosition: Point[] = [];
    /**position of bullet which displaying on map */
    private _bulletsPosition: Point[] = [];
    /**position of environment displaying on map */
    private _environmentsPosition: Point [] = [];

    /**
     * calculate distance of 2 object on map
     * @param pos1 position of object 1
     * @param pos2 position of object 2
     */
    private getDistanceOfTwoObject(pos1: Point, pos2: Point) {
        /**calculate distance of 2 position */

        /**return distance */
    }

    /**
     * check collision of 2 object list
     * @param object1 object list 1
     * @param object2 object list 2
     */
    private checkCollision(object1 : BaseObject[], object2 : BaseObject[]) {
        /**loop to check collision of this objects to other */


        /**it not done yet ll be complete later */


    }
}