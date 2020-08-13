<style lang="scss">
    @import '../../style/mixin/utils';
    //切换动画
    .switch-enter-active{
        animation:switching .12s reverse linear;
        position:absolute;
    }
    .switch-leave-active{
        animation:switching .12s linear;
        position:absolute;
    }
    @keyframes switching {
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0; 
        }
    }
    .articel{
        .info{
            //点赞被选中的时候变成红色
            .info-set{color: red;}
        }
        .content{
            min-height: 8rem;
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
        <h5>{{title}}</h5>
        <div class="info">
            <label :class="{'info-set':isGratful}"  @click="handleToggleOpinion">
                点赞数:{{articel.GratfulCount}}
            </label>
            <label >
                评论：{{articel.CommentCount}}
            </label>
            <label>
                标签：{{articel.TagName}}
            </label>
            <label>
                发表时间{{articel.Time}}
            </label>
        </div>
        <!-- 下划线 --> 
        <hr />
        <div class="content position-relative ">
            <transition name="switch" @after-enter='handleContextFadeIn' mode="out-in">
                <p v-if='isLoading===false' class="articel-text">{{context.repeat(15)}}</p>
                <loading v-else class="articel-loading"></loading>
            </transition>
        </div>
        <div class="pages d-flex">
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
        <cmts @on-comment-uploaded='articel.CommentCount++' :contentID='contentID'></cmts>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Prop, Watch ,Mixins} from 'vue-property-decorator'; 
//组件 
import Comments from '@views/Comments.vue';
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
    // isLoading:boolean=true;

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
    handleContextFadeIn():void{
        scrollToTop(document.documentElement,0);
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