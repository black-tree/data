import {declareModel} from "../../../src/model/model";

describe('defineModel', () => {

  it('throws error when re-declaring a class as a model', () => {

    function Foo(){}

    declareModel(Foo, {fields: []});
    expect(() => {declareModel(Foo, {fields: []})}).toThrow();
    
  });
  
  it('configures creation of model data for model instances', () => {
    
    let fields = [
      {name: 'name', type: 'string'},
      {name: 'email', type: 'string'}
    ];
    
    function Person() {}
    
    declareModel(Person, {fields: fields});

    let person = new Person();

    expect(person.modelAspect).toBeDefined();
  });
});
