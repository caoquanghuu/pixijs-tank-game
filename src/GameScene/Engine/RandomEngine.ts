import { AppConstants } from '../Constants';
import { Direction } from '../type';
import { createRandomDirection } from '../util';
import { BaseEngine } from './BaseEngine';

export class RandomEngine extends BaseEngine {
    private _directionChangeTime: number = AppConstants.directionChangeTime;
    private _forceDirectionCountDown: number = AppConstants.forceDirectionCountDown;

    constructor() {
        super();
        this.forceChangeDirectionCall = this.forceChangeDirection;
    }

    public forceChangeDirection(): void {
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
            const direction: Direction = createRandomDirection();
            this.direction = direction;
        }

        if (this._forceDirectionCountDown) {
            this._forceDirectionCountDown -= dt;
        }
    }

}