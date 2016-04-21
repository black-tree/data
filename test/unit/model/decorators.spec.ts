import {Model, Field} from "../../../src/model/decorators";

describe('Model', () => {

  it('declares a model for the decorated (target) class', () => {

    @Model()
    class FooModel {

    }

    expect(FooModel.prototype._modelMetadata_).toBeDefined();
  });
  
});

describe('Field', () => {

  it('defines the field for the decorated property', () => {

    @Model()
    class Person {

      @Field()
      firstName:string;
      
      @Field()
      lastName:string;
      
      @Field({type: 'number'})
      age:number;
    }

    let fields = Person.prototype._modelMetadata_.getFields();
    expect(fields.length).toEqual(3);

    let names = [];
    fields.forEach(field => names.push(field.getName()));

    expect(names).toContain('firstName');
    expect(names).toContain('lastName');
    expect(names).toContain('age');
  });
});
