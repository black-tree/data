define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=json-reader.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZGVyL2pzb24tcmVhZGVyLmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbInJlYWRlci9qc29uLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQUVBO1FBWUUsb0JBQVksTUFBVztZQUFYLHNCQUFXLEdBQVgsV0FBVztZQVZ2QixhQUFRLEdBQVUsR0FBRyxDQUFDO1lBRXRCLGNBQVMsR0FBVSxJQUFJLENBQUM7WUFFeEIsYUFBUSxHQUFVLElBQUksQ0FBQztZQUV2QixjQUFTLEdBQVUsSUFBSSxDQUFDO1lBRXhCLGVBQVUsR0FBVSxJQUFJLENBQUM7WUFHdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVELHlCQUFJLEdBQUosVUFBSyxJQUFRO1lBQ1gsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUNELE1BQU0sQ0FBQztnQkFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQzNDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztnQkFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO2dCQUM3QyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7Z0JBQy9DLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQzthQUNsRCxDQUFBO1FBQ0gsQ0FBQztRQUVELDRCQUFPLEdBQVAsVUFBUSxJQUFRLEVBQUUsSUFBVyxFQUFFLFlBQW1CO1lBQW5CLDRCQUFtQixHQUFuQixtQkFBbUI7WUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDdEIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE9BQU0sS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuQixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDdEIsQ0FBQztZQUNILENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNILGlCQUFDO0lBQUQsQ0FBQyxBQTlDRCxJQThDQztJQTlDWSxrQkFBVSxhQThDdEIsQ0FBQSJ9
