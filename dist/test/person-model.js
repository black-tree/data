var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../model/decorators"], function (require, exports, decorators_1) {
    "use strict";
    var Person = (function () {
        function Person(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
        __decorate([
            decorators_1.Field({ type: 'number' }), 
            __metadata('design:type', Object)
        ], Person.prototype, "id", void 0);
        __decorate([
            decorators_1.Field({ type: 'string' }), 
            __metadata('design:type', String)
        ], Person.prototype, "firstName", void 0);
        __decorate([
            decorators_1.Field({ type: 'string' }), 
            __metadata('design:type', String)
        ], Person.prototype, "lastName", void 0);
        __decorate([
            decorators_1.Field({ type: 'date' }), 
            __metadata('design:type', Date)
        ], Person.prototype, "birthDate", void 0);
        Person = __decorate([
            decorators_1.Model(), 
            __metadata('design:paramtypes', [String, String])
        ], Person);
        return Person;
    }());
    exports.Person = Person;
});
//# sourceMappingURL=person-model.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC9wZXJzb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsidGVzdC9wZXJzb24tbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFHQTtRQWVFLGdCQUFZLFNBQWlCLEVBQUUsUUFBZ0I7WUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDM0IsQ0FBQztRQWhCRDtZQUFDLGtCQUFLLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUM7OzBDQUFBO1FBR3hCO1lBQUMsa0JBQUssQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQzs7aURBQUE7UUFHeEI7WUFBQyxrQkFBSyxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDOztnREFBQTtRQUd4QjtZQUFDLGtCQUFLLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7O2lEQUFBO1FBWnhCO1lBQUMsa0JBQUssRUFBRTs7a0JBQUE7UUFvQlIsYUFBQztJQUFELENBQUMsQUFuQkQsSUFtQkM7SUFuQlksY0FBTSxTQW1CbEIsQ0FBQSJ9
