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
export function scrollToTop(el:HTMLElement,toY:number):void{
    var curScrollHeight:number=el.scrollTop;
    scroll()
    function scroll():void{
        // 跳出
        if(Math.abs(toY-curScrollHeight)<=1||toY<0) return ;
        let curTo=(curScrollHeight-toY)/1.1;
        el.scrollTo(0,curTo);
        curScrollHeight=curTo;
        window.requestAnimationFrame(()=>{
            scroll();
        });
    }
}
//节流
export function throttle2(fn:Function,delay:number=300):(...args:any[])=>void{
    let timer=-1;
    return function(...args:any[]){
        clearTimeout(timer);
        timer=setTimeout(function(){//执行的话一直往后推。不触发了才执行。
            let context=this;
            fn.apply(context,args);
        },delay);
    }
}
//节流
export function throttle(fn:Function,delay:number=150):Function{
    //上次执行时间
    let lastTime:Date=new Date();
    return function(...arg:any[]){
        //已经超过延迟时间
        let curTime=new Date;
        if(+curTime>+lastTime+delay){
            let context=this;//这样就可以通过返回函数指定fn的this
            fn.apply(context,arg);
            lastTime=curTime;
        }
    }
}
