import { HttpClient } from "aurelia-http-client";
import { SynchronizationBatch } from "../store/store";
import { AbstractAdapter, OperationResult, ReadOperationResult, ReadOptions, BatchOperationResult, AdapterConfig } from "./adapter";
export declare class HttpAdapter extends AbstractAdapter {
    private httpClient;
    private api;
    constructor(config: HttpAdapterConfig);
    create(models: Array<any>): Promise<OperationResult>;
    read(options?: ReadOptions): Promise<ReadOperationResult>;
    update(models: Array<any>): Promise<OperationResult>;
    delete(models: Array<any>): Promise<OperationResult>;
    sync(batch: SynchronizationBatch<any>): Promise<BatchOperationResult>;
    getHttpClient(): HttpClient;
}
export interface HttpAdapterConfig extends AdapterConfig {
    httpClient?: HttpClient;
    api: HttpApi;
}
export interface HttpApi {
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
}
