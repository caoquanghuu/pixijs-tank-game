import { Point, Rectangle } from "@pixi/core";
import { getDistanceOfTwoPosition, getRandomArbitrary } from "../util";
import { Size } from "../type";

export class PositionMap {
    // static
    public static _positions: Rectangle[] = [];

    public static _keyInStaticArrayRectangle: number;

    public keyInArrayRectangle: number;

    constructor() {
        this.keyInArrayRectangle = PositionMap._positions.length;
    }

    public static setPositionMap(rectangle: Rectangle, keyInStaticArrayPosition: number) {
        PositionMap._positions[keyInStaticArrayPosition - 1] = rectangle;
    }

    public static getMoveDistance(currentPosition: Point, nextPosition: Point, isBullet: boolean) {
        if (nextPosition.x < 10) {
        // cham trai
            nextPosition.x = 10;
        }
        if (nextPosition.x > 790) {
        // cham phai
            nextPosition.x = 790;
        }

        if (nextPosition.y < 10) {
        // cham tren
            nextPosition.y = 10;
        }
        if (nextPosition.y > 590) {
            nextPosition.y = 590;
        }
        return nextPosition;
    }

    static checkPositionIsAvailable(r1: Rectangle, r2: Rectangle) {
        if (r1.x + r1.width >= r2.x &&
            r1.x <= r2.x + r2.width &&
            r1.y + r1.height >= r2.y &&
            r1.y <= r2.y + r2.height) {
            return false;
        }
        return true;
    }

    static createNewPosition(size: Size): Rectangle {
        const rectangle = new Rectangle(null, null, size.w, size.h);
        for (let i = 0; i < 999; i++) {

            const position: Point = new Point();

            position.set(getRandomArbitrary(0, 790), getRandomArbitrary(0, 590));

            rectangle.x = position.x;
            rectangle.y = position.y;

            const isPositionAvailable = PositionMap._positions.some(position => {
                const isAvailable = PositionMap.checkPositionIsAvailable(rectangle, position);
                if (isAvailable) {
                    return true;
                }
            });

            if (isPositionAvailable) {
                break;
            }
        }
        return rectangle;
    }
}