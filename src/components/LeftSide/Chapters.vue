<template>
    <ul class="chapters position-relative">
        <li class="chapter text-center position-relative" :class="{active:selectedIndex===index}" @click="handleClickChapter(index)" v-for='(item,index) in chapterItems' :key="index">
            <span>{{item.title}}</span>
        </li>
        <li class="arrow" :style="arrowPosition"></li>
    </ul>
</template>
<style lang="scss">
    @import '../../style/variable';
    @import '../../style/mixin/utils';
    .chapters{
        padding: 0;
        // 变量
        // 过度时间
        $transition-time:0.5s;
        // 下划线用的变量
        $selected-color:$color;
        $unselectd-color:change-color($color:$selected-color,$lightness:62%);
        $unselected-width:20%;
        $selected-width:42%;
        // 作为列表的箭头
        .arrow{
            // 声明一个长宽为0的块元素
            content:'';
            display: block;
            position:absolute;
            width: 0;
            height: 0;
            // 画一个三角形
            @include triangle-like(1.2rem,.78rem);
            // 设定三角形的位置
            right: 0;
            top: 0;
            //三角形用左边框弄的，所以再往右一点点就顶住ul的边边
            //再往上一点，就箭头尖尖就可以顶住ul右上角
            transform: translateX(50%) translateY(-50%);
            // 添加过度
            transition:top $transition-time cubic-bezier(.28,.43,0,1.49);
        }
        .chapter{ 
            padding:.5rem 0;//bootstrap的py-2优先级太高了
            // 下划线
            &::after{
                // 下划线颜色
                content: '';
                display: block;
                box-sizing: content-box;
                height: 1px;
                margin-top: -1px;
                padding-bottom: 0.5rem;
                box-shadow:0 0.38px 0 0 $unselectd-color;
                // 宽度
                width: $unselected-width;
                // 居中
                position: relative;
                left:(100%-$unselected-width)/2;
                //过度效果
                transition: all $transition-time ease-out; 
            }
        }
        .active{
            &[class*='chapter']{
                // 下划线颜色变深，宽度变宽
                &::after{
                    width:$selected-width ;
                    left:(100%-$selected-width)/2;
                    box-shadow:0 0.38px 0 0 $selected-color;
                }
            }
        }
    }
</style>
<script lang='ts'>
interface ChapterItem{
    title:string,
    aheadTo:{name?:string,params?:any,path?:string},
}
//默认选中的chapter的index。
const DEFAULT_SELECTED_INDEX:number=0;
import {Vue ,Component } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import {INTRODUCTION_ARTICRL_ID, INTRODUCTION_CONTENT_ID} from '../../router'
@Component
export default class Chapter extends Vue{
    chapterItems:ChapterItem[]=[
        {
            title:'个人介绍',
            aheadTo:{name:'articel',query:{
                articelID:INTRODUCTION_ARTICRL_ID,
                contentID:INTRODUCTION_CONTENT_ID,
            }},
        },
        {
            title:'主页',
            aheadTo:{name:'main'},
        },
        {
            title:'留言板',
            aheadTo:{name:'comments'},
        }
    ];
    //当前被选中的Chapter 的 Index
    selectedIndex:number=DEFAULT_SELECTED_INDEX;
    // 点击选项触发
    handleClickChapter(index:number):void{
        //设置箭头滑向哪里
        this.selectedIndex=index;
        //跳转路由
        if(this.$route.name!=this.chapterItems[index].aheadTo.name)
            this.$router.push(this.chapterItems[index].aheadTo);
    }

    // 箭头的高度样式
    get arrowPosition():any{
        var piece:number=100/(this.chapterItems.length*2);
        var topPieces:number=this.selectedIndex*2+1;
        return {
            top:topPieces*piece+'%',
        }
    }

}
</script>