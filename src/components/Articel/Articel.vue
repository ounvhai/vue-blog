<template>
    <div class="articel">
        <atc @toggle-opinion='handleToggleOpinion' @flip-over='handleFlipOver'  :pages='pages' :articel='articel'>
            <template>
                插槽
            </template>
        </atc>
        <cmts @on-comment-uploaded='articel.CommentCount++' :contentID='contentID'></cmts>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Prop, Watch ,Mixins} from 'vue-property-decorator'; 
//组件
import  ArticelDisplay from './ArticelDisplay.vue';
import Comments from '@views/Comments.vue';
//类型
import {ArticelVM as VM ,NaviInfo as Page, User} from '../../types/index';
import {OpinionState } from '../../utils/varia';
//请求路径
import {GET_ARTICEL_INFO ,TOGGLE as TOGGLR_OPNION} from '../../utils/url';
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
    //限制点赞，请求文章的时候不能点赞
    isLoading:boolean=false;
    //继承UserTrace，不绑定用户更新后调用的钩子
    isWatchUserUpdated:boolean=false;
    created(){
        // 请求新信息  
        //只要有cookie就可以请求数据
        //但是可能会执行下面的 onUserInited 回调时候再请求一次
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
    //文章ID改变的时候请求新数据
    @Watch('articelID')
    async handleArticelChange():Promise<any>{
        this.isLoading=true;
        await this.updateInfo();
        this.isLoading=false;
    }
    // 翻到指定文章
    // 跳转到指定文章的路由
    handleFlipOver(page:Page):void{
        this.$router.push({name:'articel',query:{
            contentID:page.ContentID,
            articelID:page.ArticelID,
        }})
    }
    //点击点赞按钮
    handleToggleOpinion():void{
        if(this.isLoading) return ;
        (this.$axios as AxiosInstance)({
            method:'get',
            url:TOGGLR_OPNION,
            params:{
                contentID:this.contentID,
            }
        }).then(({data:{Data}})=>{
            console.log('改变前，值是:',this.articel.UserOpinion);
            var latestState=Data as OpinionState;
            switch(latestState){
                case OpinionState.Gratful:
                    this.articel.GratfulCount++;
                    break;
                case OpinionState.Unset:
                    this.articel.GratfulCount--;
                    break;
            }
            this.articel.UserOpinion=latestState;
            console.log('改变后：',this.articel.UserOpinion);
        })
    }
    // 发起请求，获得并处理数据已更新页面信息
    async updateInfo():Promise<any>{
        await this.requestUpdateInfo()
            .then(({data})=>{
                let info:Info=data.Data;
                this.articel=info.Articel;
                this.pages=info.Pages;
            });
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