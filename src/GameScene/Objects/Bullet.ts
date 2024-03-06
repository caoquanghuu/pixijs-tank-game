import { BaseObject } from './BaseObject';
import { BaseEngine } from '../Engine/BaseEngine';
import { switchFn } from '../util';
import { Direction } from '../type';

export class Bullet extends BaseObject {
    // property define this bullet belong to player or bot tank
    private _isPlayerBullet: boolean;

    /**
     * create a bullet object with image and speed and move engine
     * @param isPlayer is this bullet is belong to player tank
     */
    constructor(isPlayer: boolean) {
        // set id is bullet to get image of bullet */
        super('bullet');

        // set speed of bullet
        this.speed = 200;

        // set move engine for bullet
        this.moveEngine = new BaseEngine();

        // set property for this bullet
        this._isPlayerBullet = isPlayer;

        // resize bullet sprite
        this.setImageSize({ w: 10, h: 15 });

        // fix size
        this.size = { w: 10, h: 15 };
    }

    /**
     * rotate sprite follow direction
     * @param bullet bullet which is's sprite will be rotate
     */
    private rotateSpriteFollowDirection() {
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

        // switch (this.moveEngine.direction) {
        //     case Direction.UP: {
        //         this.sprite.angle = 180;
        //         break;
        //     }
        //     case Direction.DOWN: {
        //         this.sprite.angle = 0;
        //         break;
        //     }
        //     case Direction.LEFT: {
        //         this.sprite.angle = 90;
        //         break;
        //     }
        //     case Direction.RIGHT: {
        //         this.sprite.angle = -90;
        //         break;
        //     }
        // }
    }

    update(dt: number) {
        //bullet move
        this.move(dt, true);
        this.rotateSpriteFollowDirection();
    }

    get isPlayerBullet(): boolean {
        return this._isPlayerBullet;
    }

    get direction(): Direction {
        return this._moveEngine.direction;
    }

    set direction(direction) {
        this._moveEngine.direction = direction;
    }
}