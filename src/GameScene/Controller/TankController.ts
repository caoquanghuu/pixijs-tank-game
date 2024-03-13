import { Point, Rectangle } from '@pixi/core';
import { Tank } from '../Objects/Tank';
import { TankPool } from '../TankPool';
import { Direction } from '../type';
import Emitter, { getRandomArbitrary, getRandomBoolean, randomEnumKey, switchFn } from '../util';
import { SpineBoy } from '../Objects/SpineBoy';

export class TankController {

    private _usingTanks: Tank[] = [];
    private _spawnTankTime: number = 20000;
    private _playerTank: Tank;
    private _tankPool: TankPool;
    private _randomRectangle: Rectangle;

    // test for spine object
    private _spineBoy: SpineBoy;


    constructor() {

        this._tankPool = new TankPool();

        this._useEventEffect();

        // spawnTank every spawnTankTime
        this.spawnTank();

        // create a player tank
        this._playerTank = new Tank(true);
        this._usingTanks.push(this._playerTank);
        Emitter.emit('add-to-scene', this._playerTank.sprite);
        Emitter.emit('create-random-position', this._playerTank.size);
        this._playerTank.rectangle = this._randomRectangle;

        const position = new Point(this._playerTank.rectangle.x, this._playerTank.rectangle.y);

        this._playerTank.position = position;
        // test add spine boy on player tank
        this._spineBoy = new SpineBoy();
        this._spineBoy.loadBundle('assets/units/spine2d/spine-boy/spine-boy-pro.json').then(() => {
            this._spineBoy.setAnimation({ trackIndex:0, animationName: 'idle', loop: true });
            this._spineBoy.position = this._playerTank.position;
            Emitter.emit('add-to-scene', this._spineBoy.spine);
        });
    }

    private _useEventEffect() {
        Emitter.on('fire-bullet', (option: {position: Point, direction: Direction, isPlayer: boolean}) => {
            this.fireBullet(option.position, option.direction, option.isPlayer);
        });
        Emitter.on('tank-die', (tank: Tank) => {
            this.tankDie(tank);
        });
        Emitter.on('get-tank-list', () => {
            Emitter.emit('return-tank-list', this.usingTankList);
        });
        Emitter.on('return-random-position', (rectangle: Rectangle) => {
            this._randomRectangle = rectangle;
        });
        Emitter.on('handle-tank-move', (tank: Tank) => {
            this.handleTankMove(tank);
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

        Emitter.emit('create-random-position', tank.size);
        tank.rectangle = this._randomRectangle;

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
        tank.HP = 3;

        // colored tank
        tank.sprite.tint = '106BEE';

        // tank shoot faster
        tank.fireBulletTime = 3000;
    }

    public fireBullet(position: Point, direction: Direction, isPlayerBullet: boolean) {
        Emitter.emit('create-bullet', { position, direction, isPlayerBullet });

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

            // call game over to game scene
            Emitter.emit('display-game-over', null);
        } else {

            //return tank to tank pool
            this._tankPool.getTank(tankDie);

            // update score of player
            Emitter.emit('plus-score', 1);

            // set back hp for tank
            tankDie.HP = 1;

            // set tank fire time back
            tankDie.fireBulletTime = 5000;

            // set back color for tank
            tankDie.sprite.tint = 'F02468';

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

        // test update for spine boy
        this._spineBoy.update(this._playerTank.position);
    }

    /**method get tank list for check collision can access */
    get usingTankList(): Tank[] {
        return this._usingTanks;
    }
}