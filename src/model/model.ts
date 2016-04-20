import {Metadata, MetadataDefinition, createMetadata} from "./metadata";
import {ModelData} from "./model-data";

export interface ModelPrototype {

  _modelMetadata_:Metadata;

}

export interface Model {
  
  modelAspect:ModelAspect;
  
}

export class ModelAspect {
  
  private _data:ModelData;
  
  private _model:Model;

  private _id:number;
  
  constructor(model:Model, data:ModelData) {
    this._model = model;
    this._data = data;
  }
  
  getMetadata():Metadata {
    return (<ModelPrototype>Object.getPrototypeOf(this.model))._modelMetadata_;
  }
  
  commit() {
    this.data.commit();
  }
  
  commitValue(name:string) {
    this.data.commitValue(name);
  }
  
  commitValues(names:string[]) {
    this.data.commitValues(names);
  }

  rollback() {
    this.data.rollback();
  }

  isDirty():boolean {
    return this.data.isDirty();
  }
  
  isPersisted():boolean {
    let id = this.model[this.getMetadata().getIdFieldName()];
    return (id !== null && id !== undefined && id !== '');
  }
  
  get data():ModelData {
    return this._data;
  }
  
  get model():Model {
    return this._model;
  }

  get id():number {
    if (!this._id) {
      this._id = nextModelId();
    }
    return this._id;
  }
}

let modelCount = 0;
function nextModelId():number {
  return ++modelCount;
}

/**
 * Defines the specified class as a model, whose structure is defined by the
 * options passed.
 *
 * @param Class
 * @param options
 */
export function declareModel(Class:Function, options:ModelDefinition):void {

  let prototype = Class.prototype;

  if (prototype.hasOwnProperty('modelAspect')) {
    throw new Error(`Class ${Class.name} has already been defined as a model`);
  }

  let metadata = createMetadata(options);
  let fields = metadata.getModelFields();
  prototype._modelMetadata_ = metadata;
  metadata.setModelClass(Class);
  metadata.getFieldConfigurator().configureFields(Class.prototype, fields);

  Object.defineProperty(prototype, 'modelAspect', <PropertyDescriptor>{
    enumerable: false,
    get: function () {
      if (this === prototype) {
        return null;
      }
      let data = new ModelData(this);
      let modelAspect = new ModelAspect(this, data);
      Object.defineProperty(this, 'modelAspect', <PropertyDescriptor>{
        enumerable: false,
        configurable: false,
        writable: false,
        value: modelAspect
      });
      return modelAspect;
    }
  });
}

export type ModelDefinition = MetadataDefinition;
