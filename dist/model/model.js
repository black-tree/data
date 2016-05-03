define(["require", "exports", "./metadata", "./model-data", "wg-events"], function (require, exports, metadata_1, model_data_1, wg_events_1) {
    "use strict";
    var ModelAspect = (function () {
        function ModelAspect(model, data) {
            this.em = new wg_events_1.EventManager(this);
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
//# sourceMappingURL=model.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsibW9kZWwvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFpQkE7UUFVRSxxQkFBWSxLQUFXLEVBQUUsSUFBYztZQUYvQixPQUFFLEdBQWdCLElBQUksd0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUcvQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUVsQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFFRCxpQ0FBVyxHQUFYO1lBQ0UsTUFBTSxDQUFrQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQyxlQUFlLENBQUM7UUFDN0UsQ0FBQztRQUVELDRCQUFNLEdBQU47WUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxpQ0FBVyxHQUFYLFVBQVksSUFBVztZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsa0NBQVksR0FBWixVQUFhLEtBQWM7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVELDhCQUFRLEdBQVI7WUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCw2QkFBTyxHQUFQO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELGlDQUFXLEdBQVg7WUFDRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElB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
