define(["require", "exports", "../utils/filter", "wg-events"], function (require, exports, filter_1, wg_events_1) {
    "use strict";
    var StoreDataView = (function () {
        function StoreDataView(store) {
            var _this = this;
            this.filters = new filter_1.FilterChain();
            this.em = new wg_events_1.EventManager(this);
            this.onModelsAdded = function (e) {
                _this.refresh();
                _this.em.dispatchEvent({
                    name: 'items-added',
                    items: e.models
                });
            };
            this.onModelsDeleted = function (e) {
                _this.refresh();
                _this.em.dispatchEvent({
                    name: 'items-deleted',
                    items: e.models
                });
            };
            this.onModelChanged = function (e) {
                if (_this.hasItem(e.model)) {
                    if (_this.isFiltered()) {
                        _this.refresh();
                    }
                    _this.em.dispatchEvent({
                        name: 'item-changed',
                        item: e.model
                    });
                }
            };
            this.onDataLoaded = function (e) {
                _this.refresh();
                _this.em.dispatchEvent({
                    name: 'items-loaded',
                    items: e.data
                });
            };
            this.items = store.getAll();
            this.storeEvents = {
                'models-added': this.onModelsAdded,
                'models-deleted': this.onModelsDeleted,
                'model-changed': this.onModelChanged,
                'data-loaded': this.onDataLoaded
            };
            this.bindStore(store);
        }
        StoreDataView.prototype.addFilter = function (filter) {
            this.filters.addFilter(filter);
            this.refresh();
            this.em.dispatchEvent({
                name: 'filters-applied'
            });
        };
        StoreDataView.prototype.removeFilter = function (filter) {
            if (this.filters.removeFilter(filter)) {
                this.refresh();
                this.em.dispatchEvent({
                    name: 'filters-applied'
                });
            }
        };
        StoreDataView.prototype.bindStore = function (store) {
            this.unbindStore();
            this.store = store;
            for (var event_1 in this.storeEvents) {
                if (this.storeEvents.hasOwnProperty(event_1)) {
                    this.em.attachEventListener(this.store, event_1, this.storeEvents[event_1]);
                }
            }
        };
        StoreDataView.prototype.unbindStore = function () {
            if (this.store) {
                this.em.detachEventListeners(this.store);
            }
            this.store = undefined;
        };
        StoreDataView.prototype.refresh = function () {
            this.items = this.applyFilters(this.store.getAll());
        };
        StoreDataView.prototype.applyFilters = function (data) {
            var items = [];
            if (!this.isFiltered()) {
                items.push.apply(items, data);
            }
            else {
                items = data.filter(this.filters.toCallback());
            }
            return items;
        };
        StoreDataView.prototype.isFiltered = function () {
            return this.filters.getFilters().length !== 0;
        };
        StoreDataView.prototype.hasItem = function (item) {
            return this.items.indexOf(item) !== -1;
        };
        StoreDataView.prototype.addEventListener = function (event, listener) {
            this.em.addEventListener(event, listener);
        };
        StoreDataView.prototype.dispatchEvent = function (event) {
            this.em.dispatchEvent(event);
        };
        StoreDataView.prototype.on = function (event, listener) {
            this.em.on(event, listener);
        };
        StoreDataView.prototype.removeEventListener = function (event, listener) {
            this.em.removeEventListener(event, listener);
        };
        StoreDataView.prototype.off = function (event, listener) {
            this.em.off(event, listener);
        };
        StoreDataView.prototype.getItems = function () {
            return this.items.slice(0);
        };
        StoreDataView.prototype.dispose = function () {
            this.unbindStore();
        };
        return StoreDataView;
    }());
    exports.StoreDataView = StoreDataView;
});
//# sourceMappingURL=data-view.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUvZGF0YS12aWV3LmpzIiwic291cmNlUm9vdCI6Ii9zcmMiLCJzb3VyY2VzIjpbInN0b3JlL2RhdGEtdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQUtBO1FBWUUsdUJBQVksS0FBdUI7WUFackMsaUJBZ0pDO1lBMUlTLFlBQU8sR0FBZSxJQUFJLG9CQUFXLEVBQUUsQ0FBQztZQUV4QyxPQUFFLEdBQWdCLElBQUksd0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQW1EekMsa0JBQWEsR0FBRyxVQUFDLENBQThCO2dCQUNyRCxLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQThCO29CQUNqRCxJQUFJLEVBQUUsYUFBYTtvQkFDbkIsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNO2lCQUNoQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUM7WUFFTSxvQkFBZSxHQUFHLFVBQUMsQ0FBOEI7Z0JBQ3ZELEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDZixLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBb0I7b0JBQ3ZDLElBQUksRUFBRSxlQUFlO29CQUNyQixLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU07aUJBQ2hCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUVNLG1CQUFjLEdBQUcsVUFBQyxDQUErQjtnQkFDdkQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2pCLENBQUM7b0JBQ0QsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQStCO3dCQUNsRCxJQUFJLEVBQUUsY0FBYzt3QkFDcEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFL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
