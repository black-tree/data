import { Filter } from "./filter";
export declare class Collection<T> {
    protected items: T[];
    constructor(items?: T[]);
    setItems(items: T[]): void;
    clear(): void;
    add(item: T, position?: number): boolean;
    addItems(items: T[], position?: number): ItemsInsertion<T>;
    delete(item: T): boolean;
    deleteItems(items: T[]): T[];
    getAt(position: number): T;
    indexOf(item: T): number;
    lastIndexOf(item: T): number;
    private compileSearchCriteria(criteria);
    filter(filter: Filter): T[];
    findBy(criteria: SearchCriteria): T[];
    findOneBy(criteria: SearchCriteria): T;
    findIndex(criteria: SearchCriteria): number;
    includes(item: T, fromIndex?: number): boolean;
    first(): T;
    last(): T;
    slice(start: number, end: number): T[];
    getItems(): T[];
    forEach(callback: (value: T, index: number, array: T[]) => void): void;
    length: number;
}
export declare type SearchCriteria = {
    [propertyName: string]: any;
} | Function;
export declare class ItemsInsertion<T> {
    items: T[];
    position: number;
    constructor(items: T[], position: number);
    newAdded: boolean;
}
