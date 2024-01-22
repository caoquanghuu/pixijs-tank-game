import { Point } from "@pixi/core";
import { Sprite } from "@pixi/sprite";

export enum Direction {
    STAND,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export type AddToScene = (sprite : Sprite) => void;

export type RemoveFromScene = (srite : Sprite) => void;

export type FireBullet = (position: Point, direction: Direction, isPlayerBullet: boolean) => void;

