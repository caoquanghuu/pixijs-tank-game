import { IPointData } from '../../pixi';
import { BaseObject } from './BaseObject';
import { AppConstants } from '../Constants';
import Emitter from '../util';

export class HPBar extends BaseObject {
    private _isPlayer: boolean;
    private _HP: number;

    constructor(isPlayer: boolean) {
        super(isPlayer ? AppConstants.textureName.playerHP : AppConstants.textureName.botHp);

        Emitter.emit(AppConstants.eventEmitter.addToScene, this.sprite);

        this._isPlayer = isPlayer;
    }

    get HP(): number {
        return this._HP;
    }

    set HP(hp: number) {
        this._HP = hp;
    }

    private changeHPSpriteFollowHP(): void {

        const hpTextureName: string[] = AppConstants.hpTexturesName;

        this.sprite = hpTextureName[this._HP - 1];
    }

    public update(position: IPointData) {
        const newPosition: IPointData = { x: position.x, y: position.y - AppConstants.distanceOfHpBarAndTank };
        this.position = newPosition;
        this.changeHPSpriteFollowHP();
    }
}