var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var AbstractFilter = (function () {
        function AbstractFilter() {
        }
        AbstractFilter.prototype.matches = function (item) {
            throw new Error('Method must be implemented by derived classes');
        };
        AbstractFilter.prototype.toCallback = function () {
            var _this = this;
            return function (item) { return _this.matches(item); };
        };
        return AbstractFilter;
    }());
    exports.AbstractFilter = AbstractFilter;
    var CallbackFilter = (function (_super) {
        __extends(CallbackFilter, _super);
        function CallbackFilter(matches) {
            _super.call(this);
            this.matches = matches;
        }
        return CallbackFilter;
    }(AbstractFilter));
    exports.CallbackFilter = CallbackFilter;
    var FilterChain = (function (_super) {
        __extends(FilterChain, _super);
        function FilterChain(filters) {
            if (filters === void 0) { filters = []; }
            _super.call(this);
            this.filters = filters.slice(0);
        }
        FilterChain.prototype.matches = function (subject) {
            if (this.filters.length === 0) {
                return true;
            }
            for (var _i = 0, _a = this.filters; _i < _a.length; _i++) {
                var filter = _a[_i];
                if (!filter.matches(subject)) {
                    return false;
                }
            }
            return true;
        };
        FilterChain.prototype.addFilter = function (filter) {
            this.filters.push(filter);
        };
        FilterChain.prototype.removeFilter = function (filter) {
            var i = this.filters.indexOf(filter);
            if (i > -1) {
                this.filters.splice(i, 1);
                return true;
            }
            return false;
        };
        FilterChain.prototype.getFilters = function () {
            return this.filters.slice(0);
        };
        return FilterChain;
    }(AbstractFilter));
    exports.FilterChain = FilterChain;
    var PropertyMatchFilter = (function (_super) {
        __extends(PropertyMatchFilter, _super);
        function PropertyMatchFilter(matchSpecs) {
            _super.call(this);
            this.matchSpecs = [];
            for (var _i = 0, matchSpecs_1 = matchSpecs; _i < matchSpecs_1.length; _i++) {
                var criterion = matchSpecs_1[_i];
                this.matchSpecs.push(Object.assign({ operator: '=' }, criterion));
            }
            this.configure();
        }
        PropertyMatchFilter.prototype.matches = function (subject) {
            return this.filter.matches(subject);
        };
        PropertyMatchFilter.prototype.getMatchSpecifications = function () {
            return this.matchSpecs;
        };
        PropertyMatchFilter.prototype.configure = function () {
            var matcherChain = [];
            for (var _i = 0, _a = this.matchSpecs; _i < _a.length; _i++) {
                var spec = _a[_i];
                matcherChain.push(new PropertyMatcher(spec));
            }
            this.filter = new FilterChain(matcherChain);
        };
        return PropertyMatchFilter;
    }(AbstractFilter));
    exports.PropertyMatchFilter = PropertyMatchFilter;
    var PropertyMatcher = (function (_super) {
        __extends(PropertyMatcher, _super);
        function PropertyMatcher(spec) {
            _super.call(this);
            var matches;
            var value = spec.value;
            var prop = spec.property;
            switch (spec.operator || '=') {
                case '>':
                    matches = function (x) { return x[prop] > value; };
                    break;
                case '<':
                    matches = function (x) { return x[prop] < value; };
                    break;
                case '>=':
                    matches = function (x) { return x[prop] >= value; };
                    break;
                case '<=':
                    matches = function (x) { return x[prop] <= value; };
                    break;
                case '!=':
                    matches = function (x) { return x[prop] != value; };
                    break;
                case '=':
                default: matches = function (x) { return x[prop] == value; };
            }
            this.matches = matches;
        }
        return PropertyMatcher;
    }(AbstractFilter));
    exports.PropertyMatcher = PropertyMatcher;
});
//# sourceMappingURL=filter.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMvZmlsdGVyLmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbInV0aWxzL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBT0E7UUFBQTtRQVNBLENBQUM7UUFQQyxnQ0FBTyxHQUFQLFVBQVEsSUFBUTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsbUNBQVUsR0FBVjtZQUFBLGlCQUVDO1lBREMsTUFBTSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQztRQUN0QyxDQUFDO1FBQ0gscUJBQUM7SUFBRCxDQUFDLEFBVEQsSUFTQztJQVRxQixzQkFBYyxpQkFTbkMsQ0FBQTtJQUVEO1FBQW9DLGtDQUFjO1FBRWhELHdCQUFZLE9BQTJCO1lBQ3JDLGlCQUFPLENBQUM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN6QixDQUFDO1FBRUgscUJBQUM7SUFBRCxDQUFDLEFBUEQsQ0FBb0MsY0FBYyxHQU9qRDtJQVBZLHNCQUFjLGlCQU8xQixDQUFBO0lBRUQ7UUFBaUMsK0JBQWM7UUFJN0MscUJBQVksT0FBcUI7WUFBckIsdUJBQXFCLEdBQXJCLFlBQXFCO1lBQy9CLGlCQUFPLENBQUM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELDZCQUFPLEdBQVAsVUFBUSxPQUFXO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBQ0QsR0FBRyxDQUFDLENBQWUsVUFBWSxFQUFaLEtBQUEsSUFBSSxDQUFDLE9BQU8sRUFBWixjQUFZLEVB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
