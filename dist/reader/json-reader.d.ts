import { Reader, ReadResult } from "./reader";
export declare class JsonReader implements Reader {
    dataPath: string;
    totalPath: string;
    pagePath: string;
    limitPath: string;
    offsetPath: string;
    constructor(config?: {});
    read(data: any): ReadResult;
    extract(data: any, path: string, defaultValue?: any): any;
}
