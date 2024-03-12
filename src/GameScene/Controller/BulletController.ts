import { Point } from '@pixi/core';
import { Bullet } from '../Objects/Bullet';
import { Direction } from '../type';
import { BaseObject } from '../Objects/BaseObject';
import { sound } from '@pixi/sound';
import Emitter from '../util';

export class BulletController {

    // bullets list which display on game sense
    private _bullets: Bullet [] = [];

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
            sound.play('bullet-fire', { volume: 0.2 });
        }
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
        explosion.setImageSize({ w: 15, h: 15 });

        // add this explosion to game
        Emitter.emit('add-to-scene', explosion.sprite);

        // set position for it where bullet being remove
        explosion.position = bullet.position;

        // set sound for explosion
        if (bullet.isPlayerBullet) {
            sound.play('explosion');
            sound.volume('explosion', 0.2);
        }

        // remove this bullet after time
        setTimeout(() => { Emitter.emit('remove-from-scene', explosion.sprite); }, 100);
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
            if ((bullet.position.x < 0 || bullet.position.x > 800) || ((bullet.position.y < 0) || (bullet.position.y > 600))) {
                this.removeBullet(bullet);
            }
            // update bullet
            bullet.update(dt);

        });
    }

}