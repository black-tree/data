import {DefaultFieldConfigurator} from "../../../src/model/field-configurator";
import {Field} from "../../../src/field/field";
import {FieldTypes} from "../../../src/field/field-type";

describe('defaultConfigurator', () => {

  var sut:DefaultFieldConfigurator;
  var Foo:Function;
  var data:any;
  beforeAll(() => {
    sut = new DefaultFieldConfigurator();
    Foo = function Foo(){};

    sut.configureFields(Foo.prototype, [new Field('name', FieldTypes.string)]);
    data = {
      name: null,
      getValue: function(propertyName) {
        return this[propertyName];
      },
      setValue: function(propertyName, value) {
        this[propertyName] = value;
      }
    };

    Object.defineProperty(Foo.prototype, 'modelAspect', <PropertyDescriptor>{
      get: function() {return {data: data}}
    });
  });

  
  it('forwards property access and value assignment to model data', () => {
    data.name = 'Bar';

    let foo = new Foo();
    expect(foo.name).toEqual('Bar');

    foo.name = 'Baz';
    expect(data.name).toEqual('Baz');
  });
});
