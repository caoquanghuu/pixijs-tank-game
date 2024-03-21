import { AppConstants } from '../Constants';
import { Reward } from '../util';
import { ObjectsPool } from './ObjectPool';

export class RewardPool extends ObjectsPool {
    constructor() {
        super();

        this.maxObjects = AppConstants.numbersOfEnvironmentObjects;

        for (let i = 0; i < this.maxObjects; i++) {
            const reward = new Reward(AppConstants.textureName.medicalBag);

            reward.setImageSize(AppConstants.rewardSpriteSize);

            reward.size = AppConstants.rewardSpriteSize;

            this.objectPool.push(reward);
        }
    }
}