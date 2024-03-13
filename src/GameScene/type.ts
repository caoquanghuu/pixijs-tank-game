/* eslint-disable no-unused-vars */

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

export type AnimationOption = {
    trackIndex: number,
    animationName: string,
    loop: boolean
};

export interface AddAnimationOption extends AnimationOption {
    delay: number
}