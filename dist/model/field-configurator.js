define(["require", "exports"], function (require, exports) {
    "use strict";
    var DefaultFieldConfigurator = (function () {
        function DefaultFieldConfigurator() {
        }
        DefaultFieldConfigurator.prototype.configureFields = function (modelPrototype, fields) {
            fields.forEach(function (field) {
                var fieldName = field.getName();
                Object.defineProperty(modelPrototype, fieldName, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        if (this === modelPrototype) {
                            return undefined;
                        }
                        var model = this;
                        return model.modelAspect.data.getValue(fieldName);
                    },
                    set: function (value) {
                        if (this === modelPrototype) {
                            return;
                        }
                        var model = this;
                        model.modelAspect.data.setValue(fieldName, value);
                    }
                });
            });
        };
        return DefaultFieldConfigurator;
    }());
    exports.DefaultFieldConfigurator = DefaultFieldConfigurator;
    exports.FieldConfigurators = {
        'default': new DefaultFieldConfigurator()
    };
});
//# sourceMappingURL=field-configurator.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwvZmllbGQtY29uZmlndXJhdG9yLmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbIm1vZGVsL2ZpZWxkLWNvbmZpZ3VyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQVlBO1FBQUE7UUEwQkEsQ0FBQztRQXhCQyxrREFBZSxHQUFmLFVBQWdCLGNBQTZCLEVBQUUsTUFBYztZQUMzRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDbEIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNoQyxNQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQXNCO29CQUNuRSxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsWUFBWSxFQUFFLElBQUk7b0JBRWxCLEdBQUcsRUFBRTt3QkFDSCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQzs0QkFDNUIsTUFBTSxDQUFDLFNBQVMsQ0FBQzt3QkFDbkIsQ0FBQzt3QkFDRCxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUM7d0JBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3BELENBQUM7b0JBQ0QsR0FBRyxFQUFFLFVBQVMsS0FBSzt3QkFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7NEJBQzVCLE1BQU0sQ0FBQzt3QkFDVCxDQUFDO3dCQUNELElBQUksS0FBSyxHQUFVLElBQUksQ0FBQzt3QkFDeEIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDcEQsQ0FBQztpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCwrQkFBQztJQUFELENBQUMsQUExQkQsSUEwQkM7SUExQlksZ0NBQXdCLDJCQTBCcEMsQ0FBQTtJQUVVLDBCQUFrQixHQUFHO1FBQzlCLFNBQVMsRUFBRSxJQUFJLHdCQUF3QixFQUFFO0tBQzFDLENBQUMifQ==
