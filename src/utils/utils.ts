// 未设置的用户ID
export const UNSET_NUMBER=-1;
// export const UNSET_VIEWER_ID=-1;

export const UNSER_VIEREW_NAME="热心网友";

export const USER_ID_COOKIE_NAME="UserID";
// 获取页面可视高度
export function innerHeight():number{
    // ie8和其以下不兼容innerxx,最好使用innerXX，不然使用clientHeight算上滚动条
    return window.innerHeight||document.documentElement.clientWidth;
}
// 页面可视宽度
export function innerWidth():number{
    return window.innerWidth||document.documentElement.clientWidth;
}
// 是手机吗
export function isThePortable():boolean{
    // 768是bootstrap网格中md开始的值
    return innerWidth()<768;
}
// 事件往上传播一直到根节点  
export function dispatch(eventName:string,from:Vue,...args:any[]):void{
    // Function
    let fn:(...arg:any[])=>void=from[eventName];
    // 父节点
    let parentNode:Vue|undefined=from.$parent;
    //执行回调
    fn&&fn.apply(from,args);
    // 网上找节点
    if(parentNode) dispatch(eventName,parentNode,...args);
}
// 有没有这个cookie
export  function hasCookie(name:string):boolean{
    let ex:RegExp=new RegExp(`${name}=\\S+;*?`);
    let str=document.cookie;
    return !!(str.match(ex));
}

// 滚到指定高度
export function scrollToTop():void{ 
}
