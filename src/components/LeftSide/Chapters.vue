<template>
    <ul class="chapters position-relative">
        <li class="chapter text-center position-relative" :class="{active:selectedIndex===index}" @click="handleClickItem(index)" v-for='(item,index) in chapterItems' :key="index">
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
    aheadTo:{name:string,params?:any,query?:any},
}
import {UNSET_NUMBER} from '../../utils/utils';
import {Vue ,Component, Watch } from 'vue-property-decorator';
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
            aheadTo:{name:'main',params:{
                tagID:undefined,
            }},
        },
        {
            title:'留言板',
            aheadTo:{name:'comments'},
        },{
            title:'测试',
            aheadTo:{name:'test'}
        }
    ];
    //当前被选中的Chapter 的 Index
    selectedIndex:number=UNSET_NUMBER;
    created(){
        const FIRST_ITEM_INDEX=0;
        this.selectedIndex=FIRST_ITEM_INDEX;
    }
    
    handleClickItem(index:number):void{
        //修改 selectedIndex 让他到指定地方
        if(this.selectedIndex!==index)
            this.selectedIndex=index;
            //跳转到指定路由
        this.$router.push(this.chapterItems[this.selectedIndex].aheadTo)
            
    }
    // 箭头的高度样式
    //this.selectedIndex改变会触发箭头高度改变
    get arrowPosition():any{
        var piece:number=100/(this.chapterItems.length*2);
        var topPieces:number=this.selectedIndex*2+1;
        return {
            top:topPieces*piece+'%',
        }
    }

}
</script>