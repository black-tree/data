import { SearchCriteria } from "../utils/collection";
import { BatchOperationResult, Adapter } from "../adapter/adapter";
import { IEvent, IEventDispatcher } from "wg-events";
import { Instantiator, PrototypeInjectionInstantiator } from "../utils/instantiator";
export declare class Store<ModelClass> implements IEventDispatcher {
    private modelClass;
    private adapter;
    private models;
    private scheduledForInsertion;
    private scheduledForUpdate;
    private scheduledForDeletion;
    private eventDispatcher;
    private instantiator;
    static defaultInstantiator: PrototypeInjectionInstantiator;
    constructor(config?: StoreConfig);
    load(options: any): Promise<ModelClass[]>;
    setData(models: any[]): Array<ModelClass>;
    add(modelOrModels: any): Array<ModelClass>;
    delete(modelOrModels: ModelClass | ModelClass[]): Array<ModelClass>;
    findById(id: any): ModelClass;
    findOneBy(criteria: SearchCriteria): ModelClass;
    findBy(criteria: SearchCriteria): ModelClass[];
    findAt(position: number): ModelClass;
    synchronize(): Promise<BatchOperationResult>;
    private handleSynchronizationResult(result, batch);
    getSynchronizationBatch(): SynchronizationBatch<ModelClass>;
    getAdapter(): Adapter;
    addEventListener(event: string, listener: Function): void;
    dispatchEvent(event: string | IEvent): void;
    on(event: string, listener: Function): void;
    removeEventListener(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    private bindAddedModels(models);
    private bindModelListeners(model);
    private unbindModelListeners(model);
    private onModelDataChanged;
    private onModelDataCommitted;
    private setAddedModelsState(model);
    private updateModelState(model);
    getAll(): Array<ModelClass>;
    private ensureModel(object);
    private ensureModels(objects);
    isModel(object: any): boolean;
    private getModelPrototype();
    private handleModelDeletion(model);
    private handleInsertionResult(result, forInsertion);
    private handleUpdateResult(result, forUpdate, beforeUpdateSnapshot);
    private handleDeletionResult(result, forDeletion);
    private getMetadata();
    static events: {
        MODELS_ADDED: string;
        MODEL_CHANGED: string;
        DATA_LOADED: string;
        MODELS_DELETED: string;
        MODELS_DESTROYED: string;
        MODELS_SAVED: string;
    };
}
export interface StoreConfig {
    modelClass?: {
        new ();
    };
    adapter?: Adapter;
    data?: any[];
    instantiator?: Instantiator;
}
export declare class SynchronizationBatch<ModelClass> {
    forInsertion: ModelClass[];
    forUpdate: ModelClass[];
    forDeletion: ModelClass[];
    forUpdateSnapshot: any[];
    constructor(options: any);
}
export interface ModelChangedEvent<ModelClass> extends IEvent {
    model: ModelClass;
}
export interface ModelsAddedEvent<ModelClass> extends IEvent {
    models: ModelClass[];
}
export interface DataLoadedEvent<ModelClass> extends IEvent {
    data: ModelClass[];
}
export interface ModelsDeletedEvent<ModelClass> extends IEvent {
    models: ModelClass[];
}
export interface ModelsSavedEvent<ModelClass> extends IEvent {
    updated: ModelClass[];
    inserted: ModelClass[];
}
export interface ModelsDestroyedEvent<ModelClass> extends IEvent {
    models: ModelClass[];
}
