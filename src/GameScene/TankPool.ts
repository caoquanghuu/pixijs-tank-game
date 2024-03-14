
import { AppConstants } from './Constants';
import { Tank } from './Objects/Tank';
import { TankDieFn } from './type';

export class TankPool {
    private static instance: TankPool;

    // a variable to limit bot tank pool
    private _maxTanks: number = AppConstants.maxNumberOfAiTank;

    // a array to contain bot tank
    private _tanksPool: Tank[] = [];
    private _tankDieCall: TankDieFn;

    /**
     * constructor tank pool base on number of tank
     */
    constructor(tankDieCallBack: TankDieFn) {
        this._tankDieCall = tankDieCallBack;

        // a loop to create tank and add it to tank pool
        for (let i = 0; i < this._maxTanks; i++) {
            const tank = new Tank(false, this._tankDieCall);
            this._tanksPool.push(tank);
        }
    }


    public releaseTank(): Tank {

        // get tank from tank pool and return that tank
        const tank = this._tanksPool.pop();

        // return tank;
        return tank;
    }

    public getTank(tank: Tank) {

        // get tank die from tank controller
        // return tank to tank pool when tank die
        this._tanksPool.push(tank);
    }

    get tankPool(): Tank[] {
        return this._tanksPool;
    }
}
