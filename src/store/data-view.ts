import {Store, ModelsAddedEvent, ModelChangedEvent, DataLoadedEvent} from "./store";
import {FilterChain, Filter} from "../utils/filter";
import {IEventDispatcher, IEvent} from "wg-events";
import {EventManager} from "wg-events";

export class StoreDataView<ModelClass> implements IEventDispatcher{
  
  private store:Store<ModelClass>;

  private items:any[];

  private filters:FilterChain = new FilterChain();

  private em:EventManager = new EventManager(this);

  private storeEvents:{[s:string]: Function};

  constructor(store:Store<ModelClass>) {
    this.items = store.getAll();

    this.storeEvents = {
      'models-added': this.onModelsAdded,
      'models-deleted': this.onModelsDeleted,
      'model-changed': this.onModelChanged,
      'data-loaded': this.onDataLoaded
    };

    this.bindStore(store);
  }

  addFilter(filter:Filter):void {
    this.filters.addFilter(filter);
    this.refresh();
    this.em.dispatchEvent({
      name: 'filters-applied'
    });
  }

  removeFilter(filter:Filter) {
    if (this.filters.removeFilter(filter)) {
      this.refresh();
      this.em.dispatchEvent(<FiltersAppliedEvent>{
        name: 'filters-applied'
      });
    }
  }
  
  private bindStore(store) {
    this.unbindStore();
    this.store = store;
    for(let event in this.storeEvents){
      if (this.storeEvents.hasOwnProperty(event)) {
        this.em.attachEventListener(this.store, event, this.storeEvents[event]);
      }
    }
  }

  private unbindStore() {
    if (this.store) {
      this.em.detachEventListeners(this.store);
    }
    this.store = undefined;
  }

  private onModelsAdded = (e:ModelsAddedEvent<ModelClass>) => {
    this.refresh();
    this.em.dispatchEvent(<ItemsAddedEvent<ModelClass>>{
      name: 'items-added',
      items: e.models
    });
  };
  
  private onModelsDeleted = (e:ModelsAddedEvent<ModelClass>) => {
    this.refresh();
    this.em.dispatchEvent(<ItemsDeletedEvent>{
      name: 'items-deleted',
      items: e.models
    });
  };
  
  private onModelChanged = (e:ModelChangedEvent<ModelClass>) => {
    if (this.hasItem(e.model)) {
      if (this.isFiltered()) {
        this.refresh();
      }
      this.em.dispatchEvent(<ItemChangedEvent<ModelClass>>{
        name: 'item-changed',
        item: e.model
      });
    }
  };
  
  private onDataLoaded = (e:DataLoadedEvent<ModelClass>) => {
    this.refresh();
    this.em.dispatchEvent(<ItemsLoadedEvent<ModelClass>>{
      name: 'items-loaded',
      items: e.data
    });
  };

  private refresh() {
    this.items = this.applyFilters(this.store.getAll());
  }

  private applyFilters(data:any[]) {
    let items = [];
    if (!this.isFiltered()) {
      items.push(...data);
    } else {
      items = data.filter(this.filters.toCallback());
    }
    return items;
  }

  isFiltered():boolean {
    return this.filters.getFilters().length !== 0;
  }
  
  private hasItem(item:any):boolean {
    return this.items.indexOf(item) !== -1;
  }
  
  addEventListener(event:string, listener:Function) {
    this.em.addEventListener(event, listener);
  }
  
  dispatchEvent(event:string|IEvent) {
    this.em.dispatchEvent(event);
  }
  
  on(event:string, listener:Function) {
    this.em.on(event, listener);
  }
  
  removeEventListener(event:string, listener:Function) {
    this.em.removeEventListener(event, listener);
  }
  
  off(event:string, listener:Function) {
    this.em.off(event, listener);
  }
  
  getItems():ModelClass[] {
    return this.items.slice(0);
  }
  
  dispose():void {
    this.unbindStore();
  }
}

export interface ItemsAddedEvent<ModelClass> extends IEvent{

  items:ModelClass[];

}

export interface ItemsDeletedEvent extends IEvent{

  items:any[];

}

export interface ItemChangedEvent<ModelClass> extends IEvent {
  
  item:any;
  
}

export interface FiltersAppliedEvent extends IEvent {

}

export interface ItemsLoadedEvent<ModelClass> extends IEvent {

  items:ModelClass[];
}
