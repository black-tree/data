import {Filter} from "./filter";
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

  private compileSearchCriteria(criteria:SearchCriteria):Function {
    if (typeof criteria === 'function') {
      return <Function>criteria;
    }
    return (model) => {
      for (let field in criteria) {
        if (criteria.hasOwnProperty(field)) {
          if (model[field] !== criteria[field]) {
            return false;
          }
        }
      }
      return true;
    };
  }
  
  filter(filter:Filter):T[] {
    let matches = [];
    for (let item of this.items) {
      if (filter.matches(item)) {
        matches.push(item);
      }
    }
    return matches;
  }

  findBy(criteria:SearchCriteria):T[] {
    let items = [];
    let callback = this.compileSearchCriteria(criteria);
    for (let item of this.items) {
      if (callback(item)) {
        items.push(item);
      }
    }
    return items;
  }

  findOneBy(criteria:SearchCriteria):T {
    let i = this.findIndex(criteria);
    if (i > -1) {
      return this.items[i];
    }
    return undefined;
  }

  findIndex(criteria:SearchCriteria):number {
    let callback = this.compileSearchCriteria(criteria);
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

  forEach(callback:(value: T, index: number, array: T[]) => void):void {
    this.items.forEach(callback);
  }
  
  get length():number {
    return this.items.length;
  }
}

export type SearchCriteria = {[propertyName:string]: any}|Function;

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
