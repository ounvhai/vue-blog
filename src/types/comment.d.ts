import { User } from "./user";

// 提交评论的数据格式
export interface SentComment{
    // 评论文字
    Content:string,
    // 评论在哪个content底下[非评论]
    UnderContentID:number;
    // 谁提交的这个评论
    ObserverID:number;
    // 被回复的ID
    RespondedViewerID?:number;
    // 父级评论的ID
    SuperiorCommentID?:number;
}
// 显示评论的数据格式
export interface CommentViewModel{
    // 这个评论本身的contentID
    ContentID:number;
    //此评论的CommentID
    CommentID:number;
    // 母评论的commentID
    SuperiorCommentID?:number;
    // 评论内容
    Text:string;
    //这个评论的发起用户
    ObserverID:number,
    // 这个评论的发起用户的用户名
    ObserverName:string,
    //评论者的头像
    ObsererPortrait:string,
    //被回复的用户ID
    ResponsedViewerID:number,
    //被回复的用户名
    ResposedViewerName?:string,//值可能是''
    // 发布事件
    Time:Date;//
    // 点赞人数
    Approval:number;
    // 现在看东西的人是否点赞过
    IsAppreciated:boolean;
    //评论是否被审核过
    IsInspected:boolean;
    

}
