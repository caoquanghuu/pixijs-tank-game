/* eslint-disable no-unused-vars */
import { Point, Rectangle } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { BaseObject } from './Objects/BaseObject';
import { Tank } from './Objects/Tank';
import { Bullet } from './Objects/Bullet';

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
};

export type AddToSceneFn = (sprite: Sprite) => void;

export type RemoveFromSceneFn = (sprite: Sprite) => void;

export type GetObjectListFn = () => BaseObject[];

export type GetTankListFn = () => Tank[];

export type TankDieFn = (tank: Tank) => void;

export type HandleTankMoveFn = (tank: Tank) => void;

export type GetBulletListFn = () => Bullet[];

export type RemoveBulletFn = (bullet: Bullet) => void;

export type FireBulletFn = (position: Point, direction: Direction, isPlayerBullet: boolean) => void;

export type CreateNewRandomPositionFn = (size: Size) => Rectangle;

export type SetNewScoreFn = (newScore: number) => void;

export type GameOverFn = () => void;

export type RemoveEnvironmentFn = (environment: BaseObject) => void;

export type RemoveRewardObjectFn = (rewardObject: BaseObject) => void;

export type GetRewardObjectsFn = () => BaseObject[];

