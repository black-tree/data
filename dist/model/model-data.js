define(["require", "exports", "wg-events"], function (require, exports, wg_events_1) {
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
//# sourceMappingURL=model-data.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwvbW9kZWwtZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIiwic291cmNlcyI6WyJtb2RlbC9tb2RlbC1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBS0E7UUE0QkUsbUJBQVksS0FBSyxFQUFFLE1BQTZCO1lBNUJsRCxpQkFpT0M7WUFyTW9CLHNCQUE2QixHQUE3QixXQUE2QjtZQXZCeEMsV0FBTSxHQUEyQixFQUFFLENBQUM7WUFLcEMsVUFBSyxHQUEwQixFQUFFLENBQUM7WUFVbEMsb0JBQWUsR0FBRyxJQUFJLDJCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFTbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQzdDLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQU9ELDRCQUFRLEdBQVIsVUFBUyxRQUFRLEVBQUUsS0FBSztZQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUMsR0FBQyxRQUFRLENBQUMsR0FBRSxLQUFLLEtBQUMsQ0FBQyxDQUFDOztRQUN0QyxDQUFDO1FBUUQsNkJBQVMsR0FBVCxVQUFVLE1BQXdCO1lBQWxDLGlCQVFDO1lBUEMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSSxD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
