export class Factory {
  
  protected registry:{[s:string]: Function} = {};
  
  protected typeProperty = 'type';
  
  protected defaultType;
  
  create(config:any):any {
    let type = config[this.typeProperty] || this.defaultType;
    if (!type) {
      throw new Error(
        `Config options must define a ${this.typeProperty} property`);
    }
    let instantiator = this.registry[type];
    if (!instantiator) {
      throw new 
        Error(`The value "${type}" is not a known ${this.typeProperty}`);
    }
    return instantiator(config);
  }
  
  register(typeName:string, Class:{new (config?:any)}) {
    this.registerInstantiator(typeName, this.createDefaultInstantiator(Class));
  }
  
  registerInstantiator(typeName:string, factory:Function) {
    this.registry[typeName] = factory;
  }
  
  protected createDefaultInstantiator(Class:{new (config?:any)}):Function {
    return (config:any) => {
      return new Class(config);
    };
  }
}

