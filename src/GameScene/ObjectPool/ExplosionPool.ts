import { AppConstants } from '../Constants';
import { BaseObject } from '../Objects/BaseObject';
import { ObjectsPool } from './ObjectPool';

export class ExplosionPool extends ObjectsPool {
    constructor() {
        super();
        for (let i = 0; i < AppConstants.maxNumberOfBullet; i++) {
            const explosion = new BaseObject('explosion');

            explosion.setImageSize(AppConstants.explosionSpriteSize);

            this.objectPool.push(explosion);
        }
    }
}