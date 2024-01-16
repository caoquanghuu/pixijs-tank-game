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
            return this._randomEngine.getDirection();
            /** if control engine is define */
        } else if (this._controlEngine) {
            return this._controlEngine.getDirection();
        }
        return;
    }
}