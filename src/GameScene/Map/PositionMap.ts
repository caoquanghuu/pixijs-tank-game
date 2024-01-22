import { Point } from "@pixi/core";

export class PositionMap {
    // static
    public static _positions: Point[] = [];

    private static _countPositionOfTanks: number = 0;

    private _keyInStaticArrayPosition: number;

    constructor() {
        PositionMap._countPositionOfTanks += 1;
        this._keyInStaticArrayPosition = PositionMap._countPositionOfTanks;
    }

    get keyInStaticArrayPosition() {
        return this._keyInStaticArrayPosition;
    }

    public static setPositionMap(position: Point, keyInStaticArrayPosition: number) {
        PositionMap._positions[keyInStaticArrayPosition - 1] = position;
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

        // // kiem tra xem co phai bullet khong
        // if (!isBullet) {
        // // loai bo vi tri cua tank khoi position map
        //     let newPositionMap = PositionMap._positions;
        //     const i = newPositionMap.findIndex(
        //         (position) => position === currentPosition
        //     );
        //     delete newPositionMap[i];

        //     //kiem tra xem next position co gan voi cac tank khac khong
        //     const isNextPositionCloseWithOtherTank = newPositionMap.some(
        //         (positions) => {
        //             const distance = getDistanceOfTwoPosition(positions, nextPosition);
        //             if (distance <= 70) {
        //                 return true;
        //             }
        //         }
        //     );

        //     if (isNextPositionCloseWithOtherTank) {
        //         return currentPosition;
        //     }
        // }

        return nextPosition;
    }
}