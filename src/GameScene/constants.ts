import { Size } from './type';
import { IPointData, Point } from '../pixi';

export namespace AppConstants {
    export const screenWidth: number = 800;
    export const screenHeight: number = 600;
    export const minScreenWidth: number = 0;
    export const minScreenHeight: number = 0;

    export const scoreSpriteWidth: number = 30;
    export const scoreSpriteHeight: number = 30;

    export const minScreenUseAbleWidth: number = 10;
    export const maxScreenUseAbleWidth: number = 790;
    export const minScreenUseAbleHeight: number = 10;
    export const maxScreenUseAbleHeight: number = 590;

    export const defaultScoreDisplayPosition: Point = new Point(760, 10);
    export const positionOfBunker: Point = new Point(400, 580);
    export const textGameOverPosition: IPointData = { x: 180, y: 80 };
    export const textYourScorePosition: IPointData = { x: 180, y: 110 };
    export const buttonReplayPosition: IPointData = { x: 180, y: 180 };

    export const mainMenuTitlePosition: IPointData = { x: 180, y: 60 };
    export const mainMenuButtonPosition: IPointData = { x: 180, y: 180 };

    export const spaceBetweenScoresNumber: number = 17;

    export const volumeOfFireBullet: number = 0.2;
    export const volumeOfExplosion: number = 0.2;
    export const volumeOfTankMoving: number = 0.1;
    export const volumeMainMenuMusic: number = 0.5;

    export const timeExplosionDisappear: number = 100;

    export const explosionSpriteSize: Size = { w: 15, h: 15 };
    export const bunkerSpriteSize: Size = { w: 50, h: 50 };
    export const environmentSpriteSize: Size = { w: 15, h: 15 };
    export const rewardSpriteSize: Size = { w: 20, h: 20 };
    export const bulletSpriteSize: Size = { w: 10, h: 15 };
    export const scaleOfSpineBoy: IPointData = { x: 0.1, y: 0.1 };
    export const tankSpriteSize: Size = { w: 20, h: 20 };

    export const distanceOfObjectsWhenCreate: number = 70;
    export const spaceBetweenFences: number = 7.5;
    export const distanceOfHpBarAndTank: number = 20;

    export const numbersOfEnvironmentObjects: number = 30;

    export const ratioCreateReward: number = 10;
    export const ratioCreateBossTank: number = 50;

    export const timeSpawnTank: number = 20000;
    export const minTimeSpawnTank: number = 10000;
    export const timeFireBulletOfBossTank: number = 3000;
    export const timeFireBulletOfAiTank: number = 5000;
    export const directionChangeTime: number = 2000;

    export const maxHpOfPlayerTank: number = 5;
    export const maxHpOfBossTank: number = 3;
    export const maxHpOfAiTank: number = 1;
    export const maxNumberOfAiTank: number = 20;

    export const colorOfBossTank: string = '106BEE';
    export const colorOfAiTank: string = 'F02468';
    export const colorOfGameOverText: number = 0xff1010;
    export const colorOfYourScoreText: number = 0xff1010;
    export const colorOfReplayText: number = 0xff1010;
    export const colorOfStartButton: number = 0xff1010;

    export const distanceFlitchWhenHaveCollision: number = 2;

    export const fontSizeOfStartButton: number = 14;
    export const fontSizeOfGameOverText: number = 24;
    export const fontSizeOfYourScoreText: number = 14;
    export const fontSizeOfReplayText: number = 11;

    export const forceDirectionCountDown: number = 200;

    export const speedOfBullet: number = 200;
    export const speedOfTank: number = 100;

    export const addToSceneEvent: string = 'add-to-scene';
    export const removeFromSceneEvent: string = 'remove-from-scene';

    export const fireBulletEvent: string = 'fire-bullet';

    export const displayGameOverEvent: string = 'display-game-over';
}