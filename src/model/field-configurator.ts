import {ModelPrototype, Model} from "./model";
import {Field} from "../field/field";

/**
 * The interface that must be implemented by all field configurators
 */
export interface FieldConfigurator {
  
  configureFields(modelPrototype:ModelPrototype, fields:Field[]):void;
  
}

export class DefaultFieldConfigurator implements FieldConfigurator{
  
  configureFields(modelPrototype:ModelPrototype, fields:Field[]):void {
    fields.forEach(field => {
      var fieldName = field.getName();
      Object.defineProperty(modelPrototype, fieldName, <PropertyDescriptor>{
        enumerable: true,
        configurable: true,
      
        get: function() {
          if (this === modelPrototype) {
            return undefined;
          }
          let model = <Model>this;
          return model.modelAspect.data.getValue(fieldName);
        },
        set: function(value) {
          if (this === modelPrototype) {
            return;
          }
          let model = <Model>this;
          model.modelAspect.data.setValue(fieldName, value);
        }
      });
    });
  }
}

export var FieldConfigurators = {
  'default': new DefaultFieldConfigurator()
};

