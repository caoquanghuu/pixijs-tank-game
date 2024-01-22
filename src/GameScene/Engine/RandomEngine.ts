import { Direction } from "../type";
import { randomEnumKey } from "../util";
import { BaseEngine } from "./BaseEngine";

export class RandomEngine extends BaseEngine {
    private _directionChangeTime: number = 2000;

    /**
     * random get a direction from enum
     */
    private randomDirection() {
        /**random to get direction from enum Direction */
        const direction = randomEnumKey(Direction);
        /**assign direction to this direction */
        this.direction = direction;
    }

    private forceChangeDirection() {
        this._directionChangeTime = 0;
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