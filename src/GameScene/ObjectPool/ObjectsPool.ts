import { AppConstants } from '../Constants';
import { Bullet } from '../Objects/Bullet';
import { Tank } from '../Objects/Tank';
import { ObjectsType } from '../type';
import { Environment, Explosion, Reward } from '../util';

export class ObjectsPool {
    private _tankPool: Tank[] = [];
    private _bulletPool: Bullet[] = [];
    private _environmentPool: Environment[] = [];
    private _rewardPool: Reward[] = [];
    private _explosionPool: Explosion[] = [];
    private _playerTank: Tank;

    constructor() {
        for (let i = 0; i < AppConstants.numberOfRewardObjects; i++) {
            const reward = new Reward(AppConstants.textureName.medicalBag);

            reward.setImageSize(AppConstants.rewardSpriteSize);

            reward.size = AppConstants.rewardSpriteSize;

            this._rewardPool.push(reward);
        }

        // create environment object with define from begin*/
        for (let i = 0; i < AppConstants.numbersOfEnvironmentObjects; i++) {
            this.createEnvironmentObject(AppConstants.textureName.tree1);
            this.createEnvironmentObject(AppConstants.textureName.tree2);
            this.createEnvironmentObject(AppConstants.textureName.rock);
        }

        for (let i = 0; i < AppConstants.maxNumberOfBullet; i++) {
            const explosion = new Explosion(AppConstants.textureName.explosion);

            explosion.setImageSize(AppConstants.explosionSpriteSize);

            this._explosionPool.push(explosion);
        }

        for (let i = 0; i < AppConstants.maxNumberOfBullet; i++) {
            const bullet = new Bullet();
            this._bulletPool.push(bullet);
        }

        // a loop to create tank and add it to tank pool
        for (let i = 0; i < AppConstants.maxNumberOfAiTank; i++) {
            const tank = new Tank(false);
            this._tankPool.push(tank);
        }

        this._playerTank = new Tank(true);
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     * @param position set position for object if require
     */
    private createEnvironmentObject(name: string): void {

        // use name to get image from asset
        const object = new Environment(name);

        // set size */
        object.setImageSize(AppConstants.environmentSpriteSize);

        // set size property
        object.size = AppConstants.environmentSpriteSize;

        this._environmentPool.push(object);
    }

    public releaseObject(option: ObjectsType): Tank | Bullet | Reward | Environment | Explosion {
        switch (option) {
            case ObjectsType.TANK:
                const tank = this._tankPool.pop();
                return tank;
            case ObjectsType.PLAYER:
                return this._playerTank;
            case ObjectsType.BULLET:
                const bullet = this._bulletPool.pop();
                return bullet;
            case ObjectsType.ENVIRONMENT:
                const environment = this._environmentPool.pop();
                return environment;
            case ObjectsType.REWARD:
                const reward = this._rewardPool.pop();
                return reward;
            case ObjectsType.EXPLOSION:
                const explosion = this._explosionPool.pop();
                return explosion;
            default:
        }
    }

    public returnObject(object: Tank | Bullet | Reward | Environment | Explosion) {
        if (object instanceof Tank) this._tankPool.push(object);
        if (object instanceof Bullet) this._bulletPool.push(object);
        if (object instanceof Reward) this._rewardPool.push(object);
        if (object instanceof Environment) this._rewardPool.push(object);
        if (object instanceof Explosion) this._explosionPool.push(object);
    }
}