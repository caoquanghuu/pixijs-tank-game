import { Tank } from "../Objects/Tank";
import { ObjectController } from "./ObjectController";

export class TankController extend ObjectController {
    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number;

    private spawnTank() {
        // get a Tank from TankPool then display it.
        // set Random Position and Direction for it.
    }

    private tankDie(tank: Tank) {
        // check tank die is player or AI tank
        // if player tank die return game over to game sense, if ene tank die then:
        // check tank die in using tank, return it to tank pool and set it HP to 1.
    }

    private tankMove(tank: Tank) {
        // check collision is allow tank move, if have collision then set tank can not move.
        // if have no collision tank ll move normally.
    }
}