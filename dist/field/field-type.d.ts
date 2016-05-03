export interface FieldType {
    convertRawValue(value: any, options: FieldTypeOptions): any;
    serializeValue(value: any, options: FieldTypeOptions): any;
    valuesAreEqual?(value1: any, value2: any): boolean;
    getDefaultOptions(): FieldTypeOptions;
}
export declare abstract class BaseFieldType implements FieldType {
    convertRawValue(value: any, options: FieldTypeOptions): any;
    getDefaultOptions(): FieldTypeOptions;
    abstract serializeValue(value: any, options: FieldTypeOptions): any;
    protected abstract convertToType(value: any, options: FieldTypeOptions): any;
}
export declare class AnyType extends BaseFieldType {
    serializeValue(value: any, options: FieldTypeOptions): string;
    protected convertToType(value: any, options: FieldTypeOptions): any;
}
export declare class StringType extends BaseFieldType {
    protected convertToType(value: any, options: FieldTypeOptions): string;
    serializeValue(value: any, options: FieldTypeOptions): string;
}
export declare class NumberType extends BaseFieldType {
    protected convertToType(value: any, options: FieldTypeOptions): number;
    serializeValue(value: number, options: FieldTypeOptions): number;
}
export declare class BooleanType extends BaseFieldType {
    protected convertToType(value: any, options: FieldTypeOptions): boolean;
    serializeValue(value: number, options: FieldTypeOptions): number;
}
export declare class DateType extends BaseFieldType {
    protected convertToType(value: any, options: FieldTypeOptions): any;
    serializeValue(value: Date, options: DateTypeOptions): string;
    valuesAreEqual(value1: Date, value2: Date): boolean;
    getDefaultOptions(): FieldTypeOptions;
}
export interface FieldTypeOptions {
    nullValues: boolean;
}
export declare var defaultFieldTypeOptions: FieldTypeOptions;
export interface DateTypeOptions extends FieldTypeOptions {
    dateFormat: string;
    parseDateFormat?: string;
    serializeDateFormat?: string;
}
export declare var dateTypeDefaultOptions: DateTypeOptions;
export declare var FieldTypes: {
    any: AnyType;
    string: StringType;
    number: NumberType;
    boolean: BooleanType;
    date: DateType;
};
