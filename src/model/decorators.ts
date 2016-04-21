import {declareModel, ModelPrototype, ModelDefinition} from "./model";
import {FieldFactory, FieldDefinition} from "../field/field";
import {FieldType, FieldTypeOptions} from "../field/field-type";
import {Metadata} from "./metadata";

/**
 * Decorates a class for declaring it as a model. Calls [[declareModel]] on the
 * target class with the provided options
 * @param options The options to pass to the [[declareModel|declareModel()]]
 * function
 * @return {Function} The actual decorator function
 */
export function Model(options:ModelDefinition = {}) {
  
  return (Target) => {

    if (fieldRegistry.has(Target.prototype)){
      options.fields = fieldRegistry.get(Target.prototype);
    }
    declareModel(Target, options);
    return Target;
  }
}

/**
 * Decorates a class property to declare it a model field.
 * @param options The options used for defining the field
 * @return {Function} The actual decorator function
 * @constructor
 */
export function Field(options:FieldDecoratorOptions = {}) {

  return (modelPrototype:ModelPrototype, propertyName) => {
    let definition:FieldDefinition = Object.assign({name: propertyName}, options);
    let metadata:Metadata = modelPrototype._modelMetadata_;

    let field = FieldFactory.create(definition);
    
    if (metadata) {
      metadata.addField(FieldFactory.create(definition));
    } else {

      let fields = fieldRegistry.get(modelPrototype);
      if (!fields) {
        fields = [];
        fieldRegistry.set(modelPrototype, fields);
      }
      fields.push(field);
    }
  }
}

let fieldRegistry = new Map<any[]>();

/**
 * The options that can be passed to the [[Field]] decorator
 */
export interface FieldDecoratorOptions{

  type?:string|FieldType;

  typeOptions?:FieldTypeOptions;
}
