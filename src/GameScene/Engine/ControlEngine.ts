import { Direction} from "../type";
import { keyboard } from "../util";
import { BaseEngine } from "./BaseEngine";

export class ControlEngine extends BaseEngine {
    /**
     * constructor to create event listener to player control
     */
    constructor() {
        super();
        /** add event listener for keydown */
        const left = keyboard('ArrowLeft'),
            up = keyboard('ArrowUp'),
            right = keyboard('ArrowRight'),
            down = keyboard('ArrowDown');
        left.press = () => {
            this.direction = Direction.LEFT;
        };
        left.release = () => {
            this.direction = Direction.STAND;
        };
        right.press = () => {
            this.direction = Direction.RIGHT;
        };
        right.release = () => {
            this.direction = Direction.STAND;
        };
        up.press = () => {
            this.direction = Direction.UP;
        };
        up.release = () => {
            this.direction = Direction.STAND;
        };
        down.press = () => {
            this.direction = Direction.DOWN;
        };
        down.release = () => {
            this.direction = Direction.STAND;
        };
    }
}