import {Collection, SearchCriteria} from "../utils/collection";
import {ModelPrototype} from "../model/model";
import {DataChangedEvent, DataCommittedEvent} from "../model/model-data";
import {BatchOperationResult, Adapter, OperationResult, ReadOperationResult} from "../adapter/adapter";
import {Metadata} from "../model/metadata";
import {EventDispatcher, IEvent, IEventDispatcher} from "wg-events";

/**
 * Manages a collection of models of a specific type. It is configured with an
 * adapter in order to maintain the store in sync with a backend
 */
export class Store<ModelClass> implements IEventDispatcher{
  
  /**
   * The model class (i.e. the constructor for models of the type managed by 
   * the store).
   */
  private modelClass:{new():ModelClass};

  /**
   * The adapter used to synchronize this store with a backend
   */
  private adapter:Adapter;
  
  /**
   * The collection of models in this store
   */
  private models:Collection<ModelClass>;
  
  /**
   * The set of models that are scheduled for insertion in the backend via the
   * configured adapter
   */
  private scheduledForInsertion:Set<ModelClass>;
  
  /**
   * The set of models that are scheduled for update in the backend via the
   * configured adapter
   */
  private scheduledForUpdate:Set<ModelClass>;
  
  /**
   * The set of models that are scheduled for deletion in the backend via the
   * configured adapter
   */
  private scheduledForDeletion:Set<ModelClass>;
  
  /**
   * The event dispatcher used for dispatching this store events
   */
  private eventDispatcher:EventDispatcher;
  
  /**
   * Creates a new store configured with the provided options
   * @param config
   */
  constructor(config:StoreConfig = {}) {

    this.modelClass = config.modelClass;
    this.adapter = config.adapter;
    this.models = new Collection<ModelClass>();
    this.scheduledForInsertion = new Set<ModelClass>();
    this.scheduledForUpdate = new Set<ModelClass>();
    this.scheduledForDeletion = new Set<ModelClass>();

    this.eventDispatcher = new EventDispatcher();

    if (config.data) {
      this.loadModels(config.data);
    }
  }

  /**
   * Loads models into this store from the associated backend using the adapter
   * this store has been configured with
   * @param options
   * @return {Promise<ModelClass[]>}
   * @throws Error if the store has not been configured with an [[Adapter]]
   */
  load(options:any):Promise<ModelClass[]> {
    if (!this.adapter) {
      throw new Error('This store cannot load data without being configured ' +
        'with an adapter');
    }
    this.models.clear();
    return this.adapter.read(options).then((result:ReadOperationResult) => {
      return this.loadModels(result.data);
    });
  }

  /**
   * Loads the specified data into this store
   * @param models
   * @return {ModelClass[]}
   */
  loadModels(models:any[]):Array<ModelClass> {
    let oldModels = this.getAll();
    this.models.clear();
    oldModels.forEach(model => this.unbindModelListeners(model));
    
    let added = this.models.addItems(this.ensureModels(models)).items;

    this.bindAddedModels(added);
    this.eventDispatcher.dispatchEvent(<ModelsLoadedEvent<ModelClass>>{
      name: 'models-loaded',
      models: added
    });
    return added;
  }

  /**
   * Adds the the indicated model(s) to this store, and returns an array with
   * those that were actually added (those not yet contained in the
   * store).
   * @param modelOrModels
   * @return {ModelClass[]}
   */
  add(modelOrModels:any):Array<ModelClass> {
    if (!Array.isArray(modelOrModels)) {
      modelOrModels = [modelOrModels];
    }

    let added = this.models.addItems(this.ensureModels(modelOrModels)).items;
    this.bindAddedModels(added);
    this.eventDispatcher.dispatchEvent(<ModelsAddedEvent<ModelClass>>{
      name: Store.events.MODELS_ADDED,
      models: added
    });
    return added;
  }

  /**
   * Deletes the indicated model(s) from this store, and returns an array of those
   * that where actually removed (those that are indeed contained in the store)
   * @param modelOrModels
   * @return {ModelClass[]}
   */
  delete(modelOrModels:ModelClass|ModelClass[]):Array<ModelClass> {
    let deleted:ModelClass[];
    if (this.isModel(modelOrModels)) {
      deleted = this.models.deleteItems([<ModelClass>modelOrModels]);
    } else {
      deleted = this.models.deleteItems(<ModelClass[]>modelOrModels);
    }
    deleted.forEach((model) => {
      this.handleModelDeletion(model);
    });
    this.eventDispatcher.dispatchEvent(<ModelsDeletedEvent<ModelClass>> {
      name: 'models-deleted',
      models: deleted
    });
    return deleted;
  }

  findById(id:any):ModelClass {
    let idField = this.getMetadata().getIdFieldName();
    return this.findOneBy((model) => id === model[idField]);
  }

  findOneBy(criteria:SearchCriteria):ModelClass {
    return this.models.findOneBy(criteria);
  }

  findBy(criteria:SearchCriteria):ModelClass[] {
    return this.models.findBy(criteria);
  }

  findAt(position:number):ModelClass {
    return this.models.getAt(position);
  }
  /**
   * Synchronizes the store with the associated backend through the [[Adapter]]
   * configured for this store.
   * @return {Promise<BatchOperationResult>|Promise}
   */
  synchronize():Promise<BatchOperationResult> {
    var batch = this.getSynchronizationBatch();
    let syncPromise = this.adapter.sync(batch);
    return new Promise<BatchOperationResult>((resolve) => {
      syncPromise.then(result => {
        this.handleSynchronizationResult(result, batch);
        resolve(result);
      });
    });
  }

  private handleSynchronizationResult(result:BatchOperationResult, batch:SynchronizationBatch<ModelClass>) {
    this.handleInsertionResult(result.create, batch.forInsertion);
    this.handleUpdateResult(result.update, batch.forUpdate, batch.forUpdateSnapshot);
    this.handleDeletionResult(result.delete, batch.forDeletion);
  }

  /**
   * Returns a [[SynchronizationBatch]] that contains the models that are
   * currently scheduled for insertion, for update and for deletion
   * @return SynchronizationBatch
   */
  getSynchronizationBatch():SynchronizationBatch<ModelClass> {
    return new SynchronizationBatch<ModelClass>({
      forInsertion: Array.from(this.scheduledForInsertion),
      forUpdate: Array.from(this.scheduledForUpdate),
      forDeletion: Array.from(this.scheduledForDeletion)
    });
  }

  /**
   * Returns the adapter used to synchronize this store with a backend
   */
  getAdapter():Adapter {
    return this.adapter;
  }


  addEventListener(event:string, listener:Function) {
    this.eventDispatcher.addEventListener(event, listener);
  }

  dispatchEvent(event:string|IEvent) {
    this.eventDispatcher.dispatchEvent(event);
  }

  on(event:string, listener:Function) {
    this.eventDispatcher.on(event, listener);
  }

  removeEventListener(event:string, listener:Function) {
    this.eventDispatcher.removeEventListener(event, listener);
  }

  off(event:string, listener:Function) {
    this.eventDispatcher.off(event, listener);
  }

  /**
   * Makes this store aware of the specified models, which are supposed to
   * have been just added to the store
   * @param models
   */
  private bindAddedModels(models:any[]) {
    models.forEach((model) => {
      this.bindModelListeners(model);
      this.setAddedModelsState(model);
    });
  }

  /**
   * Binds the listeners necessary for this store to observe the passed model
   * in order to manage its lifecycle states
   * @param model
   */
  private bindModelListeners(model:any) {
    model.modelAspect.data.on('data-changed', this.onModelDataChanged);
    model.modelAspect.data.on('data-committed', this.onModelDataCommitted);
  }

  /**
   * Removes any listeners attached by this store to the passed model
   * @param model
   */
  private unbindModelListeners(model:any) {
    model.modelAspect.data.off('data-changed', this.onModelDataChanged);
    model.modelAspect.data.on('data-committed', this.onModelDataCommitted);
  }

  /**
   * Called when the data changed event of a model data is dispatched
   * @param e
   */
  private onModelDataChanged = (e:DataChangedEvent) => {
    this.updateModelState(e.model);
    this.eventDispatcher.dispatchEvent(<ModelChangedEvent<ModelClass>>{
      name: Store.events.MODEL_CHANGED,
      model: e.model
    });
  };

  private onModelDataCommitted = (e:DataCommittedEvent) => {
    this.updateModelState(e.model);
  };

  /**
   * Sets the lifecycle state of a model that has just been added to the store
   * @param model
   */
  private setAddedModelsState(model:any) {
    // Handle the case when the added model was already in the store but it was
    // deleted and its still among the models scheduled for deletion
    if (this.scheduledForDeletion.has(model)) {
      this.scheduledForDeletion.delete(model);
    }
    // Then now just update the model state as usual
    this.updateModelState(model);
  }

  /**
   * Updates the lifecycle state of a model that exists in the store
   * @param model
   */
  private updateModelState(model:any) {

    let modelAspect = model.modelAspect;

    // If the model has not been persisted, then it must be scheduled for
    // insertion regardless of its dirty state
    if (!modelAspect.isPersisted()) {
      this.scheduledForInsertion.add(model);

      // However, if the model had its id changed from a non null value to a
      // null value, then it used to be considered as persisted, and we may
      // find it among the models scheduled for update. We make sure it is not
      // there:
      this.scheduledForUpdate.delete(model);
      return;
    }
    // If the model is persisted, then it must be scheduled for an update only
    // if it has been modified, that is, only if it is dirty. If it was already
    // scheduled for an update, then it must be unscheduled if it isn't dirty
    modelAspect.isDirty() ? this.scheduledForUpdate.add(model)
      : this.scheduledForUpdate.delete(model);

    // Note that the model could be scheduled for insertion, but at this point
    // we know the model has a persisted representation, so we make sure it is
    // that insertion is no longer scheduled
    this.scheduledForInsertion.delete(model);
  }

  /**
   * Returns an array containing all the models currently in the store
   * @return {ModelClass[]}
   */
  getAll():Array<ModelClass> {
    return this.models.getItems();
  }

  /**
   * Makes sure the passed object is a model instance. If it is not, then a
   * model instance gets created from it and returned
   * @param object
   * @return {any}
   */
  private ensureModel(object:any):ModelClass {
    if (!this.isModel(object)) {
      object = Object.assign(new this.modelClass(), object);
      // When an object has been materialized as a model through the store,
      // it should not be dirty:
      object.modelAspect.commit();
    }
    return object;
  }

  /**
   * Same as [[ensureModel]], but for an array of objects
   * @param objects
   * @return {Array}
   */
  private ensureModels(objects:any[]):Array<ModelClass> {
    let models = [];
    objects.forEach(object => models.push(this.ensureModel(object)));
    return models;
  }
  
  /**
   * Indicates whether the specified object is a model of the type managed 
   * by this store
   * @param object
   * @return {boolean}
   */
  isModel(object:any):boolean {
    return this.getModelPrototype().isPrototypeOf(object);
  }
  
  /**
   * Returns the prototype object of all models instances in this store
   * @return {any}
   */
  private getModelPrototype():ModelPrototype {
    return this.modelClass.prototype;
  }

  private handleModelDeletion(model:any) {
    if (model.modelAspect.isPersisted()) {
      this.scheduledForDeletion.add(model);
    }
    this.scheduledForInsertion.delete(model);
    this.scheduledForUpdate.delete(model);

    // When a model is removed from the store, we must no longer care what is
    // done to it
    this.unbindModelListeners(model);
  }
  
  private handleInsertionResult(result:OperationResult, forInsertion:ModelClass[]) {
    if (!result.success) {
      return;
    }
    let idName = this.getMetadata().getIdFieldName();
    result.data.forEach((record, i) => {
      let model:any = forInsertion[i];
      model[idName] = record[idName];
      model.modelAspect.commitValue(idName);
    });
  }
  
  private handleUpdateResult(result:OperationResult, forUpdate:ModelClass[], beforeUpdateSnapshot:any[]) {
    if (!result.success) {
      return;
    }
    result.data.forEach((record, i) => {
      let model:any = forUpdate[i];
      let snapshot = beforeUpdateSnapshot[i];
      let toCommit = [];
      for (let property in snapshot) {
        if (snapshot.hasOwnProperty(property)) {
          if (model[property] === snapshot[property]) {
            toCommit.push(property);
          }
        }
      }
      model.modelAspect.commitValues(toCommit);
    });
  }
  
  private handleDeletionResult(result:OperationResult, forDeletion:ModelClass[]) {
    if (!result.success) {
      return;
    }
    forDeletion.forEach(model => this.scheduledForDeletion.delete(model));
  }
  
  private getMetadata():Metadata {
    return this.getModelPrototype()._modelMetadata_;
  }
  
  static events = {
    MODELS_ADDED: 'models-added',
    MODEL_CHANGED: 'model-changed',
    MODELS_LOADED: 'models-loaded',
    MODELS_DELETED: 'models-deleted',
    MODELS_DESTROYED: 'models-destroyed',
    MODELS_SAVED: 'models-saved'
  };
}

/**
 * The options for configuring a [[Store]]
 */
export interface StoreConfig {
  
  /**
   * The class (constructor) of the models in this store
   */
  modelClass?:{new()};

  /**
   * The adapter used by the store to synchronize itself with the data stored
   * in a backend
   */
  adapter?:Adapter;
  
  /**
   * The initial set of models to load into the store
   */
  data?:any[];

}

/**
 * Holds the model instances that are scheduled for an insertion, an update or
 * a deletion as it would be necessary to perform an store synchronization
 */
export class SynchronizationBatch<ModelClass> {

  /**
   * The model instances scheduled for insertion. This are models that do not
   * yet represent a persisted resource in the backend, which is the case if
   * they do not have a non-null id
   */
  forInsertion:ModelClass[];

  /**
   * The model instances scheduled for an update. This are models that already
   * have a persistent representation in the backend but are currently dirty,
   * i.e., they differ from the persisted resource they represent
   */
  forUpdate:ModelClass[];

  /**
   * The model instance scheduled for deletion. These are the models deleted
   * from the store, and whose represented resource must therefore be removed
   * in the backend in order to maintain the store and the backend in sync.
   */
  forDeletion:ModelClass[];

  /**
   * An array containing the snapshots of model data for the models that are
   * scheduled for update. Needed for testing if the model has been modified
   * while the update operation was being processed and completed.
   */
  forUpdateSnapshot:any[];

  constructor(options:any) {
    this.forInsertion = options.forInsertion;
    this.forUpdate = options.forUpdate;
    this.forDeletion = options.forDeletion;

    this.forUpdateSnapshot = [];
    this.forUpdate.forEach((model:any) => {
      this.forUpdateSnapshot.push(model.modelAspect.data.getValues());
    });
  }
}

/**
 * Dispatched by a [[Store]] when one of its models has been modified
 */
export interface ModelChangedEvent<ModelClass> extends IEvent {
  
  /**
   * The store's model that has been modified
   */
  model:ModelClass;

}

/**
 * Dispatched by a [[Store]] when one or more model instances have been added
 * to the store
 */
export interface ModelsAddedEvent<ModelClass> extends IEvent {
  
  /**
   * The models that were added to the store
   */
  models:ModelClass[];

}

/**
 * Dispatched by a [[Store]] when its models have been loaded, either using the
 * configured [[Adapter]] via a call to [[Store.load|load()]] or loading local data
 * via a call to [[Store.loadModels|loadModels()]].
 */
export interface ModelsLoadedEvent<ModelClass> extends IEvent {

  /**
   * The models loaded into the store
   */
  models:ModelClass[];
}

/**
 * Dispatched by a [[Store]] when one or more of its models have been deleted.
 * Do not confuse with [[ModelsDestroyedEvent]], which is only dispatched when
 * the models have also been deleted in the associated backend, usually after
 * synchronizing the store that had some models deleted.
 */
export interface ModelsDeletedEvent<ModelClass> extends IEvent {
  
  /**
   * The models deleted from the store
   */
  models:ModelClass[];

}

/**
 * Dispatched by a [[Store]] when one or more of its models have been saved in
 * the associated backend.
 */
export interface ModelsSavedEvent<ModelClass> extends IEvent {
  
  /**
   * The models that were updated
   */
  updated:ModelClass[];
  
  /**
   * The models that where inserted
   */
  inserted:ModelClass[];

}

/**
 * Dispatched when one or more of a [[Store]] models have been deleted in the
 * associated backend. 
 */
export interface ModelsDestroyedEvent<ModelClass> extends IEvent {
  
  /**
   * The models whose corresponding resource was deleted in the [[Store]] 
   * associated backend.
   */
  models:ModelClass[];

}
