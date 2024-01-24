import { Direction } from "../type";
import { ControlEngine } from "./ControlEngine";
import { RandomEngine } from "./RandomEngine";

export class BaseEngine {
    private _direction: Direction = Direction.STAND;
    public forceChangeDirectionCall: () => void = null;

    /** get a direction */
    get direction() {
        return this._direction;
    }

    /** set a direction */
    set direction(direction: Direction) {
        this._direction = direction;
    }

    public update(dt) {

    }
}