export interface Reader {
    read(data: any): ReadResult;
}
export interface ReadResult {
    data: any[];
    total: number;
    page: number;
    limit: number;
    offset: number;
}
