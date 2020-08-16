export interface ValidInfo{
    value:any,
    validator:(value:any)=>boolean,
    attr:string,
}