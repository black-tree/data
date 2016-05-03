import { Field, FieldDefinition } from "../field/field";
import { FieldConfigurator } from "./field-configurator";
export declare class Metadata {
    private fields;
    private idField;
    private modelClass;
    private fieldConfigurator;
    setFields(fields: Field[]): void;
    getFields(): Field[];
    getModelFields(): Field[];
    addField(field: Field): void;
    getIdField(): Field;
    getIdFieldName(): string;
    setModelClass(modelClass: Function): void;
    getModelClass(): Function;
    getFieldConfigurator(): FieldConfigurator;
    setFieldConfigurator(configurator: FieldConfigurator): void;
}
export declare function createMetadata(options: MetadataDefinition): Metadata;
export interface MetadataDefinition {
    fields?: (Field | FieldDefinition)[];
    fieldConfigurator?: string | FieldConfigurator;
    idFieldName?: string;
    injectModelApi?: boolean;
}
export declare var metadataDefinitionDefaults: {
    fields: any[];
    fieldConfigurator: string;
    idFieldName: string;
    injectModelApi: boolean;
};
