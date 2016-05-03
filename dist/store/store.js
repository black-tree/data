define(["require", "exports", "../utils/collection", "wg-events", "../utils/instantiator"], function (require, exports, collection_1, wg_events_1, instantiator_1) {
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
            this.eventDispatcher = new wg_events_1.EventDispatcher();
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
//# sourceMappingURL=store.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUvc3RvcmUuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsic3RvcmUvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFZQTtRQW9ERSxlQUFZLE1BQXVCO1lBcERyQyxpQkF1YkM7WUFuWWEsc0JBQXVCLEdBQXZCLFdBQXVCO1lBcU4zQix1QkFBa0IsR0FBRyxVQUFDLENBQWtCO2dCQUM5QyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixLQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBZ0M7b0JBQ2hFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWE7b0JBQ2hDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztpQkFDZixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUM7WUFFTSx5QkFBb0IsR0FBRyxVQUFDLENBQW9CO2dCQUNsRCxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQztZQTdOQSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUM7WUFDckUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLEVBQWMsQ0FBQztZQUMzQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxHQUFHLEVBQWMsQ0FBQztZQUNuRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQWMsQ0FBQztZQUNoRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQWMsQ0FBQztZQUVsRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksMkJBQWUsRUFBRSxDQUFDO1lBRTdDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQztRQVNELG9CQUFJLEdBQUosVUFBSyxPQUFXO1lBQWhCLGlCQVNDO1lBUkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQ7b0JBQ3JFLGlCQUFpQixDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQTBCO2dCQUNoRSxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBT0QsdUJBQU8sR0FBUCxVQUFRLE1BQVk7WUFBcEIsaUJBYUM7WUFaQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7WUFFN0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUVsRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUE4QjtnQkFDOUQsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLElBQUksRUFBRSxLQUFLO2FBQ1osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFTRCxtQkFBRyxHQUFILFVBQUksYUFBaUI7WUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsYUFBYSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDekUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBK0I7Z0JBQy9ELElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVk7Z0JBQy9CLE1BQU0sRUFBRSxLQUFLO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFRRCxzQkFBTSxHQUFOLFVBQU8sYUFBcUM7WUFBNUMsaUJBZUM7WUFkQyxJQUFJLE9BQW9CLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFhLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDakUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBZSxhQUFhLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7Z0JBQ3BCLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFrQztnQkFDbEUsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsTUFBTSxFQUFFLE9BQU87YUFDaEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRUQsd0JBQVEsR0FBUixVQUFTLEVBQU07WUFDYixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQyxLQUFLLElBQUssT0FBQSxFQUFFLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUVELHlCQUFTLEdBQVQsVUFBVSxRQUF1QjtZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELHNCQUFNLEdBQU4sVUFBTyxRQUF1QjtZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELHNCQUFNLEdBQU4sVUFBTyxRQUFlO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBTUQsMkJBQVcsR0FBWDtZQUFBLGlCQVNDO1lBUkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDM0MsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLElBQUksT0FBTyxDQUF1QixVQUFDLE9BQU87Z0JBQy9DLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO29CQUNyQixLQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNoRCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRU8sMkNBQTJCLEdBQW5DLFVBQW9DLE1BQTJCLEVBQUUsS0FBc0M7WUFDckcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFPRCx1Q0FBdUIsR0FBdkI7WUFDRSxNQUFNLENBQUMsSUFBSSxvQkFBb0IsQ0FBYTtnQkFDMUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO2dCQUNwRCxTQUFTLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7Z0JBQzlDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQzthQUNuRCxDQUFDLENBQUM7UUFDTCxDQUFDO1FBS0QsMEJBQVUsR0FBVjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7UUFHRCxnQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBWSxFQUFFLFFBQWlCO1lBQzlDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCw2QkFBYSxHQUFiLFVBQWMsS0FBbUI7WUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELGtCQUFFLEdBQUYsVUFBRyxLQUFZLEVBQUUsUUFBaUI7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFFRCxtQ0FBbUIsR0FBbkIsVUFBb0IsS0FBWSxFQUFFLFFBQWlCO1lBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxtQkFBRyxHQUFILFVBQUksS0FBWSxFQUFFLFFBQWlCO1lBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBT08sK0JBQWUsR0FBdkIsVUFBd0IsTUFBWTtZQUFwQyxpQkFLQztZQUpDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2dCQUNuQixLQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFPTyxrQ0FBa0IsR0FBMUIsVUFBMkIsS0FBUztZQUNsQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDcEUsQ0FBQztRQU1PLG9DQUFvQixHQUE1QixVQUE2QixLQUFTO1lBQ3BDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUMvRCxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBc0JPLG1DQUFtQixHQUEzQixVQUE0QixLQUFTO1lBR25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQU1PLGdDQUFnQixHQUF4QixVQUF5QixLQUFTO1lBRWhDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFJcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQU10QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUM7WUFDVCxDQUFDO1lBSUQsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2tCQUN0RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBSzFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQU1ELHNCQUFNLEdBQU47WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxDQUFDO1FBUU8sMkJBQVcsR0FBbkIsVUFBb0IsTUFBVTtZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUcxRCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFPTyw0QkFBWSxHQUFwQixVQUFxQixPQUFhO1lBQWxDLGlCQUlDO1lBSEMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQVFELHVCQUFPLEdBQVAsVUFBUSxNQUFVO1lBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQU1PLGlDQUFpQixHQUF6QjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUNuQyxDQUFDO1FBRU8sbUNBQW1CLEdBQTNCLFVBQTRCLEtBQVM7WUFDbkMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsQ0FBQztZQUNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUl0QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVPLHFDQUFxQixHQUE3QixVQUE4QixNQUFzQixFQUFFLFlBQXlCO1lBQzdFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNULENBQUM7WUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxLQUFLLEdBQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFTyxrQ0FBa0IsR0FBMUIsVUFBMkIsTUFBc0IsRUFBRSxTQUFzQixFQUFFLG9CQUEwQjtZQUNuRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDVCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxLQUFLLEdBQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUM5QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFCLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUNELEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVPLG9DQUFvQixHQUE1QixVQUE2QixNQUFzQixFQUFFLFdBQXdCO1lBQTdFLGlCQUtDO1lBSkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDO1lBQ1QsQ0FBQztZQUNELFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUF2QyxDQUF1QyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVPLDJCQUFXLEdBQW5CO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUNsRCxDQUFDO1FBL1hNLHlCQUFtQixHQUFHLElBQUksNkNBQThCLEVBQUUsQ0FBQztRQWlZM0QsWUFBTSxHQUFHO1lBQ2QsWUFBWSxFQUFFLGNBQWM7WUFDNUIsYUFBYSxFQUFFLGVBQWU7WUFDOUIsV0FBVyxFQUFFLGFBQWE7WUFDMUIsY0FBYyxFQUFFLGdCQUFnQjtZQUNoQyxnQkFBZ0IsRUFBRSxrQkFBa0I7WUFDcEMsWUFBWSxFQUFFLGNBQWM7U0FDN0IsQ0FBQztRQUNKLFlBQUM7SUFBRCxDQUFDLEFBdmJELElBdWJDO0lBdmJZLGFBQUssUUF1YmpCLENBQUE7SUFrQ0Q7UUE4QkUsOEJBQVksT0FBVztZQTlCekIsaUJBd0NDO1lBVEcsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFFdkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQVM7Z0JBQy9CLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCwyQkFBQztJQUFELENBQUMsQUF4Q0QsSUF3Q0M7SUF4Q1ksNEJBQW9CLHVCQXdDaEMsQ0FBQSJ9
