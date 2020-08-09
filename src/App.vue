<template>
    <div  class="app container-fluid">
        <div class="app-content row h-100">
            <!-- 侧边栏 -->
            <left-side class="app-content-left-side" :isSeen='isSeen' @on-open='handleLeftSideFadeEnd' @on-closed='handleLeftSideFadeEnd' @on-click-mask='handleClickMask'  />
            <!-- 
                触发显示LeftSide
                只在md以下显示
             -->
             <transition name="left-side-trigger">
                <div @click="isSeen=true" v-show="isForShowLeftSideOpen" class="trigger position-fixed"></div>
             </transition>
            <!-- 内容 -->
            <div class="main position-relative col-12 col-md-8 offset-md-4">
                <!-- 导航栏 -->
                <navbar/>
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

                width: 1rem;
                height: 1rem;
                background-color: black;

                z-index:3
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
import Navbar from '@com/Nav.vue';
import Footer from '@com/Footer.vue';
// Utils
import {innerHeight, isThePortable} from "../src/utils/utils";
//URL
import {FETCH_USER} from './utils/url'
// 类型
import { AxiosInstance } from 'axios';
import {ServerRespond} from './types/index';
@Component({
    components:{
        LeftSide,
        Navbar,
        jiao:Footer,
    }
})
export default class App extends Vue{
    test(){
        console.log('需要填写');
    }
    
    isSeen:boolean=true;

    isLeftSideFading:boolean=false;
    
    created(){
        (this.$axios as AxiosInstance)({
            url:FETCH_USER,
        }).then(({data})=>{
            let serverRespond:ServerRespond=data;
            this.$mergeUser(serverRespond.Data);
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
    handleClickTrigger():void{
        this.isSeen=true;
        this.isLeftSideFading=true;
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
