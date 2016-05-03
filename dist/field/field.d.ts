import { FieldType, FieldTypeOptions } from "./field-type";
export declare class Field {
    private name;
    private type;
    private typeOptions;
    constructor(name: string, type: FieldType);
    getName(): string;
    getType(): FieldType;
    getTypeOptions(): FieldTypeOptions;
    setTypeOptions(options: FieldTypeOptions): void;
}
export declare class FieldFactory {
    static create(options: FieldDefinition | Field): Field;
}
export interface FieldDefinition {
    name: string;
    type?: string | FieldType;
    typeOptions?: FieldTypeOptions;
}
export declare var defaultFieldOptions: {
    type: string;
};
