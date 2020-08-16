<template>
    <div class="assistants position-relative">
        <h6>
            <span>助力~</span>
            <small class="text-muted">当前：{{user.Assistant}}</small>
        </h6>
        <ul class="items list-unstyled d-flex justify-content-around">
            <li  v-for="assis in assistants" :key="assis.ID" class="position-relative">
                <avatar class="w-100" :name='assis.Name'  :portrait='assis.Portrait'/>
                <span class="assistant-count position-absolute text-danger">+{{assis.Count}}</span>
            </li>
        </ul>
        <button @click="handleClickAssistBtn" class="add-assistant-btn mb-1 btn btn-outline-dark btn-sm position-relative">
            助力
        </button> 
        <request-watcher class="position-absolute w-100 text-center" :request='request'>
            <template #loading>
                <small>助力中...</small>
            </template>
            <template #done>
                <small>多谢！</small>
            </template>
            <template #err>
                <small>...有点小问题</small>
            </template>
        </request-watcher>
    </div>
</template>
<style lang="scss">
    .assistants{
        .items{
            margin-bottom: 0;
            li{
                flex: 0 0 auto;
                width: 12%;
                .assistant-count{
                    // avatar点赞数量再头像的右上角
                    right:0;
                    top: 0;
                    transform: translateX(50%) translateY(-50%);
                    //背景颜色为透明
                    background-color: transparent;
                }
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
import {User,ServerRespond ,AssistantVM} from '../../types/index';
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
    assistants:AssistantVM[]=[];
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
        //根据ID，查看助力值列表内是否有自己的。
        // 有自己的就光修改自己的数据
        // 没自己的就先试试把自己加上去，然后选前三
        let isOverride:boolean=new Set([...this.assistants.map(instance=>instance.ID),latestUser.ID]).size==this.assistants.length;
        if(isOverride){//有重复的值，直接修改助力列表内自己的助力值
            let newList:AssistantVM[]=[...this.assistants].map(user=>{
                //是自己信息的Assistant更新一下最新值
                if(user.ID===latestUser.ID){
                    let latestAssistant:AssistantVM= Object.assign(user,
                    {
                        Count:latestUser.Assistant,
                        Name:latestUser.Name,
                        Portrait:latestUser.Portrait
                    } as AssistantVM);
                    return Object.assign({},latestAssistant);
                }
                //不是自己信息的Assistant直接返回
                return user;
            });
            this.assistants=newList;
        }else{
            let user:AssistantVM={ID:latestUser.ID,Name:latestUser.Name,Count:latestUser.Assistant,Portrait:latestUser.Portrait};
           this.assistants=[...this.assistants,user].filter(user=>user.Count>0).sort((a:AssistantVM,b:AssistantVM)=>b.Count-a.Count).slice(0,LENGTH_OF_ASSISTANTS);
        }
    }
    created(){
        this.isRequesting=true;
        //请求助力值
        (this.$axios as AxiosInstance)({
            url:INIT_ASSISTANT,
        }).then(({data:{Data}})=>{
            this.assistants=Data;
            this.isRequesting=false;
        })
    }
    // 添加助力值
    async handleClickAssistBtn():Promise<any>{
        if(this.isRequesting) return ;
        this.isRequesting=true;
        this.request=this.handleAssistantAdded();
        await this.request;
        this.isRequesting=false;
    }
    async handleAssistantAdded():Promise<any>{
        await this.requestAddAssistant()
            .then(({data:{Data}})=>{//返回值是用户当前助力值
                // 更新全局用户信息
                this.$mergeUser(<User>{Assistant:Data})
            })
    }
    // 发起添加助力值请求
    requestAddAssistant():Promise<any>{
        return (this.$axios as AxiosInstance)({
            url:ADD_ASSISTANT,
        })
    }
}
</script>