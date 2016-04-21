import {Field, FieldDefinition, FieldFactory} from "../field/field";
import {FieldConfigurator, FieldConfigurators} from "./field-configurator";

export class Metadata {
  
  private fields:Field[];

  private idField:Field;
  
  private modelClass:Function;

  private fieldConfigurator:FieldConfigurator;
  
  setFields(fields:Field[]):void {
    this.fields = fields;
  }

  getFields():Field[] {
    return this.fields;
  }

  getModelFields():Field[] {
    let fields = Array.from(this.fields);
    fields.push(this.getIdField());
    return fields;
  }
  
  addField(field:Field) {
    this.fields.push(field);
  }

  getIdField():Field {
    if (!this.idField) {
      this.idField = FieldFactory.create({name: 'id'});
    }
    return this.idField;
  }
  
  getIdFieldName():string {
    return this.getIdField().getName();
  }

  setModelClass(modelClass:Function):void {
    this.modelClass = modelClass;
  }

  getModelClass():Function {
    return this.modelClass;
  }
  
  getFieldConfigurator():FieldConfigurator {
    return this.fieldConfigurator;
  }
  
  setFieldConfigurator(configurator:FieldConfigurator) {
    this.fieldConfigurator = configurator;
  }
}

/**
 * A factory function for creating Metadata instances from a metadata
 * definition object
 * @param options
 * @return {Metadata}
 */
export function createMetadata(options:MetadataDefinition):Metadata {
  options = Object.assign({}, metadataDefinitionDefaults, options);
  let metadata = new Metadata();
  let fields = [];
  options.fields.forEach(field => {
    fields.push(FieldFactory.create(field));
  });
  
  metadata.setFields(fields);

  if (typeof options.fieldConfigurator === 'string') {
    options.fieldConfigurator = FieldConfigurators[<string>options.fieldConfigurator];
  }
  metadata.setFieldConfigurator(<FieldConfigurator>options.fieldConfigurator);
  return metadata;
}

export interface MetadataDefinition {

  fields?:(Field|FieldDefinition)[];

  fieldConfigurator?:string|FieldConfigurator;

  idFieldName?:string;

  injectModelApi?:boolean;
}

export var metadataDefinitionDefaults = {
  
  fields: [],
  
  fieldConfigurator: 'default',

  idFieldName: 'id',

  injectModelApi: false

};
