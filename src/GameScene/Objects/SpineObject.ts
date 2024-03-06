import 'pixi-spine';
import '@pixi-spine/loader-3.8';
import { Assets } from '@pixi/assets';
import { Spine } from 'pixi-spine';
import { BaseObject } from './BaseObject';
import { Point } from '@pixi/core';

export class SpineObject extends BaseObject {
    private _url: string;
    private _spineData: any;
    protected _spine: Spine;

    constructor() {
        super();
        this.speed = 1;
    }

    set animation(option: {trackIndex: number, animationName: string, loop: boolean}) {
        this._spine.state.setAnimation(option.trackIndex, option.animationName, option.loop);
    }

    get spine(): Spine {
        return this._spine;
    }

    /**
     * method to flip image
     * @param isFlip set true to the face of character turn left, false to turn right
     */
    protected flipImage(isFlip: boolean) {
        if (isFlip) {
            this._spine.scale.x = -0.1;
        } else {
            this._spine.scale.x = 0.1;
        }
    }

    override set position(position: Point) {
        this._spine.position.x = position.x;
        this._spine.position.y = position.y;
    }

    override get position(): Point {
        const position = new Point();
        position.x = this._spine.position.x;
        position.y = this._spine.position.y;
        return position;
    }

    public async loadBundle(url: string) {
        await Assets.load(url).then((resource) => {
            this._url = url;

            this._spineData = resource.spineData;

            this._spine = new Spine(this._spineData);

            this._spine.autoUpdate = true;

            this._spine.state.timeScale = this.speed;
        });
    }
}