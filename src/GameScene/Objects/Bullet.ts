import { BaseObject } from './BaseObject';
import { BaseEngine } from '../Engine/BaseEngine';
import { switchFn } from '../util';
import { Direction } from '../type';
import { AppConstants } from '../Constants';
import { Rectangle } from '../../pixi';

export class Bullet extends BaseObject {
    // property define this bullet belong to player or bot tank
    private _isPlayerBullet: boolean;

    /**
     * create a bullet object with image and speed and move engine
     * @param isPlayer is this bullet is belong to player tank
     */
    constructor() {
        // set id is bullet to get image of bullet */
        super(AppConstants.textureName.bullet);

        // set speed of bullet
        this.speed = AppConstants.speedOfBullet;

        // set move engine for bullet
        this.moveEngine = new BaseEngine();

        // resize bullet sprite
        this.setImageSize(AppConstants.bulletSpriteSize);

        // fix size
        this.size = AppConstants.bulletSpriteSize;
    }

    get isPlayerBullet(): boolean {
        return this._isPlayerBullet;
    }

    set isPlayerBullet(isPlayer: boolean) {
        this._isPlayerBullet = isPlayer;
    }

    get direction(): Direction {
        return this._moveEngine.direction;
    }

    set direction(direction: Direction) {
        this._moveEngine.direction = direction;
    }

    /**
     * rotate sprite follow direction
     * @param bullet bullet which is's sprite will be rotate
     */
    private rotateSpriteFollowDirection(): void {
        const rotateUp = () => {
            this.sprite.angle = 180;
        };

        const rotateDown = () => {
            this.sprite.angle = 0;
        };

        const rotateLeft = () => {
            this.sprite.angle = 90;
        };

        const rotateRight = () => {
            this.sprite.angle = -90;
        };

        const rotateList = {
            1 : rotateUp,
            2 : rotateDown,
            3 : rotateLeft,
            4 : rotateRight,
            'default' : () => {}
        };

        const rotateSwitch = switchFn(rotateList, 'default');

        rotateSwitch(this.moveEngine.direction);
    }

    update(dt: number) {
        //bullet move
        this.move(dt, true);
        this.rotateSpriteFollowDirection();
        this.rectangle = new Rectangle(this.position.x, this.position.y, this.size.w, this.size.h);
    }
}