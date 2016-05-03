define(["require", "exports", "./field-type"], function (require, exports, field_type_1) {
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
//# sourceMappingURL=field.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQvZmllbGQuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsiZmllbGQvZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFFQTtRQWlCRSxlQUFZLElBQVcsRUFBRSxJQUFjO1lBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUM7UUFFRCx1QkFBTyxHQUFQO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQztRQUVELHVCQUFPLEdBQVA7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO1FBRUQsOEJBQWMsR0FBZDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzFCLENBQUM7UUFFRCw4QkFBYyxHQUFkLFVBQWUsT0FBd0I7WUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDN0IsQ0FBQztRQUNILFlBQUM7SUFBRCxDQUFDLEFBckNELElBcUNDO0lBckNZLGFBQUssUUFxQ2pCLENBQUE7SUFFRDtRQUFBO1FBZ0JBLENBQUM7UUFkUSxtQkFBTSxHQUFiLFVBQWMsT0FBNkI7WUFDekMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQU0sT0FBTyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxJQUFJLFVBQVUsR0FBbUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsMkJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakYsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsdUJBQVUsQ0FBUyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUVELElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQWEsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25FLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0gsbUJBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDO0lBaEJZLG9CQUFZLGVBZ0J4QixDQUFBO0lBV1UsMkJBQW1CLEdBQUc7UUFFL0IsSUFBSSxFQUFFLEtBQUs7S0FDWixDQUFDIn0=
