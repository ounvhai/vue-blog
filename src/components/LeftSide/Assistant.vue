<template>
    <div class="assistants position-relative">
        <h6>
            <span>助力榜：</span>
            <span>当前助力值：{{user.Assistant}}</span>
        </h6>
        <ul class="items list-unstyled d-flex justify-content-around">
            <li  v-for="(assistant,index) in assistants" :key="index">
                <avatar class="w-100" :name='assistant.Name'  :portrait='assistant.Portrait'/>
            </li>
        </ul>
        <button @click="handleClickAssistBtn" class="add-assistant-btn btn btn-outline-dark btn-sm position-relative">
            助力
        </button> 
        <br/>
        <request-watcher class="d-block w-100 text-center mt-2" :request='request'>
            <template #loading>
                助力中...
            </template>
            <template #done>
                多谢！
            </template>
            <template #err>
                ...出了点小问题
            </template>

        </request-watcher>
    </div>
</template>
<style lang="scss">
    .assistants{
        .items{
            li{
                flex: 0 0 auto;
                width: 12%;
            }
        }
        .add-assistant-btn{
            left:50%;
            transform:translateX(-50%);
        }
    }
</style>
<script lang='ts'>
import {Vue ,Component } from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
// 类型
import {User,ServerRespond } from '../../types/index';
//mixin
import userTrace from '../../mixins/UserTrace.vue'
// 组件
import Avatar from '@com/Avatar.vue';
import RequestWatcher from '@com/RequestWatcher.vue';
// a路径
import {INIT_ASSISTANT,ADD_ASSISTANT} from '../../utils/url';
import { AxiosInstance } from 'axios';

// 助力值列表的个数
const LENGTH_OF_ASSISTANTS=3;

@Component({
    components:{
        Avatar,
        RequestWatcher,
    }
})
export default class Assistant extends mixins(userTrace){
    assistants:User[]=[];
    // 当前用户信息,
    //空对象是初始值占着这个坑
    user:User=<User>{};
    // 是否在请求数据
    isRequesting:boolean=true;
    // 请求中的Promise
    request:Promise<any>|null=null;
    // 继承自userTrace 的字段，指示是否绑定用户信息初始化的钩子
    isWatchUserInited:boolean=false;
    // 继承来的方法，监听用户信息更新
    onUserUpdate(latestUser:User):void{
        //更新用户自己的信息
        this.user=latestUser;
        // console.log("接受到新用户信息，",latestUser);
        //更新助力值列表
            //原本助力值列表就有用户ID的话,直接修改列表内的助力值
            // 不然就加入用户的信息,重新排序,截取前三
        let isOverride:boolean=new Set([...this.assistants.map(instance=>instance.ID),latestUser.ID]).size==this.assistants.length;
        if(isOverride){//有重复的值，直接修改助力榜内自己的助力值
            let newList:User[]=[...this.assistants].map(user=>{
                //是自己信息的Assistant更新一下最新值
                if(user.ID===latestUser.ID){
                    let latestAssistant:User= Object.assign(user,
                    {
                        Assistant:latestUser.Assistant,
                        Name:latestUser.Name,
                        Portrait:latestUser.Portrait
                    } as User);
                    return Object.assign({},latestAssistant);
                }
                //不是自己信息的Assistant直接返回
                return user;
            });
            this.assistants=newList;
        }else{
            let user:User={ID:latestUser.ID,Name:latestUser.Name,Assistant:latestUser.Assistant,Portrait:latestUser.Portrait};
            let newList:User[]=[...this.assistants,user].filter(user=>user.Assistant>0).sort((a,b)=>(b as User).Assistant-(a as User).Assistant).slice(0,LENGTH_OF_ASSISTANTS);
            this.assistants=newList;
        }
    }
    created(){
        this.isRequesting=true;
        // 初始化助力值列表
        var axios:AxiosInstance=this.$axios;
        axios({
            url:INIT_ASSISTANT,
        }).then(({data})=>{
            this.assistants=(data as ServerRespond).Data;
            this.isRequesting=false;
        })
    }
    // 添加助力值
    async handleClickAssistBtn():Promise<any>{
        if(this.isRequesting) return ;
        this.isRequesting=true;
        this.request=this.requestAddAssistant();
        await this.request;
        this.isRequesting=false;
    }
    // 请求添加助力值
    requestAddAssistant():Promise<any>{
        var http:AxiosInstance=this.$axios;
         return http({
            url:ADD_ASSISTANT,
        }).then(({data})=>{
            //最新的助力值
            let latestAssistant=(data as ServerRespond).Data;
            //最新助力值更新到用户上
            var newUser:User=<User>{Assistant:latestAssistant};
            this.$mergeUser(newUser);
        });
    }
}
</script>