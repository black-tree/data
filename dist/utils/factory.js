define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=factory.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMvZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIiwic291cmNlcyI6WyJ1dGlscy9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBQUE7UUFBQTtZQUVZLGFBQVEsR0FBMEIsRUFBRSxDQUFDO1lBRXJDLGlCQUFZLEdBQUcsTUFBTSxDQUFDO1FBK0JsQyxDQUFDO1FBM0JDLHdCQUFNLEdBQU4sVUFBTyxNQUFVO1lBQ2YsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLElBQUksS0FBSyxDQUNiLGtDQUFnQyxJQUFJLENBQUMsWUFBWSxjQUFXLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQ0QsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sSUFDSixLQUFLLENBQUMsaUJBQWMsSUFBSSwwQkFBb0IsSUFBSSxDQUFDLFlBQWMsQ0FBQyxDQUFDO1lBQ3JFLENBQUM7WUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCwwQkFBUSxHQUFSLFVBQVMsUUFBZSxFQUFFLEtBQXlCO1lBQ2pELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUVELHNDQUFvQixHQUFwQixVQUFxQixRQUFlLEVBQUUsT0FBZ0I7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDcEMsQ0FBQztRQUVTLDJDQUF5QixHQUFuQyxVQUFvQyxLQUF5QjtZQUMzRCxNQUFNLENBQUMsVUFBQyxNQUFVO2dCQUNoQixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUNILGNBQUM7SUFBRCxDQUFDLEFBbkNELElBbUNDO0lBbkNZLGVBQU8sVUFtQ25CLENBQUEifQ==
