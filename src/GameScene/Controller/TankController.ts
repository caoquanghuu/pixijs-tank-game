import { Point } from '@pixi/core';
import { Tank } from '../Objects/Tank';
import { TankPool } from '../TankPool';
import { CreateNewRandomPositionFn, Direction, SetNewScoreFn } from '../type';
import Emitter, { getRandomArbitrary, getRandomBoolean, randomEnumKey, switchFn } from '../util';
import { SpineBoy } from '../Objects/SpineBoy';
import { AppConstants } from '../Constants';

export class TankController {

    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number = AppConstants.timeSpawnTank;
    private _playerTank: Tank;
    private _tankPool: TankPool;

    private _createNewRandomPositionCall: CreateNewRandomPositionFn;
    private _setNewScoreCall: SetNewScoreFn;

    // test for spine object
    private _spineBoy: SpineBoy;


    constructor(createNewRandomPositionCallBack: CreateNewRandomPositionFn, setNewScoreCallBack: SetNewScoreFn) {

        this._tankPool = new TankPool(this.tankDie.bind(this));

        this._useEventEffect();

        this._createNewRandomPositionCall = createNewRandomPositionCallBack;
        this._setNewScoreCall = setNewScoreCallBack;

        // create a player tank
        this._playerTank = new Tank(true, this.tankDie.bind(this));
        this._usingTanks.push(this._playerTank);

        // test add spine boy on player tank
        this._spineBoy = new SpineBoy();

        this._spineBoy.loadBundle('assets/units/spine2d/spine-boy/spine-boy-pro.json').then(() => {
            this._spineBoy.setAnimation({ trackIndex:0, animationName: 'idle', loop: true });
        });
    }

    /**method get tank list for check collision can access */
    get usingTankList(): Tank[] {
        return this._usingTanks;
    }

    public reset() {
        Emitter.emit('remove-from-scene', this._spineBoy.spine);

        this._usingTanks.forEach((tank) => {
            if (!tank.isPlayerTank) {
                this.tankDie(tank);
            }
        });
    }

    public init() {
        Emitter.emit('add-to-scene', this._playerTank.sprite);
        this._playerTank.rectangle = this._createNewRandomPositionCall(this._playerTank.size);

        const position = new Point(this._playerTank.rectangle.x, this._playerTank.rectangle.y);

        this._playerTank.position = position;

        Emitter.emit('add-to-scene', this._spineBoy.spine);
        this._spineBoy.position = this._playerTank.position;
    }

    private _useEventEffect() {
        Emitter.on('fire-bullet', (option: {position: Point, direction: Direction, isPlayer: boolean}) => {
            this.fireBulletOfSpineBoy(option.position, option.direction, option.isPlayer);
        });
    }

    /**
     * spawn a enemy tank
     */
    private spawnTank() {

        // get a Tank from TankPool then display it.
        const tank = this._tankPool.releaseTank();

        // random create boss tank
        const isCreateBossTank = getRandomBoolean(50);
        if (isCreateBossTank) {
            this.createBossTank(tank);
        }

        tank.rectangle = this._createNewRandomPositionCall(tank.size);

        // create new position based on rectangle
        const position = new Point(tank.rectangle.x, tank.rectangle.y);

        // set position for tank
        tank.position = position;

        // push this tank to using tank
        this._usingTanks.push(tank);

        // add this tank to game sense
        Emitter.emit('add-to-scene', tank.sprite);
        Emitter.emit('add-to-scene', tank.HPBar.sprite);

        const direction = randomEnumKey(Direction);
        tank.direction = direction;
    }

    private createBossTank(tank: Tank) {
        // tank have more hp
        tank.HP = AppConstants.maxHpOfBossTank;

        // colored tank
        tank.sprite.tint = AppConstants.colorOfBossTank;

        // tank shoot faster
        tank.fireBulletTime = AppConstants.timeFireBulletOfBossTank;
    }

    public fireBulletOfSpineBoy(position: Point, direction: Direction, isPlayerBullet: boolean) {
        // animation fire for spine boy
        if (isPlayerBullet) {
            this._spineBoy.addAnimation({ trackIndex: 2, animationName: 'shoot', loop: false, delay:0 });
        }
    }

    /**
     * tank will die
     * @param tank tank which will die
     */
    private tankDie(tankDie: Tank) {

        // check tank die is player or AI tank
        if (tankDie.isPlayerTank) {

            // call game over to UI controller
            Emitter.emit('display-game-over', null);
        } else {

            //return tank to tank pool
            this._tankPool.getTank(tankDie);

            // update score of player
            this._setNewScoreCall(1);

            // set back hp for tank
            tankDie.HP = AppConstants.maxHpOfAiTank;

            // set tank fire time back
            tankDie.fireBulletTime = AppConstants.timeFireBulletOfAiTank;

            // set back color for tank
            tankDie.sprite.tint = AppConstants.colorOfAiTank;

            //remove sprite from game scene
            Emitter.emit('remove-from-scene', tankDie.sprite);

            Emitter.emit('remove-from-scene', tankDie.HPBar.sprite);

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
            const newPosition = new Point(tank.position.x, tank.position.y + AppConstants.distanceFlitchWhenHaveCollision);
            tank.position = newPosition;
        };

        const flitchDown = () => {
            const newPosition = new Point(tank.position.x, tank.position.y - AppConstants.distanceFlitchWhenHaveCollision);
            tank.position = newPosition;
        };

        const flitchLeft = () => {
            const newPosition = new Point(tank.position.x + AppConstants.distanceFlitchWhenHaveCollision, tank.position.y);
            tank.position = newPosition;
        };

        const flitchRight = () => {
            const newPosition = new Point(tank.position.x - AppConstants.distanceFlitchWhenHaveCollision, tank.position.y);
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
            this._spawnTankTime = getRandomArbitrary(AppConstants.minTimeSpawnTank, AppConstants.timeSpawnTank);
            if (this._tankPool.tankPool.length != 0) {
                this.spawnTank();
            }

        }

        this._usingTanks.forEach(tank => tank.update(dt));

        // test update for spine boy
        this._spineBoy.update(this._playerTank.position);
    }

}