import {
  Collection,
  ObservableCollection,
  ItemsAddedEvent,
  ItemsDeletedEvent,
  ItemsSetEvent,
  ItemsClearedEvent
} from "../../../src/utils/collection";

describe('Collection', () => {

  it('ignores insertion of repeated items', () => {
    let collection = new Collection();
    collection.addItems([1,2,3,4,5]);
    let inserted = collection.add(1);

    expect(inserted).toBeFalsy();
    expect(collection.length).toEqual(5);
    expect(collection.last()).toEqual(5);
  });

  it('adds items at specified position', () => {

    let collection = new Collection();
    collection.addItems([1,2,3,4,5]);

    collection.add('x', 3);
    expect(collection.getAt(3)).toEqual('x');

    collection.add('xx', 0);
    expect(collection.getAt(0)).toEqual('xx');

    collection.add('xxx');
    expect(collection.last()).toEqual('xxx');
    
    collection.addItems(['a', 'b', 'c'], 3);
    expect(collection.slice(3, 6)).toEqual(['a', 'b', 'c']);
  });
});

describe('ObservableCollection', () => {
  
  it('dispatches items added event', () => {

    let collection = new ObservableCollection();
    let added = [];
    collection.on('items-added', (e:ItemsAddedEvent) => {
      added.push(e.items);
    });

    collection.add('x');
    expect(added).toContain(['x']);

    collection.addItems([1, 2, 3]);
    expect(added).toContain([1,2,3]);

    //Does not dispatches event if no actual insertion occurred
    collection.add('x');
    expect(added.length).toEqual(2);
  });

  it('dispatches items deleted event', () => {

    let collection = new ObservableCollection();
    let deleted = [];
    collection.on('items-deleted', (e:ItemsDeletedEvent) => {
      deleted.push(e.items);
    });

    collection.addItems([1,2,3,4,5,6]);

    collection.delete(1);
    expect(deleted).toContain([1]);

    collection.deleteItems([2, 3, 4]);
    expect(deleted).toContain([2,3,4]);

    //Delete events must not be triggered if no actual deletion occurred
    collection.delete(1);
    expect(deleted.length).toEqual(2);
  });

  it('dispatched items set event', () => {
    let collection = new ObservableCollection([1, 2, 3]);
    let itemsSet = [];
    let cleared = false;
    collection.on('items-set', (e:ItemsSetEvent) => {
      itemsSet.push([e.oldItems, e.newItems]);
    });
    collection.on('items-cleared', () => {
      cleared = true;
    });

    collection.setItems(['a', 'b', 'c']);
    //When setting items, clear event must not be dispatched
    expect(cleared).toBeFalsy();
    expect(itemsSet).toContain([[1, 2, 3], ['a', 'b', 'c']]);
  });

  it('dispatches items cleared event', () => {
    let collection = new ObservableCollection([1, 2, 3]);
    let oldItems;

    collection.on('items-cleared', (e:ItemsClearedEvent) => {
      oldItems = e.oldItems;
    });

    collection.clear();
    expect(oldItems).toEqual([1, 2, 3]);
  });
});
