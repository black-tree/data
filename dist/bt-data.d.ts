declare module 'bt-data/utils/filter' {
	export interface Filter {
	    matches(item: any): boolean;
	    toCallback(): (item: any) => boolean;
	}
	export abstract class AbstractFilter {
	    matches(item: any): boolean;
	    toCallback(): (item: any) => boolean;
	}
	export class CallbackFilter extends AbstractFilter implements Filter {
	    constructor(matches: (item: any) => boolean);
	}
	export class FilterChain extends AbstractFilter implements Filter {
	    filters: Filter[];
	    constructor(filters?: Filter[]);
	    matches(subject: any): boolean;
	    addFilter(filter: Filter): void;
	    removeFilter(filter: Filter): boolean;
	    getFilters(): Filter[];
	}
	export class PropertyMatchFilter extends AbstractFilter implements Filter {
	    private matchSpecs;
	    private filter;
	    constructor(matchSpecs: PropertyMatchSpecification[]);
	    matches(subject: any): boolean;
	    getMatchSpecifications(): PropertyMatchSpecification[];
	    private configure();
	}
	export class PropertyMatcher extends AbstractFilter implements Filter {
	    constructor(spec: PropertyMatchSpecification);
	}
	export interface PropertyMatchSpecification {
	    property: string;
	    operator?: string;
	    value: any;
	}

}
declare module 'bt-data/utils/collection' {
	import { Filter } from 'bt-data/utils/filter';
	export class Collection<T> {
	    protected items: T[];
	    constructor(items?: T[]);
	    setItems(items: T[]): void;
	    clear(): void;
	    add(item: T, position?: number): boolean;
	    addItems(items: T[], position?: number): ItemsInsertion<T>;
	    delete(item: T): boolean;
	    deleteItems(items: T[]): T[];
	    getAt(position: number): T;
	    indexOf(item: T): number;
	    lastIndexOf(item: T): number;
	    private compileSearchCriteria(criteria);
	    filter(filter: Filter): T[];
	    findBy(criteria: SearchCriteria): T[];
	    findOneBy(criteria: SearchCriteria): T;
	    findIndex(criteria: SearchCriteria): number;
	    includes(item: T, fromIndex?: number): boolean;
	    first(): T;
	    last(): T;
	    slice(start: number, end: number): T[];
	    getItems(): T[];
	    forEach(callback: (value: T, index: number, array: T[]) => void): void;
	    length: number;
	}
	export type SearchCriteria = {
	    [propertyName: string]: any;
	} | Function;
	export class ItemsInsertion<T> {
	    items: T[];
	    position: number;
	    constructor(items: T[], position: number);
	    newAdded: boolean;
	}

}
declare module 'bt-data/field/field-type' {
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
	    convertRawValue(value: any, options: FieldTypeOptions): any;
	    /**
	     * Converts a value of this FieldType to a serialized representation of it.
	     * Can be considered the inverse function of [[FieldType.convertRawValue]].
	     * @param value
	     * @param options
	     */
	    serializeValue(value: any, options: FieldTypeOptions): any;
	    /**
	     * Test whether two values of this FieldType should be considered equal
	     * @param value1
	     * @param value2
	     */
	    valuesAreEqual?(value1: any, value2: any): boolean;
	    /**
	     * Returns a copy of the default options that will be passed to the value
	     * conversion functions
	     */
	    getDefaultOptions(): FieldTypeOptions;
	}
	/**
	 * A base class from which to derive field types. It helps by handling
	 * [[TypeOptions|options]] that are common to all field types
	 */
	export abstract class BaseFieldType implements FieldType {
	    convertRawValue(value: any, options: FieldTypeOptions): any;
	    getDefaultOptions(): FieldTypeOptions;
	    /**
	     *
	     * @inheritdoc
	     */
	    abstract serializeValue(value: any, options: FieldTypeOptions): any;
	    protected abstract convertToType(value: any, options: FieldTypeOptions): any;
	}
	/**
	 * A field type that simply returns values as they are given, without
	 * performing any conversion
	 */
	export class AnyType extends BaseFieldType {
	    /**
	     * @inheritdoc
	     */
	    serializeValue(value: any, options: FieldTypeOptions): string;
	    protected convertToType(value: any, options: FieldTypeOptions): any;
	}
	/**
	 * The field type for the string data type.
	 */
	export class StringType extends BaseFieldType {
	    protected convertToType(value: any, options: FieldTypeOptions): string;
	    /**
	     *
	     * @inheritdoc
	     */
	    serializeValue(value: any, options: FieldTypeOptions): string;
	}
	/**
	 * The field type for the number data type
	 */
	export class NumberType extends BaseFieldType {
	    protected convertToType(value: any, options: FieldTypeOptions): number;
	    /**
	     *
	     * @inheritdoc
	     */
	    serializeValue(value: number, options: FieldTypeOptions): number;
	}
	/**
	 * The field type for the boolean data type
	 */
	export class BooleanType extends BaseFieldType {
	    protected convertToType(value: any, options: FieldTypeOptions): boolean;
	    /**
	     *
	     * @inheritdoc
	     */
	    serializeValue(value: number, options: FieldTypeOptions): number;
	}
	/**
	 * Field type for the date data type. The conversion methods of this type
	 * accept the [[DateTypeOptions]] extension of the [[TypeOptions]] that allows
	 * specifying the format that should be used for parsing raw values and
	 * for serializing Date objects back into strings. This class also implements
	 * the optional method [[valuesAreEqual]] that should be used by value change
	 * detectors to decide whether a value has really changed.
	 */
	export class DateType extends BaseFieldType {
	    protected convertToType(value: any, options: FieldTypeOptions): any;
	    /**
	     * Converts a Date instance into a string, in the format specified by the
	     * options parameter.
	     * @param value
	     * @param options
	     * @return {Object|number}
	     */
	    serializeValue(value: Date, options: DateTypeOptions): string;
	    /**
	     * Test whether two Date instances should be considered as the same value.
	     * Will return true if both instances correspond to the same date.
	     * @param value1
	     * @param value2
	     * @return {boolean}
	     */
	    valuesAreEqual(value1: Date, value2: Date): boolean;
	    getDefaultOptions(): FieldTypeOptions;
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
	    nullValues: boolean;
	}
	/**
	 * The default options passed to field types conversion functions
	 */
	export var defaultFieldTypeOptions: FieldTypeOptions;
	/**
	 * The options that can be passed to the conversion functions of the
	 * [[DateType]] field type.
	 */
	export interface DateTypeOptions extends FieldTypeOptions {
	    /**
	     * The format to use for both parsing and serializing dates
	     */
	    dateFormat: string;
	    /**
	     * If specified, this will be the format used only for parsing a raw
	     * string into a `Date`
	     */
	    parseDateFormat?: string;
	    /**
	     * If specified, this will be the format used only for serializing a Date
	     * instance back into a string.
	     */
	    serializeDateFormat?: string;
	}
	/**
	 * The default options passed to the conversion functions of the [[DateType]].
	 */
	export var dateTypeDefaultOptions: DateTypeOptions;
	/**
	 * A map of field type names to instances of that field type.
	 */
	export var FieldTypes: {
	    any: AnyType;
	    string: StringType;
	    number: NumberType;
	    boolean: BooleanType;
	    date: DateType;
	};

}
declare module 'bt-data/field/field' {
	import { FieldType, FieldTypeOptions } from 'bt-data/field/field-type';
	export class Field {
	    /**
	     * The name of the field
	     */
	    private name;
	    /**
	     * The field's type
	     */
	    private type;
	    /**
	     * Options specific to this field's type
	     */
	    private typeOptions;
	    constructor(name: string, type: FieldType);
	    getName(): string;
	    getType(): FieldType;
	    getTypeOptions(): FieldTypeOptions;
	    setTypeOptions(options: FieldTypeOptions): void;
	}
	export class FieldFactory {
	    static create(options: FieldDefinition | Field): Field;
	}
	export interface FieldDefinition {
	    name: string;
	    type?: string | FieldType;
	    typeOptions?: FieldTypeOptions;
	}
	export var defaultFieldOptions: {
	    type: string;
	};

}
declare module 'bt-data/model/field-configurator' {
	import { ModelPrototype } from 'bt-data/model/model';
	import { Field } from 'bt-data/field/field';
	/**
	 * The interface that must be implemented by all field configurators
	 */
	export interface FieldConfigurator {
	    configureFields(modelPrototype: ModelPrototype, fields: Field[]): void;
	}
	export class DefaultFieldConfigurator implements FieldConfigurator {
	    configureFields(modelPrototype: ModelPrototype, fields: Field[]): void;
	}
	export var FieldConfigurators: {
	    'default': DefaultFieldConfigurator;
	};

}
declare module 'bt-data/model/metadata' {
	import { Field, FieldDefinition } from 'bt-data/field/field';
	import { FieldConfigurator } from 'bt-data/model/field-configurator';
	export class Metadata {
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
	/**
	 * A factory function for creating Metadata instances from a metadata
	 * definition object
	 * @param options
	 * @return {Metadata}
	 */
	export function createMetadata(options: MetadataDefinition): Metadata;
	export interface MetadataDefinition {
	    fields?: (Field | FieldDefinition)[];
	    fieldConfigurator?: string | FieldConfigurator;
	    idFieldName?: string;
	    injectModelApi?: boolean;
	}
	export var metadataDefinitionDefaults: {
	    fields: any[];
	    fieldConfigurator: string;
	    idFieldName: string;
	    injectModelApi: boolean;
	};

}
declare module 'bt-data/model/model-data' {
	import { IEvent, IEventDispatcher } from "wg-events";
	/**
	 * Holds and manages the persistence state of a model instance data
	 */
	export class ModelData implements IEventDispatcher {
	    /**
	     * The values of this data, indexed by name
	     */
	    private values;
	    /**
	     * The set of all dirty values, indexed by name
	     */
	    private dirty;
	    /**
	     * The model whose data is managed by this ModelData instance
	     */
	    private model;
	    /**
	     * Used to dispatch events
	     */
	    private eventDispatcher;
	    /**
	     * Creates a new ModelData instance for the specified model, optionally
	     * initialized with the provided values
	     * @param model
	     * @param values
	     */
	    constructor(model: any, values?: {
	        [s: string]: any;
	    });
	    /**
	     * Sets the value of the indicated property
	     * @param property
	     * @param value
	     */
	    setValue(property: any, value: any): void;
	    /**
	     * Sets the values of the properties as defined by the given key/value
	     * pairs. No [[DataChangedEvent]] is dispatched until all the values have
	     * been set.
	     * @param values
	     */
	    setValues(values: {
	        [s: string]: any;
	    }): void;
	    private _setValue(property, value);
	    /**
	     * Gets the value of the indicated property. Returns undefined if the data
	     * does not contain such property.
	     * @param property
	     * @return {any}
	     */
	    getValue(property: any): any;
	    /**
	     * Returns all the current values of this data
	     * @return {{}}
	     */
	    getValues(): {
	        [s: string]: any;
	    };
	    /**
	     * Commits the values of this data, effectively making this data non-dirty
	     */
	    commit(): void;
	    commitValue(property: string): void;
	    commitValues(properties: string[]): void;
	    /**
	     * Reverts this data values to what they where immediately after the first
	     * call to [[commit]].
	     */
	    rollback(): void;
	    /**
	     * Indicates whether any of the values of this data is dirty, that is,
	     * if any of them was modified after the last call to [[commit]].
	     * @return {boolean}
	     */
	    isDirty(): boolean;
	    /**
	     * Indicates whether the passed property is dirty.
	     * @param property
	     * @return {boolean}
	     */
	    hasDirtyValue(property: any): boolean;
	    /**
	     * Returns all the change made to each of this data's dirty values
	     * @return {Array}
	     */
	    getChanges(): ValueChange[];
	    private getChange(value);
	    private dispatchDataChangedEvent(values);
	    private dispatchDataCommittedEvent(committed);
	    addEventListener(event: string, listener: Function): any;
	    on(event: string, listener: Function): any;
	    removeEventListener(event: string, listener: Function): any;
	    off(event: string, listener: Function): any;
	    dispatchEvent(event: string | IEvent): any;
	}
	/**
	 * A helper class to manage the persistence state of a single ModelData value
	 */
	export class DataValue {
	    /**
	     * The name of the property to which this value corresponds
	     */
	    private name;
	    /**
	     * The current value of this object
	     */
	    private value;
	    /**
	     * The value of this object just before the last call to [[setValue]]
	     */
	    private oldValue;
	    /**
	     * The current committed value of this object
	     */
	    private committedValue;
	    /**
	     * A function to test if two values are actually different
	     * @type {function(any, any): boolean}
	     */
	    private valuesDiffer;
	    /**
	     * Creates a new DataValue object with the indicated name and initial value
	     * @param name
	     * @param value
	     */
	    constructor(name: string, value?: any);
	    /**
	     * Sets the value of this data value object. Returns true if the value was
	     * actually changed
	     * @param value
	     * @return {boolean}
	     */
	    setValue(value: any): boolean;
	    /**
	     * Returns the current value of this object
	     * @return {any}
	     */
	    getValue(): any;
	    /**
	     * The value of this object just before the last call to [[setValue]]
	     * @return {any}
	     */
	    getOldValue(): any;
	    /**
	     * The current committed value of this object
	     * @return {any}
	     */
	    getCommittedValue(): any;
	    /**
	     * The name of the property to which this value corresponds
	     * @return {string}
	     */
	    getName(): string;
	    /**
	     * Commits this value
	     */
	    commit(): boolean;
	    /**
	     * Reverts this value to what it was just after the last call to [[commit]]
	     * or its initial value
	     */
	    rollback(): void;
	    /**
	     * Indicates whether this value is dirty
	     * @return {boolean}
	     */
	    isDirty(): boolean;
	    /**
	     * Sets the comparison function to use when testing if two values are
	     * different
	     * @param handler
	     */
	    setValuesDifferHandler(handler: (v1, v2) => boolean): void;
	    /**
	     * The default function used for testing if two values are different
	     * @param v1
	     * @param v2
	     * @return {boolean}
	     */
	    static valuesDiffer(v1: any, v2: any): boolean;
	}
	/**
	 * Represents the change of the value of a property
	 */
	export interface ValueChange {
	    /**
	     * The name of the property to which the value corresponds
	     */
	    propertyName: string;
	    /**
	     * The old (previous) value of the property
	     */
	    oldValue: any;
	    /**
	     * The new (current) value of the property
	     */
	    newValue: any;
	}
	/**
	 * Dispatched when one ore more values of a [[ModelData]] has changed
	 */
	export interface DataChangedEvent extends IEvent {
	    /**
	     * The collection of changes that the data underwent
	     */
	    changes: ValueChange[];
	    /**
	     * The model data that was changed
	     */
	    data: ModelData;
	    /**
	     * The model instance to which the modified data belongs
	     */
	    model: any;
	}
	export interface DataCommittedEvent extends IEvent {
	    properties: string[];
	    /**
	     * The model data that was committed
	     */
	    data: ModelData;
	    /**
	     * The model instance to which the committed data belongs
	     */
	    model: any;
	}

}
declare module 'bt-data/model/model' {
	import { Metadata, MetadataDefinition } from 'bt-data/model/metadata';
	import { ModelData } from 'bt-data/model/model-data';
	import { Field } from 'bt-data/field/field';
	import { IEventDispatcher, IEvent } from "wg-events";
	export interface ModelPrototype {
	    _modelMetadata_: Metadata;
	}
	export interface Model {
	    modelAspect: ModelAspect;
	}
	export class ModelAspect implements IEventDispatcher {
	    private _data;
	    private _model;
	    private _id;
	    private em;
	    constructor(model: Model, data: ModelData);
	    getMetadata(): Metadata;
	    commit(): void;
	    commitValue(name: string): void;
	    commitValues(names: string[]): void;
	    rollback(): void;
	    isDirty(): boolean;
	    isPersisted(): boolean;
	    addEventListener(event: string, listener: Function): void;
	    on(event: string, listener: Function): any;
	    removeEventListener(event: string, listener: Function): void;
	    off(event: string, listener: Function): void;
	    dispatchEvent(event: string | IEvent): void;
	    data: ModelData;
	    model: Model;
	    id: number;
	}
	/**
	 * Defines the specified class as a model, whose structure is defined by the
	 * options passed.
	 *
	 * @param Class
	 * @param options
	 */
	export function declareModel(Class: Function, options: ModelDefinition): void;
	export interface ModelClass {
	    getFields(): Field[];
	}
	export function injectModelApi(ModelClass: any): void;
	export type ModelDefinition = MetadataDefinition;

}
declare module 'bt-data/utils/instantiator' {
	export interface Instantiator {
	    instantiate<Class>(InstanceClass: (new () => Class)): Class;
	}
	export class PrototypeInjectionInstantiator implements Instantiator {
	    instantiate<Class>(InstanceClass: (new () => Class)): Class;
	}
	export class ConstructorCallInstantiator implements Instantiator {
	    instantiate<Class>(InstanceClass: (new () => Class)): Class;
	}

}
