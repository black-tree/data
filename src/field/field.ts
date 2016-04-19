import {FieldType, FieldTypeOptions, FieldTypes} from "./field-type";

export class Field {
  
  /**
   * The name of the field
   */
  private name:string;
  
  /**
   * The field's type
   */
  private type:FieldType;
  
  /**
   * Options specific to this field's type
   */
  private typeOptions:FieldTypeOptions;
  
  constructor(name:string, type:FieldType) {
    this.name = name;
    this.type = type;
  }

  getName():string {
    return this.name;
  }

  getType():FieldType {
    return this.type;
  }

  getTypeOptions():FieldTypeOptions {
    return this.typeOptions;
  }
  
  setTypeOptions(options:FieldTypeOptions):void {
    this.typeOptions = options;
  }
}

export function createField(options:FieldDefinition|Field):Field {
  
  if (Field.prototype.isPrototypeOf(options)) {
    return <any>options;
  }
  
  let definition:FieldDefinition = Object.assign({}, defaultFieldOptions, options);
  if (typeof definition.type === 'string') {
    definition.type = FieldTypes[<string>definition.type];
  }
  
  let field = new Field(definition.name, <FieldType>definition.type);
  field.setTypeOptions(definition.typeOptions);
  return field;
}

export interface FieldDefinition {
  
  name:string;
  
  type?:string|FieldType;
  
  typeOptions?:FieldTypeOptions;
}

export var defaultFieldOptions = {
  
  type: 'any'
};
