import { Direction } from "../type";
import { ControlEngine } from "./ControlEngine";
import { RandomEngine } from "./RandomEngine";

export class BaseEngine {
    private _direction: Direction;
    private _randomEngine: RandomEngine;
    private _controlEngine: ControlEngine;
    /**
     * constructor base engine base on it is random or not
     * @param isRandom a parameter to define is random engine or control engine
     */
    constructor(isRandom) {
        isRandom ? this._randomEngine = new RandomEngine() : this._controlEngine = new ControlEngine();
    }

    /** get a direction */
    get direction(): Direction {
        /**if random engine is define */
        if (this._randomEngine) {
            this._direction = this._randomEngine.getDirection();
            /** if control engine is define */
        } else if (this._controlEngine) {
            this._direction = this._controlEngine.getDirection();
        }
        return this._direction;
    }
    /** set direction when create object */
    set direction(direction: Direction) {
        this._direction = direction;
    }

    public update(dt: number) {
        if (this._randomEngine) {
            this._randomEngine.update(dt);
        }
    }
}