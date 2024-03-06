import { Point } from '@pixi/core';
import { SpineObject } from './SpineObject';
import { keyboard } from '../util';

export class SpineBoy extends SpineObject {
    private _left: any;
    private _right: any;
    private _up: any;
    private _down: any;


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
            this.animation = { trackIndex:1, animationName: 'run', loop: true };
            this.flipImage(true);
        };
        this._left.release = () => {
        };
        this._right.press = () => {
            this.animation = { trackIndex:1, animationName: 'run', loop: true };
            this.flipImage(false);
        };
        this._right.release = () => {
        };
        this._up.press = () => {
            this.animation = { trackIndex:1, animationName: 'jump', loop: true };
        };
        this._up.release = () => {
        };
        this._down.press = () => {
            this.animation = { trackIndex:1, animationName: 'hoverboard', loop: true };
        };
        this._down.release = () => {
        };

        if (this._up.release && this._down.release && this._left.release && this._right.release) {
            this.animation = { trackIndex:1, animationName: 'idle', loop: true };
        }
    }


    public update(position: Point) {
        this.position = position;
    }
}