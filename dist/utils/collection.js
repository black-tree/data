define(["require", "exports"], function (require, exports) {
    "use strict";
    var Collection = (function () {
        function Collection(items) {
            if (items === void 0) { items = []; }
            this.setItems(items);
        }
        Collection.prototype.setItems = function (items) {
            this.clear();
            this.addItems(items);
        };
        Collection.prototype.clear = function () {
            this.items = [];
        };
        Collection.prototype.add = function (item, position) {
            return this.addItems([item], position).newAdded;
        };
        Collection.prototype.addItems = function (items, position) {
            var _this = this;
            var newItems = [];
            items.forEach(function (item) {
                if (!_this.includes(item)) {
                    newItems.push(item);
                }
            });
            if (isNaN(position) || position > this.length) {
                position = this.length;
                (_a = this.items).push.apply(_a, newItems);
            }
            else if (position === 0) {
                (_b = this.items).unshift.apply(_b, newItems);
            }
            else {
                var leftItems = this.items.slice(0, position);
                var rightItems = this.items.slice(position, this.length);
                this.items = leftItems.concat(newItems, rightItems);
            }
            return new ItemsInsertion(newItems, position);
            var _a, _b;
        };
        Collection.prototype.delete = function (item) {
            return !!this.deleteItems([item]).length;
        };
        Collection.prototype.deleteItems = function (items) {
            var _this = this;
            var deleted = [];
            items.forEach(function (item) {
                var i = _this.indexOf(item);
                if (i > -1) {
                    _this.items.splice(i, 1);
                    deleted.push(item);
                }
            });
            return deleted;
        };
        Collection.prototype.getAt = function (position) {
            return this.items[position];
        };
        Collection.prototype.indexOf = function (item) {
            return this.items.indexOf(item);
        };
        Collection.prototype.lastIndexOf = function (item) {
            return this.items.lastIndexOf(item);
        };
        Collection.prototype.compileSearchCriteria = function (criteria) {
            if (typeof criteria === 'function') {
                return criteria;
            }
            return function (model) {
                for (var field in criteria) {
                    if (criteria.hasOwnProperty(field)) {
                        if (model[field] !== criteria[field]) {
                            return false;
                        }
                    }
                }
                return true;
            };
        };
        Collection.prototype.filter = function (filter) {
            var matches = [];
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (filter.matches(item)) {
                    matches.push(item);
                }
            }
            return matches;
        };
        Collection.prototype.findBy = function (criteria) {
            var items = [];
            var callback = this.compileSearchCriteria(criteria);
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (callback(item)) {
                    items.push(item);
                }
            }
            return items;
        };
        Collection.prototype.findOneBy = function (criteria) {
            var i = this.findIndex(criteria);
            if (i > -1) {
                return this.items[i];
            }
            return undefined;
        };
        Collection.prototype.findIndex = function (criteria) {
            var callback = this.compileSearchCriteria(criteria);
            var ii = this.items.length;
            var i = 0;
            for (; i < ii; i++) {
                if (callback(this.items[i])) {
                    return i;
                }
            }
            return -1;
        };
        Collection.prototype.includes = function (item, fromIndex) {
            if (fromIndex === void 0) { fromIndex = 0; }
            var ii = this.items.length;
            var i = fromIndex;
            for (; i < ii; i++) {
                if (this.items[i] === item) {
                    return true;
                }
            }
            return false;
        };
        Collection.prototype.first = function () {
            return this.items[0];
        };
        Collection.prototype.last = function () {
            return this.items[this.length - 1];
        };
        Collection.prototype.slice = function (start, end) {
            return this.items.slice(start, end);
        };
        Collection.prototype.getItems = function () {
            return Array.from(this.items || []);
        };
        Collection.prototype.forEach = function (callback) {
            this.items.forEach(callback);
        };
        Object.defineProperty(Collection.prototype, "length", {
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        return Collection;
    }());
    exports.Collection = Collection;
    var ItemsInsertion = (function () {
        function ItemsInsertion(items, position) {
            this.items = items;
            this.position = position;
        }
        Object.defineProperty(ItemsInsertion.prototype, "newAdded", {
            get: function () {
                return !!this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        return ItemsInsertion;
    }());
    exports.ItemsInsertion = ItemsInsertion;
});
//# sourceMappingURL=collection.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMvY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIiwic291cmNlcyI6WyJ1dGlscy9jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBQ0E7UUFJRSxvQkFBWSxLQUFjO1lBQWQscUJBQWMsR0FBZCxVQUFjO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUVELDZCQUFRLEdBQVIsVUFBUyxLQUFTO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUVELDBCQUFLLEdBQUw7WUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBRUQsd0JBQUcsR0FBSCxVQUFJLElBQU0sRUFBRSxRQUFnQjtZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxDQUFDO1FBRUQsNkJBQVEsR0FBUixVQUFTLEtBQVMsRUFBRSxRQUFnQjtZQUFwQyxpQkFtQkM7WUFsQkMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdkIsTUFBQSxJQUFJLENBQUMsS0FBSyxFQUFDLElBQUksV0FBSSxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFBLElBQUksQ0FBQyxLQUFLLEVBQUMsT0FBTyxXQUFJLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFFTixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxLQUFLLEdBQU8sU0FBUyxRQUFLLFFBQVEsRUFBSyxVQUFVLENBQUMsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7UUFDaEQsQ0FBQztRQUVELDJCQUFNLEdBQU4sVUFBTyxJQUFNO1lBQ1gsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDM0MsQ0FBQztRQUVELGdDQUFXLEdBQVgsVUFBWSxLQUFTO1lBQXJCLGlCQVVDO1lBVEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNoQixJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNYLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRUQsMEJBQUssR0FBTCxVQUFNLFFBQWU7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVELDRCQUFPLEdBQVAsVUFBUSxJQUFNO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxnQ0FBVyxHQUFYLFVBQVksSUFBTTtZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVPLDBDQUFxQixHQUE3QixVQUE4QixRQUF1QjtZQUNuRCxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLENBQVcsUUFBUSxDQUFDO1lBQzVCLENBQUM7WUFDRCxNQUFNLENBQUMsVUFBQyxLQUFLO2dCQUNYLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFDZixDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUVELDJCQUFNLEdBQU4sVUFBTyxNQUFhO1lBQ2xCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixHQUFHLENBQUMsQ0FBYSxVQUFVLEVBQVYsS0FBQSxJQUFJLENBQUMsS0FBSyxFQUFWLGNBQVUsRUFBVixJQUFVLENBQUM7Z0JBQXZCLElBQUksSUFBSSxTQUFBO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixDQUFDO2FBQ0Y7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFRCwyQkFBTSxHQUFOLFVBQU8sUUFBdUI7WUFDNUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELEdBQUcsQ0FBQyxDQUFhLFVBQVUsRUFBVixLQUFBLElBQUksQ0FBQyxLQUFLLEVBQVYsY0FBVSxFQUFWLElBQVUsQ0FBQztnQkFBdkIsSUFBSSxJQUFJLFNBQUE7Z0JBQ1gsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkIsQ0FBQzthQUNGO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCw4QkFBUyxHQUFULFVBQVUsUUFBdUI7WUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCw4QkFBUyxHQUFULFVBQVUsUUFBdUI7WUFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDO1lBQ0gsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLENBQUM7UUFFRCw2QkFBUSxHQUFSLFVBQVMsSUFBTSxFQUFFLFNBQWE7WUFBYix5QkFBYSxHQUFiLGFBQWE7WUFDNUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ2xCLEdBQUcsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztZQUNILENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELDBCQUFLLEdBQUw7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBRUQseUJBQUksR0FBSjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEMsQ0FBQztRQUVELDBCQUFLLEdBQUwsVUFBTSxLQUFZLEVBQUUsR0FBVTtZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFRCw2QkFBUSxHQUFSO1lBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsNEJBQU8sR0FBUCxVQUFRLFFBQXNEO1lBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxzQkFBSSw4QkFBTTtpQkFBVjtnQkFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDM0IsQ0FBQzs7O1dBQUE7UUFDSCxpQkFBQztJQUFELENBQUMsQUFqS0QsSUFpS0M7SUFqS1ksa0JBQVUsYUFpS3RCLENBQUE7SUFJRDtRQU1FLHdCQUFZLEtBQVMsRUFBRSxRQUFlO1lBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzNCLENBQUM7UUFFRCxzQkFBSSxvQ0FBUTtpQkFBWjtnQkFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzdCLENBQUM7OztXQUFBO1FBQ0gscUJBQUM7SUFBRCxDQUFDLEFBZEQsSUFjQztJQWRZLHNCQUFjLGlCQWMxQixDQUFBIn0=
