import { Tank } from "../Objects/Tank";

export class TankController {
    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number;
    private _playerTank: Tank;

    constructor() {
        // spawnTank every spawnTankTime

        // create a player tank
    }

    /**
     * spawn a enemy tank
     */
    private spawnTank() {
        // get a Tank from TankPool then display it.
        // set Random Position and Direction for it.
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