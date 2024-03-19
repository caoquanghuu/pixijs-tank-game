
import { AppConstants } from '../Constants';
import { Bullet } from '../Objects/Bullet';

export class BulletPool {
    private _bulletPool: Bullet[] = [];
    private _maxBullets: number;

    constructor() {

        this._maxBullets = AppConstants.maxNumberOfBullet;

        // create bullets object with define from begin*/
        for (let i = 0; i < this._maxBullets; i++) {

            const bullet = new Bullet();

            this._bulletPool.push(bullet);
        }
    }

    /**
     * return bullet from bullet pool, if bullet pool empty, it will auto create bullet and return
     * @returns return bullet from bullet pool
     */
    public releaseBullet(): Bullet {
        if (!this._bulletPool) {

            const bullet = new Bullet();
            this._bulletPool.push(bullet);

            return this._bulletPool.pop();
        } else {

            return this._bulletPool.pop();
        }
    }

    public getBullet(bullet: Bullet) {
        this._bulletPool.push(bullet);
    }
}