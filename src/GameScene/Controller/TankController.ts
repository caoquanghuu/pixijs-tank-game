import { Point } from '@pixi/core';
import { Tank } from '../Objects/Tank';
import { TankPool } from '../TankPool';
import { AddToSceneFn, CreateNewRandomPositionFn, Direction, FireBulletFn, GameOverFn, RemoveFromSceneFn, SetNewScoreFn } from '../type';
import { getRandomArbitrary, randomEnumKey, switchFn } from '../util';

export class TankController {

    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number = 20000;
    private _playerTank: Tank;
    private _tankPool: TankPool;

    private _addToScene: AddToSceneFn;
    private _removeFromScene: RemoveFromSceneFn;
    private _fireBulletCallback: FireBulletFn;
    private _createNewRandomPositionCall: CreateNewRandomPositionFn;
    private _setNewScoreCall: SetNewScoreFn;
    private _gameOverCall: GameOverFn;


    constructor(addToSceneCallBack: AddToSceneFn, removeFromSceneCallBack: RemoveFromSceneFn, fireBulletCallBack: FireBulletFn,
        createNewRandomPositionCallBack: CreateNewRandomPositionFn, setNewScoreCallBack: SetNewScoreFn, gameOverCallBack: GameOverFn) {

        this._tankPool = new TankPool(this.fireBullet.bind(this), this.tankDie.bind(this), addToSceneCallBack);

        // spawnTank every spawnTankTime
        this._addToScene = addToSceneCallBack;
        this._removeFromScene = removeFromSceneCallBack;
        this._fireBulletCallback = fireBulletCallBack;
        this._createNewRandomPositionCall = createNewRandomPositionCallBack;
        this._setNewScoreCall = setNewScoreCallBack;
        this._gameOverCall = gameOverCallBack;

        this.spawnTank();

        // create a player tank
        this._playerTank = new Tank(true, this.fireBullet.bind(this), this.tankDie.bind(this), this._addToScene.bind(this));
        this._usingTanks.push(this._playerTank);
        this._addToScene(this._playerTank.sprite);
        this._playerTank.rectangle = this._createNewRandomPositionCall(this._playerTank.size);

        const position = new Point(this._playerTank.rectangle.x, this._playerTank.rectangle.y);

        this._playerTank.position = position;
    }

    /**
     * spawn a enemy tank
     */
    private spawnTank() {

        // get a Tank from TankPool then display it.
        const tank = this._tankPool.releaseTank();

        tank.rectangle = this._createNewRandomPositionCall(tank.size);

        // create new position based on rectangle
        const position = new Point(tank.rectangle.x, tank.rectangle.y);

        // set position for tank
        tank.position = position;

        // push this tank to using tank
        this._usingTanks.push(tank);

        // add this tank to game sense
        this._addToScene(tank.sprite);
        this._addToScene(tank.HPBar.sprite);

        const direction = randomEnumKey(Direction);
        tank.direction = direction;
    }

    public fireBullet(position: Point, direction: Direction, isPlayerBullet: boolean) {
        this._fireBulletCallback(position, direction, isPlayerBullet);
    }

    /**
     * tank will die
     * @param tank tank which will die
     */
    private tankDie(tankDie: Tank) {

        // check tank die is player or AI tank
        if (tankDie.isPlayerTank) {

            // call game over to game scene
            this._gameOverCall();
        } else {

            //return tank to tank pool
            this._tankPool.getTank(tankDie);

            // update score of player
            this._setNewScoreCall(1);

            // set back hp for tank
            tankDie.HP = 1;

            //remove sprite from game scene
            this._removeFromScene(tankDie.sprite);

            this._removeFromScene(tankDie.HPBar.sprite);

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
        const direction = tank.direction;

        // check collision is allow tank move, if have collision then set tank can not move.
        tank.direction = Direction.STAND;

        const flitchUp = () => {
            const newPosition = new Point(tank.position.x, tank.position.y + 2);
            tank.position = newPosition;
        };

        const flitchDown = () => {
            const newPosition = new Point(tank.position.x, tank.position.y - 2);
            tank.position = newPosition;
        };

        const flitchLeft = () => {
            const newPosition = new Point(tank.position.x + 2, tank.position.y);
            tank.position = newPosition;
        };

        const flitchRight = () => {
            const newPosition = new Point(tank.position.x - 2, tank.position.y);
            tank.position = newPosition;
        };

        const directionList = {
            1 : flitchUp,
            2 : flitchDown,
            3 : flitchLeft,
            4 : flitchRight,
            'default' : () => {}
        };

        const directionSwitch = switchFn(directionList, 'default');

        directionSwitch(direction);

        // switch (direction) {
        //     case Direction.UP: {
        //         const newPosition = new Point(tank.position.x, tank.position.y + 2);
        //         tank.position = newPosition;
        //         break;
        //     }
        //     case Direction.DOWN: {
        //         const newPosition = new Point(tank.position.x, tank.position.y - 2);
        //         tank.position = newPosition;
        //         break;
        //     }
        //     case Direction.LEFT: {
        //         const newPosition = new Point(tank.position.x + 2, tank.position.y);
        //         tank.position = newPosition;
        //         break;
        //     }
        //     case Direction.RIGHT: {
        //         const newPosition = new Point(tank.position.x - 2, tank.position.y);
        //         tank.position = newPosition;
        //         break;
        //     }
        // }

        //change direction if tank is bot
        if (!tank.isPlayerTank) {
            tank.moveEngine.forceChangeDirectionCall();
        }
    }

    public update(dt: number) {

        /**reduce spawn tank time back */
        this._spawnTankTime -= dt;

        /** then spawn tank based on dt time */
        if (this._spawnTankTime <= 0) {
            this._spawnTankTime = getRandomArbitrary(10000, 20000);
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