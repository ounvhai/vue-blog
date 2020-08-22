<style lang="scss">
    @import '../../style/mixin/utils';
    
    .articel{
        
        .content{
            min-height: 8rem;
            line-height: 1.8rem;
            z-index: 2;                //这里的作用 跟 .articel-cmt 一起，为了加载时不要让输入框遮住全文
            .articel-text{
                // 字体缩进
                text-indent: 2rem;
                // 英文字折行
                word-wrap:break-word;
                word-break: break-all;
            }
            .articel-loading{
                // loding图标居中
                margin-left:50%;
                transform: translateX(-50%);
            }
        }
        .articel-cmt{
            z-index: 1;
        }
        .pages{
            .page{
                //【上一页/下一页】 前面/后面的符号
                &:nth-of-type(1)::before,&:nth-of-type(2)::after{//这也是个flex元素,.page（父级）是个flex容器
                    content: '';
                    display: block;
                    width:1rem;
                    height: 1rem;
                    background-color: black;
                    flex:0 0 auto;//不增不减内容自适应
                }
                flex: 1 0 auto;
                .page-title{
                    //限制标题最多显示2行
                    @include text-lines(2);
                    //自由分配剩下的空间
                    flex:1 1 auto;
                    // 跟【上一页/下一页】的符号高度对其
                    line-height: 1rem;

                    word-wrap:break-word;
                    word-break: break-all;
                }
            }
        }
    }
</style>
<template>
    <div class="articel">
        <h2 class="mt-4">{{title}}</h2>
        <div class=" info mt-3 ">
            <label  class="mr-3"  @click="handleToggleOpinion">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-suit-heart-fill " fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path :class="{'text-danger':isGratful}" d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                </svg>
                
                {{articel.GratfulCount}}
            </label>
            <label  class="mr-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-right-quote" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M2 1h12a1 1 0 0 1 1 1v11.586l-2-2A2 2 0 0 0 11.586 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                    <path fill-rule="evenodd" d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
                </svg>
                {{articel.CommentCount}}
            </label>
            <label class="mr-3">
                <svg width="1em" style="transform:rotateZ(90deg)" height="1em" viewBox="0 0 16 16" class="bi bi-tags " fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                    <path fill-rule="evenodd" d="M5.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    <path d="M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                </svg>
                {{articel.TagName}}
            </label>
            <label class="mr-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-alarm" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 15A6 6 0 1 0 8 3a6 6 0 0 0 0 12zm0 1A7 7 0 1 0 8 2a7 7 0 0 0 0 14z"/>
                    <path fill-rule="evenodd" d="M8 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.053.224l-1.5 3a.5.5 0 1 1-.894-.448L7.5 8.882V5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
                    <path fill-rule="evenodd" d="M11.646 14.146a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1-.708.708l-1-1a.5.5 0 0 1 0-.708zm-7.292 0a.5.5 0 0 0-.708 0l-1 1a.5.5 0 0 0 .708.708l1-1a.5.5 0 0 0 0-.708zM5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                    <path d="M7 1h2v2H7V1z"/>
                </svg>
                {{articel.Time | public_articel_time}}
            </label>
        </div>
        <!-- 下划线 --> 
        <hr />
        <div class="content position-relative ">
            <!-- @after-enter='handleContextFadeIn' -->
            <transition name="loading-switching"  mode="out-in">
                <div v-if='isLoading===false' class="articel-text" v-html="context"></div>
                <loading v-else class="articel-loading my-4"></loading>
            </transition>
        </div>
        <div class="pages d-flex my-5 mx-3 px-md-5">
            <div @click="handleFlipOver(LastPage)" class="page  d-flex last-page w-50 ">
                <p class="page-title px-3">
                    {{LastPage.Title}}
                </p>
            </div>
            <div @click="handleFlipOver(NextPage)" class="page text-right d-flex next-page w-50">
                <p class="page-title px-3">
                    {{NextPage.Title}}
                </p>
            </div>
        </div>
        <cmts class="articel-cmt position-relative" @on-comment-uploaded='articel.CommentCount++' :contentID='contentID'></cmts>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Prop, Watch ,Mixins} from 'vue-property-decorator'; 
//组件 
import Comments from '@com/Comment/Comments.vue';
import Loading from '@com/loading.vue';
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
import {hasCookie ,scrollToTop} from '../../utils/utils';
import {latestUser } from '../../utils/userMgr/index';
import moment from 'moment';
//常量
import {USER_ID_COOKIE_NAME, UNSET_NUMBER}  from '../../utils/utils'  


interface Info{
    Articel:VM,
    Pages:Page[],
}
@Component({
    components:{ 
        cmts:Comments,
        Loading,
    },
    filters:{ 
    }
})
export default class Articel extends Mixins(UserTrace){
    

    @Prop({required:true}) articelID!:number;
    @Prop({required:true}) contentID!:number;
    articel:VM={} as VM;
    // 页码
    pages:Page[]=[];  
    //是否初始化数据了
    //因为有2个地方可能会触发更新，但是实际只初始化一次created 和 onUserInited 中
    //所以初始化过后用这个标识，只初始化一次
    isInited:boolean=false;
    //请求的时候为true
    //true的时候会显示加载图标
    //不能点赞toggleOpinion
    isLoading:boolean=false;
    
    isTogglingOpinion:boolean=false; 
    //继承UserTrace，不绑定用户更新后调用的钩子
    isWatchUserUpdated:boolean=false;
    // 请求显示的信息
    created(){
        //只要有cookie就可以请求数据
        //但是可能会执行下面的 onUserInited 回调时候再请求一次
        // 所以加个isInited 减少无用请求
        if(hasCookie(USER_ID_COOKIE_NAME)){
            this.updateInfo()
            this.isInited=true;
            scrollToTop(document.documentElement,0);
        }
    }
    //继承UserTrace的方法，第一次更新User后调用
    //请求显示的信息
    // 如果是第一次来会没cookie以请求显示的信息，在这里会有cookie
    onUserInited(latestUser:User):void{
        if(this.isInited===false){
            this.updateInfo();
            this.isInited=true;
        }
    }
    //文章ID改变的时候请求新数据
    @Watch('articelID')
    async handleArticelChange():Promise<any>{
        //滚到最上面
        scrollToTop(document.documentElement,0);
        // 请求数据
        this.isLoading=true;
        await this.updateInfo();
        this.isLoading=false;
    }
    // 翻到指定文章
    // 跳转到指定文章的路由
    handleFlipOver(page:Page):void{
        //不能指向任何一个文章的不重定向
        if(page.ArticelID===UNSET_NUMBER) return ;
        this.$router.push({name:'articel',query:{
            contentID:page.ContentID,
            articelID:page.ArticelID,
        }})
    }
    //内容淡入完成的时候执行
    //让页面滚到最上面
    /* handleContextFadeIn():void{
        scrollToTop(document.documentElement,0);
    } */
    //点击点赞按钮
    async handleToggleOpinion():Promise<any>{
        if(this.isLoading || this.isTogglingOpinion) return ;
        this.isTogglingOpinion=true;
        await (this.$axios as AxiosInstance)({
            method:'get',
            url:TOGGLR_OPNION,
            params:{
                contentID:this.contentID,
                userID:latestUser().ID,
            }
        }).then(({data:{Data}})=>{
            let {UserOponion:latestState}=Data;
            switch(latestState){
                case OpinionState.Gratful:
                    this.articel.GratfulCount++;
                    break;
                case OpinionState.Unset:
                    this.articel.GratfulCount--;
                    break;
            }
            this.articel.UserOpinion=latestState;
        })
        this.isTogglingOpinion=false;
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
                userID:latestUser().ID,
            }
        })
    }
    


    get title():string{
        return this.articel.Title||'加载中...';
    }
    get context():string{
        return this.articel.Text||'';
    }
    
    get isGratful():boolean {
        return this.articel.UserOpinion===OpinionState.Gratful;
    }
    

    get NextPage():Page{
        return [...this.pages].filter(instance=>instance&&instance.ArticelID>this.articel.ArticelID)[0]||this.defaultPage;
    }
    get LastPage():Page{
        return [...this.pages].filter(instance=>instance&&instance.ArticelID<this.articel.ArticelID)[0]||this.defaultPage;
    }
    get defaultPage():Page{
        return {Title:'没有啦',ArticelID:UNSET_NUMBER,ContentID:UNSET_NUMBER} as Page;
    }
}
</script>