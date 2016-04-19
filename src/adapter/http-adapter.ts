import {HttpClient} from "aurelia-http-client";
import {SynchronizationBatch} from "../store/store";
import {
  AbstractAdapter,
  OperationResult,
  ReadOperationResult,
  ReadOptions,
  BatchOperationResult,
  AdapterConfig
} from "./adapter";

/**
 * An implementation of the [[Adapter]] interface for managing resources in a
 * server via the HTTP network
 */
export class HttpAdapter extends AbstractAdapter{

  /**
   * The HTTP client used to make requests to the backend server
   */
  private httpClient:HttpClient;

  /**
   * The HTTP API endpoints to which the adapter operations are routed
   */
  private api:HttpApi;

  /**
   * Creates a new HttpAdapter instance configured with the provided options
   * @param config
   */
  constructor (config:HttpAdapterConfig) {
    super(config);
    this.httpClient = config.httpClient;
    this.api = config.api;
  }

  /**
   *
   * @inheritdoc
   */
  create(models:Array<any>):Promise<OperationResult> {
    let data = this.serializeModelData(models);
    
    return new Promise<OperationResult>((resolve) => {
      let promise = this.getHttpClient().createRequest(this.api.create)
        .withContent(data).send();
      
      promise.then(response => {
        resolve({
          type: 'create',
          success: true,
          data: this.getReader().read(response.content).data
        });
      });
      
      promise.catch(() => {
        resolve({
          type: 'create',
          success: false
        });
      });
    });
  }

  /**
   *
   * @inheritdoc
   */
  read(options?:ReadOptions):Promise<ReadOperationResult> {
    return new Promise((resolve) => {

      let requestPromise = this.httpClient.createRequest(this.api.read)
        .withParams(options.params || {})
        .send();

      requestPromise.then(response => {
        let result = this.getReader().read(response.content);
        resolve({
          type: 'read',
          success: true,
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
          offset: result.offset
        });
      });

      requestPromise.catch(() => {
        resolve({
          type: 'read',
          success: false
        });
      });
    });
  }

  /**
   *
   * @inheritdoc
   */
  update(models:Array<any>):Promise<OperationResult> {
    return new Promise((resolve) => {
      let requestPromise = this.httpClient.createRequest(this.api.update)
        .withContent(this.serializeModelData(models))
        .send();

      requestPromise.then(response => {
        resolve({
          type: 'update',
          success: true,
          data: this.getReader().read(response.content).data
        });
      });

      requestPromise.catch(() => {
        resolve({
          type: 'update',
          success: false
        });
      });
    });
  }

  /**
   *
   * @inheritdoc
   */
  delete(models:Array<any>):Promise<OperationResult> {
    return new Promise((resolve) => {
      let requestPromise = this.httpClient.createRequest(this.api.update)
        .withContent(this.serializeModelData(models))
        .send();

      requestPromise.then(response => {
        resolve({
          type: 'delete',
          success: true,
          data: this.getReader().read(response.content).data
        });
      });

      requestPromise.catch(() => {
        resolve({
          type: 'delete',
          success: false
        });
      });
    });
  }

  /**
   *
   * @inheritdoc
   */
  sync(batch:SynchronizationBatch<any>):Promise<BatchOperationResult> {
    return new Promise((resolve) => {
      let inProgress = 3;
      let result:any = {};
      function attemptResolve() {
        if (inProgress === 0) {
          resolve(result);
        }
      }

      this.update(batch.forUpdate).then(update => {
        result.update = update;
        inProgress--;
        attemptResolve();
      });
      this.create(batch.forDeletion).then(deletion => {
        result.delete = deletion;
        inProgress--;
        attemptResolve();
      });
      this.create(batch.forInsertion).then(insertion => {
        result.create = insertion;
        inProgress--;
        attemptResolve();
      });
    });
  }

  /**
   * Returns HTTP client used by the adapter to make requests to the backend server
   * @return {HttpClient}
   */
  getHttpClient():HttpClient {
    if (!this.httpClient) {
      this.httpClient = new HttpClient();
    }
    return this.httpClient;
  }
}

/**
 * Adds options to the basic adapter configuration that are specific to the
 * [[HttpAdapter]]
 */
export interface HttpAdapterConfig extends AdapterConfig {

  /**
   * The HttpClient used for making HTTP requests to the backend server
   */
  httpClient?:HttpClient;

  /**
   * The HTTP API endpoints to which the adapter operations are routed
   */
  api:HttpApi;

}

/**
 * Specifies HTTP API endpoints to which the adapter operations are routed
 */
export interface HttpApi {

  /**
   * The HTTP endpoint for the create operation
   */
  create?:string;

  /**
   * The HTTP endpoint for the read operation
   */
  read?:string;

  /**
   * The HTTP endpoint for the update operation
   */
  update?:string;

  /**
   * The HTTP endpoint for the delete operation
   */
  delete?:string;

}
