import { SynchronizationBatch } from "../store/store";
import { Reader } from "../reader/reader";
import { Serializer } from "../serializer/serializer";
import { JsonSerializer } from "../serializer/json-serializer";
import { ModelPrototype } from "../model/model";
import { Metadata } from "../model/metadata";
export interface Adapter {
    create(models: Array<any>): Promise<OperationResult>;
    read(options?: ReadOptions): Promise<ReadOperationResult>;
    update(models: Array<any>): Promise<OperationResult>;
    delete(models: Array<any>): Promise<OperationResult>;
    sync(batch: SynchronizationBatch<any>): Promise<BatchOperationResult>;
}
export declare abstract class AbstractAdapter implements Adapter {
    private modelClass;
    private reader;
    private serializer;
    constructor(config: AdapterConfig);
    getReader(): Reader;
    getSerializer(): Serializer;
    getModelClass(): Function;
    protected getModelPrototype(): ModelPrototype;
    getModelMetadata(): Metadata;
    abstract create(models: Array<any>): Promise<OperationResult>;
    abstract read(options?: ReadOptions): Promise<ReadOperationResult>;
    abstract update(models: Array<any>): Promise<OperationResult>;
    abstract delete(models: Array<any>): Promise<OperationResult>;
    abstract sync(batch: SynchronizationBatch<any>): Promise<BatchOperationResult>;
    serializeModelData(models: Array<any>): any[];
}
export declare var defaultReader: Reader;
export declare var defaultSerializer: JsonSerializer;
export interface AdapterConfig {
    modelClass: Function;
    reader?: Reader;
    serializer?: Serializer;
}
export interface ReadOptions {
    params: any;
    filters: any;
    orderBy: any;
}
export interface OperationResult {
    type: string;
    success: boolean;
    data?: any[];
}
export interface ReadOperationResult extends OperationResult {
    total?: number;
    page?: number;
    limit?: number;
    offset?: number;
}
export interface BatchOperationResult {
    create: OperationResult;
    update: OperationResult;
    delete: OperationResult;
}
