var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var BaseFieldType = (function () {
        function BaseFieldType() {
        }
        BaseFieldType.prototype.convertRawValue = function (value, options) {
            if (options.nullValues && value === null) {
                return null;
            }
            return this.convertToType(value, options);
        };
        BaseFieldType.prototype.getDefaultOptions = function () {
            return Object.assign({}, exports.defaultFieldTypeOptions);
        };
        return BaseFieldType;
    }());
    exports.BaseFieldType = BaseFieldType;
    var AnyType = (function (_super) {
        __extends(AnyType, _super);
        function AnyType() {
            _super.apply(this, arguments);
        }
        AnyType.prototype.serializeValue = function (value, options) {
            return value;
        };
        AnyType.prototype.convertToType = function (value, options) {
            return value;
        };
        return AnyType;
    }(BaseFieldType));
    exports.AnyType = AnyType;
    var StringType = (function (_super) {
        __extends(StringType, _super);
        function StringType() {
            _super.apply(this, arguments);
        }
        StringType.prototype.convertToType = function (value, options) {
            return String(value);
        };
        StringType.prototype.serializeValue = function (value, options) {
            return value;
        };
        return StringType;
    }(BaseFieldType));
    exports.StringType = StringType;
    var NumberType = (function (_super) {
        __extends(NumberType, _super);
        function NumberType() {
            _super.apply(this, arguments);
        }
        NumberType.prototype.convertToType = function (value, options) {
            return Number(value);
        };
        NumberType.prototype.serializeValue = function (value, options) {
            return value;
        };
        return NumberType;
    }(BaseFieldType));
    exports.NumberType = NumberType;
    var BooleanType = (function (_super) {
        __extends(BooleanType, _super);
        function BooleanType() {
            _super.apply(this, arguments);
        }
        BooleanType.prototype.convertToType = function (value, options) {
            return !!value;
        };
        BooleanType.prototype.serializeValue = function (value, options) {
            return value;
        };
        return BooleanType;
    }(BaseFieldType));
    exports.BooleanType = BooleanType;
    var DateType = (function (_super) {
        __extends(DateType, _super);
        function DateType() {
            _super.apply(this, arguments);
        }
        DateType.prototype.convertToType = function (value, options) {
            return new Date(Number(value));
        };
        DateType.prototype.serializeValue = function (value, options) {
            return String(value.valueOf());
        };
        DateType.prototype.valuesAreEqual = function (value1, value2) {
            return value1.valueOf() !== value2.valueOf();
        };
        DateType.prototype.getDefaultOptions = function () {
            return exports.dateTypeDefaultOptions;
        };
        return DateType;
    }(BaseFieldType));
    exports.DateType = DateType;
    exports.defaultFieldTypeOptions = {
        nullValues: true
    };
    exports.dateTypeDefaultOptions = Object.assign({
        dateFormat: ''
    }, exports.defaultFieldTypeOptions);
    exports.FieldTypes = {
        any: new AnyType(),
        string: new StringType(),
        number: new NumberType(),
        boolean: new BooleanType(),
        date: new DateType()
    };
});
//# sourceMappingURL=field-type.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQvZmllbGQtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIiwic291cmNlcyI6WyJmaWVsZC9maWVsZC10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7SUF1Q0E7UUFBQTtRQW9CQSxDQUFDO1FBbEJDLHVDQUFlLEdBQWYsVUFBZ0IsS0FBUyxFQUFFLE9BQXdCO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFRCx5Q0FBaUIsR0FBakI7WUFDRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsK0JBQXVCLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBU0gsb0JBQUM7SUFBRCxDQUFDLEFBcEJELElBb0JDO0lBcEJxQixxQkFBYSxnQkFvQmxDLENBQUE7SUFNRDtRQUE2QiwyQkFBYTtRQUExQztZQUE2Qiw4QkFBYTtRQWExQyxDQUFDO1FBUkMsZ0NBQWMsR0FBZCxVQUFlLEtBQVMsRUFBRSxPQUF3QjtZQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUdTLCtCQUFhLEdBQXZCLFVBQXdCLEtBQVMsRUFBRSxPQUF3QjtZQUN6RCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNILGNBQUM7SUFBRCxDQUFDLEFBYkQsQ0FBNkIsYUFBYSxHQWF6QztJQWJZLGVBQU8sVUFhbkIsQ0FBQTtJQUtEO1FBQWdDLDhCQUFhO1FBQTdDO1lBQWdDLDhCQUFhO1FBYzdDLENBQUM7UUFaVyxrQ0FBYSxHQUF2QixVQUF3QixLQUFTLEVBQUUsT0FBd0I7WUFDekQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBTUQsbUNBQWMsR0FBZCxVQUFlLEtBQVMsRUFBRSxPQUF3QjtZQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVILGlCQUFDO0lBQUQsQ0FBQyxBQWRELENBQWdDLGFBQWEsR0FjNUM7SUFkWSxrQkFBVSxhQWN0QixDQUFBO0lBS0Q7UUFBZ0MsOEJBQWE7UUFBN0M7WUFBZ0MsOEJBQWE7UUFhN0MsQ0FBQztRQVhXLGtDQUFhLEdBQXZCLFVBQXdCLEtBQVMsRUFBRSxPQUF3QjtZQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFNRCxtQ0FBYyxHQUFkLFVBQWUsS0FBWSxFQUFFLE9BQXdCO1lBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0gsaUJBQUM7SUFBRCxDQUFDLEFBYkQsQ0FBZ0MsYUFBYSxHQWE1QztJQWJZLGtCQUFVLGFBYXRCLENBQUE7SUFLRDtRQUFpQywrQkFBYTtRQUE5QztZQUFpQyw4QkFBYTtRQWE5QyxDQUFDO1FBWFcsbUNBQWEsR0FBdkIsVUFBd0IsS0FBUyxFQUFFLE9BQXdCO1lBQ3pELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFNRCxvQ0FBYyxHQUFkLFVBQWUsS0FBWSxFQUFFLE9BQXdCO1lBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0gsa0JBQUM7SUFBRCxDQUFDLEFBYkQsQ0FBaUMsYUFBYSxHQWE3QztJQWJZLG1CQUFXLGNBYXZCLENBQUE7SUFVRDtRQUE4Qiw0QkFBYTtRQUEzQztZQUE4Qiw4QkFBYTtRQWdDM0MsQ0FBQztRQTlCVyxnQ0FBYSxHQUF2QixVQUF3QixLQUFTLEVBQUUsT0FBd0I7WUFDekQsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFTRCxpQ0FBYyxHQUFkLFVBQWUsS0FBVSxFQUFFLE9BQXVCO1lBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQVNELGlDQUFjLEdBQWQsVUFBZSxNQUFXLEVBQUUsTUFBVztZQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQyxDQUFDO1FBR0Qsb0NBQWlCLEdBQWpCO1lBQ0UsTUFBTSxDQUFDLDhCQUFzQixDQUFDO1FBQ2hDLENBQUM7UUFDSCxlQUFDO0lBQUQsQ0FBQyxBQWhDRCxDQUE4QixhQUFhLEdBZ0MxQztJQWhDWSxnQkFBUSxXQWdDcEIsQ0FBQTtJQW9CVSwrQkFBdUIsR0FBb0I7UUFFcEQsVUFBVSxFQUFFLElBQUk7S0FFakIsQ0FBQztJQThCUyw4QkFBc0IsR0FBbUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoRSxVQUFVLEVBQUUsRUFBRTtLQUNmLEVBQUUsK0JBQXVCLENBQUMsQ0FBQztJQUtqQixrQkFBVSxHQUFHO1FBQ3RCLEdBQUcsRUFBRSxJQUFJLE9BQU8sRUFBRTtRQUNsQixNQUFNLEVBQUUsSUFBSSxVQUFVLEVBQUU7UUFDeEIsTUFBTSxFQUFFLElBQUksVUFBVSxFQUFFO1FBQ3hCLE9BQU8sRUFBRSxJQUFJLFdBQVcsRUFBRTtRQUMxQixJQUFJLEVBQUUsSUFBSSxRQUFRLEVBQUU7S0FDckIsQ0FBQyJ9
