import {StoreDataView, ItemsAddedEvent, ItemChangedEvent, ItemsDeletedEvent} from "../store/data-view";
import {EventManager} from "wg-events";

export interface DataViewConfig<ModelClass> {

  data:StoreDataView<ModelClass>;

  container:HTMLElement;

  itemRenderer?:(model:ModelClass, index:number) => string;
}

export class DataView<ModelClass> {

  data:StoreDataView<ModelClass>;

  em:EventManager = new EventManager(this);

  container:HTMLElement;

  items:ModelClass[];

  itemIndexMap = new Map<ModelClass, number>();

  nodes:HTMLElement[];

  nodeIndexMap = new Map<HTMLElement, number>();

  suspendRendering:boolean = false;

  constructor(config:DataViewConfig<ModelClass>) {
    this.bindData(config.data);

    this.container = config.container || HTMLParser.parse('<div>');

    if (typeof config.itemRenderer === 'function') {
      this.renderItem = config.itemRenderer;
    }

    this.bindViewEvents();
    this.render();
  }

  private bindData(data:StoreDataView<ModelClass>) {
    this.data = data;

    this.em.attachEventListener(data, 'items-added', this.onItemsAdded);
    this.em.attachEventListener(data, 'items-deleted', this.onItemsDeleted);
    this.em.attachEventListener(data, 'item-changed', this.onItemChanged);
    this.em.attachEventListener(data, 'filters-applied', this.onFiltersApplied);
  }

  private onItemsAdded = (e:ItemsAddedEvent<ModelClass>) => {
    if (!this.data.isFiltered()) {
      this.appendItems(e.items);
    } else {
      this.render();
    }
  };

  private onItemChanged = (e:ItemChangedEvent<ModelClass>) => {
    if (!this.data.isFiltered()) {
      this.updateItemNode(e.item);
    } else {
      this.render();
    }
  };

  private onItemsDeleted = (e:ItemsDeletedEvent) => {
    this.deleteItems(e.items);
  };

  private onFiltersApplied = () => {
    console.log('filtered');
    this.render();
  };

  private updateItemNode(item:ModelClass) {
    let currentNode = this.getItemNode(item);
    if (!currentNode) {
      return;
    }
    let index = this.getIndexOfItem(item);
    let newNode = this.buildItemNode(item, index);

    currentNode.insertAdjacentElement('afterend', newNode);
    this.container.removeChild(currentNode);

    this.nodes[index] = newNode;
    this.nodeIndexMap.delete(currentNode);
    this.nodeIndexMap.set(newNode, index);
  }

  private render() {
    let items = this.data.getItems();
    this.items = [];
    this.nodes = [];
    this.itemIndexMap.clear();
    this.nodeIndexMap.clear();
    this.container.innerHTML = '';
    this.appendItems(items);
  }

  private appendItems(items:ModelClass[]) {
    let i = this.items.length;
    items.forEach(item => {
      this.appendItem(item, i);
      i++;
    });
  }

  private deleteItems(items:ModelClass[]) {
    items.forEach(item => {
      let node = this.getItemNode(item);
      let i = this.getIndexOfNode(node);
      this.nodes.splice(i, 1);
      this.items.splice(i, 1);
      this.container.removeChild(node);
      this.nodeIndexMap.delete(node);
      this.itemIndexMap.delete(item);
    });
  }

  private appendItem(item:ModelClass, index:number) {
    let node = this.buildItemNode(item, index);
    this.container.appendChild(node);
    this.items.push(item);
    this.nodes.push(node);
    this.itemIndexMap.set(item, index);
    this.nodeIndexMap.set(node, index);
  }

  buildItemNode(item:ModelClass, index:number):HTMLElement {
    let node = HTMLParser.parse(this.renderItem(item, index));
    node.setAttribute('item-node', String(index));
    return node;
  }

  renderItem(model:ModelClass, index:number):string {
    return `<div>${index}. ${model}</div>`;
  }

  getItemNode(item:ModelClass) {
    return this.nodes[this.getIndexOfItem(item)];
  }

  getItemFromNode(node:HTMLElement) {
    return this.items[this.getIndexOfNode(node)];
  }

  getIndexOfNode(element:HTMLElement):number {
    let i = this.nodeIndexMap.get(element);
    return i === undefined ? -1 : i;
  }

  getIndexOfItem(item:ModelClass):number {
    let i = this.itemIndexMap.get(item);
    return i === undefined ? -1 : i;
  }

  getContainer():HTMLElement {
    return this.container;
  }

  private bindViewEvents() {
    this.em.attachEventListener(this.container, 'click', this.onContainerClick);
  }

  private onContainerClick = (e:MouseEvent) => {
    let node = <HTMLElement>e.target;
    while (node !== this.container && !node.matches('[item-node]')) {
      node = node.parentElement;
    }
    if (node === this.container) {
      return;
    }

    let item = this.getItemFromNode(node);
    let evt;
    this.em.dispatchEvent(evt = {
      name: 'item-clicked',
      item: item,
      node: node
    });
    console.log(evt);
  };
}

export class HTMLParser {

  private static parserElement:HTMLElement;

  static parse(html:string):HTMLElement {
    let el = this.getParserElement();
    el.innerHTML = html;
    return <HTMLElement>el.firstElementChild;
  }

  private static getParserElement():HTMLElement {
    if (!this.parserElement) {
      let fragment = document.createDocumentFragment();
      fragment.appendChild(document.createElement('div'));
      this.parserElement = <HTMLElement>fragment.firstChild;
    }
    return this.parserElement;
  }
}

export class ItemNode<ModelClass> {

  index:number;

  model:ModelClass;

  element:HTMLElement;

  constructor(index:number, model:ModelClass, element:HTMLElement) {
    this.index = index;
    this.model = model;
    this.element = element;
  }
}
