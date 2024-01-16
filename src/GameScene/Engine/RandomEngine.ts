import { Direction } from "../type";

export class RandomEngine {
    private _direction: Direction;
    private _directionChangeTime: number = 2000;

    /**method to get direction from this engine */
    public getDirection() {
        return this._direction;
    }

    /**
     * random get a direction from enum
     */
    private randomDirection() {
        /**random to get direction from enum Direction */
        /**assign direction to this direction */
    }

    public update(dt: number) {
        /**set for the direction change time reduce to dt. */
        /** if it = 0 then set randomDirection again to get new direction. */
    }

}