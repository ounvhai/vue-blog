// 类型
import {User } from '../../types/index';

// 事件总线
import {getEventBus} from '../eventBus';
import { update ,} from './userStore'; 
//导出用户信息
export { latestUser} from './userStore';

//用户信息初始化啦？
let isInited:boolean=false;

// 更新用户信息后触发的钩子名
const HANDLE_UPDATE_USER_EVENT:string="global-user-info-updated";
// 初始化用户数据后触发的事件的钩子名
const HANDLE_INITED_USER_EVENT:string="global-user-info-inited";


// 注册监听（以传递最新的用户）-用户信息更新后触发/
export function registUpdatedHandler(handler:(latestUser:User)=>void):void{
    getEventBus().$on(HANDLE_UPDATE_USER_EVENT,handler);
}
// 注册监听以传递最新用户信息。用户信息第一次更新后触发，绑定的回调只执行一次
export function registInitedHandler(handler:(latestUser:User)=>void):void{
    getEventBus().$once(HANDLE_INITED_USER_EVENT,handler);
}
//更新用户信息，并给钩子分发最新信息
// 如果需要初始化，则用户数据更时，调用用户初始化钩子，不然执行用户更新钩子
export function updateUser(user:User):void{
    let latest:User= update(user);
    // 更新时状态标记为未初始化，则执行初始化钩子，标记已初始化状态
    if(isInited===false){
        getEventBus().$emit(HANDLE_INITED_USER_EVENT,latest);
        isInited=true;
    } 
    // 执行更新钩子
    getEventBus().$emit(HANDLE_UPDATE_USER_EVENT,latest);
}
