import { Point } from '@pixi/core';
import { BaseObject } from './BaseObject';
import { AddToSceneFn } from '../type';

export class HP extends BaseObject {
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
        if (this._isPlayer) {
            switch (this._HP) {
                case 5: {
                    this.sprite = 'player-hp';
                    break;
                }
                case 4: {
                    this.sprite = '4-hp';
                    break;
                }
                case 3: {
                    this.sprite = '3-hp';
                    break;
                }
                case 2: {
                    this.sprite = '2-hp';
                    break;
                }
                case 1: {
                    this.sprite = '1-hp';
                    break;
                }
            }
        }
    }

    get HP(): number {
        return this._HP;
    }

    set HP(hp: number) {
        this._HP = hp;
    }

    update(position: Point) {
        const newPosition = new Point(position.x, position.y - 20);
        this.position = newPosition;
        this.changeHPSpriteFollowHP();
    }
}