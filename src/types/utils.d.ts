export interface ValidInfo{
    value:any,
    validator:(value:any)=>Promise<any>,
    attr:string,
}