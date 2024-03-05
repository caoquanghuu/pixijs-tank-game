import 'pixi-spine';
import '@pixi-spine/loader-3.8';
import { Assets } from '@pixi/assets';
import { Spine } from 'pixi-spine';

export class SpineObject {
    private _url: string;
    private _spineData: any;
    private _spine: Spine;
    private _speed: number = 1;

    constructor() {
    }

    set size(size: { w: number, h: number }) {
        this._spine.width = size.w;
        this._spine.height = size.h;
    }

    set animation(option: {trackIndex: number, animationName: string, loop: boolean}) {
        this._spine.state.setAnimation(option.trackIndex, option.animationName, option.loop);
    }

    set position(position: {x: number, y: number }) {
        this._spine.position.x = position.x;
        this._spine.position.y = position.y;
    }

    get spine(): Spine {
        return this._spine;
    }

    get position(): {x: number, y: number} {
        const position = { x : this._spine.position.x, y : this._spine.position.y };
        return position;
    }

    public async loadBundle(url: string) {
        await Assets.load(url).then((resource) => {
            this._url = url;

            this._spineData = resource.spineData;

            this._spine = new Spine(this._spineData);

            this._spine.autoUpdate = true;

            this._spine.state.timeScale = this._speed;
        });
    }
}