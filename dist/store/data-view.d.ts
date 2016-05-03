import { Store } from "./store";
import { Filter } from "../utils/filter";
import { IEventDispatcher, IEvent } from "wg-events";
export declare class StoreDataView<ModelClass> implements IEventDispatcher {
    private store;
    private items;
    private filters;
    private em;
    private storeEvents;
    constructor(store: Store<ModelClass>);
    addFilter(filter: Filter): void;
    removeFilter(filter: Filter): void;
    private bindStore(store);
    private unbindStore();
    private onModelsAdded;
    private onModelsDeleted;
    private onModelChanged;
    private onDataLoaded;
    private refresh();
    private applyFilters(data);
    isFiltered(): boolean;
    private hasItem(item);
    addEventListener(event: string, listener: Function): void;
    dispatchEvent(event: string | IEvent): void;
    on(event: string, listener: Function): void;
    removeEventListener(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    getItems(): ModelClass[];
    dispose(): void;
}
export interface ItemsAddedEvent<ModelClass> extends IEvent {
    items: ModelClass[];
}
export interface ItemsDeletedEvent extends IEvent {
    items: any[];
}
export interface ItemChangedEvent<ModelClass> extends IEvent {
    item: any;
}
export interface FiltersAppliedEvent extends IEvent {
}
export interface ItemsLoadedEvent<ModelClass> extends IEvent {
    items: ModelClass[];
}
