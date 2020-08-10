import { OpinionState } from "@/utils/varia";

export interface ArticelVM{
    ContentID:number,
    ArticelID:number,
    Title:string,
    Text:string,
    Time:Date,
    GratfulCount:number,
    CommentCount:number,
    TagID:number,
    TagName:string,
    UserOpinion:OpinionState
}
 
export interface NaviInfo{
    Title:string,
    ArticelID:number,
    ContentID:number,
}