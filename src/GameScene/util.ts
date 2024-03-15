import { IPointData, Rectangle } from '../pixi';
import EventEmitter from 'eventemitter3';
import { BaseObject } from './Objects/BaseObject';
import { Direction } from './type';

export const randomEnumKey = (enumeration: any): any => {
    const keys = Object.keys(enumeration).filter(
        (k) => !(Math.abs(Number.parseInt(k)) + 1)
    );
    const enumKey = keys[Math.floor(Math.random() * keys.length)];
    return enumeration[enumKey];
};

export function getRandomArbitrary(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function keyboard(value: any) {
    const key: any = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = (event) => {
        if (event.key === key.value) {
            if (key.isUp && key.press) {
                key.press();
            }
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = (event) => {
        if (event.key === key.value) {
            if (key.isDown && key.release) {
                key.release();
            }
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener('keydown', downListener, false);
    window.addEventListener('keyup', upListener, false);

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener('keydown', downListener);
        window.removeEventListener('keyup', upListener);
    };

    return key;
}

export function getDistanceOfTwoPosition(pos1: IPointData, pos2: IPointData): number {
    const distance: number = Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
    return distance;
}

export const switchFn = (lookupObject, defaultCase = '_default') => expression => (lookupObject[expression] || lookupObject[defaultCase])();

/**
 * function random return a boolean result base on percent
 * @param percent percent want to take true result
 */
export function getRandomBoolean(percent: number): boolean {
    const randomNumber = getRandomArbitrary(1, 100);
    if (randomNumber <= percent) {
        return true;
    } else {
        return false;
    }
}

export function checkCollisionBetweenTwoRectangle(r1: Rectangle, r2: Rectangle): boolean {

    if (r1.x + r1.width / 2 >= r2.x - r2.width / 2 &&
        r1.x - r1.width / 2 <= r2.x + r2.width / 2 &&
        r1.y + r1.height / 2 >= r2.y - r2.height / 2 &&
        r1.y - r1.height / 2 <= r2.y + r2.height / 2) {
        return true;
    }
    return false;
}

/**
     * check collision of 2 object
     * @param object1 object list 1
     * @param object2 object list 2
     */
export function checkCollision(object1: BaseObject, object2: BaseObject): boolean {

    const aBox = new Rectangle(object1.sprite.x, object1.sprite.y, object1.size.w, object1.size.h);
    const bBox = new Rectangle(object2.sprite.x, object2.sprite.y, object2.size.w, object2.size.h);
    // const aBox = object1.sprite.getBounds();
    // const bBox = object2.sprite.getBounds();

    return checkCollisionBetweenTwoRectangle(aBox, bBox);
}

/**
     * random get a direction from enum
     */
export function createRandomDirection(): Direction {

    // random to get direction from enum Direction
    const direction = randomEnumKey(Direction);

    return direction;
}

const eventEmitter = new EventEmitter();
const Emitter = {
    on: (event: string, fn) => eventEmitter.on(event, fn),
    once: (event: string, fn) => eventEmitter.once(event, fn),
    off: (event: string, fn) => eventEmitter.off(event, fn),
    emit: (event: string, payload) => eventEmitter.emit(event, payload),
    remove: () => eventEmitter.removeAllListeners(),
};
Object.freeze(Emitter);
export default Emitter;
