import {Event} from './event';

export class EventDispatcher {

  private _listeners:{[event:string]: Set<Function>};

  on(event:string, listener:Function):void {
    let listenersForEvent = this.listeners[event];
    if (!listenersForEvent) {
      listenersForEvent = new Set<Function>();
      this.listeners[event] = listenersForEvent;
    }
    listenersForEvent.add(listener);
  }

  off(event:string, listener:Function) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].delete(listener);
    if ((<any>this.listeners[event]).size === 0) {
      delete this.listeners[event];
    }
  }

  dispatchEvent(event:string|Event, ...args) {
    if (typeof event === 'string') {
      event = <Event>{name: event};
    }
    let listeners = this.listeners[(<Event>event).name];
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => {
      listener(event, ...args);
    });
  }

  get listeners() {
    if (!this._listeners) {
      this._listeners = {};
    }
    return this._listeners;
  }
}
