<template>

<div class="articels">
        <transition-group name="articel-in" tag='ul' class="articel-list">
            <li v-for="a in articels" :key="a.ArticelID">
                <item @on-tag-click='handleClickArticelTag' @click.native="handleClickArticelItem(a)" :articel='a'></item>
            </li>
        </transition-group>
        <div class="decorate text-center my-5">
            <transition name='loading-switching'>
                <loading v-show="isLoading"></loading>
            </transition>
            <h6 class="my-5" v-if="isAllLoaded">- - 木有啦 - - </h6>
            <h6 class="my-5" v-show='isLoading'>--加载中--</h6>
        </div>
</div>
</template>
<style lang="scss">
.articel-list{
    margin-bottom: 8rem;
}
    .articel-in-enter{
        opacity: 0;
    }
    .articel-in-enter-to{
        opacity:1;
    }
    .articel-in-enter-active{
        transition: all .38s;
    }
    
</style>
<script lang="ts">
import {Vue ,Component ,Prop, Watch} from 'vue-property-decorator';
//类型
import {ArticelVM as VM} from '../types/index'
//组件
import ArticelItem from '@com/Articel/ArticelListItem.vue';
import Loading from '@com/loading.vue'
//常量
import {GET_ARTICEL_PAGE} from '../utils/url';
import { AxiosInstance } from 'axios';
//方法
import {innerHeight, scrollToTop,throttle} from '../utils/utils';
import {latestUser } from '../utils/userMgr/index';
//第一页的页码
const UNSET_PAGE:number=0;
//每页加载的个数n 
const PAGE_SIZE:number=5;

// window滚动事件触发此节流器
let handleWindowScrollThrottle=throttle(function(){
    // 如果滚动到底部//需要 scrolltop + 屏幕高度 与 scrollHeight的关系
    // 而且没有在加载，且还能请求数据
    // 那就请求下一页数据
    const offset:number=100;//滚动条拉到底不大好，所以网上偏移一点点就可以触发了。
    const screenHeight:number=innerHeight();//屏幕高度
            
    let {scrollTop,scrollHeight}=document.documentElement;
    //如果已经快要拉到底部(高度>临界值)，能请求更多数据的情况下，没在请求数据的状态中，那就请求数据
    if((scrollTop+screenHeight)>(scrollHeight-offset) && this.isLoading===false&&this.isAllLoaded===false)
        //请求更多数据
        this.handleLoadMore();
},80)

@Component({
    components:{
        item:ArticelItem,
        Loading,
    }
})
export default class ArticelList extends Vue{

    @Prop({required:false}) tagID:number;
     
    //文章列表
    articels:VM[]=[];
    //第一页
    curPage:number=UNSET_PAGE;
    // 是否在加载中
    isLoading:boolean =false;
    //是不是全部文章都加载完了
    isAllLoaded:boolean=false;

    created(){ 
        scrollToTop(document.documentElement,0)
         this.handleLoadMore();
    }
    mounted(){
        //绑定滚动监听事件/
        document.addEventListener.call(window,'scroll',this.onScrollThrottle);
    }
    beforeDestroy(){
        //解绑滚动监听事件
        document.addEventListener.call(window,'scroll',this.onScrollThrottle);
    }
    @Watch('$route')
    handleRouteUpdate():void{
        this.curPage=0;
        this.articels=[];
        this.isAllLoaded=false;
        this.isLoading=false;//为了可以进行下一页的请求
        scrollToTop(document.documentElement,0);
        this.handleLoadMore();
    }
    //加载下一页数据
    async handleLoadMore():Promise<any>{
        if(this.isLoading||this.isAllLoaded) return ;
        this.isLoading=true;
        await this.requestNextPage()
            .then(({data:{Data}})=>{
                let articels:VM[]=Data;
                //加载完了就标记已加载状态，
                if(articels.length<PAGE_SIZE)
                    this.isAllLoaded=true;
                // 添加新一页的文章数据，并标记下一页
                this.articels=this.articels.concat(articels);
                this.curPage+=1;
            })
        this.isLoading=false;
    }
    // 点击某个文章事件
    // 跳转到某个文章详情
    handleClickArticelItem(articel:VM):void{
        this.$router.push({
            name:'articel',
            query:{
                articelID:articel.ArticelID,
                contentID:articel.ContentID,
            }
        })
    }
    // 点击了标签，跳转到特定标签的路由
    handleClickArticelTag(tagID:number):void{ 
        this.$router.replace({
            name:'main',
            params:{
                tagID:tagID,
            }
        })
    }
    //请求下一页数据
    //根据给定的常量PageSize，还有当前的页数，当前的TagID，相对的求下一页的数据
    requestNextPage():Promise<any>{
        let nextPage:number=this.curPage+1;
        return  (this.$axios as AxiosInstance)({
            url:GET_ARTICEL_PAGE,
            method:'get',
            params:{
                pageSize:PAGE_SIZE,
                pageNumber:nextPage,
                tagID:this.tagID,//有可能是undefined
                userID:latestUser().ID,
            }
        })
    }

    // 绑定了本组件实例的一个节流器，鼠标滚动的时候触发
    get onScrollThrottle():()=>void{
        return handleWindowScrollThrottle.bind(this);
    }
}
</script>