var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./adapter"], function (require, exports, adapter_1) {
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
    }(adapter_1.AbstractAdapter));
    exports.MemoryAdapter = MemoryAdapter;
});
//# sourceMappingURL=memory-adapter.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci9tZW1vcnktYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIiwic291cmNlcyI6WyJhZGFwdGVyL21lbW9yeS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7SUFVQTtRQUFtQyxpQ0FBZTtRQVNoRCx1QkFBWSxNQUEwQjtZQUNwQyxrQkFBTSxNQUFNLENBQUMsQ0FBQztZQVJSLFNBQUksR0FBUyxFQUFFLENBQUM7WUFJaEIsV0FBTSxHQUFVLENBQUMsQ0FBQztZQUt4QixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO1FBQ2hELENBQUM7UUFFRCw4QkFBTSxHQUFOLFVBQU8sTUFBaUI7WUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCw0QkFBSSxHQUFKLFVBQUssT0FBb0I7WUFDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDekIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELDhCQUFNLEdBQU4sVUFBTyxNQUFpQjtZQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELDhCQUFNLEdBQU4sVUFBTyxNQUFpQjtZQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELDRCQUFJLEdBQUosVUFBSyxLQUErQjtZQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDeEMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDckMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUN4QyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRU8sK0JBQU8sR0FBZixVQUFnQixNQUFpQjtZQUFqQyxpQkFZQztZQVhDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtnQkFDakIsTUFBTSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3pDLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQztnQkFDTCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztRQUNKLENBQUM7UUFFTywrQkFBTyxHQUFmLFVBQWdCLE1BQVk7WUFBNUIsaUJBWUM7WUFYQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07Z0JBQ2pCLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN6QyxLQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUM7Z0JBQ0wsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3BCLENBQUM7UUFDSixDQUFDO1FBRU8sK0JBQU8sR0FBZixVQUFnQixNQUFZO1lBQTVCLGlCQVNDO1lBUkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7Z0JBQ2xCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQztnQkFDTCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxPQUFPLEVBQUUsSUFBSTthQUNkLENBQUM7UUFDSixDQUFDO1FBQ08sOEJBQU0sR0FBZDtZQUNFLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQUNILG9CQUFDO0lBQUQsQ0FBQyxBQW5GRCxDQUFtQyx5QkFBZSxHQW1GakQ7SUFuRlkscUJBQWEsZ0JBbUZ6QixDQUFBIn0=
