define(["require", "exports", "./model", "../field/field"], function (require, exports, model_1, field_1) {
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
//# sourceMappingURL=decorators.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwvZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIiwic291cmNlcyI6WyJtb2RlbC9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBWUEsZUFBc0IsT0FBNEI7UUFBNUIsdUJBQTRCLEdBQTVCLFlBQTRCO1FBRWhELE1BQU0sQ0FBQyxVQUFDLE1BQU07WUFDWixJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBLENBQUM7Z0JBQzdCLE1BQUEsT0FBTyxDQUFDLE1BQU0sRUFBQyxJQUFJLFdBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLGNBQWMsQ0FBQyxVQUFVLENBQUM7WUFDbkMsQ0FBQztZQUNELG9CQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUM7O1FBQ2hCLENBQUMsQ0FBQTtJQUNILENBQUM7SUFaZSxhQUFLLFFBWXBCLENBQUE7SUFRRCxlQUFzQixPQUFrQztRQUFsQyx1QkFBa0MsR0FBbEMsWUFBa0M7UUFFdEQsTUFBTSxDQUFDLFVBQUMsY0FBa0IsRUFBRSxZQUFZO1lBQ3RDLElBQUksVUFBVSxHQUFtQixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlFLElBQUksUUFBUSxHQUFZLGNBQWMsQ0FBQyxlQUFlLENBQUM7WUFFdkQsSUFBSSxLQUFLLEdBQUcsb0JBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFNUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDYixRQUFRLENBQUMsUUFBUSxDQUFDLG9CQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVOLElBQUksTUFBTSxHQUFTLGNBQWUsQ0FBQyxVQUFVLENBQUM7Z0JBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUNOLGNBQWUsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2dCQUM1QyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNILENBQUMsQ0FBQTtJQUNILENBQUM7SUFwQmUsYUFBSyxRQW9CcEIsQ0FBQSJ9
