import { AppConstants } from '../Constants';
import { Direction } from '../type';
import { keyboard } from '../util';
import { BaseEngine } from './BaseEngine';

export class ControlEngine extends BaseEngine {

    private _left: any;
    private _right: any;
    private _up: any;
    private _down: any;
    private _keyHandler = {
        isUp : false,
        isDown : false,
        isLeft : false,
        isRight : false
    };
    /**
     * constructor to create event listener to player control
     */
    constructor() {
        super();
        // add event listener for keydown
        this._left = keyboard(AppConstants.keyboardEvent.moveLeft),
        this._up = keyboard(AppConstants.keyboardEvent.moveUp),
        this._right = keyboard(AppConstants.keyboardEvent.moveRight),
        this._down = keyboard(AppConstants.keyboardEvent.moveDown);

        this._left.press = () => {
            this.direction = Direction.LEFT;
            this._keyHandler.isLeft = true;
        };
        this._left.release = () => {
            this._keyHandler.isLeft = false;
        };
        this._right.press = () => {
            this.direction = Direction.RIGHT;
            this._keyHandler.isRight = true;
        };
        this._right.release = () => {
            this._keyHandler.isRight = false;
        };
        this._up.press = () => {
            this.direction = Direction.UP;
            this._keyHandler.isUp = true;
        };
        this._up.release = () => {
            this._keyHandler.isUp = false;
        };
        this._down.press = () => {
            this.direction = Direction.DOWN;
            this._keyHandler.isDown = true;
        };
        this._down.release = () => {
            this._keyHandler.isDown = false;
        };
    }

    public update() {
        // avoid duplicate set direction
        if (this.direction === Direction.STAND) return;
        if (!this._keyHandler.isUp && !this._keyHandler.isDown && !this._keyHandler.isLeft && !this._keyHandler.isRight) {
            this.direction = Direction.STAND;
        }
    }
}