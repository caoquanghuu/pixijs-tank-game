import { Sprite } from "@pixi/sprite";
import { Direction } from "../type";
import { AssetsLoader } from "src/AssetsLoader";
import { BaseEngine } from "../Engine/BaseEngine";

export class BaseObject {
    /**a sprite */
    private _sprite: Sprite;
    /**speed move of the object */
    protected speed: number;
    /** this ll use for tank when fire bullet */
    protected lastDirection: Direction;
    /**move engine of this object ll define which type of move */
    protected moveEngine: BaseEngine;
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

    private _move(deltaTime: number, isBullet: boolean) {
        if (!this.moveEngine) {
            return;
        }

        /** get direction from move engine */

        /**calculate next position base on direction, delta time and speed */

        /**set next position for sprite*/

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