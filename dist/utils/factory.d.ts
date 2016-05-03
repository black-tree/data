export declare class Factory {
    protected registry: {
        [s: string]: Function;
    };
    protected typeProperty: string;
    protected defaultType: any;
    create(config: any): any;
    register(typeName: string, Class: {
        new (config?: any);
    }): void;
    registerInstantiator(typeName: string, factory: Function): void;
    protected createDefaultInstantiator(Class: {
        new (config?: any);
    }): Function;
}
