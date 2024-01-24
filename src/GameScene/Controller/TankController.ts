import { Point } from "@pixi/core";
import { Tank } from "../Objects/Tank";
import { TankPool } from "../TankPool";
import { AddToScene, Direction, FireBullet, RemoveFromScene } from "../type";
import { getRandomArbitrary, randomEnumKey } from "../util";
import { Sprite } from "@pixi/sprite";
import { PositionMap } from "../Map/PositionMap";

export class TankController {
    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number = 2000;
    private _playerTank: Tank;
    private _addToScene: AddToScene;
    private _removeFromScene: RemoveFromScene;
    private _fireBulletCallback: FireBullet;
    private _tankPool: TankPool;
    private _positionMap: PositionMap;

    constructor(addToSceneCallBack: AddToScene, removeFromSceneCallBack: RemoveFromScene, fireBulletCallBack: FireBullet) {
        this._tankPool = TankPool.getInstance(this.fireBullet.bind(this), this.tankDie.bind(this));
        // spawnTank every spawnTankTime
        this._addToScene = addToSceneCallBack;
        this._removeFromScene = removeFromSceneCallBack;
        this._fireBulletCallback = fireBulletCallBack;

        this.spawnTank();
        // create a player tank
        this._playerTank = new Tank(true, this.fireBullet.bind(this), this.tankDie.bind(this));
        this._usingTanks.push(this._playerTank);
        this._addToScene(this._playerTank.sprite);
        this._playerTank.sprite.position.set(100, 100);
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
        this._addToScene(tank.sprite);


        // set Random Position and Direction for it.
        const direction = randomEnumKey(Direction);
        tank.moveEngine.direction = direction;
        /**get random position */
        //check position is available

        //then set that position
        tank.sprite.position.set(getRandomArbitrary(0, 800), getRandomArbitrary(0, 600));
    }

    public fireBullet(position: Point, direction: Direction, isPlayerBullet: boolean) {
        this._fireBulletCallback(position, direction, isPlayerBullet);
    }

    /**
     * tank will die
     * @param tank tank which will die
     */
    private tankDie(tankDie: Tank) {
        /** check tank die is player or AI tank
        if player tank die return game over to game sense, if ene tank die then:
        check tank die in using tank, return it to tank pool and set it HP to 1.  */
        if (tankDie.isPlayerTank) {
            // game over
            console.log('game over');
        } else {
            //return tank to tank pool
            this._tankPool.getTank(tankDie);
            // set back hp for tank
            tankDie.HP = 1;
            //remove sprite from game scene
            this._removeFromScene(tankDie.sprite);
            // remove from using tank list
            const p = this._usingTanks.findIndex(tank => tank === tankDie);
            this._usingTanks.splice(p, 1);
        }
    }

    /**
     * handle move of tank when have collision
     * @param tank tank which need to handle move
     */
    public handleTankMove(tank: Tank) {
        // get current direction of tank
        const direction = tank.moveEngine.direction;
        // check collision is allow tank move, if have collision then set tank can not move.
        tank.moveEngine.direction = Direction.STAND;

        switch (direction) {
            case Direction.UP: {
                tank.sprite.position.y += 1;
                break;
            }
            case Direction.DOWN: {
                tank.sprite.position.y -= 1;
                break;
            }
            case Direction.LEFT: {
                tank.sprite.position.x += 1;
                break;
            }
            case Direction.RIGHT: {
                tank.sprite.position.x -= 1;
                break;
            }
        }
        //change direction if tank is bot
        if (!tank.isPlayerTank) {
            tank.moveEngine.forceChangeDirectionCall();
        }

        // if have no collision tank ll move normally.
        // force change direction if tank is bot
    }

    public update(dt: number) {
        /**reduce spawn tank time back */
        this._spawnTankTime -= dt;
        /** then spawn tank based on dt time */
        if (this._spawnTankTime <= 0) {
            this._spawnTankTime = 2000;
            if (this._tankPool.tankPool.length != 0) {
                this.spawnTank();
            }

        }

        this._usingTanks.forEach(tank => tank.update(dt));
    }

    /**method get tank list for check collision can access */
    get usingTankList(): Tank[] {
        return this._usingTanks;
    }
}