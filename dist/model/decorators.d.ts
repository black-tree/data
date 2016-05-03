import { ModelDefinition } from "./model";
import { FieldType, FieldTypeOptions } from "../field/field-type";
export declare function Model(options?: ModelDefinition): (Target: any) => any;
export declare function Field(options?: FieldDecoratorOptions): (modelPrototype: any, propertyName: any) => void;
export interface FieldDecoratorOptions {
    type?: string | FieldType;
    typeOptions?: FieldTypeOptions;
}
