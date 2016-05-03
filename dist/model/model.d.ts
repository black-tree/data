import { Metadata, MetadataDefinition } from "./metadata";
import { ModelData } from "./model-data";
import { Field } from "../field/field";
import { IEventDispatcher, IEvent } from "wg-events";
export interface ModelPrototype {
    _modelMetadata_: Metadata;
}
export interface Model {
    modelAspect: ModelAspect;
}
export declare class ModelAspect implements IEventDispatcher {
    private _data;
    private _model;
    private _id;
    private em;
    constructor(model: Model, data: ModelData);
    getMetadata(): Metadata;
    commit(): void;
    commitValue(name: string): void;
    commitValues(names: string[]): void;
    rollback(): void;
    isDirty(): boolean;
    isPersisted(): boolean;
    addEventListener(event: string, listener: Function): void;
    on(event: string, listener: Function): any;
    removeEventListener(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    dispatchEvent(event: string | IEvent): void;
    data: ModelData;
    model: Model;
    id: number;
}
export declare function declareModel(Class: Function, options: ModelDefinition): void;
export interface ModelClass {
    getFields(): Field[];
}
export declare function injectModelApi(ModelClass: any): void;
export declare type ModelDefinition = MetadataDefinition;
