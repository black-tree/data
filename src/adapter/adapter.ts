import {SynchronizationBatch} from "../store/store";
import {Reader} from "../reader/reader";
import {Serializer} from "../serializer/serializer";
import {JsonReader} from "../reader/json-reader";
import {JsonSerializer} from "../serializer/json-serializer";
import {ModelPrototype} from "../model/model";
import {Metadata} from "../model/metadata";

export interface Adapter {

  /**
   * Creates the indicated models in the backend associated to this adapter
   * @param models The models to create
   * @return {Promise<OperationResult>} A promise that resolves to an
   * [[OperationResult]] representing the result of the create operation
   */
  create(models:Array<any>):Promise<OperationResult>;

  /**
   * Reads data from this adapter backend and returns it as an array of plain
   * objects, each representing a resource that corresponds to a model
   * @param options Options to specialize the read operation
   * @return {Promise<ReadOperationResult>} A promise that resolves to an
   * [[ReadOperationResult]] representing the result of the read operation
   */
  read(options?:ReadOptions):Promise<ReadOperationResult>;

  /**
   * Updates the backend resources associated to each of the models in the
   * indicated collection
   * @param models The models to update in the backend
   * @return {Promise<OperationResult>} A promise that resolves to an
   * [[OperationResult]] representing the result of the update operation
   */
  update(models:Array<any>):Promise<OperationResult>;

  /**
   * Deletes the backend resource associated to each model in the indicated
   * collection
   * @param models The models to delete in the backend
   * @return {Promise<OperationResult>} A promise that resolves to an
   * [[OperationResult]] representing the result of the delete operation
   */
  delete(models:Array<any>):Promise<OperationResult>;

  /**
   * Executes a synchronization operation specified by the provided batch
   * @param batch
   * @return {Promise<BatchOperationResult>} A promise that resolves to a
   * [[BatchOperationResult]] representing the result of the sync operation
   */
  sync(batch:SynchronizationBatch<any>):Promise<BatchOperationResult>;

}

/**
 * A base class that handles issues common to most adapters
 */
export abstract class AbstractAdapter implements Adapter{

  /**
   * The model class for the models handled by the adapter
   */
  private modelClass:Function;

  /**
   * The reader to use for parsing/extracting a [[ReadResult]] from the
   * raw data provided by the adapter's backend
   */
  private reader:Reader;

  /**
   * The serializer to use for preparing the data to be passed/sent to the
   * adapter's backend
   */
  private serializer:Serializer;

  /**
   * A base constructor that configures the adapter with the configuration
   * object given
   * @param config
   */
  constructor(config:AdapterConfig) {
    Object.assign(this, config);
  }

  /**
   * The reader to use for parsing/extracting a [[ReadResult]] from the
   * raw data provided by the adapter's backend
   * @return {Reader}
   */
  getReader():Reader {
    if (!this.reader) {
      this.reader = defaultReader;
    }
    return this.reader;
  }

  /**
   * The serializer to use for preparing the data to be passed/sent to the
   * adapter's backend
   * @return {Serializer}
   */
  getSerializer():Serializer {
    if (!this.serializer) {
      this.serializer = defaultSerializer;
    }
    return this.serializer;
  }

  getModelClass():Function {
    return this.modelClass;
  }

  protected getModelPrototype():ModelPrototype {
    return this.modelClass.prototype;
  }

  getModelMetadata():Metadata {
    return this.getModelPrototype()._modelMetadata_;
  }

  /**
   * @inheritdoc
   */
  abstract create(models:Array<any>):Promise<OperationResult>;

  /**
   * @inheritdoc
   */
  abstract read(options?:ReadOptions):Promise<ReadOperationResult>;

  /**
   * @inheritdoc
   */
  abstract update(models:Array<any>):Promise<OperationResult>;

  /**
   * @inheritdoc
   */
  abstract delete(models:Array<any>):Promise<OperationResult>;

  /**
   * @inheritdoc
   */
  abstract sync(batch:SynchronizationBatch<any>):Promise<BatchOperationResult>;
  
  serializeModelData(models:Array<any>):any[] {
    let data = [];
    models.forEach(model => data.push(model.modelAspect.data.getValues()));
    return data;
  }
}
/**
 * The default instance of [[Reader]] to use by subclasses of
 * [[AbstractAdapter]].
 * @type {Reader}
 */
export var defaultReader:Reader = new JsonReader();

/**
 * The default instance of [[Serializer]] to use by subclasses of
 * [[AbstractAdapter]].
 * @type {JsonSerializer}
 */
export var defaultSerializer = new JsonSerializer();

/**
 * The most basic configuration options to pass to the constructor
 * of [[AbstractAdapter]]
 */
export interface AdapterConfig {

  /**
   * The model class of each model handled by this adapter
   */
  modelClass:Function;

  /**
   * The reader to use for parsing/extracting a [[ReadResult]] from the
   * raw data provided by the adapter's backend
   */
  reader?:Reader;

  /**
   * The serializer to use for preparing the data to be passed/sent to the
   * adapter's backend
   */
  serializer?:Serializer;
  
}

/**
 * The options that can be passed to [[Adapter.read]] in order to make the read
 * operation more specialized
 */
export interface ReadOptions {
  
  /**
   * Parameters to pass to the backend service.
   */
  params:any;
  
  /**
   * Filters to indicate the backend service which resources to read.
   */
  filters:any;
  
  /**
   * Tells the backend service the order in which the data must be returned.
   */
  orderBy:any;

}

/**
 * The result of an adapter operation.
 */
export interface OperationResult {
  
  /**
   * Describes the type of this operation.
   */
  type:string;
  
  /**
   * Indicates whether the operation completed successfully.
   */
  success:boolean;
  
  /**
   * The data returned by the backend service after executing the operation.
   */
  data?:any[];

}

/**
 * An extension of the operation result object for [[Adapter.read]] operations
 */
export interface ReadOperationResult extends OperationResult{
  
  /**
   * The total number of resources living in the backend.
   */
  total?:number;
  
  /**
   * The page number in which the resources are located when loading paginated
   * data
   */
  page?:number;
  
  /**
   * The size of each page when loading paginated data
   */
  limit?:number;
  
  /**
   * The offset that indicates the position of the first resource of the loaded
   * page among all the resources
   */
  offset?:number;

}

/**
 * A batch of operation results, one for each type of operation
 */
export interface BatchOperationResult {
  
  /**
   * The result of the create operation
   */
  create:OperationResult;
  
  /**
   * The result of the update operation
   */
  update:OperationResult;
  
  /**
   * The result of the delete operation
   */
  delete:OperationResult;

}

