define(["require", "exports", "wg-events"], function (require, exports, wg_events_1) {
    "use strict";
    var DataView = (function () {
        function DataView(config) {
            var _this = this;
            this.em = new wg_events_1.EventManager(this);
            this.itemIndexMap = new Map();
            this.nodeIndexMap = new Map();
            this.suspendRendering = false;
            this.onItemsAdded = function (e) {
                if (!_this.data.isFiltered()) {
                    _this.appendItems(e.items);
                }
                else {
                    _this.render();
                }
            };
            this.onItemChanged = function (e) {
                if (!_this.data.isFiltered()) {
                    _this.updateItemNode(e.item);
                }
                else {
                    _this.render();
                }
            };
            this.onItemsDeleted = function (e) {
                _this.deleteItems(e.items);
            };
            this.onFiltersApplied = function () {
                console.log('filtered');
                _this.render();
            };
            this.onContainerClick = function (e) {
                var node = e.target;
                while (node !== _this.container && !node.matches('[item-node]')) {
                    node = node.parentElement;
                }
                if (node === _this.container) {
                    return;
                }
                var item = _this.getItemFromNode(node);
                var evt;
                _this.em.dispatchEvent(evt = {
                    name: 'item-clicked',
                    item: item,
                    node: node
                });
                console.log(evt);
            };
            this.bindData(config.data);
            this.container = config.container || HTMLParser.parse('<div>');
            if (typeof config.itemRenderer === 'function') {
                this.renderItem = config.itemRenderer;
            }
            this.bindViewEvents();
            this.render();
        }
        DataView.prototype.bindData = function (data) {
            this.data = data;
            this.em.attachEventListener(data, 'items-added', this.onItemsAdded);
            this.em.attachEventListener(data, 'items-deleted', this.onItemsDeleted);
            this.em.attachEventListener(data, 'item-changed', this.onItemChanged);
            this.em.attachEventListener(data, 'filters-applied', this.onFiltersApplied);
        };
        DataView.prototype.updateItemNode = function (item) {
            var currentNode = this.getItemNode(item);
            if (!currentNode) {
                return;
            }
            var index = this.getIndexOfItem(item);
            var newNode = this.buildItemNode(item, index);
            currentNode.insertAdjacentElement('afterend', newNode);
            this.container.removeChild(currentNode);
            this.nodes[index] = newNode;
            this.nodeIndexMap.delete(currentNode);
            this.nodeIndexMap.set(newNode, index);
        };
        DataView.prototype.render = function () {
            var items = this.data.getItems();
            this.items = [];
            this.nodes = [];
            this.itemIndexMap.clear();
            this.nodeIndexMap.clear();
            this.container.innerHTML = '';
            this.appendItems(items);
        };
        DataView.prototype.appendItems = function (items) {
            var _this = this;
            var i = this.items.length;
            items.forEach(function (item) {
                _this.appendItem(item, i);
                i++;
            });
        };
        DataView.prototype.deleteItems = function (items) {
            var _this = this;
            items.forEach(function (item) {
                var node = _this.getItemNode(item);
                var i = _this.getIndexOfNode(node);
                _this.nodes.splice(i, 1);
                _this.items.splice(i, 1);
                _this.container.removeChild(node);
                _this.nodeIndexMap.delete(node);
                _this.itemIndexMap.delete(item);
            });
        };
        DataView.prototype.appendItem = function (item, index) {
            var node = this.buildItemNode(item, index);
            this.container.appendChild(node);
            this.items.push(item);
            this.nodes.push(node);
            this.itemIndexMap.set(item, index);
            this.nodeIndexMap.set(node, index);
        };
        DataView.prototype.buildItemNode = function (item, index) {
            var node = HTMLParser.parse(this.renderItem(item, index));
            node.setAttribute('item-node', String(index));
            return node;
        };
        DataView.prototype.renderItem = function (model, index) {
            return "<div>" + index + ". " + model + "</div>";
        };
        DataView.prototype.getItemNode = function (item) {
            return this.nodes[this.getIndexOfItem(item)];
        };
        DataView.prototype.getItemFromNode = function (node) {
            return this.items[this.getIndexOfNode(node)];
        };
        DataView.prototype.getIndexOfNode = function (element) {
            var i = this.nodeIndexMap.get(element);
            return i === undefined ? -1 : i;
        };
        DataView.prototype.getIndexOfItem = function (item) {
            var i = this.itemIndexMap.get(item);
            return i === undefined ? -1 : i;
        };
        DataView.prototype.getContainer = function () {
            return this.container;
        };
        DataView.prototype.bindViewEvents = function () {
            this.em.attachEventListener(this.container, 'click', this.onContainerClick);
        };
        return DataView;
    }());
    exports.DataView = DataView;
    var HTMLParser = (function () {
        function HTMLParser() {
        }
        HTMLParser.parse = function (html) {
            var el = this.getParserElement();
            el.innerHTML = html;
            return el.firstElementChild;
        };
        HTMLParser.getParserElement = function () {
            if (!this.parserElement) {
                var fragment = document.createDocumentFragment();
                fragment.appendChild(document.createElement('div'));
                this.parserElement = fragment.firstChild;
            }
            return this.parserElement;
        };
        return HTMLParser;
    }());
    exports.HTMLParser = HTMLParser;
    var ItemNode = (function () {
        function ItemNode(index, model, element) {
            this.index = index;
            this.model = model;
            this.element = element;
        }
        return ItemNode;
    }());
    exports.ItemNode = ItemNode;
});
//# sourceMappingURL=data-view.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy9kYXRhLXZpZXcuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsidmlldy9kYXRhLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFZQTtRQWtCRSxrQkFBWSxNQUFpQztZQWxCL0MsaUJBOEtDO1lBMUtDLE9BQUUsR0FBZ0IsSUFBSSx3QkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBTXpDLGlCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7WUFJN0MsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztZQUU5QyxxQkFBZ0IsR0FBVyxLQUFLLENBQUM7WUF3QnpCLGlCQUFZLEdBQUcsVUFBQyxDQUE2QjtnQkFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDNUIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sa0JBQWEsR0FBRyxVQUFDLENBQThCO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM1QixLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7WUFDSCxDQUFDLENBQUM7WUFFTSxtQkFBYyxHQUFHLFVBQUMsQ0FBbUI7Z0JBQzNDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQztZQUVNLHFCQUFnQixH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
