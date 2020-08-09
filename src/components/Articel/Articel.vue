<template>
    <div class="articel">
        <atc @flip-over='handleFlipOver'  :pages='pages' :articel='articel'>
            <template>
                插槽
            </template>
        </atc>
        <cmts :contentID='contentID'></cmts>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Prop, Watch ,Mixins} from 'vue-property-decorator'; 
//组件
import  ArticelDisplay from './ArticelDisplay.vue';
import Comments from '@views/Comments.vue';
//类型
import {ArticelVM as VM ,NaviInfo as Page, User} from '../../types/index';
//请求路径
import {GET_ARTICEL_INFO } from '../../utils/url';
import { AxiosInstance } from 'axios';
import { Route } from 'vue-router';
//mixins
import UserTrace from '@mixins/UserTrace.vue';
//方法
import {hasCookie } from '../../utils/utils';
//常量
import {USER_ID_COOKIE_NAME, UNSET_NUMBER}  from '../../utils/utils'  


interface Info{
    Articel:VM,
    Pages:Page[],
}
@Component({
    components:{
        atc:ArticelDisplay,
        cmts:Comments,
    }
})
export default class Articel extends Mixins(UserTrace){
    @Prop({required:true}) articelID!:number;
    @Prop({required:true}) contentID!:number;
    articel:VM={} as VM;
    // 页码
    pages:Page[]=[];  

    isInited:boolean=false;

    //继承UserTrace，不绑定用户更新后调用的钩子
    isWatchUserUpdated:boolean=false;
    created(){
        // 请求新信息  
        //只要有cookie就可以请求数据
        //但是可能会执行下面的 onUserInited 钩子时候再请求一次
        // 所以加个isInited 减少无用请求
        if(hasCookie(USER_ID_COOKIE_NAME)){
            this.updateInfo()
            this.isInited=true;
        }
    }
    //继承UserTrace的方法，第一次更新User后调用
    onUserInited(latestUser:User):void{
        if(this.isInited===false){
            this.updateInfo();
            this.isInited=true;
        }
    }
    @Watch('$route')
    handleRouteChange(newRoute:Route,oldRoute:Route){
        //请求更新信息？？？会更新吗
        console.log('路由更新');
    }
    // 更新页面显示内容
    updateInfo():void{
        this.requestUpdateInfo()
            .then(({data})=>{
                let info:Info=data.Data;
                this.articel=info.Articel;
                this.pages=info.Pages;
            })
    }
    handleFlipOver(page:Page):void{
        console.log('跳转到下一个页面的文章。看一下通过？query传参，路由参数传参，得到参数是：',page);
        // this.$router.push({name:''})
    }
    //发起更新信息的请求
    requestUpdateInfo():Promise<any>{
        return (this.$axios as AxiosInstance)({
            method:'get',
            url:GET_ARTICEL_INFO,
            params:{
                articelID:this.articelID,
            }
        })
    }

    
}
</script>