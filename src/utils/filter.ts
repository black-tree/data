export interface Filter {

  matches(item:any):boolean;

  toCallback():(item:any) => boolean;
}

export abstract class AbstractFilter {

  matches(item:any):boolean {
    throw new Error('Method must be implemented by derived classes');
  }

  toCallback():(item:any) => boolean {
    return (item) => this.matches(item);
  }
}

export class CallbackFilter extends AbstractFilter implements Filter{

  constructor(matches:(item:any)=>boolean) {
    super();
    this.matches = matches;
  }
  
}

export class FilterChain extends AbstractFilter implements Filter{
  
  filters:Filter[];
  
  constructor(filters:Filter[] = []) {
    super();
    this.filters = filters.slice(0);
  }
  
  matches(subject:any):boolean {
    if (this.filters.length === 0) {
      return true;
    }
    for (let filter of this.filters) {
      if (!filter.matches(subject)) {
        return false;
      }
    }
    return true;
  }
  
  addFilter(filter:Filter) {
    this.filters.push(filter);
  }
  
  removeFilter(filter:Filter) {
    let i = this.filters.indexOf(filter);
    if (i > -1) {
      this.filters.splice(i, 1);
      return true;
    }
    return false;
  }
  
  getFilters():Filter[] {
    return this.filters.slice(0);
  }
}

export class PropertyMatchFilter extends AbstractFilter implements Filter{

  private matchSpecs:PropertyMatchSpecification[];
  
  private filter:FilterChain;

  constructor(matchSpecs:PropertyMatchSpecification[]) {
    super();
    this.matchSpecs = [];
    for (let criterion of matchSpecs) {
      this.matchSpecs.push(Object.assign({operator: '='}, criterion));
    }

    this.configure();
  }

  matches(subject:any):boolean {
    return this.filter.matches(subject);
  }
  
  getMatchSpecifications():PropertyMatchSpecification[] {
    return this.matchSpecs;
  }

  private configure() {
    let matcherChain = [];
    for (let spec of this.matchSpecs) {
      matcherChain.push(new PropertyMatcher(spec));
    }
    
    this.filter = new FilterChain(matcherChain);
  }
}

export class PropertyMatcher extends AbstractFilter implements Filter{
  
  constructor(spec:PropertyMatchSpecification) {
    super();
    let matches;
    let value = spec.value;
    let prop = spec.property;
    switch (spec.operator || '=') {
      case '>'  : matches = (x) => x[prop] > value;
        break;
      case '<'  : matches = (x) => x[prop] < value;
        break;
      case '>=' : matches = (x) => x[prop] >= value;
        break;
      case '<=' : matches = (x) => x[prop] <= value;
        break;
      case '!=' : matches = (x) => x[prop] != value;
        break;
      case '='  :
      default   : matches = (x) => x[prop] == value;
    }
    this.matches = matches;
  }
}

export interface PropertyMatchSpecification {

  property:string;

  operator?:string;

  value:any;

}
