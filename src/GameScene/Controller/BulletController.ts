import { Point } from '@pixi/core';
import { Bullet } from '../Objects/Bullet';
import { Direction } from '../type';
import { BaseObject } from '../Objects/BaseObject';
import { sound } from '@pixi/sound';
import { AppConstants } from '../Constants';
import Emitter from '../util';

export class BulletController {

    // bullets list which display on game sense
    private _bullets: Bullet [] = [];

    constructor() {
        this._useEventEffect();
    }

    get bullets(): Bullet[] {
        return this._bullets;
    }

    /**
     * fire a bullet when tank require
     * @param tankPosition position of tank require fire bullet
     * @param tankDirection direction of tank require fire bullet
     * @param isPlayerBullet define is player tank require fire bullet
     */
    public createBullet(tankPosition: Point, tankDirection: Direction, isPlayerBullet: boolean) {

        // create a new bullet
        const bullet = new Bullet (isPlayerBullet);
        this._bullets.push(bullet);

        // set position and direction for this bullet
        bullet.position = tankPosition;
        bullet.direction = tankDirection;

        // append bullet to game sense
        Emitter.emit('add-to-scene', bullet.sprite);

        // add sound fire bullet if it is player fire
        if (isPlayerBullet) {
            sound.play('bullet-fire', { volume: AppConstants.volumeOfFireBullet });
        }
    }

    private _useEventEffect() {
        Emitter.on('fire-bullet', (option: {position: Point, direction: Direction, isPlayer: boolean}) => {
            this.createBullet(option.position, option.direction, option.isPlayer);
        });
    }

    public reset() {
        if (!this._bullets) return;
        this._bullets.forEach(bullet => {
            this.removeBullet(bullet);
        });
    }

    /**
     * remove bullet when require
     * @param bullet bullet which need to remove
     */
    public removeBullet(bullet: Bullet) {

        // remove bullet in array list
        const p = this._bullets.findIndex(bullets => bullets === bullet);
        this._bullets.splice(p, 1);

        // remove bullet in game sense
        Emitter.emit('remove-from-scene', bullet.sprite);

        // create a sprite with explosion
        const explosion = new BaseObject('explosion');

        // set size for explosion sprite
        explosion.setImageSize(AppConstants.explosionSpriteSize);

        // add this explosion to game
        Emitter.emit('add-to-scene', explosion.sprite);

        // set position for it where bullet being remove
        explosion.position = bullet.position;

        // set sound for explosion
        if (bullet.isPlayerBullet) {
            sound.play('explosion');
            sound.volume('explosion', AppConstants.volumeOfExplosion);
        }

        // remove this bullet after time
        setTimeout(() => { Emitter.emit('remove-from-scene', explosion.sprite); }, AppConstants.timeExplosionDisappear);
    }


    /**
     * check position of bullet, if if go out of game sense then remove it
     * @param dt
     */
    public update(dt: number) {

        //check bullet position out of map yet then:
        this._bullets.forEach(bullet => {

            // check bullet position out of map yet?
            // if is it.
            if ((bullet.position.x < AppConstants.minScreenWidth || bullet.position.x > AppConstants.screenWidth) || ((bullet.position.y < AppConstants.minScreenHeight) || (bullet.position.y > AppConstants.screenHeight))) {
                this.removeBullet(bullet);
            }
            // update bullet
            bullet.update(dt);

        });
    }

}