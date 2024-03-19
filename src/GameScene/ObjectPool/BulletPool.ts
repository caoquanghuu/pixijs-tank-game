
import { AppConstants } from '../Constants';
import { Bullet } from '../Objects/Bullet';

export class BulletPool {
    private _bulletPool: Bullet[] = [];
    private _maxBullets: number;

    constructor() {

        this._maxBullets = AppConstants.maxNumberOfBullet;

        // create bullets object with define from begin*/
        for (let i = 0; i < this._maxBullets; i++) {

            this._createBullet();
        }
    }

    private _createBullet() {
        const bullet = new Bullet();
        this._bulletPool.push(bullet);
    }

    /**
     * return bullet from bullet pool, if bullet pool empty, it will auto create bullet and return
     * @returns return bullet from bullet pool
     */
    public releaseBullet(): Bullet {
        if (!this._bulletPool) {
            this._createBullet();
        }
        const bullet = this._bulletPool.pop();
        return bullet;
    }

    public getBullet(bullet: Bullet) {
        bullet.isPlayerBullet = false;
        this._bulletPool.unshift(bullet);
    }

    get bulletPool(): Bullet[] {
        return this._bulletPool;
    }
}