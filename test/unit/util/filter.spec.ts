import {CallbackFilter, PropertyMatcher, PropertyMatchFilter, FilterChain} from "../../../src/utils/filter";

describe(CallbackFilter.name, () => {

  it('matches items using the specified callback function', () => {

    let filter = new CallbackFilter((item) => item.value === 'bar');

    expect(filter.matches({value: 'bar'})).toBeTruthy();
    expect(filter.matches({value: 'foo'})).toBeFalsy();
  });
});

describe(PropertyMatcher.name, () => {
  
  it('matches objects properly', () => {
    let matcher = new PropertyMatcher({
      property: 'name',
      value: 'Foo'
    });

    let matchable:any = {name: 'Foo'};
    let nonMatchable = {name: 'Bar'};

    expect(matcher.matches(matchable)).toBeTruthy();
    expect(matcher.matches(nonMatchable)).toBeFalsy();

    matcher = new PropertyMatcher({
      property: 'value',
      operator: '<=',
      value: 4
    });

    expect(matcher.matches({value: 3})).toBeTruthy();
    expect(matcher.matches({value: 4})).toBeTruthy();
    expect(matcher.matches({value: 5})).toBeFalsy();

  });
});

describe(PropertyMatchFilter.name, () => {

  it('matches objects properly', () => {
    let filter = new PropertyMatchFilter([{
      property: 'name',
      value: 'Foo'
    }]);

    expect(filter.matches({name: 'Foo'})).toBeTruthy();
    expect(filter.matches({name: 'Bar'})).toBeFalsy();
  });

  it('returns property match specs', () => {
    let filter = new PropertyMatchFilter([{
      property: 'name',
      value: 'Foo'
    }]);

    let matchSpecs = filter.getMatchSpecifications();
    expect(matchSpecs[0].property).toEqual('name');
    expect(matchSpecs[0].value).toEqual('Foo');
  });
});

describe(FilterChain.name, () => {

  it('applies contained filters', () => {

    let filterChain = new FilterChain([
      new CallbackFilter(item => item.foo === 'x'),
      new CallbackFilter(item => item.bar === 'y')
    ]);

    expect(filterChain.matches({foo: 'x', bar: 'y'})).toBeTruthy();
    expect(filterChain.matches({foo: 'a', bar: 'y'})).toBeFalsy();
    expect(filterChain.matches({foo: 'x', bar: 'b'})).toBeFalsy();
  });

  it('can add a filter', () => {

    let filterChain = new FilterChain();

    filterChain.addFilter(new CallbackFilter(item => item.foo === 'x'));
    expect(filterChain.matches({foo: 'x'})).toBeTruthy();
    expect(filterChain.matches({foo: 'a'})).toBeFalsy();
  });

  it('can remove a filter', () => {

    var filter = new CallbackFilter(item => item.foo === 'x');
    let filterChain = new FilterChain([
      filter
    ]);

    filterChain.removeFilter(filter);
    expect(filterChain.matches({foo: 'a'})).toBeTruthy();
  });
});
