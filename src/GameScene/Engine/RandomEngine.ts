import { Direction } from "../type";
import { randomEnumKey } from "../util";

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
        const direction = randomEnumKey(Direction);
        /**assign direction to this direction */
        this._direction = direction;
    }

    public update(dt: number) {
        /**set for the direction change time reduce to dt. */
        this._directionChangeTime -= dt;
        /** if it = 0 then set randomDirection again to get new direction. */
        if (this._directionChangeTime <= 0) {
            this._directionChangeTime = 2000;
            this.randomDirection();
        }
    }

}