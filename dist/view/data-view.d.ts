import { StoreDataView } from "../store/data-view";
import { EventManager } from "wg-events";
export interface DataViewConfig<ModelClass> {
    data: StoreDataView<ModelClass>;
    container: HTMLElement;
    itemRenderer?: (model: ModelClass, index: number) => string;
}
export declare class DataView<ModelClass> {
    data: StoreDataView<ModelClass>;
    em: EventManager;
    container: HTMLElement;
    items: ModelClass[];
    itemIndexMap: Map<ModelClass, number>;
    nodes: HTMLElement[];
    nodeIndexMap: Map<HTMLElement, number>;
    suspendRendering: boolean;
    constructor(config: DataViewConfig<ModelClass>);
    private bindData(data);
    private onItemsAdded;
    private onItemChanged;
    private onItemsDeleted;
    private onFiltersApplied;
    private updateItemNode(item);
    private render();
    private appendItems(items);
    private deleteItems(items);
    private appendItem(item, index);
    buildItemNode(item: ModelClass, index: number): HTMLElement;
    renderItem(model: ModelClass, index: number): string;
    getItemNode(item: ModelClass): HTMLElement;
    getItemFromNode(node: HTMLElement): ModelClass;
    getIndexOfNode(element: HTMLElement): number;
    getIndexOfItem(item: ModelClass): number;
    getContainer(): HTMLElement;
    private bindViewEvents();
    private onContainerClick;
}
export declare class HTMLParser {
    private static parserElement;
    static parse(html: string): HTMLElement;
    private static getParserElement();
}
export declare class ItemNode<ModelClass> {
    index: number;
    model: ModelClass;
    element: HTMLElement;
    constructor(index: number, model: ModelClass, element: HTMLElement);
}
