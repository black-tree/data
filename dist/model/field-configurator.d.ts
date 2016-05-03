import { ModelPrototype } from "./model";
import { Field } from "../field/field";
export interface FieldConfigurator {
    configureFields(modelPrototype: ModelPrototype, fields: Field[]): void;
}
export declare class DefaultFieldConfigurator implements FieldConfigurator {
    configureFields(modelPrototype: ModelPrototype, fields: Field[]): void;
}
export declare var FieldConfigurators: {
    'default': DefaultFieldConfigurator;
};
