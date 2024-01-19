import { Point } from "@pixi/core";
import { Tank } from "../Objects/Tank";
import { TankPool } from "../TankPool";
import { Direction } from "../type";
import { getRandomArbitrary, randomEnumKey } from "../util";

export class TankController {
    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number = 20000;
    private _playerTank: Tank;
    private _spawnCallBack: Function;
    private _fireBulletCallback: Function;
    private _tankPool = TankPool.getInstance(this.fireBullet.bind(this));

    constructor(spawnTankCallBack: Function, fireBulletCallBack: Function) {
        // spawnTank every spawnTankTime
        this._spawnCallBack = spawnTankCallBack;
        this._fireBulletCallback = fireBulletCallBack;

        this.spawnTank();
        // create a player tank
        this._playerTank = new Tank(true, this.fireBullet.bind(this));
        this._usingTanks.push(this._playerTank);
    }

    /**
     * spawn a enemy tank
     */
    private spawnTank() {
        // get a Tank from TankPool then display it.
        const tank = this._tankPool.releaseTank();

        // push this tank to using tank
        this._usingTanks.push(tank);

        // add this tank to game sense
        this._spawnCallBack(tank);


        // set Random Position and Direction for it.
        const direction = randomEnumKey(Direction);
        tank.moveEngine.direction = direction;
        /**get random position */
        //check position is available

        //then set that position
        tank.sprite.position.set(getRandomArbitrary(600, 800), getRandomArbitrary(600, 800));
    }

    public fireBullet(position: Point, direction: Direction, isPlayerBullet: boolean) {
        this._fireBulletCallback(position, direction, isPlayerBullet);
    }

    /**
     * tank will die
     * @param tank tank which will die
     */
    private tankDie(tank: Tank) {
        /** check tank die is player or AI tank
        if player tank die return game over to game sense, if ene tank die then:
        check tank die in using tank, return it to tank pool and set it HP to 1.  */
        if (tank._isPlayerTank) {
            // game over
            console.log('game over');
        } else {
            this._tankPool.getTank(tank);
            tank.HP = 1;
        }
    }

    /**
     * handle move of tank when have collision
     * @param tank tank which need to handle move
     */
    private tankHandleMove(tank: Tank) {
        // check collision is allow tank move, if have collision then set tank can not move.
        // if have no collision tank ll move normally.
    }

    public update(dt: number) {
        /**reduce spawn tank time back */
        this._spawnTankTime -= dt;
        /** then spawn tank based on dt time */
        if (this._spawnTankTime <= 0) {
            this._spawnTankTime = 20000;

            this.spawnTank();
        }

        this._usingTanks.forEach(tank => tank.update(dt));
    }

    /**method get tank list for check collision can access */
    get usingTankList(): Tank[] {
        return this._usingTanks;
    }
}