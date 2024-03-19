import { Tank } from '../Objects/Tank';
import { TankPool } from '../ObjectPool/TankPool';
import { CreateNewRandomPositionFn, Direction, SetNewScoreFn } from '../type';
import Emitter, { getRandomArbitrary, getRandomBoolean, randomEnumKey, switchFn } from '../util';
import { SpineBoy } from '../Objects/SpineBoy';
import { AppConstants } from '../Constants';
import { IPointData } from '@pixi/core';

export class TankController {

    private _usingTanks: Tank[] = [];
    private _playerTank: Tank;
    private _spawnTankTime: number = AppConstants.timeSpawnTank;
    private _tankPool: TankPool;

    private _createNewRandomPositionCall: CreateNewRandomPositionFn;
    private _setNewScoreCall: SetNewScoreFn;

    // test for spine object
    private _spineBoy: SpineBoy;


    constructor(createNewRandomPositionCallBack: CreateNewRandomPositionFn, setNewScoreCallBack: SetNewScoreFn) {

        this._tankPool = new TankPool(this._tankDie.bind(this));

        this._useEventEffect();

        this._createNewRandomPositionCall = createNewRandomPositionCallBack;
        this._setNewScoreCall = setNewScoreCallBack;

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

    public reset(): void {
        this._spineBoy.remove();

        this._usingTanks.forEach((tank) => {
            tank.remove();
        });

        this._usingTanks = [];
    }

    public init(): void {
        this._getTank(true);

        this._spineBoy.show();
        this._spineBoy.position = this._playerTank.position;
    }

    private _useEventEffect(): void {
        Emitter.on('fire-bullet', this._fireBulletOfSpineBoy.bind(this));
    }

    private _getTank(type: boolean) {
        const tank = this._tankPool.releaseTank(type);

        if (!type) {
            const isCreateBossTank = getRandomBoolean(50);

            if (isCreateBossTank) {
                tank.HP = AppConstants.maxHpOfBossTank;

                // colored tank
                tank.sprite.tint = AppConstants.colorOfBossTank;

                // tank shoot faster
                tank.fireBulletTime = AppConstants.timeFireBulletOfBossTank;

                tank.direction = randomEnumKey(Direction);
            }
        } else {
            this._playerTank = tank;
        }

        tank.rectangle = this._createNewRandomPositionCall(tank.size);

        const position = { x: tank.rectangle.x, y: tank.rectangle.y };

        tank.position = position;

        this._usingTanks.push(tank);

        tank.show();
        tank.HPBar.show();
    }

    private _fireBulletOfSpineBoy(position: IPointData, direction: Direction, isPlayerBullet: boolean): void {
        // animation fire for spine boy
        if (isPlayerBullet) {
            this._spineBoy.addAnimation({ trackIndex: 2, animationName: 'shoot', loop: false, delay:0 });
        }
    }

    /**
     * tank will die
     * @param tank tank which will die
     */
    private _tankDie(tankDie: Tank): void {

        // check tank die is player or AI tank
        if (tankDie.isPlayerTank) {

            // call game over to UI controller
            Emitter.emit(AppConstants.displayGameOverEvent, null);
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
            tankDie.remove();

            tankDie.HPBar.remove();

            // remove from using tank list
            const p = this._usingTanks.findIndex(tank => tank === tankDie);
            this._usingTanks.splice(p, 1);
        }
    }

    /**
     * handle move of tank when have collision
     * @param tank tank which need to handle move
     */
    public handleTankMove(tank: Tank): void {

        // get current direction of tank
        const direction = tank.direction;

        // check collision is allow tank move, if have collision then set tank can not move.
        tank.direction = Direction.STAND;

        const flitchUp = () => {
            const newPosition: IPointData = { x: tank.position.x, y: tank.position.y + AppConstants.distanceFlitchWhenHaveCollision };
            tank.position = newPosition;
        };

        const flitchDown = () => {
            const newPosition: IPointData = { x: tank.position.x, y: tank.position.y - AppConstants.distanceFlitchWhenHaveCollision };
            tank.position = newPosition;
        };

        const flitchLeft = () => {
            const newPosition: IPointData = { x: tank.position.x + AppConstants.distanceFlitchWhenHaveCollision, y: tank.position.y };
            tank.position = newPosition;
        };

        const flitchRight = () => {
            const newPosition: IPointData = { x: tank.position.x - AppConstants.distanceFlitchWhenHaveCollision, y: tank.position.y };
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
                this._getTank(false);
            }

        }

        this._usingTanks.forEach(tank => tank.update(dt));

        // test update for spine boy
        this._spineBoy.update(this._playerTank.position);
    }

}