import { Point } from '@pixi/core';
import { BaseObject } from './BaseObject';
import { AddToSceneFn } from '../type';
import { AppConstants } from '../Constants';

export class HPBar extends BaseObject {
    private _isPlayer: boolean;
    private _HP: number;
    private _addToSceneCall: AddToSceneFn;

    constructor(isPlayer: boolean, addToSceneCallBack: AddToSceneFn) {
        super(isPlayer ? 'player-hp' : 'bot-hp');

        this._addToSceneCall = addToSceneCallBack;

        this._addToSceneCall(this.sprite);

        this._isPlayer = isPlayer;
    }

    private changeHPSpriteFollowHP() {

        const hpTexture: string[] = ['1-hp', '2-hp', '3-hp', '4-hp', 'player-hp'];

        this.sprite = hpTexture[this._HP - 1];
    }

    get HP(): number {
        return this._HP;
    }

    set HP(hp: number) {
        this._HP = hp;
    }

    public update(position: Point) {
        const newPosition = new Point(position.x, position.y - AppConstants.distanceOfHpBarAndTank);
        this.position = newPosition;
        this.changeHPSpriteFollowHP();
    }
}