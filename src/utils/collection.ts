import {EventDispatcher} from "../event/dispatcher";
import {Event} from "../event/event";

export class Collection<T> {

  protected items:T[];

  constructor(items:T[] = []) {
    this.setItems(items);
  }

  setItems(items:T[]) {
    this.clear();
    this.addItems(items);
  }

  clear():void {
    this.items = [];
  }

  add(item:T, position?:number):boolean {
    return this.addItems([item], position).newAdded;
  }

  addItems(items:T[], position?:number):ItemsInsertion<T> {
    let newItems = [];
    items.forEach(item => {
      if (!this.includes(item)) {
        newItems.push(item);
      }
    });
    if (isNaN(position) || position > this.length) {
      position = this.length;
      this.items.push(...newItems);
    } else if (position === 0) {
      this.items.unshift(...newItems);
    } else {

      let leftItems = this.items.slice(0, position);
      let rightItems = this.items.slice(position, this.length);
      this.items = [...leftItems, ...newItems, ...rightItems];
    }
    return new ItemsInsertion(newItems, position);
  }

  delete(item:T):boolean {
    return !!this.deleteItems([item]).length;
  }

  deleteItems(items:T[]):T[] {
    let deleted = [];
    items.forEach(item => {
      let i = this.indexOf(item);
      if (i > -1) {
        this.items.splice(i, 1);
        deleted.push(item);
      }
    });
    return deleted;
  }

  getAt(position:number):T {
    return this.items[position];
  }

  indexOf(item:T):number {
    return this.items.indexOf(item);
  }

  lastIndexOf(item:T):number {
    return this.items.lastIndexOf(item);
  }

  find(callback):T {
    for (let item of this.items) {
      if (callback(item)) {
        return item;
      }
    }
    return undefined;
  }

  findIndex(callback):number {
    let ii = this.items.length;
    let i = 0;
    for (; i < ii; i++) {
      if (callback(this.items[i])) {
        return i;
      }
    }
    return -1;
  }

  includes(item:T, fromIndex = 0):boolean {
    let ii = this.items.length;
    let i = fromIndex;
    for(; i < ii; i++) {
      if (this.items[i] === item) {
        return true;
      }
    }
    return false;
  }

  first():T {
    return this.items[0];
  }

  last():T {
    return this.items[this.length - 1]
  }

  slice(start:number, end:number):T[] {
    return this.items.slice(start, end);
  }

  getItems():T[] {
    return Array.from(this.items || []);
  }
  
  get length():number {
    return this.items.length;
  }
}

export class ObservableCollection<T> extends Collection<T> {

  private dispatcher:EventDispatcher;

  private resetting:boolean;

  constructor(items:T[] = []) {
    super(items);
    this.dispatcher = new EventDispatcher();
  }


  setItems(items:T[]) {
    let oldItems = this.items;
    this.resetting = true;
    super.setItems(items);
    this.resetting = false;
    if (oldItems) {
      this.dispatchItemsSetEvent(oldItems, this.getItems());
    }
  }

  addItems(items:T[], position?:number):ItemsInsertion<T> {
    let insertions = super.addItems(items, position);
    if (!this.resetting) {
      this.dispatchItemsAddedEvent(insertions.items);
    }
    return insertions;
  }

  deleteItems(items:T[]):any[] {
    let deleted = super.deleteItems(items);
    this.dispatchItemsDeletedEvent(deleted);
    return deleted;
  }


  clear():void {
    let oldItems = this.getItems();
    super.clear();
    if (!this.resetting) {
      this.dispatchItemsClearedEvent(oldItems);
    }
  }
  
  on(event:string, listener:Function) {
    this.dispatcher.on(event, listener);
  }
  
  off(event:string, listener:Function) {
    this.dispatcher.off(event, listener);
  }

  private dispatchItemsAddedEvent(items:T[]) {
    if (items.length) {
      this.dispatcher.dispatchEvent(<ItemsAddedEvent<T>>{
        name: 'items-added',
        items: items,
        collection: this
      });
    }
  }

  private dispatchItemsDeletedEvent(items:T[]) {
    if (items.length) {
      this.dispatcher.dispatchEvent(<ItemsDeletedEvent<T>>{
        name: 'items-deleted',
        items: items,
        collection: this
      });
    }
  }

  private dispatchItemsSetEvent(oldItems:T[], newItems:T[]) {
    this.dispatcher.dispatchEvent(<ItemsSetEvent<T>>{
      name: 'items-set',
      newItems: newItems,
      oldItems: oldItems,
      collection: this
    });
  }

  private dispatchItemsClearedEvent(oldItems:T[]) {
    this.dispatcher.dispatchEvent(<ItemsClearedEvent<T>>{
      name: 'items-cleared',
      oldItems: oldItems,
      collection: this
    });
  }
}

export class ItemsInsertion<T> {

  items:T[];

  position:number;

  constructor(items:T[], position:number) {
    this.items = items;
    this.position = position;
  }

  get newAdded():boolean {
    return !!this.items.length;
  }
}

export interface ItemsAddedEvent<T> extends Event {

  items:any[];

  collection:ObservableCollection<T>;

}

export interface ItemsDeletedEvent<T> extends Event {

  items:any[];

  collection:ObservableCollection<T>;

}

export interface ItemsSetEvent<T> extends Event {

  oldItems:any[];

  newItems:any[];

  collection:ObservableCollection<T>;

}

export interface ItemsClearedEvent<T> extends Event {

  oldItems:any[];

  collection:ObservableCollection<T>;

}
