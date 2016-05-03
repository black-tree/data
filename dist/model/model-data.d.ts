import { IEvent, IEventDispatcher } from "wg-events";
export declare class ModelData implements IEventDispatcher {
    private values;
    private dirty;
    private model;
    private eventDispatcher;
    constructor(model: any, values?: {
        [s: string]: any;
    });
    setValue(property: any, value: any): void;
    setValues(values: {
        [s: string]: any;
    }): void;
    private _setValue(property, value);
    getValue(property: any): any;
    getValues(): {
        [s: string]: any;
    };
    commit(): void;
    commitValue(property: string): void;
    commitValues(properties: string[]): void;
    rollback(): void;
    isDirty(): boolean;
    hasDirtyValue(property: any): boolean;
    getChanges(): ValueChange[];
    private getChange(value);
    private dispatchDataChangedEvent(values);
    private dispatchDataCommittedEvent(committed);
    addEventListener(event: string, listener: Function): any;
    on(event: string, listener: Function): any;
    removeEventListener(event: string, listener: Function): any;
    off(event: string, listener: Function): any;
    dispatchEvent(event: string | IEvent): any;
}
export declare class DataValue {
    private name;
    private value;
    private oldValue;
    private committedValue;
    private valuesDiffer;
    constructor(name: string, value?: any);
    setValue(value: any): boolean;
    getValue(): any;
    getOldValue(): any;
    getCommittedValue(): any;
    getName(): string;
    commit(): boolean;
    rollback(): void;
    isDirty(): boolean;
    setValuesDifferHandler(handler: (v1, v2) => boolean): void;
    static valuesDiffer(v1: any, v2: any): boolean;
}
export interface ValueChange {
    propertyName: string;
    oldValue: any;
    newValue: any;
}
export interface DataChangedEvent extends IEvent {
    changes: ValueChange[];
    data: ModelData;
    model: any;
}
export interface DataCommittedEvent extends IEvent {
    properties: string[];
    data: ModelData;
    model: any;
}
