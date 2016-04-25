import {Collection} from "../../../src/utils/collection";

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
