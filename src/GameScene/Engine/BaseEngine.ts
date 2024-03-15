import { Direction } from '../type';

export class BaseEngine {
    private _direction: Direction = Direction.STAND;
    public forceChangeDirectionCall: () => void = null;

    // get a direction
    get direction(): Direction {
        return this._direction;
    }

    // set a direction
    set direction(direction: Direction) {
        this._direction = direction;
    }

    // eslint-disable-next-line no-unused-vars
    public update(dt: number) {

    }
}