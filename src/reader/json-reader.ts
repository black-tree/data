import {Reader, ReadResult} from "./reader";

export class JsonReader implements Reader{
  
  dataPath:string = '.';
  
  totalPath:string = null;
  
  pagePath:string = null;
  
  limitPath:string = null;
  
  offsetPath:string = null;
  
  constructor(config = {}) {
    Object.assign(this, config);
  }
  
  read(data:any):ReadResult {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    return {
      data: this.extract(data, this.dataPath, []),
      total: this.extract(data, this.totalPath, null),
      page: this.extract(data, this.pagePath, null),
      limit: this.extract(data, this.limitPath, null),
      offset: this.extract(data, this.offsetPath, null)
    }
  }
  
  extract(data:any, path:string, defaultValue = null):any {
    if (!path) {
      return defaultValue;
    }
    if (path === '.') {
      return data;
    }
    let parts = path.split('.');
    let value = data;
    while(parts.length) {
      value = value[parts.shift()];
      if (!value) {
        return defaultValue;
      }
    }
    return value;
  }
}
