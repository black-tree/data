export interface Filter {
    matches(item: any): boolean;
    toCallback(): (item: any) => boolean;
}
export declare abstract class AbstractFilter {
    matches(item: any): boolean;
    toCallback(): (item: any) => boolean;
}
export declare class CallbackFilter extends AbstractFilter implements Filter {
    constructor(matches: (item: any) => boolean);
}
export declare class FilterChain extends AbstractFilter implements Filter {
    filters: Filter[];
    constructor(filters?: Filter[]);
    matches(subject: any): boolean;
    addFilter(filter: Filter): void;
    removeFilter(filter: Filter): boolean;
    getFilters(): Filter[];
}
export declare class PropertyMatchFilter extends AbstractFilter implements Filter {
    private matchSpecs;
    private filter;
    constructor(matchSpecs: PropertyMatchSpecification[]);
    matches(subject: any): boolean;
    getMatchSpecifications(): PropertyMatchSpecification[];
    private configure();
}
export declare class PropertyMatcher extends AbstractFilter implements Filter {
    constructor(spec: PropertyMatchSpecification);
}
export interface PropertyMatchSpecification {
    property: string;
    operator?: string;
    value: any;
}
