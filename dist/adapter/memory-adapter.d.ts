import { AbstractAdapter, OperationResult, ReadOptions, ReadOperationResult, BatchOperationResult, AdapterConfig } from "./adapter";
import { SynchronizationBatch } from '../store/store';
export declare class MemoryAdapter extends AbstractAdapter {
    private data;
    private idFieldName;
    private lastId;
    constructor(config: MemoryAdapterConfig);
    create(models: Array<any>): Promise<OperationResult>;
    read(options?: ReadOptions): Promise<ReadOperationResult>;
    update(models: Array<any>): Promise<OperationResult>;
    delete(models: Array<any>): Promise<OperationResult>;
    sync(batch: SynchronizationBatch<any>): Promise<BatchOperationResult>;
    private _create(models);
    private _update(models);
    private _delete(models);
    private nextId();
}
export interface MemoryAdapterConfig extends AdapterConfig {
    idFieldName?: string;
}
