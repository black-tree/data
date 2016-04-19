import {MemoryAdapter} from "../../../src/adapter/memory-adapter";
import {declareModel} from "../../../src/model/model";
import {OperationResult} from "../../../src/adapter/adapter";

describe('MemoryAdapter', () => {
  
  class FooModel {
    
    id:number;
    
    bar:string;
  }
  
  beforeAll(() => {
    declareModel(FooModel, {
      fields: [{name: 'bar', type: 'string'}]
    });
  });
  
  it('inserts records', (done) => {
    
    let adapter = new MemoryAdapter({modelClass: FooModel});
    let model = new FooModel();
    model.bar = 'baz';

    let createPromise = adapter.create([model]);
    expect(Promise.prototype.isPrototypeOf(createPromise)).toBeTruthy();
    createPromise.then((result:OperationResult) => {
      expect(result.success).toBeTruthy();
      expect(result.type).toEqual('create');
      expect(result.data[0].id).toEqual(1);

      done();
    });
  });
  
  
});
