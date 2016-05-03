define(["require", "exports"], function (require, exports) {
    "use strict";
    var PrototypeInjectionInstantiator = (function () {
        function PrototypeInjectionInstantiator() {
        }
        PrototypeInjectionInstantiator.prototype.instantiate = function (InstanceClass) {
            return Object.create(InstanceClass.prototype);
        };
        return PrototypeInjectionInstantiator;
    }());
    exports.PrototypeInjectionInstantiator = PrototypeInjectionInstantiator;
    var ConstructorCallInstantiator = (function () {
        function ConstructorCallInstantiator() {
        }
        ConstructorCallInstantiator.prototype.instantiate = function (InstanceClass) {
            return new InstanceClass();
        };
        return ConstructorCallInstantiator;
    }());
    exports.ConstructorCallInstantiator = ConstructorCallInstantiator;
});
//# sourceMappingURL=instantiator.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMvaW5zdGFudGlhdG9yLmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbInV0aWxzL2luc3RhbnRpYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQU1BO1FBQUE7UUFLQSxDQUFDO1FBSEMsb0RBQVcsR0FBWCxVQUFtQixhQUE4QjtZQUMvQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNILHFDQUFDO0lBQUQsQ0FBQyxBQUxELElBS0M7SUFMWSxzQ0FBOEIsaUNBSzFDLENBQUE7SUFFRDtRQUFBO1FBS0EsQ0FBQztRQUhDLGlEQUFXLEdBQVgsVUFBbUIsYUFBNEI7WUFDN0MsTUFBTSxDQUFDLElBQUksYUFBYSxFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUNILGtDQUFDO0lBQUQsQ0FBQyxBQUxELElBS0M7SUFMWSxtQ0FBMkIsOEJBS3ZDLENBQUEifQ==
