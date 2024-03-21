import { IPointData } from '../../pixi';
import { Bullet } from '../Objects/Bullet';
import { Direction } from '../type';
import { sound } from '@pixi/sound';
import { AppConstants } from '../Constants';
import Emitter from '../util';
import { BulletPool } from '../ObjectPool/BulletPool';
import { ExplosionPool } from '../ObjectPool/ExplosionPool';

export class BulletController {

    // bullets list which display on game sense
    private _usingBullets: Bullet [] = [];
    private _bulletPool: BulletPool;
    private _explosionPool: ExplosionPool;

    constructor() {
        this._useEventEffect();

        this._bulletPool = new BulletPool();

        this._explosionPool = new ExplosionPool();
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

        // set position and direction for this bullet
        bullet.position = option.position;
        bullet.direction = option.direction;
        bullet.isPlayerBullet = option.isPlayer;

        // append bullet to game sense
        bullet.show();

        this._usingBullets.push(bullet);

        // add sound fire bullet if it is player fire
        if (option.isPlayer) {
            sound.play(AppConstants.soundCfg.fire, { volume: AppConstants.volumeOfFireBullet });
        }
    }

    private _useEventEffect(): void {
        Emitter.on(AppConstants.eventEmitter.fireBullet, this.createBullet.bind(this));
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

        // set sound for explosion
        if (bullet.isPlayerBullet) {
            sound.play(AppConstants.soundCfg.explosion, { volume: AppConstants.volumeOfExplosion });
        }

        // create a explosion where bullet being remove
        this._displayExplosion(bullet.position);

    }

    private _displayExplosion(position: IPointData) {
        const explosion = this._explosionPool.releaseObject();
        explosion.position = position;
        explosion.show();

        setTimeout(() => {
            explosion.remove();
            this._explosionPool.getObject(explosion);
        }, AppConstants.timeExplosionDisappear);
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