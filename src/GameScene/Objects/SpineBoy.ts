import { Point } from '@pixi/core';
import { SpineObject } from './SpineObject';
import { keyboard } from '../util';

export class SpineBoy extends SpineObject {
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


    constructor() {
        super();
        this.init().then(() => {
            this.changeAnimation();
        });
    }

    private async init() {
        await this.loadBundle('assets/units/spine2d/spine-boy/spine-boy-pro.json').then(() => {
            this._spine.scale = { x: 0.1, y: 0.1 };
        });
    }

    private changeAnimation() {
        this._left = keyboard('ArrowLeft'),
        this._up = keyboard('ArrowUp'),
        this._right = keyboard('ArrowRight'),
        this._down = keyboard('ArrowDown');

        this._left.press = () => {
            this.setAnimation({ trackIndex:1, animationName: 'run', loop: true });
            this.flipImage(true);
            this._keyHandler.isLeft = true;
        };
        this._left.release = () => {
            this._keyHandler.isLeft = false;
        };
        this._right.press = () => {
            this.setAnimation({ trackIndex:1, animationName: 'run', loop: true });
            this.flipImage(false);
            this._keyHandler.isRight = true;
        };
        this._right.release = () => {
            this._keyHandler.isRight = false;
        };
        this._up.press = () => {
            this.setAnimation({ trackIndex:1, animationName: 'jump', loop: true });
            this._keyHandler.isUp = true;
        };
        this._up.release = () => {
            this._keyHandler.isUp = false;
        };
        this._down.press = () => {
            this.setAnimation({ trackIndex:1, animationName: 'hoverboard', loop: true });
            this._keyHandler.isDown = true;
        };
        this._down.release = () => {
            this._keyHandler.isDown = false;
        };
    }


    public update(position: Point) {
        // spine boy have position of player tank
        this.position = position;

        // spine boy have idle animation when tank stop
        if (this._keyHandler.isUp === false && this._keyHandler.isDown === false && this._keyHandler.isLeft === false && this._keyHandler.isRight === false) {
            // return if current animation is idle
            if (this.animationName === 'idle') return;
            this.setAnimation({ trackIndex:1, animationName: 'idle', loop: true });
        }
    }
}