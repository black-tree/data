define(["require", "exports", "../reader/json-reader", "../serializer/json-serializer"], function (require, exports, json_reader_1, json_serializer_1) {
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
//# sourceMappingURL=adapter.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbImFkYXB0ZXIvYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQTBEQTtRQXdCRSx5QkFBWSxNQUFvQjtZQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBT0QsbUNBQVMsR0FBVDtZQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQWEsQ0FBQztZQUM5QixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQztRQU9ELHVDQUFhLEdBQWI7WUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLHlCQUFpQixDQUFDO1lBQ3RDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO1FBRUQsdUNBQWEsR0FBYjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7UUFFUywyQ0FBaUIsR0FBM0I7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDbkMsQ0FBQztRQUVELDBDQUFnQixHQUFoQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDbEQsQ0FBQztRQTJCRCw0Q0FBa0IsR0FBbEIsVUFBbUIsTUFBaUI7WUFDbEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0gsc0JBQUM7SUFBRCxDQUFDLEFBOUZELElBOEZDO0lBOUZxQix1QkFBZSxrQkE4RnBDLENBQUE7SUFNVSxxQkFBYSxHQUFVLElBQUksd0JBQVUsRUFBRSxDQUFDO0lBT3hDLHlCQUFpQixHQUFHLElBQUksZ0NBQWMsRUFBRSxDQUFDIn0=
