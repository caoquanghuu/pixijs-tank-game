import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();
const Emitter1 = {
    on: (event: string, fn) => eventEmitter.on(event, fn),
    once: (event: string, fn) => eventEmitter.once(event, fn),
    off: (event: string, fn) => eventEmitter.off(event, fn),
    emit: (event: string, payload) => eventEmitter.emit(event, payload),
    remove: () => { eventEmitter.removeAllListeners(); },
};
Object.freeze(Emitter1);
export default Emitter1;