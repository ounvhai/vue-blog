<template>
    <div class="overview form-inline">
        <div class='form-group'>
            <label class=''>你好</label>
            <input 
                class="form-control"
                type="text"
                :value="name" 
                @input="handleInputName"
                @change="handleChangeName"
                placeholder="热心网友">
        </div>
            <request-watcher :request='request'>
                <template #loading>
                    ajax
                </template>
                <template #done>
                    done
                </template>
                <template #fail>
                    fail
                </template>
            </request-watcher>
    </div>
</template>
<style lang="scss">
    .overview{
        .sayhi{
            span{
                flex:0 0 auto;
                width: auto;;
            }
            input {

            }
        }
    }
</style>
<script lang='ts'>
import {Vue ,Component } from 'vue-property-decorator';
import {mixins} from 'vue-class-component'
// 组件
import UserTrace from '@mixins/UserTrace.vue';
import RequestWatcher from '../RequestWatcher.vue';
// 类型
import { User ,ServerRespond} from '../../types';
import { AxiosInstance } from 'axios';
// 路径
import {UPDATE_USER} from '../../utils/url.ts';
@Component({
    components:{
        RequestWatcher,
    }
})
export default class Overview extends mixins(UserTrace){ 
    //上一次提交的名字
    submitedName:string='';
    // 用户名
    name:string='';
    // 需要被监听状态的请求
    request:Promise<any>|null=null;
    //是否正在请求中
    isLoading:boolean=false;
    //继承 UserTrace ，不绑定初始化钩子
    isWatchUserInited:boolean=false;
    // 继承UserTrace的方法。
    onUserUpdate(latestUser:User):void{
        this.name=latestUser.Name;
    }
    // 打字过程中触发事件
    handleInputName(e:Event):void{
        if(this.isLoading===true) return ;
        let txt:string=e.target.value;
        this.name=txt;
    }
    // 点击文字框以外的区域触发
    async handleChangeName(e:Event):Promise<any>{
        // 要提交的名字==刚刚提交过的名字，或正请求提交中。就无视
        if(this.name===this.submitedName||this.isLoading) return ;
        this.isLoading=true;
        this.request=this.requestAlterName().then(({data})=>{
            let newUsername:User=(data as ServerRespond).Data;
            //记录提交过的名字
            this.submitedName=newUsername.Name;
            //提交全局更新
            let latest:User=<User>{Name:newUsername.Name};
            this.$mergeUser(latest);
        })
        await this.request;
        this.isLoading=false;
    }
    // 发起请求修改用户名 
    requestAlterName():Promise<any>{
        var newName:User=<User>{Name:this.name};
        return  (this.$axios as AxiosInstance)({
            url:UPDATE_USER,
            method:"POST",
            data:newName,
        })
    }
}
</script>