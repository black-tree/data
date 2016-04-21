/**
 * Defines the API common to all field types
 */
export interface FieldType {

  /**
   * Converts a raw value to a value of this field type
   * @param value The value to convert
   * @param options Any options that can be used by the function to tune the
   * value conversion
   */
  convertRawValue(value:any, options:FieldTypeOptions):any;

  /**
   * Converts a value of this FieldType to a serialized representation of it.
   * Can be considered the inverse function of [[FieldType.convertRawValue]].
   * @param value
   * @param options
   */
  serializeValue(value:any, options:FieldTypeOptions):any;

  /**
   * Test whether two values of this FieldType should be considered equal
   * @param value1
   * @param value2
   */
  valuesAreEqual?(value1:any, value2:any):boolean;

  /**
   * Returns a copy of the default options that will be passed to the value
   * conversion functions
   */
  getDefaultOptions():FieldTypeOptions;
}

/**
 * A base class from which to derive field types. It helps by handling
 * [[TypeOptions|options]] that are common to all field types
 */
export abstract class BaseFieldType implements FieldType{

  convertRawValue(value:any, options:FieldTypeOptions):any {
    if (options.nullValues && value === null) {
      return null;
    }
    return this.convertToType(value, options);
  }

  getDefaultOptions():FieldTypeOptions {
    return Object.assign({}, defaultFieldTypeOptions);
  }

  /**
   *
   * @inheritdoc
   */
  abstract serializeValue(value:any, options:FieldTypeOptions):any;

  protected abstract convertToType(value:any, options:FieldTypeOptions):any;
}

/**
 * A field type that simply returns values as they are given, without
 * performing any conversion
 */
export class AnyType extends BaseFieldType {

  /**
   * @inheritdoc
   */
  serializeValue(value:any, options:FieldTypeOptions):string {
    return value;
  }


  protected convertToType(value:any, options:FieldTypeOptions):any {
    return value;
  }
}

/**
 * The field type for the string data type.
 */
export class StringType extends BaseFieldType{

  protected convertToType(value:any, options:FieldTypeOptions):string {
    return String(value);
  }

  /**
   *
   * @inheritdoc
   */
  serializeValue(value:any, options:FieldTypeOptions):string {
    return value;
  }

}

/**
 * The field type for the number data type
 */
export class NumberType extends BaseFieldType {

  protected convertToType(value:any, options:FieldTypeOptions):number {
    return Number(value);
  }

  /**
   *
   * @inheritdoc
   */
  serializeValue(value:number, options:FieldTypeOptions):number {
    return value;
  }
}

/**
 * The field type for the boolean data type
 */
export class BooleanType extends BaseFieldType {

  protected convertToType(value:any, options:FieldTypeOptions):boolean {
    return !!value;
  }

  /**
   *
   * @inheritdoc
   */
  serializeValue(value:number, options:FieldTypeOptions):number {
    return value;
  }
}

/**
 * Field type for the date data type. The conversion methods of this type
 * accept the [[DateTypeOptions]] extension of the [[TypeOptions]] that allows
 * specifying the format that should be used for parsing raw values and
 * for serializing Date objects back into strings. This class also implements
 * the optional method [[valuesAreEqual]] that should be used by value change
 * detectors to decide whether a value has really changed.
 */
export class DateType extends BaseFieldType{

  protected convertToType(value:any, options:FieldTypeOptions):any {
    return new Date(Number(value));
  }

  /**
   * Converts a Date instance into a string, in the format specified by the
   * options parameter.
   * @param value
   * @param options
   * @return {Object|number}
   */
  serializeValue(value:Date, options:DateTypeOptions):string {
    return String(value.valueOf());
  }

  /**
   * Test whether two Date instances should be considered as the same value.
   * Will return true if both instances correspond to the same date.
   * @param value1
   * @param value2
   * @return {boolean}
   */
  valuesAreEqual(value1:Date, value2:Date):boolean {
    return value1.valueOf() !== value2.valueOf();
  }


  getDefaultOptions():FieldTypeOptions {
    return dateTypeDefaultOptions;
  }
}

/**
 * The most basic set of options that can be passed to the conversion functions
 * of a [[FieldType]], namely [[FieldType.convertRawValue|convertRawValue()]] and
 * [[FieldType.serializeValue|serializeValue()]]
 */
export interface FieldTypeOptions {

  /**
   * Tells whether null values should be kept as they are, without coercing
   * them into the data type associated to a [[FieldType]]
   */
  nullValues:boolean;

}

/**
 * The default options passed to field types conversion functions
 */
export var defaultFieldTypeOptions:FieldTypeOptions = {

  nullValues: true

};

/**
 * The options that can be passed to the conversion functions of the
 * [[DateType]] field type.
 */
export interface DateTypeOptions extends FieldTypeOptions{

  /**
   * The format to use for both parsing and serializing dates
   */
  dateFormat:string;

  /**
   * If specified, this will be the format used only for parsing a raw
   * string into a `Date`
   */
  parseDateFormat?:string;

  /**
   * If specified, this will be the format used only for serializing a Date
   * instance back into a string.
   */
  serializeDateFormat?:string;

}

/**
 * The default options passed to the conversion functions of the [[DateType]].
 */
export var dateTypeDefaultOptions:DateTypeOptions = Object.assign({
  dateFormat: ''
}, defaultFieldTypeOptions);

/**
 * A map of field type names to instances of that field type.
 */
export var FieldTypes = {
  any: new AnyType(),
  string: new StringType(),
  number: new NumberType(),
  boolean: new BooleanType(),
  date: new DateType()
};
