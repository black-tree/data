import {EventDispatcher} from "../event/dispatcher";
import {Event} from "../event/event";

/**
 * Holds and manages the persistence state of a model instance data
 */
export class ModelData extends EventDispatcher{

  /**
   * The values of this data, indexed by name
   */
  private values:{[s:string]: DataValue};

  /**
   * The set of all dirty values, indexed by name
   */
  private dirty:{[s:string]:DataValue};

  /**
   * The model whose data is managed by this ModelData instance
   */
  private model;

  /**
   * Creates a new ModelData instance for the specified model, optionally
   * initialized with the provided values
   * @param model
   * @param values
   */
  constructor(model, values:{[s:string]: any} = {}) {
    super();
    this.values = {};
    this.dirty = {};
    this.model = model;
    Object.getOwnPropertyNames(values).forEach(prop => {
      this.values[prop] = new DataValue(prop, values[prop]);
    });
  }

  /**
   * Sets the value of the indicated property
   * @param property
   * @param value
   */
  setValue(property, value) {
    this.setValues({[property]: value});
  }

  /**
   * Sets the values of the properties as defined by the given key/value
   * pairs. No [[DataChangedEvent]] is dispatched until all the values have
   * been set.
   * @param values
   */
  setValues(values:{[s:string]: any}) {
    let modified = [];
    Object.getOwnPropertyNames(values).forEach(prop => {
      if (this._setValue(prop, values[prop])) {
        modified.push(this.values[prop]);
      }
    });
    this.dispatchDataChangedEvent(modified);
  }

  private _setValue(property, value) {
    let dataValue = this.values[property];
    if (!dataValue) {
      dataValue = new DataValue(property);
      this.values[property] = dataValue;
    }
    if (dataValue.setValue(value)) {
      dataValue.isDirty() ? this.dirty[property] = dataValue
        : delete this.dirty[property];
      return true;
    }
    return false;
  }

  /**
   * Gets the value of the indicated property. Returns undefined if the data
   * does not contain such property.
   * @param property
   * @return {any}
   */
  getValue(property):any {
    if (this.values[property]) {
      return this.values[property].getValue();
    }
  }
  
  /**
   * Returns all the current values of this data
   * @return {{}}
   */
  getValues():{[s:string]: any} {
    let values = {};
    for (let name in this.values){
      if (this.values.hasOwnProperty(name)) {
        values[name] = this.values[name].getValue();
      }
    }
    return values;
  }

  /**
   * Commits the values of this data, effectively making this data non-dirty
   */
  commit() {
    this.commitValues(Object.keys(this.dirty));
  }

  commitValue(property:string) {
    this.commitValues([property]);
  }
  
  commitValues(properties:string[]) {
    let committed = [];
    properties.forEach(property => {
      if (this.dirty.hasOwnProperty(property)) {
        var value = this.dirty[property];
        value.commit();
        committed.push(property);
        delete this.dirty[property];
      }
    });
    this.dispatchDataCommittedEvent(committed);
  }

  /**
   * Reverts this data values to what they where immediately after the first
   * call to [[commit]].
   */
  rollback() {
    let rejected = [];
    for (let property in this.dirty) {
      if (this.dirty.hasOwnProperty(property)) {
        let value = this.dirty[property];
        value.rollback();
        rejected.push(value);
      }
    }
    this.dirty = {};
    this.dispatchDataChangedEvent(rejected);
  }

  /**
   * Indicates whether any of the values of this data is dirty, that is,
   * if any of them was modified after the last call to [[commit]].
   * @return {boolean}
   */
  isDirty():boolean {
    return !!Object.getOwnPropertyNames(this.dirty).length;
  }

  /**
   * Indicates whether the passed property is dirty.
   * @param property
   * @return {boolean}
   */
  hasDirtyValue(property):boolean {
    return this.dirty.hasOwnProperty(property);
  }

  /**
   * Returns all the change made to each of this data's dirty values
   * @return {Array}
   */
  getChanges():ValueChange[] {
    let dirty = [];
    for (let property in this.dirty) {
      if (this.dirty.hasOwnProperty(property)) {
        dirty.push(this.getChange(this.dirty[property]));
      }
    }
    return dirty;
  }

  private getChange(value:DataValue):ValueChange {
    return {
      propertyName: value.getName(),
      oldValue: value.getOldValue(),
      newValue: value.getValue()
    };
  }

  private dispatchDataChangedEvent(values:DataValue[]) {
    if (values.length) {
      let changes = [];
      values.forEach(value => changes.push(this.getChange(value)));
      this.dispatchEvent(<DataChangedEvent>{
        name: 'data-changed', 
        changes: changes, 
        data: this, 
        model: this.model
      
      });
    }
  }
  
  private dispatchDataCommittedEvent(committed:string[]) {
    this.dispatchEvent(<DataCommittedEven>{
      name:'data-committed',
      properties: committed,
      data: this,
      model: this.model
    });
  }
}

/**
 * A helper class to manage the persistence state of a single ModelData value
 */
export class DataValue {

  /**
   * The name of the property to which this value corresponds
   */
  private name:string;

  /**
   * The current value of this object
   */
  private value:any;

  /**
   * The value of this object just before the last call to [[setValue]]
   */
  private oldValue:any;

  /**
   * The current committed value of this object
   */
  private committedValue:any;

  /**
   * A function to test if two values are actually different
   * @type {function(any, any): boolean}
   */
  private valuesDiffer:(v1, v2) => boolean = DataValue.valuesDiffer;

  /**
   * Creates a new DataValue object with the indicated name and initial value
   * @param name
   * @param value
   */
  constructor(name:string, value?) {
    this.name = name;
    this.value = value;
    this.committedValue = value;
  }

  /**
   * Sets the value of this data value object. Returns true if the value was
   * actually changed
   * @param value
   * @return {boolean}
   */
  setValue(value) {
    let prevValue = this.value;
    if (!this.valuesDiffer(prevValue, value)) {
      return false;
    }
    this.value = value;
    this.oldValue = prevValue;
    return true;
  }

  /**
   * Returns the current value of this object
   * @return {any}
   */
  getValue():any {
    return this.value;
  }

  /**
   * The value of this object just before the last call to [[setValue]]
   * @return {any}
   */
  getOldValue():any {
    return this.oldValue;
  }

  /**
   * The current committed value of this object
   * @return {any}
   */
  getCommittedValue():any {
    return this.committedValue;
  }

  /**
   * The name of the property to which this value corresponds
   * @return {string}
   */
  getName():string {
    return this.name;
  }

  /**
   * Commits this value
   */
  commit() {
    if (!this.valuesDiffer(this.committedValue, this.value)) {
      return false;
    }
    this.committedValue = this.value;
    return true;
  }

  /**
   * Reverts this value to what it was just after the last call to [[commit]]
   * or its initial value
   */
  rollback() {
    if (this.isDirty()) {
      this.oldValue = this.value;
      this.value = this.committedValue;
    }
  }

  /**
   * Indicates whether this value is dirty
   * @return {boolean}
   */
  isDirty() {
    return this.value !== this.committedValue;
  }

  /**
   * Sets the comparison function to use when testing if two values are
   * different
   * @param handler
   */
  setValuesDifferHandler(handler:(v1, v2) => boolean) {
    this.valuesDiffer = handler;
  }

  /**
   * The default function used for testing if two values are different
   * @param v1
   * @param v2
   * @return {boolean}
   */
  static valuesDiffer(v1, v2):boolean {
    return v1 !== v2;
  }
}

/**
 * Represents the change of the value of a property
 */
export interface ValueChange {

  /**
   * The name of the property to which the value corresponds
   */
  propertyName:string;

  /**
   * The old (previous) value of the property
   */
  oldValue:any;

  /**
   * The new (current) value of the property
   */
  newValue:any;
}

/**
 * Dispatched when one ore more values of a [[ModelData]] has changed
 */
export interface DataChangedEvent extends Event{

  /**
   * The collection of changes that the data underwent
   */
  changes:ValueChange[];

  /**
   * The model data that was changed
   */
  data:ModelData;

  /**
   * The model instance to which the modified data belongs
   */
  model:any;
  
}

export interface DataCommittedEven extends Event {
  
  properties:string[];
  
  /**
   * The model data that was committed
   */
  data:ModelData;
  
  /**
   * The model instance to which the committed data belongs
   */
  model:any;
}
