define(["require", "exports", "../field/field", "./field-configurator"], function (require, exports, field_1, field_configurator_1) {
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
                this.idField = field_1.FieldFactory.create({ name: 'id' });
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
            fields.push(field_1.FieldFactory.create(field));
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
//# sourceMappingURL=metadata.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwvbWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsibW9kZWwvbWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFHQTtRQUFBO1FBc0RBLENBQUM7UUE1Q0MsNEJBQVMsR0FBVCxVQUFVLE1BQWM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQUVELDRCQUFTLEdBQVQ7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO1FBRUQsaUNBQWMsR0FBZDtZQUNFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQsMkJBQVEsR0FBUixVQUFTLEtBQVc7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUVELDZCQUFVLEdBQVY7WUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFZLENBQUMsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDbkQsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7UUFFRCxpQ0FBYyxHQUFkO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQsZ0NBQWEsR0FBYixVQUFjLFVBQW1CO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQy9CLENBQUM7UUFFRCxnQ0FBYSxHQUFiO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekIsQ0FBQztRQUVELHVDQUFvQixHQUFwQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDaEMsQ0FBQztRQUVELHVDQUFvQixHQUFwQixVQUFxQixZQUE4QjtZQUNqRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFDO1FBQ3hDLENBQUM7UUFDSCxlQUFDO0lBQUQsQ0FBQyxBQXRERCxJQXNEQztJQXREWSxnQkFBUSxXQXNEcEIsQ0FBQTtJQVFELHdCQUErQixPQUEwQjtRQUN2RCxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsa0NBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsaUJBQWlCLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsRCxPQUFPLENBQUMsaUJBQWlCLEdBQUcsdUNBQWtCLENBQVMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEYsQ0FBQztRQUNELFFBQVEsQ0FBQyxvQkFBb0IsQ0FBb0IsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBZmUsc0JBQWMsaUJBZTdCLENBQUE7SUFhVSxrQ0FBMEIsR0FBRztRQUV0QyxNQUFNLEVBQUUsRUFBRTtRQUVWLGlCQUFpQixFQUFFLFNBQVM7UUFFNUIsV0FBVyxFQUFFLElBQUk7UUFFakIsY0FBYyxFQUFFLEtBQUs7S0FFdEIsQ0FBQyJ9
