import { Application } from "@pixi/app";
import { GameScene } from "../GameScene";
import { Tank } from "../Objects/Tank";
import { TankPool } from "../Objects/TankPool";
import { Direction } from "../type";
import { getRandomArbitrary, randomEnumKey } from "../util";

export class TankController {
    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number = 20000;
    private _playerTank: Tank;

    constructor() {
        // spawnTank every spawnTankTime
        setInterval(() => this.spawnTank(new GameScene), this._spawnTankTime);
        // create a player tank
        this._playerTank = new Tank(true);
        this._usingTanks.push(this._playerTank);
    }

    /**
     * spawn a enemy tank
     */
    private spawnTank(GameScene: GameScene) {
        // get a Tank from TankPool then display it.
        const tank = TankPool.releaseTank();

        // push this tank to using tank
        this._usingTanks.push(tank);

        // add this tank to game sense
        GameScene.addChild(tank.sprite);


        // set Random Position and Direction for it.
        const direction = randomEnumKey(Direction);
        tank.moveEngine.direction = direction;
        /**get random position */
        //check position is available

        //then set that position
        tank.sprite.position.set(getRandomArbitrary(600, 800), getRandomArbitrary(600, 800));
    }

    /**
     * tank will die
     * @param tank tank which will die
     */
    private tankDie(tank: Tank) {
        /** check tank die is player or AI tank
        if player tank die return game over to game sense, if ene tank die then:
        check tank die in using tank, return it to tank pool and set it HP to 1.  */
    }

    /**
     * handle move of tank when have collision
     * @param tank tank which need to handle move
     */
    private tankHandleMove(tank: Tank) {
        // check collision is allow tank move, if have collision then set tank can not move.
        // if have no collision tank ll move normally.
    }

    /**method get tank list for check collision can access */
    get usingTankList(): Tank[] {
        return this._usingTanks;
    }
}