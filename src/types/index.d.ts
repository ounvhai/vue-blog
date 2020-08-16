export * from './user';
export * from './comment';
export * from './articel';
export * from './tags';
export * from './utils';

export enum Result{
    //请求成功
    Success=1,
    //请求失败
    Fail=0,
    //未定义
    Undefined=-1,
}

export interface ServerRespond{
    Data:any,
    IsErr:boolean,
    Outcome:Result,
}
