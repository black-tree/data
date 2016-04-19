import {declareModel, Model, ModelAspect} from "../../../src/model/model";
import {Store} from "../../../src/store/store";
import {DataChangedEvent, ValueChange} from "../../../src/model/model-data";
import {FieldTypes} from "../../../src/field/field-type";
import {MemoryAdapter} from "../../../src/adapter/memory-adapter";
import {BatchOperationResult} from "../../../src/adapter/adapter";

describe('Store', () => {

  class FooModel implements Model{
    id:number;
    bar:string = 'baz';

    modelAspect:ModelAspect;
  }

  beforeAll(() => {

    declareModel(FooModel, {
      fields: [{name: 'bar'}]
    });

  });

  it('creates model instances from raw objects when adding them to the store', () => {
    let store = new Store<FooModel>({modelClass: FooModel});
    let added = store.add({})[0];

    expect(added instanceof FooModel).toBeTruthy();
  });

  it('sets models as non dirty when created from raw objects added to the store', () => {
    let store = new Store<FooModel>({modelClass: FooModel});
    store.add([{bar: 'x'}, {id: 1, bar: 'x'}]);

    expect(store.getSynchronizationBatch().forUpdate.length).toEqual(0);
  });

  it('detects added objects are already model instances', () => {
    let store = new Store<FooModel>({modelClass: FooModel});
    let foo = new FooModel();

    let added = store.add(foo)[0];
    expect(added).toBe(foo);

  });

  it('manages model lifecycle states', () => {

    let store = new Store<FooModel>({modelClass: FooModel});
    let model = new FooModel();
    model.id = 1;

    let added = store.add([
      {},
      {bar: 'x'},
      {id: 1, bar: 'x'},
      model // Already an instance of FooModel
    ]);
    let scheduled = store.getSynchronizationBatch();

    expect(scheduled.forInsertion.length).toEqual(2);
    expect(scheduled.forInsertion).toContain(added[0]);
    expect(scheduled.forInsertion).toContain(added[1]);

    expect(scheduled.forUpdate.length).toEqual(1);
    expect(scheduled.forUpdate).toContain(model);

    expect(scheduled.forDeletion.length).toEqual(0);

    // Committing a persisted model should remove its schedule for update
    model.modelAspect.data.commit();
    scheduled = store.getSynchronizationBatch();
    expect(scheduled.forUpdate.length).toEqual(0);


    // When modified, a model must be scheduled for update
    model.bar += 'x';
    scheduled = store.getSynchronizationBatch();
    expect(scheduled.forUpdate).toContain(model);

    // Executing a rollback on a persisted model removes its schedule for
    // update
    model.modelAspect.data.rollback();
    scheduled = store.getSynchronizationBatch();
    expect(scheduled.forUpdate.length).toEqual(0);

    // Modifying a non persisted model must not cause anything, since it must
    // remain scheduled for insertion
    added[0].bar = 'x';
    expect(scheduled.forInsertion).toContain(added[0]);
    expect(scheduled.forUpdate.indexOf(added[0])).toEqual(-1);
    
    // Setting the id of a model makes it a persisted dirty record, so it must
    // be among those scheduled for update
    added[0].id = 2;
    scheduled = store.getSynchronizationBatch();
    expect(scheduled.forUpdate).toContain(added[0]);
    expect(scheduled.forInsertion.indexOf(added[0])).toEqual(-1);

    // Deleting a persisted model causes it to be scheduled for deletion, and
    // it should no longer be in the store
    store.delete(model);
    scheduled = store.getSynchronizationBatch();
    expect(scheduled.forDeletion).toContain(model);
    expect(scheduled.forUpdate.indexOf(model)).toEqual(-1);
    
    // Deleting a non persisted model simply removes it from the store, and
    // it doesn't get scheduled for deletion
    store.delete(added[1]);
    scheduled = store.getSynchronizationBatch();
    expect(scheduled.forDeletion.indexOf(added[1])).toEqual(-1);
    expect(scheduled.forInsertion.indexOf(added[1])).toEqual(-1);

  });

  it('inserts models in the backend via the configured adapter', (done) => {

    let store = new Store<FooModel>({
      modelClass: FooModel,
      adapter: new MemoryAdapter({modelClass: FooModel})
    });

    let model = store.add({bar: 'baz'})[0];


    store.synchronize().then((result:BatchOperationResult) => {
      expect(result.create.data.length).toEqual(1);
      expect(model.id).toBeTruthy();

      let scheduledForInsertion = store.getSynchronizationBatch().forInsertion;
      expect(scheduledForInsertion.length).toEqual(0);
      done();
    });
  });

  it('updates models in the backend via the configured adapter', (done) => {

    let store = new Store<FooModel>({
      modelClass: FooModel,
      adapter: new MemoryAdapter({modelClass: FooModel})
    });

    let model = store.add([{id: 1, bar: 'baz'}])[0];
    model.bar += 'x';

    store.synchronize().then((e:BatchOperationResult) => {
      expect(e.update.data.length).toEqual(1);
      expect(model.modelAspect.isDirty()).toBeFalsy();

      let scheduled = store.getSynchronizationBatch();
      expect(scheduled.forUpdate.length).toEqual(0);
      done();
    });
  });
});
