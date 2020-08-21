<template>
    <div  class="app container-fluid">
        <div class="app-content row h-100">
            <!-- 侧边栏 -->
            <left-side 
                class="app-content-left-side" 
                :isSeen='isShowLeftSide' 
                @on-open='handleLeftSideFadeEnd'
                @on-closed='handleLeftSideFadeEnd' 
                @on-click-mask='handleClickMask' 
             />
            <!-- 
                触发显示LeftSide
                只在md以下显示
             -->
             <transition name="left-side-trigger">
                <!-- <div @click="isSeen=true" v-show="isForShowLeftSideOpen" class="trigger position-fixed"></div> -->
                <svg width='1em' height='1em' @click="isSeen=true" v-show="isForShowLeftSideOpen"  viewBox="0 0 16 16" class=" trigger position-fixed bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
             </transition>
            <!-- 内容 -->
            <div class="main position-relative col-12 col-md-9 offset-md-3">
                <!-- 导航栏 -->
                <!-- <navbar/> -->
                <router-view />
                <jiao />
            </div>
        </div>
    </div>
</template> 
<style lang="scss">
    @keyframes trigger-fade{
        0%{
            opacity: .6;
        }
        100%{
            opacity: 1;
        }
    }
    .left-side-trigger-enter-active{
        animation: trigger-fade .5s ease-in;
    }
    .left-side-trigger-leave-active{
        animation: trigger-fade .05s ease-out reverse;
    }
    .app{
        .app-content{
            .trigger{
                left: 0;
                top: 1rem;
                z-index:3;
            }
            z-index: 2;
            .main{
                z-index:1;
            }
            .app-content-left-side{
                z-index: 3;
            }
        }
    }
</style>
<script lang='ts'>
import {Vue ,Component ,Ref} from 'vue-property-decorator';

// 组件
import LeftSide from '@com/LeftSide/LeftSide.vue' 
import Footer from '@com/Footer.vue';
// Utils
import {innerHeight, isThePortable ,hasCookie ,USER_ID_COOKIE_NAME} from "./utils/utils";
//URL
import {FETCH_USER} from './utils/url'
// 类型
import { AxiosInstance } from 'axios';
import {ServerRespond, User} from './types/index';

@Component({
    components:{
        LeftSide, 
        jiao:Footer,
    }
})
export default class App extends Vue{
    isSeen:boolean=true;

    isLeftSideFading:boolean=false;


    
    created(){
        //请求用户数据
        //如果本地有存储UserID，获得UserID指向的实例
        //不然就不传ID让数据数据库建一个新的
        let userID:number|undefined;
        if(localStorage.UserID)
            userID=+(localStorage.UserID);
        (this.$axios as AxiosInstance)({
            url:FETCH_USER,
            method:'get',
            params:{
                userID,
            }
        }).then(({data:{Data}})=>{
            let latestUser:User=Data
            //更新全局user数据
            if(!localStorage.UserID)
                localStorage.setItem("UserID",latestUser.ID.toString());
            this.$mergeUser(latestUser);
        })
    }
    mounted():void{
        // 确保滚动条一直都在，减少重排
        var offset:number=20;
        document.documentElement.style.minHeight=innerHeight()+offset+'px';
    }
    // leftSide的过度完成
    handleLeftSideFadeEnd(){
        this.isLeftSideFading=false;
    }
    // 点击了LeftSide的遮罩触发
    handleClickMask():void{
        this.isSeen=false;
        this.isLeftSideFading=true;
    }
    //由chapter组件通过utils.ts中dispatch递归$parent来调用此方法
    //关闭遮罩
    handleClickChapterItem(){
        this.isSeen=false;
    }
    get isShowLeftSide():boolean{
        if(this.isThePortable===false)  return true;
        return this.isSeen;
    }
    // 当前是否移动设备
    get isThePortable():boolean{
        return isThePortable();
    }
    // 是否可以显示以触发关闭LeftSide
    get isForShowLeftSideOpen(){
        return this.isThePortable&&this.isSeen===false&&this.isLeftSideFading===false;
    }
}

</script>
