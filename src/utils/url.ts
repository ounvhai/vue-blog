/* 
    用户
*/
// 初始化助力值
const VIEWER_PATH:string="Viewer/";
export const INIT_ASSISTANT:string=VIEWER_PATH+"GetAssistantList";
// 添加助力值
export const ADD_ASSISTANT:string=VIEWER_PATH+"AddAssistant";
// 获取用户信息
export const FETCH_USER:string=VIEWER_PATH+"GetIdentity";
//更新用户信息
export const UPDATE_USER:string=VIEWER_PATH+"UpdateViewer";



// 评论的控制器总路径
const COMMENTS_PATH:string="Comments/";
// 添加评论
export const UPLOAD_COMMENT:string=COMMENTS_PATH+"UploadComment";
// 获取评论列表
export const GET_COMMENTS:string=COMMENTS_PATH+"GetComments";

// 文章控制器
const ARTICEL_PATH:string="Articel/";
//获得文章信息
export const GET_ARTICEL_INFO:string=ARTICEL_PATH+'GetArticelInfo';
//获取某一页的几篇文章
export const GET_ARTICEL_PAGE:string=ARTICEL_PATH+'GetPage';

//点赞控制器
const OPINION_PATH="Opinion/";

//对点赞状态取反
export const TOGGLE:string=OPINION_PATH+"Toggle";

//tag标签控制器
const TAG_PATH:string="Tag/";
export const GET_ALL_TAG=TAG_PATH;




