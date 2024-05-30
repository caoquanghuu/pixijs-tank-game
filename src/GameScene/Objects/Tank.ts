// Tank class
import { IPointData, Rectangle } from '../../pixi';
import { RandomEngine } from '../Engine/RandomEngine';
import { BaseObject } from './BaseObject';
import { Direction } from '../type';
import { ControlEngine } from '../Engine/ControlEngine';
import Emitter, { getRandomArbitrary, keyboard } from '../util';
import { HPBar } from './HPBar';
import { sound } from '@pixi/sound';
import { AppConstants } from '../Constants';

export class Tank extends BaseObject {

    // this tank is player or bot
    private _isPlayerTank: boolean;

    // hp of this tank
    private _HPBar: HPBar;

    private _fireBulletTime: number;

    constructor(isPlayer: boolean) {
        // set image of tank is player tank or bot tank
        super(AppConstants.textureName.tankStandUp);

        // set speed of tank
        this.speed = AppConstants.speedOfTank;

        // set last direction of tank
        this.lastDirection = Direction.UP;

        // set size of tank
        this.size = AppConstants.tankSpriteSize;

        this._isPlayerTank = isPlayer;

        this._HPBar = new HPBar(isPlayer);

        // set move engine and type trigger fire bullet for tank base on is player or not
        if (isPlayer) {

            //set control move
            this.moveEngine = new ControlEngine();

            // set hp
            this._HPBar.HP = AppConstants.maxHpOfPlayerTank;

            // set control fire key event by space keyboard
            const fire = keyboard(AppConstants.keyboardEvent.fire);
            fire.press = () => {
                this.fire({ position: this.position, direction: this.lastDirection, isPlayer: true });
            };
        } else {

            // set random move
            this.moveEngine = new RandomEngine();

            //set hp
            this._HPBar.HP = AppConstants.maxHpOfAiTank;

            //change color for bot tank
            this.sprite.tint = AppConstants.colorOfAiTank;

            // set time for fire bullet
            this._fireBulletTime = AppConstants.timeFireBulletOfAiTank;
        }
    }

    get HPBar(): HPBar {
        return this._HPBar;
    }

    get HP(): number {
        return this._HPBar.HP;
    }

    get direction(): Direction {
        return this._moveEngine.direction;
    }

    get isPlayerTank(): boolean {
        return this._isPlayerTank;
    }

    get fireBulletTime(): number {
        return this._fireBulletTime;
    }

    set fireBulletTime(time: number) {
        this._fireBulletTime = time;
    }

    set HP(hp: number) {
        this._HPBar.HP = hp;
    }

    set direction(direction: Direction) {
        this._moveEngine.direction = direction;
    }

    /**
     * tank start to fire bullet
     */
    public fire(option: {position: IPointData, direction: Direction, isPlayer: boolean}) {

        // call fire bullet to tank controller
        Emitter.emit(AppConstants.eventEmitter.fireBullet, option);
    }

    /**
     *  tank hp reduce to 0 and tank will be destroy
     */
    public checkHPOfTank() {
        if (this.HPBar.HP === 0) {
            // call tank die to tank controller
            Emitter.emit(AppConstants.eventEmitter.tankDie, this);
        }
    }

    private playTankMovingSound(direction: Direction) {
        // check sound only for player tank
        if (!this.isPlayerTank) return;

        // when tank moving
        if (direction != Direction.STAND) {

            // check sound is playing or not
            const movingSound = sound.find(AppConstants.soundCfg.tankMoving);

            if (!movingSound.isPlaying) {

                // if sound not playing then play
                sound.play(AppConstants.soundCfg.tankMoving, { volume: AppConstants.volumeOfTankMoving, loop: true });
            }
        } else {
            // stop playing moving sound when tank stop
            sound.stop(AppConstants.soundCfg.tankMoving);
        }

    }

    /**
     * change texture and size of tank when direction of tank change
     * @param direction new direction changed
     */
    private changeTextureFollowDirection(direction: Direction) {
        const tankMoveTexturesName: string[] = AppConstants.tankMoveTexturesName;
        const tankStandTexturesName: string[] = AppConstants.tankStandTexturesName;

        // change texture when tank move
        this.sprite = tankMoveTexturesName[direction - 1];

        // when tank stop move:
        if (direction === Direction.STAND) {
            this.sprite = tankStandTexturesName[this.lastDirection - 1];
        }
    }

    /**
     * Update tank
     * @param dt delta time from ticker
     */
    update(dt: number): void {
        // update rectangle
        this.rectangle = new Rectangle(this.position.x, this.position.y, this.size.w, this.size.h);

        // move
        this.move(dt, false);

        // check hp tank and destroy it if hp = 0
        this.checkHPOfTank();

        // update new direction for random move
        this.moveEngine.update(dt);

        // update this HP
        this._HPBar.update(this.position);

        // change texture when direction of tank change
        this.changeTextureFollowDirection(this.direction);

        // // play tank moving sound
        this.playTankMovingSound(this.direction);

        // set fire bullet call for bot tank
        if (!this._isPlayerTank) {
            this._fireBulletTime -= dt;
            if (this._fireBulletTime <= 0) {
                this.fire({ position: this.position, direction : this.lastDirection, isPlayer: false });
                this._fireBulletTime = getRandomArbitrary(3000, 5000);
            }
        }
    }
}