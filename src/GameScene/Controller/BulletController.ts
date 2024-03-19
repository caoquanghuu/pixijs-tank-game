import { IPointData } from '../../pixi';
import { Bullet } from '../Objects/Bullet';
import { Direction } from '../type';
import { BaseObject } from '../Objects/BaseObject';
import { sound } from '@pixi/sound';
import { AppConstants } from '../Constants';
import Emitter from '../util';
import { BulletPool } from '../ObjectPool/BulletPool';

export class BulletController {

    // bullets list which display on game sense
    private _usingBullets: Bullet [] = [];
    private _bulletPool: BulletPool;

    constructor() {
        this._useEventEffect();

        this._bulletPool = new BulletPool();
    }

    get bullets(): Bullet[] {
        return this._usingBullets;
    }

    /**
     * fire a bullet when tank require
     * @param tankPosition position of tank require fire bullet
     * @param tankDirection direction of tank require fire bullet
     * @param isPlayerBullet define is player tank require fire bullet
     */
    public createBullet(option: {position: IPointData, direction: Direction, isPlayer: boolean}) {

        // create a new bullet
        const bullet = this._bulletPool.releaseBullet();
        this._usingBullets.push(bullet);

        // set position and direction for this bullet
        bullet.position = option.position;
        bullet.direction = option.direction;
        bullet.isPlayerBullet = option.isPlayer;

        // append bullet to game sense
        bullet.show();

        // add sound fire bullet if it is player fire
        if (option.isPlayer) {
            sound.play('bullet-fire', { volume: AppConstants.volumeOfFireBullet });
        }
    }

    private _useEventEffect(): void {
        Emitter.on(AppConstants.fireBulletEvent, this.createBullet.bind(this));
    }

    public reset(): void {
        this._usingBullets.forEach(bullet => {
            bullet.remove();
            this._bulletPool.getBullet(bullet);
        });

        this._usingBullets = [];
    }

    /**
     * remove bullet when require
     * @param bullet bullet which need to remove
     */
    public removeBullet(bullet: Bullet): void {

        // remove bullet in array list
        const p = this._usingBullets.findIndex(bullets => bullets === bullet);
        this._usingBullets.splice(p, 1);

        // return bullet to bullet pool
        this._bulletPool.getBullet(bullet);

        // remove bullet in game sense
        bullet.remove();

        // create a sprite with explosion
        const explosion = new BaseObject('explosion');

        // set size for explosion sprite
        explosion.setImageSize(AppConstants.explosionSpriteSize);

        // add this explosion to game
        explosion.show();

        // set position for it where bullet being remove
        explosion.position = bullet.position;

        // set sound for explosion
        if (bullet.isPlayerBullet) {
            sound.play('explosion');
            sound.volume('explosion', AppConstants.volumeOfExplosion);
        }

        // remove this bullet after time
        setTimeout(() => { explosion.remove(); }, AppConstants.timeExplosionDisappear);
    }


    /**
     * check position of bullet, if if go out of game sense then remove it
     * @param dt
     */
    public update(dt: number): void {

        //check bullet position out of map yet then:
        this._usingBullets.forEach(bullet => {

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