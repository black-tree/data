import {StoreDataView, ItemsAddedEvent, ItemsLoadedEvent, ItemChangedEvent} from "../../../src/store/data-view";
import {Store} from "../../../src/store/store";
import {CallbackFilter} from "../../../src/utils/filter";
import {Person} from '../../../src/test/person-model';

describe(StoreDataView.name, () => {

  it('adds models when they are added to the store', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);

    store.add({firstName: 'Foo'});

    let items = view.getItems();
    expect(items[0].firstName).toEqual('Foo');
  });

  it('applies filters to added models', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);

    view.addFilter(new CallbackFilter(person => person.firstName === 'Bar'));

    store.add({firstName: 'Foo'});

    let items = view.getItems();
    expect(items.length).toEqual(0);
  });

  it('applies filters after deleting models', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);
    let persons = [new Person('Foo'), new Person('Bar')];
    view.addFilter(new CallbackFilter(person => person.firstName === 'Bar'));

    store.add(persons);
    store.delete(persons[1]);

    let items = view.getItems();
    expect(items.length).toEqual(0);
  });

  it('applies filters after adding a new filter', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);

    store.add([{firstName: 'Foo'}]);
    view.addFilter(new CallbackFilter(person => person.firstName === 'Bar'));

    let items = view.getItems();
    expect(items.length).toEqual(0);
  });

  it('applies filters after removing an existing filter', () => {
    let store = new Store<Person>({modelClass: Person});
    var filter = new CallbackFilter(person => person.firstName === 'Bar');
    let view = new StoreDataView<Person>(store);

    view.addFilter(filter);

    store.add([{firstName: 'Foo'}]);

    view.removeFilter(filter);

    let items = view.getItems();
    expect(items.length).toEqual(1);

  });

  it('dispatches items-added event', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);
    let itemsAdded:any[] = undefined;

    view.on('items-added', (e:ItemsAddedEvent<Person>) => {
      itemsAdded = e.items;
    });

    store.add([{firstName: 'Foo'}]);

    expect(itemsAdded.length).toEqual(1);
  });
  
  it('dispatches items-loaded event', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);
    let itemsLoaded:Person[] = undefined;

    view.on('items-loaded', (e:ItemsLoadedEvent) => itemsLoaded = e.items);

    store.setData([{firstName: 'Foo'}]);

    expect(itemsLoaded[0].firstName).toEqual('Foo');
  });

  it('dispatches items-changed event', () => {
    let person = new Person('Foo');
    let store = new Store<Person>({
      modelClass: Person,
      data: [person]
    });
    let view = new StoreDataView<Person>(store);
    let firstName:string = person.firstName;

    view.on('item-changed', (e:ItemChangedEvent<Person>) => firstName = e.item.firstName);

    person.firstName = 'Bar';

    expect(firstName).toEqual('Bar');
  });

  it('unbinds store when disposed', () => {
    let store = new Store<Person>({modelClass: Person});
    let view = new StoreDataView<Person>(store);
    let unbound = true;

    view.on('items-added', () => unbound = false);

    view.dispose();
    store.add({firstName: 'Foo'});

    expect(unbound).toBeTruthy();
  });
});
