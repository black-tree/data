var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("adapter/adapter", ["require", "exports", "reader/json-reader", "serializer/json-serializer"], function (require, exports, json_reader_1, json_serializer_1) {
    "use strict";
    var AbstractAdapter = (function () {
        function AbstractAdapter(config) {
            Object.assign(this, config);
        }
        AbstractAdapter.prototype.getReader = function () {
            if (!this.reader) {
                this.reader = exports.defaultReader;
            }
            return this.reader;
        };
        AbstractAdapter.prototype.getSerializer = function () {
            if (!this.serializer) {
                this.serializer = exports.defaultSerializer;
            }
            return this.serializer;
        };
        AbstractAdapter.prototype.getModelClass = function () {
            return this.modelClass;
        };
        AbstractAdapter.prototype.getModelPrototype = function () {
            return this.modelClass.prototype;
        };
        AbstractAdapter.prototype.getModelMetadata = function () {
            return this.getModelPrototype()._modelMetadata_;
        };
        AbstractAdapter.prototype.serializeModelData = function (models) {
            var data = [];
            models.forEach(function (model) { return data.push(model.modelAspect.data.getValues()); });
            return data;
        };
        return AbstractAdapter;
    }());
    exports.AbstractAdapter = AbstractAdapter;
    exports.defaultReader = new json_reader_1.JsonReader();
    exports.defaultSerializer = new json_serializer_1.JsonSerializer();
});
define("adapter/http-adapter", ["require", "exports", "aurelia-http-client", "adapter/adapter"], function (require, exports, aurelia_http_client_1, adapter_1) {
    "use strict";
    var HttpAdapter = (function (_super) {
        __extends(HttpAdapter, _super);
        function HttpAdapter(config) {
            _super.call(this, config);
            this.httpClient = config.httpClient;
            this.api = config.api;
        }
        HttpAdapter.prototype.create = function (models) {
            var _this = this;
            var data = this.serializeModelData(models);
            return new Promise(function (resolve) {
                var promise = _this.getHttpClient().createRequest(_this.api.create)
                    .withContent(data).send();
                promise.then(function (response) {
                    resolve({
                        type: 'create',
                        success: true,
                        data: _this.getReader().read(response.content).data
                    });
                });
                promise.catch(function () {
                    resolve({
                        type: 'create',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.read = function (options) {
            var _this = this;
            return new Promise(function (resolve) {
                var requestPromise = _this.httpClient.createRequest(_this.api.read)
                    .withParams(options.params || {})
                    .send();
                requestPromise.then(function (response) {
                    var result = _this.getReader().read(response.content);
                    resolve({
                        type: 'read',
                        success: true,
                        data: result.data,
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        offset: result.offset
                    });
                });
                requestPromise.catch(function () {
                    resolve({
                        type: 'read',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.update = function (models) {
            var _this = this;
            return new Promise(function (resolve) {
                var requestPromise = _this.httpClient.createRequest(_this.api.update)
                    .withContent(_this.serializeModelData(models))
                    .send();
                requestPromise.then(function (response) {
                    resolve({
                        type: 'update',
                        success: true,
                        data: _this.getReader().read(response.content).data
                    });
                });
                requestPromise.catch(function () {
                    resolve({
                        type: 'update',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.delete = function (models) {
            var _this = this;
            return new Promise(function (resolve) {
                var requestPromise = _this.httpClient.createRequest(_this.api.update)
                    .withContent(_this.serializeModelData(models))
                    .send();
                requestPromise.then(function (response) {
                    resolve({
                        type: 'delete',
                        success: true,
                        data: _this.getReader().read(response.content).data
                    });
                });
                requestPromise.catch(function () {
                    resolve({
                        type: 'delete',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.sync = function (batch) {
            var _this = this;
            return new Promise(function (resolve) {
                var inProgress = 3;
                var result = {};
                function attemptResolve() {
                    if (inProgress === 0) {
                        resolve(result);
                    }
                }
                _this.update(batch.forUpdate).then(function (update) {
                    result.update = update;
                    inProgress--;
                    attemptResolve();
                });
                _this.create(batch.forDeletion).then(function (deletion) {
                    result.delete = deletion;
                    inProgress--;
                    attemptResolve();
                });
                _this.create(batch.forInsertion).then(function (insertion) {
                    result.create = insertion;
                    inProgress--;
                    attemptResolve();
                });
            });
        };
        HttpAdapter.prototype.getHttpClient = function () {
            if (!this.httpClient) {
                this.httpClient = new aurelia_http_client_1.HttpClient();
            }
            return this.httpClient;
        };
        return HttpAdapter;
    }(adapter_1.AbstractAdapter));
    exports.HttpAdapter = HttpAdapter;
});
define("adapter/memory-adapter", ["require", "exports", "adapter/adapter"], function (require, exports, adapter_2) {
    "use strict";
    var MemoryAdapter = (function (_super) {
        __extends(MemoryAdapter, _super);
        function MemoryAdapter(config) {
            _super.call(this, config);
            this.data = [];
            this.lastId = 0;
            this.idFieldName = config.idFieldName || 'id';
        }
        MemoryAdapter.prototype.create = function (models) {
            return Promise.resolve(this._create(models));
        };
        MemoryAdapter.prototype.read = function (options) {
            return Promise.resolve({
                type: 'read',
                success: true,
                data: this.data.slice(0)
            });
        };
        MemoryAdapter.prototype.update = function (models) {
            return Promise.resolve(this._update(models));
        };
        MemoryAdapter.prototype.delete = function (models) {
            return Promise.resolve(this._delete(models));
        };
        MemoryAdapter.prototype.sync = function (batch) {
            return Promise.resolve({
                create: this._create(batch.forInsertion),
                update: this._update(batch.forUpdate),
                delete: this._delete(batch.forDeletion)
            });
        };
        MemoryAdapter.prototype._create = function (models) {
            var _this = this;
            var data = this.serializeModelData(models);
            data.forEach(function (record) {
                record[_this.idFieldName] = _this.nextId();
                _this.data[record[_this.idFieldName]] = record;
            });
            return {
                type: 'create',
                success: true,
                data: data.slice(0)
            };
        };
        MemoryAdapter.prototype._update = function (models) {
            var _this = this;
            var data = this.serializeModelData(models);
            data.forEach(function (record) {
                record[_this.idFieldName] = _this.nextId();
                _this.data[record[_this.idFieldName]] = record;
            });
            return {
                type: 'update',
                success: true,
                data: data.slice(0)
            };
        };
        MemoryAdapter.prototype._delete = function (models) {
            var _this = this;
            models.forEach(function (model) {
                var id = model[_this.idFieldName];
                _this.data.splice(id, 1);
            });
            return {
                type: 'delete',
                success: true
            };
        };
        MemoryAdapter.prototype.nextId = function () {
            return ++this.lastId;
        };
        return MemoryAdapter;
    }(adapter_2.AbstractAdapter));
    exports.MemoryAdapter = MemoryAdapter;
});
define("field/field-type", ["require", "exports"], function (require, exports) {
    "use strict";
    var BaseFieldType = (function () {
        function BaseFieldType() {
        }
        BaseFieldType.prototype.convertRawValue = function (value, options) {
            if (options.nullValues && value === null) {
                return null;
            }
            return this.convertToType(value, options);
        };
        BaseFieldType.prototype.getDefaultOptions = function () {
            return Object.assign({}, exports.defaultFieldTypeOptions);
        };
        return BaseFieldType;
    }());
    exports.BaseFieldType = BaseFieldType;
    var AnyType = (function (_super) {
        __extends(AnyType, _super);
        function AnyType() {
            _super.apply(this, arguments);
        }
        AnyType.prototype.serializeValue = function (value, options) {
            return value;
        };
        AnyType.prototype.convertToType = function (value, options) {
            return value;
        };
        return AnyType;
    }(BaseFieldType));
    exports.AnyType = AnyType;
    var StringType = (function (_super) {
        __extends(StringType, _super);
        function StringType() {
            _super.apply(this, arguments);
        }
        StringType.prototype.convertToType = function (value, options) {
            return String(value);
        };
        StringType.prototype.serializeValue = function (value, options) {
            return value;
        };
        return StringType;
    }(BaseFieldType));
    exports.StringType = StringType;
    var NumberType = (function (_super) {
        __extends(NumberType, _super);
        function NumberType() {
            _super.apply(this, arguments);
        }
        NumberType.prototype.convertToType = function (value, options) {
            return Number(value);
        };
        NumberType.prototype.serializeValue = function (value, options) {
            return value;
        };
        return NumberType;
    }(BaseFieldType));
    exports.NumberType = NumberType;
    var BooleanType = (function (_super) {
        __extends(BooleanType, _super);
        function BooleanType() {
            _super.apply(this, arguments);
        }
        BooleanType.prototype.convertToType = function (value, options) {
            return !!value;
        };
        BooleanType.prototype.serializeValue = function (value, options) {
            return value;
        };
        return BooleanType;
    }(BaseFieldType));
    exports.BooleanType = BooleanType;
    var DateType = (function (_super) {
        __extends(DateType, _super);
        function DateType() {
            _super.apply(this, arguments);
        }
        DateType.prototype.convertToType = function (value, options) {
            return new Date(Number(value));
        };
        DateType.prototype.serializeValue = function (value, options) {
            return String(value.valueOf());
        };
        DateType.prototype.valuesAreEqual = function (value1, value2) {
            return value1.valueOf() !== value2.valueOf();
        };
        DateType.prototype.getDefaultOptions = function () {
            return exports.dateTypeDefaultOptions;
        };
        return DateType;
    }(BaseFieldType));
    exports.DateType = DateType;
    exports.defaultFieldTypeOptions = {
        nullValues: true
    };
    exports.dateTypeDefaultOptions = Object.assign({
        dateFormat: ''
    }, exports.defaultFieldTypeOptions);
    exports.FieldTypes = {
        any: new AnyType(),
        string: new StringType(),
        number: new NumberType(),
        boolean: new BooleanType(),
        date: new DateType()
    };
});
define("field/field", ["require", "exports", "field/field-type"], function (require, exports, field_type_1) {
    "use strict";
    var Field = (function () {
        function Field(name, type) {
            this.name = name;
            this.type = type;
        }
        Field.prototype.getName = function () {
            return this.name;
        };
        Field.prototype.getType = function () {
            return this.type;
        };
        Field.prototype.getTypeOptions = function () {
            return this.typeOptions;
        };
        Field.prototype.setTypeOptions = function (options) {
            this.typeOptions = options;
        };
        return Field;
    }());
    exports.Field = Field;
    var FieldFactory = (function () {
        function FieldFactory() {
        }
        FieldFactory.create = function (options) {
            if (Field.prototype.isPrototypeOf(options)) {
                return options;
            }
            var definition = Object.assign({}, exports.defaultFieldOptions, options);
            if (typeof definition.type === 'string') {
                definition.type = field_type_1.FieldTypes[definition.type];
            }
            var field = new Field(definition.name, definition.type);
            field.setTypeOptions(definition.typeOptions);
            return field;
        };
        return FieldFactory;
    }());
    exports.FieldFactory = FieldFactory;
    exports.defaultFieldOptions = {
        type: 'any'
    };
});
define("model/decorators", ["require", "exports", "model/model", "field/field"], function (require, exports, model_1, field_1) {
    "use strict";
    function Model(options) {
        if (options === void 0) { options = {}; }
        return function (Target) {
            var modelPrototype = Target.prototype;
            options.fields = options.fields || [];
            if (modelPrototype.__fields__) {
                (_a = options.fields).push.apply(_a, modelPrototype.__fields__);
                delete modelPrototype.__fields__;
            }
            model_1.declareModel(Target, options);
            return Target;
            var _a;
        };
    }
    exports.Model = Model;
    function Field(options) {
        if (options === void 0) { options = {}; }
        return function (modelPrototype, propertyName) {
            var definition = Object.assign({ name: propertyName }, options);
            var metadata = modelPrototype._modelMetadata_;
            var field = field_1.FieldFactory.create(definition);
            if (metadata) {
                metadata.addField(field_1.FieldFactory.create(definition));
            }
            else {
                var fields = modelPrototype.__fields__;
                if (!fields) {
                    fields = [];
                    modelPrototype.__fields__ = fields;
                }
                fields.push(field);
            }
        };
    }
    exports.Field = Field;
});
define("model/field-configurator", ["require", "exports"], function (require, exports) {
    "use strict";
    var DefaultFieldConfigurator = (function () {
        function DefaultFieldConfigurator() {
        }
        DefaultFieldConfigurator.prototype.configureFields = function (modelPrototype, fields) {
            fields.forEach(function (field) {
                var fieldName = field.getName();
                Object.defineProperty(modelPrototype, fieldName, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        if (this === modelPrototype) {
                            return undefined;
                        }
                        var model = this;
                        return model.modelAspect.data.getValue(fieldName);
                    },
                    set: function (value) {
                        if (this === modelPrototype) {
                            return;
                        }
                        var model = this;
                        model.modelAspect.data.setValue(fieldName, value);
                    }
                });
            });
        };
        return DefaultFieldConfigurator;
    }());
    exports.DefaultFieldConfigurator = DefaultFieldConfigurator;
    exports.FieldConfigurators = {
        'default': new DefaultFieldConfigurator()
    };
});
define("model/metadata", ["require", "exports", "field/field", "model/field-configurator"], function (require, exports, field_2, field_configurator_1) {
    "use strict";
    var Metadata = (function () {
        function Metadata() {
        }
        Metadata.prototype.setFields = function (fields) {
            this.fields = fields;
        };
        Metadata.prototype.getFields = function () {
            return this.fields;
        };
        Metadata.prototype.getModelFields = function () {
            var fields = Array.from(this.fields);
            fields.push(this.getIdField());
            return fields;
        };
        Metadata.prototype.addField = function (field) {
            this.fields.push(field);
        };
        Metadata.prototype.getIdField = function () {
            if (!this.idField) {
                this.idField = field_2.FieldFactory.create({ name: 'id' });
            }
            return this.idField;
        };
        Metadata.prototype.getIdFieldName = function () {
            return this.getIdField().getName();
        };
        Metadata.prototype.setModelClass = function (modelClass) {
            this.modelClass = modelClass;
        };
        Metadata.prototype.getModelClass = function () {
            return this.modelClass;
        };
        Metadata.prototype.getFieldConfigurator = function () {
            return this.fieldConfigurator;
        };
        Metadata.prototype.setFieldConfigurator = function (configurator) {
            this.fieldConfigurator = configurator;
        };
        return Metadata;
    }());
    exports.Metadata = Metadata;
    function createMetadata(options) {
        options = Object.assign({}, exports.metadataDefinitionDefaults, options);
        var metadata = new Metadata();
        var fields = [];
        options.fields.forEach(function (field) {
            fields.push(field_2.FieldFactory.create(field));
        });
        metadata.setFields(fields);
        if (typeof options.fieldConfigurator === 'string') {
            options.fieldConfigurator = field_configurator_1.FieldConfigurators[options.fieldConfigurator];
        }
        metadata.setFieldConfigurator(options.fieldConfigurator);
        return metadata;
    }
    exports.createMetadata = createMetadata;
    exports.metadataDefinitionDefaults = {
        fields: [],
        fieldConfigurator: 'default',
        idFieldName: 'id',
        injectModelApi: false
    };
});
define("model/model-data", ["require", "exports", "wg-events"], function (require, exports, wg_events_1) {
    "use strict";
    var ModelData = (function () {
        function ModelData(model, values) {
            var _this = this;
            if (values === void 0) { values = {}; }
            this.values = {};
            this.dirty = {};
            this.eventDispatcher = new wg_events_1.EventDispatcher(this);
            this.model = model;
            Object.getOwnPropertyNames(values).forEach(function (prop) {
                _this.values[prop] = new DataValue(prop, values[prop]);
            });
        }
        ModelData.prototype.setValue = function (property, value) {
            this.setValues((_a = {}, _a[property] = value, _a));
            var _a;
        };
        ModelData.prototype.setValues = function (values) {
            var _this = this;
            var modified = [];
            Object.getOwnPropertyNames(values).forEach(function (prop) {
                if (_this._setValue(prop, values[prop])) {
                    modified.push(_this.values[prop]);
                }
            });
            this.dispatchDataChangedEvent(modified);
        };
        ModelData.prototype._setValue = function (property, value) {
            var dataValue = this.values[property];
            if (!dataValue) {
                dataValue = new DataValue(property);
                this.values[property] = dataValue;
            }
            if (dataValue.setValue(value)) {
                dataValue.isDirty() ? this.dirty[property] = dataValue
                    : delete this.dirty[property];
                return true;
            }
            return false;
        };
        ModelData.prototype.getValue = function (property) {
            if (this.values[property]) {
                return this.values[property].getValue();
            }
        };
        ModelData.prototype.getValues = function () {
            var values = {};
            for (var name_1 in this.values) {
                if (this.values.hasOwnProperty(name_1)) {
                    values[name_1] = this.values[name_1].getValue();
                }
            }
            return values;
        };
        ModelData.prototype.commit = function () {
            this.commitValues(Object.keys(this.dirty));
        };
        ModelData.prototype.commitValue = function (property) {
            this.commitValues([property]);
        };
        ModelData.prototype.commitValues = function (properties) {
            var _this = this;
            var committed = [];
            properties.forEach(function (property) {
                if (_this.dirty.hasOwnProperty(property)) {
                    var value = _this.dirty[property];
                    value.commit();
                    committed.push(property);
                    delete _this.dirty[property];
                }
            });
            this.dispatchDataCommittedEvent(committed);
        };
        ModelData.prototype.rollback = function () {
            var rejected = [];
            for (var property in this.dirty) {
                if (this.dirty.hasOwnProperty(property)) {
                    var value = this.dirty[property];
                    value.rollback();
                    rejected.push(value);
                }
            }
            this.dirty = {};
            this.dispatchDataChangedEvent(rejected);
        };
        ModelData.prototype.isDirty = function () {
            return !!Object.getOwnPropertyNames(this.dirty).length;
        };
        ModelData.prototype.hasDirtyValue = function (property) {
            return this.dirty.hasOwnProperty(property);
        };
        ModelData.prototype.getChanges = function () {
            var dirty = [];
            for (var property in this.dirty) {
                if (this.dirty.hasOwnProperty(property)) {
                    dirty.push(this.getChange(this.dirty[property]));
                }
            }
            return dirty;
        };
        ModelData.prototype.getChange = function (value) {
            return {
                propertyName: value.getName(),
                oldValue: value.getOldValue(),
                newValue: value.getValue()
            };
        };
        ModelData.prototype.dispatchDataChangedEvent = function (values) {
            var _this = this;
            if (values.length) {
                var changes_1 = [];
                values.forEach(function (value) { return changes_1.push(_this.getChange(value)); });
                this.dispatchEvent({
                    name: 'data-changed',
                    changes: changes_1,
                    data: this,
                    model: this.model
                });
            }
        };
        ModelData.prototype.dispatchDataCommittedEvent = function (committed) {
            this.dispatchEvent({
                name: 'data-committed',
                properties: committed,
                data: this,
                model: this.model
            });
        };
        ModelData.prototype.addEventListener = function (event, listener) {
            this.eventDispatcher.addEventListener(event, listener);
        };
        ModelData.prototype.on = function (event, listener) {
            this.eventDispatcher.on(event, listener);
        };
        ModelData.prototype.removeEventListener = function (event, listener) {
            this.eventDispatcher.removeEventListener(event, listener);
        };
        ModelData.prototype.off = function (event, listener) {
            this.eventDispatcher.off(event, listener);
        };
        ModelData.prototype.dispatchEvent = function (event) {
            this.eventDispatcher.dispatchEvent(event);
        };
        return ModelData;
    }());
    exports.ModelData = ModelData;
    var DataValue = (function () {
        function DataValue(name, value) {
            this.valuesDiffer = DataValue.valuesDiffer;
            this.name = name;
            this.value = value;
            this.committedValue = value;
        }
        DataValue.prototype.setValue = function (value) {
            var prevValue = this.value;
            if (!this.valuesDiffer(prevValue, value)) {
                return false;
            }
            this.value = value;
            this.oldValue = prevValue;
            return true;
        };
        DataValue.prototype.getValue = function () {
            return this.value;
        };
        DataValue.prototype.getOldValue = function () {
            return this.oldValue;
        };
        DataValue.prototype.getCommittedValue = function () {
            return this.committedValue;
        };
        DataValue.prototype.getName = function () {
            return this.name;
        };
        DataValue.prototype.commit = function () {
            if (!this.valuesDiffer(this.committedValue, this.value)) {
                return false;
            }
            this.committedValue = this.value;
            return true;
        };
        DataValue.prototype.rollback = function () {
            if (this.isDirty()) {
                this.oldValue = this.value;
                this.value = this.committedValue;
            }
        };
        DataValue.prototype.isDirty = function () {
            return this.value !== this.committedValue;
        };
        DataValue.prototype.setValuesDifferHandler = function (handler) {
            this.valuesDiffer = handler;
        };
        DataValue.valuesDiffer = function (v1, v2) {
            return v1 !== v2;
        };
        return DataValue;
    }());
    exports.DataValue = DataValue;
});
define("model/model", ["require", "exports", "model/metadata", "model/model-data", "wg-events"], function (require, exports, metadata_1, model_data_1, wg_events_2) {
    "use strict";
    var ModelAspect = (function () {
        function ModelAspect(model, data) {
            this.em = new wg_events_2.EventManager(this);
            this._model = model;
            this._data = data;
            this.em.forwardEvents(data, ['data-changed', 'data-committed']);
        }
        ModelAspect.prototype.getMetadata = function () {
            return Object.getPrototypeOf(this.model)._modelMetadata_;
        };
        ModelAspect.prototype.commit = function () {
            this.data.commit();
        };
        ModelAspect.prototype.commitValue = function (name) {
            this.data.commitValue(name);
        };
        ModelAspect.prototype.commitValues = function (names) {
            this.data.commitValues(names);
        };
        ModelAspect.prototype.rollback = function () {
            this.data.rollback();
        };
        ModelAspect.prototype.isDirty = function () {
            return this.data.isDirty();
        };
        ModelAspect.prototype.isPersisted = function () {
            var id = this.model[this.getMetadata().getIdFieldName()];
            return (id !== null && id !== undefined && id !== '');
        };
        ModelAspect.prototype.addEventListener = function (event, listener) {
            this.em.addEventListener(event, listener);
        };
        ModelAspect.prototype.on = function (event, listener) {
            this.em.on(event, listener);
        };
        ModelAspect.prototype.removeEventListener = function (event, listener) {
            this.em.removeEventListener(event, listener);
        };
        ModelAspect.prototype.off = function (event, listener) {
            this.em.off(event, listener);
        };
        ModelAspect.prototype.dispatchEvent = function (event) {
            this.em.dispatchEvent(event);
        };
        Object.defineProperty(ModelAspect.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelAspect.prototype, "model", {
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelAspect.prototype, "id", {
            get: function () {
                if (!this._id) {
                    this._id = nextModelId();
                }
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        return ModelAspect;
    }());
    exports.ModelAspect = ModelAspect;
    var modelCount = 0;
    function nextModelId() {
        return ++modelCount;
    }
    function declareModel(Class, options) {
        var prototype = Class.prototype;
        if (prototype.hasOwnProperty('modelAspect')) {
            throw new Error("Class " + Class.name + " has already been defined as a model");
        }
        var metadata = metadata_1.createMetadata(options);
        var fields = metadata.getModelFields();
        prototype._modelMetadata_ = metadata;
        metadata.setModelClass(Class);
        metadata.getFieldConfigurator().configureFields(Class.prototype, fields);
        if (options.injectModelApi) {
            injectModelApi(Class);
        }
        Object.defineProperty(prototype, 'modelAspect', {
            enumerable: false,
            get: function () {
                if (this === prototype) {
                    return null;
                }
                var data = new model_data_1.ModelData(this);
                var modelAspect = new ModelAspect(this, data);
                Object.defineProperty(this, 'modelAspect', {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: modelAspect
                });
                return modelAspect;
            }
        });
    }
    exports.declareModel = declareModel;
    function injectModelApi(ModelClass) {
        var type = typeof ModelClass;
        if (type !== 'function') {
            throw new Error("Expected argument of type 'function', but got argument " +
                ("of type " + type));
        }
        var modelPrototype = ModelClass.prototype;
        ModelClass.getFields = function () {
            return modelPrototype._modelMetadata_.getFields();
        };
    }
    exports.injectModelApi = injectModelApi;
});
define("reader/json-reader", ["require", "exports"], function (require, exports) {
    "use strict";
    var JsonReader = (function () {
        function JsonReader(config) {
            if (config === void 0) { config = {}; }
            this.dataPath = '.';
            this.totalPath = null;
            this.pagePath = null;
            this.limitPath = null;
            this.offsetPath = null;
            Object.assign(this, config);
        }
        JsonReader.prototype.read = function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            return {
                data: this.extract(data, this.dataPath, []),
                total: this.extract(data, this.totalPath, null),
                page: this.extract(data, this.pagePath, null),
                limit: this.extract(data, this.limitPath, null),
                offset: this.extract(data, this.offsetPath, null)
            };
        };
        JsonReader.prototype.extract = function (data, path, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (!path) {
                return defaultValue;
            }
            if (path === '.') {
                return data;
            }
            var parts = path.split('.');
            var value = data;
            while (parts.length) {
                value = value[parts.shift()];
                if (!value) {
                    return defaultValue;
                }
            }
            return value;
        };
        return JsonReader;
    }());
    exports.JsonReader = JsonReader;
});
define("reader/reader", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("store/data-view", ["require", "exports", "utils/filter", "wg-events"], function (require, exports, filter_1, wg_events_3) {
    "use strict";
    var StoreDataView = (function () {
        function StoreDataView(store) {
            var _this = this;
            this.filters = new filter_1.FilterChain();
            this.em = new wg_events_3.EventManager(this);
            this.onModelsAdded = function (e) {
                _this.refresh();
                _this.em.dispatchEvent({
                    name: 'items-added',
                    items: e.models
                });
            };
            this.onModelsDeleted = function (e) {
                _this.refresh();
                _this.em.dispatchEvent({
                    name: 'items-deleted',
                    items: e.models
                });
            };
            this.onModelChanged = function (e) {
                if (_this.hasItem(e.model)) {
                    if (_this.isFiltered()) {
                        _this.refresh();
                    }
                    _this.em.dispatchEvent({
                        name: 'item-changed',
                        item: e.model
                    });
                }
            };
            this.onDataLoaded = function (e) {
                _this.refresh();
                _this.em.dispatchEvent({
                    name: 'items-loaded',
                    items: e.data
                });
            };
            this.items = store.getAll();
            this.storeEvents = {
                'models-added': this.onModelsAdded,
                'models-deleted': this.onModelsDeleted,
                'model-changed': this.onModelChanged,
                'data-loaded': this.onDataLoaded
            };
            this.bindStore(store);
        }
        StoreDataView.prototype.addFilter = function (filter) {
            this.filters.addFilter(filter);
            this.refresh();
            this.em.dispatchEvent({
                name: 'filters-applied'
            });
        };
        StoreDataView.prototype.removeFilter = function (filter) {
            if (this.filters.removeFilter(filter)) {
                this.refresh();
                this.em.dispatchEvent({
                    name: 'filters-applied'
                });
            }
        };
        StoreDataView.prototype.bindStore = function (store) {
            this.unbindStore();
            this.store = store;
            for (var event_1 in this.storeEvents) {
                if (this.storeEvents.hasOwnProperty(event_1)) {
                    this.em.attachEventListener(this.store, event_1, this.storeEvents[event_1]);
                }
            }
        };
        StoreDataView.prototype.unbindStore = function () {
            if (this.store) {
                this.em.detachEventListeners(this.store);
            }
            this.store = undefined;
        };
        StoreDataView.prototype.refresh = function () {
            this.items = this.applyFilters(this.store.getAll());
        };
        StoreDataView.prototype.applyFilters = function (data) {
            var items = [];
            if (!this.isFiltered()) {
                items.push.apply(items, data);
            }
            else {
                items = data.filter(this.filters.toCallback());
            }
            return items;
        };
        StoreDataView.prototype.isFiltered = function () {
            return this.filters.getFilters().length !== 0;
        };
        StoreDataView.prototype.hasItem = function (item) {
            return this.items.indexOf(item) !== -1;
        };
        StoreDataView.prototype.addEventListener = function (event, listener) {
            this.em.addEventListener(event, listener);
        };
        StoreDataView.prototype.dispatchEvent = function (event) {
            this.em.dispatchEvent(event);
        };
        StoreDataView.prototype.on = function (event, listener) {
            this.em.on(event, listener);
        };
        StoreDataView.prototype.removeEventListener = function (event, listener) {
            this.em.removeEventListener(event, listener);
        };
        StoreDataView.prototype.off = function (event, listener) {
            this.em.off(event, listener);
        };
        StoreDataView.prototype.getItems = function () {
            return this.items.slice(0);
        };
        StoreDataView.prototype.dispose = function () {
            this.unbindStore();
        };
        return StoreDataView;
    }());
    exports.StoreDataView = StoreDataView;
});
define("store/store", ["require", "exports", "utils/collection", "wg-events", "utils/instantiator"], function (require, exports, collection_1, wg_events_4, instantiator_1) {
    "use strict";
    var Store = (function () {
        function Store(config) {
            var _this = this;
            if (config === void 0) { config = {}; }
            this.onModelDataChanged = function (e) {
                _this.updateModelState(e.model);
                _this.eventDispatcher.dispatchEvent({
                    name: Store.events.MODEL_CHANGED,
                    model: e.model
                });
            };
            this.onModelDataCommitted = function (e) {
                _this.updateModelState(e.model);
            };
            this.modelClass = config.modelClass;
            this.adapter = config.adapter;
            this.instantiator = config.instantiator || Store.defaultInstantiator;
            this.models = new collection_1.Collection();
            this.scheduledForInsertion = new Set();
            this.scheduledForUpdate = new Set();
            this.scheduledForDeletion = new Set();
            this.eventDispatcher = new wg_events_4.EventDispatcher();
            if (config.data) {
                this.setData(config.data);
            }
        }
        Store.prototype.load = function (options) {
            var _this = this;
            if (!this.adapter) {
                throw new Error('This store cannot load data without being configured ' +
                    'with an adapter');
            }
            this.models.clear();
            return this.adapter.read(options).then(function (result) {
                return _this.setData(result.data);
            });
        };
        Store.prototype.setData = function (models) {
            var _this = this;
            var oldModels = this.getAll();
            this.models.clear();
            oldModels.forEach(function (model) { return _this.unbindModelListeners(model); });
            var added = this.models.addItems(this.ensureModels(models)).items;
            this.bindAddedModels(added);
            this.eventDispatcher.dispatchEvent({
                name: 'data-loaded',
                data: added
            });
            return added;
        };
        Store.prototype.add = function (modelOrModels) {
            if (!Array.isArray(modelOrModels)) {
                modelOrModels = [modelOrModels];
            }
            var added = this.models.addItems(this.ensureModels(modelOrModels)).items;
            this.bindAddedModels(added);
            this.eventDispatcher.dispatchEvent({
                name: Store.events.MODELS_ADDED,
                models: added
            });
            return added;
        };
        Store.prototype.delete = function (modelOrModels) {
            var _this = this;
            var deleted;
            if (this.isModel(modelOrModels)) {
                deleted = this.models.deleteItems([modelOrModels]);
            }
            else {
                deleted = this.models.deleteItems(modelOrModels);
            }
            deleted.forEach(function (model) {
                _this.handleModelDeletion(model);
            });
            this.eventDispatcher.dispatchEvent({
                name: 'models-deleted',
                models: deleted
            });
            return deleted;
        };
        Store.prototype.findById = function (id) {
            var idField = this.getMetadata().getIdFieldName();
            return this.findOneBy(function (model) { return id === model[idField]; });
        };
        Store.prototype.findOneBy = function (criteria) {
            return this.models.findOneBy(criteria);
        };
        Store.prototype.findBy = function (criteria) {
            return this.models.findBy(criteria);
        };
        Store.prototype.findAt = function (position) {
            return this.models.getAt(position);
        };
        Store.prototype.synchronize = function () {
            var _this = this;
            var batch = this.getSynchronizationBatch();
            var syncPromise = this.adapter.sync(batch);
            return new Promise(function (resolve) {
                syncPromise.then(function (result) {
                    _this.handleSynchronizationResult(result, batch);
                    resolve(result);
                });
            });
        };
        Store.prototype.handleSynchronizationResult = function (result, batch) {
            this.handleInsertionResult(result.create, batch.forInsertion);
            this.handleUpdateResult(result.update, batch.forUpdate, batch.forUpdateSnapshot);
            this.handleDeletionResult(result.delete, batch.forDeletion);
        };
        Store.prototype.getSynchronizationBatch = function () {
            return new SynchronizationBatch({
                forInsertion: Array.from(this.scheduledForInsertion),
                forUpdate: Array.from(this.scheduledForUpdate),
                forDeletion: Array.from(this.scheduledForDeletion)
            });
        };
        Store.prototype.getAdapter = function () {
            return this.adapter;
        };
        Store.prototype.addEventListener = function (event, listener) {
            this.eventDispatcher.addEventListener(event, listener);
        };
        Store.prototype.dispatchEvent = function (event) {
            this.eventDispatcher.dispatchEvent(event);
        };
        Store.prototype.on = function (event, listener) {
            this.eventDispatcher.on(event, listener);
        };
        Store.prototype.removeEventListener = function (event, listener) {
            this.eventDispatcher.removeEventListener(event, listener);
        };
        Store.prototype.off = function (event, listener) {
            this.eventDispatcher.off(event, listener);
        };
        Store.prototype.bindAddedModels = function (models) {
            var _this = this;
            models.forEach(function (model) {
                _this.bindModelListeners(model);
                _this.setAddedModelsState(model);
            });
        };
        Store.prototype.bindModelListeners = function (model) {
            model.modelAspect.on('data-changed', this.onModelDataChanged);
            model.modelAspect.on('data-committed', this.onModelDataCommitted);
        };
        Store.prototype.unbindModelListeners = function (model) {
            model.modelAspect.off('data-changed', this.onModelDataChanged);
            model.modelAspect.on('data-committed', this.onModelDataCommitted);
        };
        Store.prototype.setAddedModelsState = function (model) {
            if (this.scheduledForDeletion.has(model)) {
                this.scheduledForDeletion.delete(model);
            }
            this.updateModelState(model);
        };
        Store.prototype.updateModelState = function (model) {
            var modelAspect = model.modelAspect;
            if (!modelAspect.isPersisted()) {
                this.scheduledForInsertion.add(model);
                this.scheduledForUpdate.delete(model);
                return;
            }
            modelAspect.isDirty() ? this.scheduledForUpdate.add(model)
                : this.scheduledForUpdate.delete(model);
            this.scheduledForInsertion.delete(model);
        };
        Store.prototype.getAll = function () {
            return this.models.getItems();
        };
        Store.prototype.ensureModel = function (object) {
            if (!this.isModel(object)) {
                object = Object.assign(this.instantiator.instantiate(this.modelClass), object);
                object.modelAspect.commit();
            }
            return object;
        };
        Store.prototype.ensureModels = function (objects) {
            var _this = this;
            var models = [];
            objects.forEach(function (object) { return models.push(_this.ensureModel(object)); });
            return models;
        };
        Store.prototype.isModel = function (object) {
            return this.getModelPrototype().isPrototypeOf(object);
        };
        Store.prototype.getModelPrototype = function () {
            return this.modelClass.prototype;
        };
        Store.prototype.handleModelDeletion = function (model) {
            if (model.modelAspect.isPersisted()) {
                this.scheduledForDeletion.add(model);
            }
            this.scheduledForInsertion.delete(model);
            this.scheduledForUpdate.delete(model);
            this.unbindModelListeners(model);
        };
        Store.prototype.handleInsertionResult = function (result, forInsertion) {
            if (!result.success) {
                return;
            }
            var idName = this.getMetadata().getIdFieldName();
            result.data.forEach(function (record, i) {
                var model = forInsertion[i];
                model[idName] = record[idName];
                model.modelAspect.commitValue(idName);
            });
        };
        Store.prototype.handleUpdateResult = function (result, forUpdate, beforeUpdateSnapshot) {
            if (!result.success) {
                return;
            }
            result.data.forEach(function (record, i) {
                var model = forUpdate[i];
                var snapshot = beforeUpdateSnapshot[i];
                var toCommit = [];
                for (var property in snapshot) {
                    if (snapshot.hasOwnProperty(property)) {
                        if (model[property] === snapshot[property]) {
                            toCommit.push(property);
                        }
                    }
                }
                model.modelAspect.commitValues(toCommit);
            });
        };
        Store.prototype.handleDeletionResult = function (result, forDeletion) {
            var _this = this;
            if (!result.success) {
                return;
            }
            forDeletion.forEach(function (model) { return _this.scheduledForDeletion.delete(model); });
        };
        Store.prototype.getMetadata = function () {
            return this.getModelPrototype()._modelMetadata_;
        };
        Store.defaultInstantiator = new instantiator_1.PrototypeInjectionInstantiator();
        Store.events = {
            MODELS_ADDED: 'models-added',
            MODEL_CHANGED: 'model-changed',
            DATA_LOADED: 'data-loaded',
            MODELS_DELETED: 'models-deleted',
            MODELS_DESTROYED: 'models-destroyed',
            MODELS_SAVED: 'models-saved'
        };
        return Store;
    }());
    exports.Store = Store;
    var SynchronizationBatch = (function () {
        function SynchronizationBatch(options) {
            var _this = this;
            this.forInsertion = options.forInsertion;
            this.forUpdate = options.forUpdate;
            this.forDeletion = options.forDeletion;
            this.forUpdateSnapshot = [];
            this.forUpdate.forEach(function (model) {
                _this.forUpdateSnapshot.push(model.modelAspect.data.getValues());
            });
        }
        return SynchronizationBatch;
    }());
    exports.SynchronizationBatch = SynchronizationBatch;
});
define("serializer/json-serializer", ["require", "exports"], function (require, exports) {
    "use strict";
    var JsonSerializer = (function () {
        function JsonSerializer() {
        }
        JsonSerializer.prototype.serialize = function (modelData) {
            return JSON.stringify(modelData);
        };
        return JsonSerializer;
    }());
    exports.JsonSerializer = JsonSerializer;
});
define("serializer/serializer", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("utils/collection", ["require", "exports"], function (require, exports) {
    "use strict";
    var Collection = (function () {
        function Collection(items) {
            if (items === void 0) { items = []; }
            this.setItems(items);
        }
        Collection.prototype.setItems = function (items) {
            this.clear();
            this.addItems(items);
        };
        Collection.prototype.clear = function () {
            this.items = [];
        };
        Collection.prototype.add = function (item, position) {
            return this.addItems([item], position).newAdded;
        };
        Collection.prototype.addItems = function (items, position) {
            var _this = this;
            var newItems = [];
            items.forEach(function (item) {
                if (!_this.includes(item)) {
                    newItems.push(item);
                }
            });
            if (isNaN(position) || position > this.length) {
                position = this.length;
                (_a = this.items).push.apply(_a, newItems);
            }
            else if (position === 0) {
                (_b = this.items).unshift.apply(_b, newItems);
            }
            else {
                var leftItems = this.items.slice(0, position);
                var rightItems = this.items.slice(position, this.length);
                this.items = leftItems.concat(newItems, rightItems);
            }
            return new ItemsInsertion(newItems, position);
            var _a, _b;
        };
        Collection.prototype.delete = function (item) {
            return !!this.deleteItems([item]).length;
        };
        Collection.prototype.deleteItems = function (items) {
            var _this = this;
            var deleted = [];
            items.forEach(function (item) {
                var i = _this.indexOf(item);
                if (i > -1) {
                    _this.items.splice(i, 1);
                    deleted.push(item);
                }
            });
            return deleted;
        };
        Collection.prototype.getAt = function (position) {
            return this.items[position];
        };
        Collection.prototype.indexOf = function (item) {
            return this.items.indexOf(item);
        };
        Collection.prototype.lastIndexOf = function (item) {
            return this.items.lastIndexOf(item);
        };
        Collection.prototype.compileSearchCriteria = function (criteria) {
            if (typeof criteria === 'function') {
                return criteria;
            }
            return function (model) {
                for (var field in criteria) {
                    if (criteria.hasOwnProperty(field)) {
                        if (model[field] !== criteria[field]) {
                            return false;
                        }
                    }
                }
                return true;
            };
        };
        Collection.prototype.filter = function (filter) {
            var matches = [];
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (filter.matches(item)) {
                    matches.push(item);
                }
            }
            return matches;
        };
        Collection.prototype.findBy = function (criteria) {
            var items = [];
            var callback = this.compileSearchCriteria(criteria);
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (callback(item)) {
                    items.push(item);
                }
            }
            return items;
        };
        Collection.prototype.findOneBy = function (criteria) {
            var i = this.findIndex(criteria);
            if (i > -1) {
                return this.items[i];
            }
            return undefined;
        };
        Collection.prototype.findIndex = function (criteria) {
            var callback = this.compileSearchCriteria(criteria);
            var ii = this.items.length;
            var i = 0;
            for (; i < ii; i++) {
                if (callback(this.items[i])) {
                    return i;
                }
            }
            return -1;
        };
        Collection.prototype.includes = function (item, fromIndex) {
            if (fromIndex === void 0) { fromIndex = 0; }
            var ii = this.items.length;
            var i = fromIndex;
            for (; i < ii; i++) {
                if (this.items[i] === item) {
                    return true;
                }
            }
            return false;
        };
        Collection.prototype.first = function () {
            return this.items[0];
        };
        Collection.prototype.last = function () {
            return this.items[this.length - 1];
        };
        Collection.prototype.slice = function (start, end) {
            return this.items.slice(start, end);
        };
        Collection.prototype.getItems = function () {
            return Array.from(this.items || []);
        };
        Collection.prototype.forEach = function (callback) {
            this.items.forEach(callback);
        };
        Object.defineProperty(Collection.prototype, "length", {
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        return Collection;
    }());
    exports.Collection = Collection;
    var ItemsInsertion = (function () {
        function ItemsInsertion(items, position) {
            this.items = items;
            this.position = position;
        }
        Object.defineProperty(ItemsInsertion.prototype, "newAdded", {
            get: function () {
                return !!this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        return ItemsInsertion;
    }());
    exports.ItemsInsertion = ItemsInsertion;
});
define("utils/factory", ["require", "exports"], function (require, exports) {
    "use strict";
    var Factory = (function () {
        function Factory() {
            this.registry = {};
            this.typeProperty = 'type';
        }
        Factory.prototype.create = function (config) {
            var type = config[this.typeProperty] || this.defaultType;
            if (!type) {
                throw new Error("Config options must define a " + this.typeProperty + " property");
            }
            var instantiator = this.registry[type];
            if (!instantiator) {
                throw new Error("The value \"" + type + "\" is not a known " + this.typeProperty);
            }
            return instantiator(config);
        };
        Factory.prototype.register = function (typeName, Class) {
            this.registerInstantiator(typeName, this.createDefaultInstantiator(Class));
        };
        Factory.prototype.registerInstantiator = function (typeName, factory) {
            this.registry[typeName] = factory;
        };
        Factory.prototype.createDefaultInstantiator = function (Class) {
            return function (config) {
                return new Class(config);
            };
        };
        return Factory;
    }());
    exports.Factory = Factory;
});
define("utils/filter", ["require", "exports"], function (require, exports) {
    "use strict";
    var AbstractFilter = (function () {
        function AbstractFilter() {
        }
        AbstractFilter.prototype.matches = function (item) {
            throw new Error('Method must be implemented by derived classes');
        };
        AbstractFilter.prototype.toCallback = function () {
            var _this = this;
            return function (item) { return _this.matches(item); };
        };
        return AbstractFilter;
    }());
    exports.AbstractFilter = AbstractFilter;
    var CallbackFilter = (function (_super) {
        __extends(CallbackFilter, _super);
        function CallbackFilter(matches) {
            _super.call(this);
            this.matches = matches;
        }
        return CallbackFilter;
    }(AbstractFilter));
    exports.CallbackFilter = CallbackFilter;
    var FilterChain = (function (_super) {
        __extends(FilterChain, _super);
        function FilterChain(filters) {
            if (filters === void 0) { filters = []; }
            _super.call(this);
            this.filters = filters.slice(0);
        }
        FilterChain.prototype.matches = function (subject) {
            if (this.filters.length === 0) {
                return true;
            }
            for (var _i = 0, _a = this.filters; _i < _a.length; _i++) {
                var filter = _a[_i];
                if (!filter.matches(subject)) {
                    return false;
                }
            }
            return true;
        };
        FilterChain.prototype.addFilter = function (filter) {
            this.filters.push(filter);
        };
        FilterChain.prototype.removeFilter = function (filter) {
            var i = this.filters.indexOf(filter);
            if (i > -1) {
                this.filters.splice(i, 1);
                return true;
            }
            return false;
        };
        FilterChain.prototype.getFilters = function () {
            return this.filters.slice(0);
        };
        return FilterChain;
    }(AbstractFilter));
    exports.FilterChain = FilterChain;
    var PropertyMatchFilter = (function (_super) {
        __extends(PropertyMatchFilter, _super);
        function PropertyMatchFilter(matchSpecs) {
            _super.call(this);
            this.matchSpecs = [];
            for (var _i = 0, matchSpecs_1 = matchSpecs; _i < matchSpecs_1.length; _i++) {
                var criterion = matchSpecs_1[_i];
                this.matchSpecs.push(Object.assign({ operator: '=' }, criterion));
            }
            this.configure();
        }
        PropertyMatchFilter.prototype.matches = function (subject) {
            return this.filter.matches(subject);
        };
        PropertyMatchFilter.prototype.getMatchSpecifications = function () {
            return this.matchSpecs;
        };
        PropertyMatchFilter.prototype.configure = function () {
            var matcherChain = [];
            for (var _i = 0, _a = this.matchSpecs; _i < _a.length; _i++) {
                var spec = _a[_i];
                matcherChain.push(new PropertyMatcher(spec));
            }
            this.filter = new FilterChain(matcherChain);
        };
        return PropertyMatchFilter;
    }(AbstractFilter));
    exports.PropertyMatchFilter = PropertyMatchFilter;
    var PropertyMatcher = (function (_super) {
        __extends(PropertyMatcher, _super);
        function PropertyMatcher(spec) {
            _super.call(this);
            var matches;
            var value = spec.value;
            var prop = spec.property;
            switch (spec.operator || '=') {
                case '>':
                    matches = function (x) { return x[prop] > value; };
                    break;
                case '<':
                    matches = function (x) { return x[prop] < value; };
                    break;
                case '>=':
                    matches = function (x) { return x[prop] >= value; };
                    break;
                case '<=':
                    matches = function (x) { return x[prop] <= value; };
                    break;
                case '!=':
                    matches = function (x) { return x[prop] != value; };
                    break;
                case '=':
                default: matches = function (x) { return x[prop] == value; };
            }
            this.matches = matches;
        }
        return PropertyMatcher;
    }(AbstractFilter));
    exports.PropertyMatcher = PropertyMatcher;
});
define("utils/instantiator", ["require", "exports"], function (require, exports) {
    "use strict";
    var PrototypeInjectionInstantiator = (function () {
        function PrototypeInjectionInstantiator() {
        }
        PrototypeInjectionInstantiator.prototype.instantiate = function (InstanceClass) {
            return Object.create(InstanceClass.prototype);
        };
        return PrototypeInjectionInstantiator;
    }());
    exports.PrototypeInjectionInstantiator = PrototypeInjectionInstantiator;
    var ConstructorCallInstantiator = (function () {
        function ConstructorCallInstantiator() {
        }
        ConstructorCallInstantiator.prototype.instantiate = function (InstanceClass) {
            return new InstanceClass();
        };
        return ConstructorCallInstantiator;
    }());
    exports.ConstructorCallInstantiator = ConstructorCallInstantiator;
});
define("view/data-view", ["require", "exports", "wg-events"], function (require, exports, wg_events_5) {
    "use strict";
    var DataView = (function () {
        function DataView(config) {
            var _this = this;
            this.em = new wg_events_5.EventManager(this);
            this.itemIndexMap = new Map();
            this.nodeIndexMap = new Map();
            this.suspendRendering = false;
            this.onItemsAdded = function (e) {
                if (!_this.data.isFiltered()) {
                    _this.appendItems(e.items);
                }
                else {
                    _this.render();
                }
            };
            this.onItemChanged = function (e) {
                if (!_this.data.isFiltered()) {
                    _this.updateItemNode(e.item);
                }
                else {
                    _this.render();
                }
            };
            this.onItemsDeleted = function (e) {
                _this.deleteItems(e.items);
            };
            this.onFiltersApplied = function () {
                console.log('filtered');
                _this.render();
            };
            this.onContainerClick = function (e) {
                var node = e.target;
                while (node !== _this.container && !node.matches('[item-node]')) {
                    node = node.parentElement;
                }
                if (node === _this.container) {
                    return;
                }
                var item = _this.getItemFromNode(node);
                var evt;
                _this.em.dispatchEvent(evt = {
                    name: 'item-clicked',
                    item: item,
                    node: node
                });
                console.log(evt);
            };
            this.bindData(config.data);
            this.container = config.container || HTMLParser.parse('<div>');
            if (typeof config.itemRenderer === 'function') {
                this.renderItem = config.itemRenderer;
            }
            this.bindViewEvents();
            this.render();
        }
        DataView.prototype.bindData = function (data) {
            this.data = data;
            this.em.attachEventListener(data, 'items-added', this.onItemsAdded);
            this.em.attachEventListener(data, 'items-deleted', this.onItemsDeleted);
            this.em.attachEventListener(data, 'item-changed', this.onItemChanged);
            this.em.attachEventListener(data, 'filters-applied', this.onFiltersApplied);
        };
        DataView.prototype.updateItemNode = function (item) {
            var currentNode = this.getItemNode(item);
            if (!currentNode) {
                return;
            }
            var index = this.getIndexOfItem(item);
            var newNode = this.buildItemNode(item, index);
            currentNode.insertAdjacentElement('afterend', newNode);
            this.container.removeChild(currentNode);
            this.nodes[index] = newNode;
            this.nodeIndexMap.delete(currentNode);
            this.nodeIndexMap.set(newNode, index);
        };
        DataView.prototype.render = function () {
            var items = this.data.getItems();
            this.items = [];
            this.nodes = [];
            this.itemIndexMap.clear();
            this.nodeIndexMap.clear();
            this.container.innerHTML = '';
            this.appendItems(items);
        };
        DataView.prototype.appendItems = function (items) {
            var _this = this;
            var i = this.items.length;
            items.forEach(function (item) {
                _this.appendItem(item, i);
                i++;
            });
        };
        DataView.prototype.deleteItems = function (items) {
            var _this = this;
            items.forEach(function (item) {
                var node = _this.getItemNode(item);
                var i = _this.getIndexOfNode(node);
                _this.nodes.splice(i, 1);
                _this.items.splice(i, 1);
                _this.container.removeChild(node);
                _this.nodeIndexMap.delete(node);
                _this.itemIndexMap.delete(item);
            });
        };
        DataView.prototype.appendItem = function (item, index) {
            var node = this.buildItemNode(item, index);
            this.container.appendChild(node);
            this.items.push(item);
            this.nodes.push(node);
            this.itemIndexMap.set(item, index);
            this.nodeIndexMap.set(node, index);
        };
        DataView.prototype.buildItemNode = function (item, index) {
            var node = HTMLParser.parse(this.renderItem(item, index));
            node.setAttribute('item-node', String(index));
            return node;
        };
        DataView.prototype.renderItem = function (model, index) {
            return "<div>" + index + ". " + model + "</div>";
        };
        DataView.prototype.getItemNode = function (item) {
            return this.nodes[this.getIndexOfItem(item)];
        };
        DataView.prototype.getItemFromNode = function (node) {
            return this.items[this.getIndexOfNode(node)];
        };
        DataView.prototype.getIndexOfNode = function (element) {
            var i = this.nodeIndexMap.get(element);
            return i === undefined ? -1 : i;
        };
        DataView.prototype.getIndexOfItem = function (item) {
            var i = this.itemIndexMap.get(item);
            return i === undefined ? -1 : i;
        };
        DataView.prototype.getContainer = function () {
            return this.container;
        };
        DataView.prototype.bindViewEvents = function () {
            this.em.attachEventListener(this.container, 'click', this.onContainerClick);
        };
        return DataView;
    }());
    exports.DataView = DataView;
    var HTMLParser = (function () {
        function HTMLParser() {
        }
        HTMLParser.parse = function (html) {
            var el = this.getParserElement();
            el.innerHTML = html;
            return el.firstElementChild;
        };
        HTMLParser.getParserElement = function () {
            if (!this.parserElement) {
                var fragment = document.createDocumentFragment();
                fragment.appendChild(document.createElement('div'));
                this.parserElement = fragment.firstChild;
            }
            return this.parserElement;
        };
        return HTMLParser;
    }());
    exports.HTMLParser = HTMLParser;
    var ItemNode = (function () {
        function ItemNode(index, model, element) {
            this.index = index;
            this.model = model;
            this.element = element;
        }
        return ItemNode;
    }());
    exports.ItemNode = ItemNode;
});
define("test/person-model", ["require", "exports", "model/decorators"], function (require, exports, decorators_1) {
    "use strict";
    var Person = (function () {
        function Person(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
        __decorate([
            decorators_1.Field({ type: 'number' }), 
            __metadata('design:type', Object)
        ], Person.prototype, "id", void 0);
        __decorate([
            decorators_1.Field({ type: 'string' }), 
            __metadata('design:type', String)
        ], Person.prototype, "firstName", void 0);
        __decorate([
            decorators_1.Field({ type: 'string' }), 
            __metadata('design:type', String)
        ], Person.prototype, "lastName", void 0);
        __decorate([
            decorators_1.Field({ type: 'date' }), 
            __metadata('design:type', Date)
        ], Person.prototype, "birthDate", void 0);
        Person = __decorate([
            decorators_1.Model(), 
            __metadata('design:paramtypes', [String, String])
        ], Person);
        return Person;
    }());
    exports.Person = Person;
});
//# sourceMappingURL=bt-data.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vZGlzdC9idC1kYXRhLmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbIi4uL2Rpc3QvYnQtZGF0YS50cyIsIi4uL3NyYy9hZGFwdGVyL2h0dHAtYWRhcHRlci50cyIsIi4uL3NyYy9hZGFwdGVyL21lbW9yeS1hZGFwdGVyLnRzIiwiLi4vc3JjL2ZpZWxkL2ZpZWxkLXR5cGUudHMiLCIuLi9zcmMvZmllbGQvZmllbGQudHMiLCIuLi9zcmMvbW9kZWwvZGVjb3JhdG9ycy50cyIsIi4uL3NyYy9tb2RlbC9maWVsZC1jb25maWd1cmF0b3IudHMiLCIuLi9zcmMvbW9kZWwvbWV0YWRhdGEudHMiLCIuLi9zcmMvbW9kZWwvbW9kZWwtZGF0YS50cyIsIi4uL3NyYy9tb2RlbC9tb2RlbC50cyIsIi4uL3NyYy9yZWFkZXIvanNvbi1yZWFkZXIudHMiLCIuLi9zcmMvcmVhZGVyL3JlYWRlci50cyIsIi4uL3NyYy9zdG9yZS9kYXRhLXZpZXcudHMiLCIuLi9zcmMvc3RvcmUvc3RvcmUudHMiLCIuLi9zcmMvc2VyaWFsaXplci9qc29uLXNlcmlhbGl6ZXIudHMiLCIuLi9zcmMvc2VyaWFsaXplci9zZXJpYWxpemVyLnRzIiwiLi4vc3JjL3V0aWxzL2NvbGxlY3Rpb24udHMiLCIuLi9zcmMvdXRpbHMvZmFjdG9yeS50cyIsIi4uL3NyYy91dGlscy9maWx0ZXIudHMiLCIuLi9zcmMvdXRpbHMvaW5zdGFudGlhdG9yLnRzIiwiLi4vc3JjL3ZpZXcvZGF0YS12aWV3LnRzIiwiLi4vc3JjL3Rlc3QvcGVyc29uLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwREE7UUF3QkUseUJBQVksTUFBb0I7WUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQU9ELG1DQUFTLEdBQVQ7WUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FB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
