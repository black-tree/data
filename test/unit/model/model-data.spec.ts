import {DataValue, ModelData} from "../../../src/model/model-data";

describe('DataValue', () => {

  it('initializes properly', () => {
    let value = new DataValue('foo', 'bar');
    
    expect(value.getName()).toEqual('foo');
    expect(value.getValue()).toEqual('bar');
    expect(value.getOldValue()).toBeUndefined();
    expect(value.isDirty()).toBeFalsy();
    expect(value.getCommittedValue()).toEqual('bar');
  });
  
  it('saves old value', () => {
    let value = new DataValue('foo', 'bar');
    
    value.setValue('baz');
    expect(value.getOldValue()).toEqual('bar');
  });
  
  it('commits and rollbacks values', () => {
    let value = new DataValue('foo');
    value.setValue('bar');
    expect(value.isDirty()).toBeTruthy();
    value.commit();
    expect(value.getCommittedValue()).toEqual('bar');
    expect(value.isDirty()).toBeFalsy();

    value.setValue('baz');
    expect(value.isDirty()).toBeTruthy();
    value.rollback();
    expect(value.getValue()).toEqual('bar');
    expect(value.isDirty()).toBeFalsy();
  });

  it('uses value changed handler to detect if the value was actually changed', () => {
    let value = new DataValue('foo', 'bar');

    expect(value.setValue('bar')).toBeFalsy();
    expect(value.setValue('baz')).toBeTruthy();

    //Pass a handler that always reports values as different
    value.setValuesDifferHandler((v1, v2) => true);
    expect(value.setValue('baz')).toBeTruthy();
  });
});

describe('ModelData', () => {

  it('initializes properly', () => {
    let data = new ModelData({}, {foo: 'bar'});

    expect(data.getValue('foo')).toEqual('bar');
    expect(data.isDirty()).toBeFalsy();
  });

  it('sets data values', () => {
    let data = new ModelData({});

    data.setValues({'foo': 'bar'});
    expect(data.getValue('foo')).toEqual('bar');

    data.setValue('foo', 'baz');
    expect(data.getValue('foo')).toEqual('baz');

  });

  it('keeps track of value changes', () => {
    let data = new ModelData({}, {foo: 'bar'});

    data.setValue('foo', 'baz');
    expect(data.isDirty()).toBeTruthy();
    expect(data.hasDirtyValue('foo')).toBeTruthy();

    let changes = data.getChanges();
    expect(changes.length).toBeGreaterThan(0);
    expect(changes[0].propertyName).toEqual('foo');
    expect(changes[0].newValue).toEqual('baz');
    expect(changes[0].oldValue).toEqual('bar');

    //Revert to foo's original value
    data.setValue('foo', 'bar');
    expect(data.isDirty()).toBeFalsy();
    expect(data.hasDirtyValue('foo')).toBeFalsy();
    expect(data.getChanges().length).toEqual(0);

    data.setValue('foo', 'baz');
    data.rollback();
    expect(data.isDirty()).toBeFalsy();


    data.setValue('foo', 'baz');
    data.commit();
    expect(data.isDirty()).toBeFalsy();
  });

});
