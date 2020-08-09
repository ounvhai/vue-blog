import {Vue} from 'vue-property-decorator';

let bus:Vue;


// 事件总线单例
export function getEventBus(){
    if(!bus) bus=new Vue();
    return bus;
}



