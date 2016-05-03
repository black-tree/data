import {PrototypeInjectionInstantiator, ConstructorCallInstantiator} from "../../../src/utils/instantiator";

describe(PrototypeInjectionInstantiator.name, () => {
  
  it('creates an instance of the indicated class', () => {

    class Foo {

    }

    let instantiator = new PrototypeInjectionInstantiator();
    let foo = instantiator.instantiate<Foo>(Foo);

    expect(foo instanceof Foo).toBeTruthy();

  });
});

describe(ConstructorCallInstantiator.name, () => {

  it('creates an instance of the indicated class', () => {

    class Foo {

    }

    let instantiator = new ConstructorCallInstantiator();
    let foo = instantiator.instantiate<Foo>(Foo);

    expect(foo instanceof Foo).toBeTruthy();

  });
});
