import {
  AbstractAdapter,
  OperationResult,
  ReadOptions,
  ReadOperationResult,
  BatchOperationResult, AdapterConfig
} from "./adapter";

import {SynchronizationBatch} from '../store/store';

export class MemoryAdapter extends AbstractAdapter {
  
  private data:any[] = [];
  
  private idFieldName:string;
  
  private lastId:number = 0;
  
  
  constructor(config:MemoryAdapterConfig) {
    super(config);
    this.idFieldName = config.idFieldName || 'id';
  }
  
  create(models:Array<any>):Promise<OperationResult> {
    return Promise.resolve(this._create(models));
  }
  
  read(options?:ReadOptions):Promise<ReadOperationResult> {
    return Promise.resolve({
      type: 'read',
      success: true,
      data: this.data.slice(0)
    });
  }
  
  update(models:Array<any>):Promise<OperationResult> {
    return Promise.resolve(this._update(models));
  }

  delete(models:Array<any>):Promise<OperationResult> {
    return Promise.resolve(this._delete(models));
  }
  
  sync(batch:SynchronizationBatch<any>):Promise<BatchOperationResult> {
    return Promise.resolve({
      create: this._create(batch.forInsertion),
      update: this._update(batch.forUpdate),
      delete: this._delete(batch.forDeletion)
    });
  }

  private _create(models:Array<any>):OperationResult {
    let data = this.serializeModelData(models);
    data.forEach(record => {
      record[this.idFieldName] = this.nextId();
      this.data[record[this.idFieldName]] = record;
    });

    return {
      type: 'create',
      success: true,
      data: data.slice(0)
    };
  }

  private _update(models:any[]):OperationResult {
    let data = this.serializeModelData(models);
    data.forEach(record => {
      record[this.idFieldName] = this.nextId();
      this.data[record[this.idFieldName]] = record;
    });

    return {
      type: 'update',
      success: true,
      data: data.slice(0)
    };
  }

  private _delete(models:any[]):OperationResult {
    models.forEach(model => {
      let id = model[this.idFieldName];
      this.data.splice(id, 1);
    });
    return {
      type: 'delete',
      success: true
    };
  }
  private nextId():number {
    return ++this.lastId;
  }
}

export interface MemoryAdapterConfig extends AdapterConfig {
  
  idFieldName?:string;
  
}
