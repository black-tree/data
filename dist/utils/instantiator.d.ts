export interface Instantiator {
    instantiate<Class>(InstanceClass: (new () => Class)): Class;
}
export declare class PrototypeInjectionInstantiator implements Instantiator {
    instantiate<Class>(InstanceClass: (new () => Class)): Class;
}
export declare class ConstructorCallInstantiator implements Instantiator {
    instantiate<Class>(InstanceClass: (new () => Class)): Class;
}
