import {JsonReader} from "../../../src/reader/json-reader";

describe('JsonReader', () => {

  it('handles string and object inputs', () => {

    let reader = new JsonReader();
    let data = JSON.stringify([{id: 1}, {id: 2}]);

    expect(reader.read(data).data.length).toEqual(2);

    data = JSON.parse(data);
    expect(reader.read(data).data.length).toEqual(2);
  });

  it('reads data from specified path', () => {

    let reader = new JsonReader();
    let result = reader.read([{}]);

    expect(result.data.length).toEqual(1);

    reader.dataPath = 'data';
    expect(reader.read({data: [{}]}).data.length).toEqual(1);

    reader.dataPath = 'result.data';
    expect(reader.read({result: {data: [{}]}}).data.length).toEqual(1);
  });
});
