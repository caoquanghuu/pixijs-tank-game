import { Point } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { BaseObject } from "./Objects/BaseObject";
import { Tank } from "./Objects/Tank";
import { Bullet } from "./Objects/Bullet";

export enum Direction {
    STAND,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export type Size = {
    w: number,
    h: number,
}

export type AddToScene = (sprite: Sprite) => void;

export type RemoveFromScene = (srite: Sprite) => void;

export type GetObjectList = () => BaseObject[];

export type GetTankList = () => Tank[];

export type TankDie = (tank: Tank) => void;

export type HandleTankMove = (tank: Tank) => void;

export type GetBulletList = () => Bullet[];

export type RemoveBullet = (bullet: Bullet) => void;

export type FireBullet = (position: Point, direction: Direction, isPlayerBullet: boolean) => void;

