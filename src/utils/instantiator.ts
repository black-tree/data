export interface Instantiator {

  instantiate<Class>(InstanceClass:(new() => Class)):Class;

}

export class PrototypeInjectionInstantiator implements Instantiator {
  
  instantiate<Class>(InstanceClass:(new() => Class)):Class {
    return Object.create(InstanceClass.prototype);
  }
}

export class ConstructorCallInstantiator implements Instantiator {
  
  instantiate<Class>(InstanceClass:(new()=>Class)):Class {
    return new InstanceClass();
  }
}
