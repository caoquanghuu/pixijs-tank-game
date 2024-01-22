import { Sprite } from "@pixi/sprite";
import { Direction } from "../type";
import { BaseEngine } from "../Engine/BaseEngine";
import { AssetsLoader } from "../../AssetsLoader";
import { PositionMap} from '../Map/PositionMap';
import { ObservablePoint, Point } from "@pixi/core";

export class BaseObject {
    /**a sprite */
    private _sprite: Sprite;
    /**speed move of the object */
    protected speed: number;
    /** this ll use for tank when fire bullet */
    protected lastDirection: Direction;
    /**move engine of this object ll define which type of move */
    protected _moveEngine: BaseEngine;
    /** size of the image object for avoid wrong when check collision */
    private _size: number;

    /**
     * constructor a object with option
     * @param id name of object base on asset name, this ll be use to get image too
     */
    constructor(id: string) {
        /** get image for sprite with id*/
        this._sprite = new Sprite(AssetsLoader.getTexture(id));

        /** set middle point for sprite*/
        this._sprite.anchor.set(0.5);
    }

    private calculateObjectSize(sprite: Sprite) {
        /**base on the sprite calculate the size of this object */

        /** then set this size */
    }

    get moveEngine() {
        return this._moveEngine;
    }

    set moveEngine(moveEngine: BaseEngine) {
        this._moveEngine = moveEngine;
    }

    set sprite(texture: string) {
        this._sprite.texture = AssetsLoader.getTexture(texture);
    }

    public move(deltaTime: number, isBullet: boolean) {
        if (!this.moveEngine) {
            return;
        }

        /** get direction from move engine */
        const direction = this._moveEngine.direction;

        /** return if current direction is standing*/
        if (direction === Direction.STAND) {
            return;
        }

        /** assign direction to last direction for bullet fire */
        this.lastDirection = direction;

        /**calculate next position base on direction, delta time and speed */

        let nextX: number, nextY: number;

        switch (direction) {
            case Direction.UP:
                nextY = (this._sprite.position.y) - ((this.speed * deltaTime) / 1000);
                nextX = this._sprite.position.x;
                break;
            case Direction.DOWN:
                nextY = (this._sprite.position.y) + ((this.speed * deltaTime) / 1000);
                nextX = this._sprite.position.x;
                break;
            case Direction.LEFT:
                nextY = this._sprite.position.y;
                nextX = (this._sprite.position.x) - ((this.speed * deltaTime) / 1000);
                break;
            case Direction.RIGHT:
                nextY = this._sprite.position.y;
                nextX = (this._sprite.position.x) + ((this.speed * deltaTime) / 1000);
                break;
            default:
                break;
        }

        const position: Point = new Point(nextX, nextY);

        const nextPosition = PositionMap.getMoveDistance(this.sprite.position, position, isBullet)

        /**set next position for sprite*/
        this._sprite.x = nextPosition.x;
        this._sprite.y = nextPosition.y;
        /**change image follow to direction*/
    }

    /**method to get this sprite for get position or some thing else */
    get sprite(): Sprite {
        return this._sprite;
    }

    /**method to get size of this object for check collision */
    get size(): number {
        return this._size;
    }
}