import { Tank } from "./Tank";

export class TankPool {
    /**a variable to limit bot tank pool */
    private _numberOfTank: number = 20;
    /**a array to contain bot tank */
    public static _tanksPool: Tank[] = [];

    /**
     * constructor tank pool base on number of tank
     */
    constructor() {
        /**a loop to create tank and add it to tank pool */
        for (let i = 0; i < this._numberOfTank; i++) {
            const tank = new Tank(false);
            TankPool._tanksPool.push(tank);
        }
    }

    static releaseTank() {
        /** get tank from tank pool and return that tank */
        const tank = TankPool._tanksPool.pop();
        // return tank;
        return tank;

    }

    static getTank(tank: Tank) {
        /** get tank die from tank controller */
        /** return tank to tank pool when tank die */
        TankPool._tanksPool.push(tank);
    }
}