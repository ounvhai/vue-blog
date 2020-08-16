export interface User{
    ID:number,
    Name:string,
    // 联系方式
    Contact?:string,
    // 个人网站
    Website?:string,
    // 助力值
    Assistant:number,
    //头像
    Portrait:string,
}

export interface AssistantVM{
    ID:number,
    Name:string,
    Portrait:string,
    Count:number,   
}