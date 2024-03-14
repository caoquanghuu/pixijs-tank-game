import { AppConstants } from '../Constants';
import { Direction } from '../type';
import { randomEnumKey } from '../util';
import { BaseEngine } from './BaseEngine';

export class RandomEngine extends BaseEngine {
    private _directionChangeTime: number = AppConstants.directionChangeTime;
    private _forceDirectionCountDown: number = AppConstants.forceDirectionCountDown;

    constructor() {
        super();
        this.forceChangeDirectionCall = this.forceChangeDirection;
    }

    /**
     * random get a direction from enum
     */
    private randomDirection() {

        // random to get direction from enum Direction
        const direction = randomEnumKey(Direction);

        // assign direction to this direction
        this.direction = direction;
    }

    public forceChangeDirection() {
        if (this._forceDirectionCountDown <= 0) {
            this._forceDirectionCountDown = AppConstants.forceDirectionCountDown;
            this._directionChangeTime = 0;
        }
    }

    public update(dt: number) {

        // set for the direction change time reduce to dt.
        this._directionChangeTime -= dt;

        // if it = 0 then set randomDirection again to get new direction.
        if (this._directionChangeTime <= 0) {
            this._directionChangeTime = AppConstants.directionChangeTime;
            this.randomDirection();
        }

        if (this._forceDirectionCountDown) {
            this._forceDirectionCountDown -= dt;
        }
    }

}