import { Sprite } from '@pixi/sprite';
import { Direction, Size } from '../type';
import { BaseEngine } from '../Engine/BaseEngine';
import { AssetsLoader } from '../../AssetsLoader';
import { IPointData, Point, Rectangle } from '@pixi/core';
import { switchFn } from '../util';
import { AppConstants } from '../Constants';

export class BaseObject {
    // a sprite
    private _sprite: Sprite;

    //speed move of the object
    private _speed: number;

    // this ll use for tank when fire bullet
    protected lastDirection: Direction;

    //move engine of this object ll define which type of move
    protected _moveEngine: BaseEngine;

    // size of the image object for avoid wrong when check collision
    private _size: {w: number, h: number};

    // rectangle of object */
    private _rectangle: Rectangle;

    /**
     * constructor a object with option
     * @param id name of object base on asset name, this ll be use to get image too
     */
    constructor(id?: string) {
        // get image for sprite with id
        this._sprite = new Sprite(AssetsLoader.getTexture(id));

        // set middle point for sprite
        this._sprite.anchor.set(0.5);
        this._size = { w: this._sprite.width, h: this._sprite.height };
    }

    get position(): IPointData {
        const position = this.sprite.position;
        return position;
    }

    set position(position: IPointData) {
        this.sprite.position = position;
    }

    get moveEngine() {
        return this._moveEngine;
    }

    set moveEngine(moveEngine: BaseEngine) {
        this._moveEngine = moveEngine;
    }

    set sprite(textureName: string) {
        const assetsTexture = AssetsLoader.getTexture(textureName);
        if (!assetsTexture) {
            console.log('cant get' + `${textureName}`);
        } else {
            this._sprite.texture = assetsTexture;
        }
    }

    set speed(speed: number) {
        this._speed = speed;
    }

    get speed(): number {
        return this._speed;
    }

    get rectangle(): Rectangle {
        return this._rectangle;
    }

    set rectangle(rectangle: Rectangle) {
        this._rectangle = rectangle;
    }

    // method to get this sprite for get position or some thing else
    get sprite(): Sprite {
        return this._sprite;
    }

    // method to get size of this object for check collision
    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;
    }

    public move(deltaTime: number, isBullet) {
        if (!this.moveEngine) {
            return;
        }

        // get direction from move engine
        const direction = this._moveEngine.direction;

        // return if current direction is standing
        if (direction === Direction.STAND) {
            return;
        }

        // assign direction to last direction for bullet fire
        this.lastDirection = direction;

        //calculate next position base on direction, delta time and speed

        let nextX: number, nextY: number;

        const moveUp = () => {
            nextY = (this.position.y) - ((this._speed * deltaTime) / 1000);
            nextX = this.position.x;
        };

        const moveDown = () => {
            nextY = (this.position.y) + ((this._speed * deltaTime) / 1000);
            nextX = this.position.x;
        };

        const moveLeft = () => {
            nextY = this.position.y;
            nextX = (this.position.x) - ((this._speed * deltaTime) / 1000);
        };

        const moveRight = () => {
            nextY = this.position.y;
            nextX = (this.position.x) + ((this._speed * deltaTime) / 1000);
        };

        const moveList = {
            1 : moveUp,
            2 : moveDown,
            3 : moveLeft,
            4 : moveRight,
            'default' : () => {}
        };

        const moveSwitch = switchFn(moveList, 'default');

        moveSwitch(direction);

        if (!isBullet) {
            if (nextX < AppConstants.minScreenUseAbleWidth) {
                // collision top
                nextX = AppConstants.minScreenUseAbleWidth;
            }
            if (nextX > AppConstants.maxScreenUseAbleWidth) {
                // collision right
                nextX = AppConstants.maxScreenUseAbleWidth;
            }

            if (nextY < AppConstants.minScreenUseAbleHeight) {
                // collision top
                nextY = AppConstants.minScreenUseAbleHeight;
            }
            if (nextY > AppConstants.maxScreenUseAbleHeight) {
                // collision bottom
                nextY = AppConstants.maxScreenUseAbleHeight;
            }
        }


        const newPosition: Point = new Point(nextX, nextY);


        //set next position for sprite
        this.position = newPosition;
    }

    // method to set width height of the image
    public setImageSize(size: Size) {
        this.sprite.width = size.w;
        this.sprite.height = size.h;
    }
}