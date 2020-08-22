<template>
    <ul :class="['chapter-'+selectedIndex+'-active']"  class="chapters position-relative">

        <li class="chapter text-center position-relative"  @click="handleClickItem(index)" v-for='(item,index) in chapterItems' :key="index">
            <span>{{item.title}}</span>
        </li>
    </ul>
</template>
<style lang="scss">
    @import '../../style/variable';
    @import '../../style/mixin/utils';
    

    // --------------------------------------------------some chapter selected style               start--------------------------

    //有多少个item就设置为几
    //写少显示不正常，写多了就多余
    $item-count:3;

    //未选中的chapter的y方向 总 padding
    $unselected-padding-y:2%;
    //选中的chapter的y方向 总 padding
    $selected-padding-y:7%;


    @for $index from 0 to $item-count{
        //箭头去到什么高度
        //&:::after 是箭头本体
        .chapters[class*=chapter-#{$index}-active]{
            $unselected-h:(100%-$selected-padding-y)/$item-count;
            $selected-h:$unselected-h+$selected-padding-y;
            // 箭头高度
            &::after{
                //被选中的chapter上有几个未选中的chapter
                $unselected-above-count: $index;
                top:$unselected-above-count*$unselected-h+$selected-h/2;
                transform: translateY(-50%);
            }
            //chapter 被选中的样式
            //  下划线的长度
            //  padding
            .chapter:nth-child(#{$index+1}){
                padding:{
                    top: $selected-padding-y/2;
                    bottom:$selected-padding-y/2;
                    background: black;
                }
                //下划线本体
                &::after{
                    width: 50%;
                    margin-top: .38rem;
                }
            }
        }
    }


    // --------------------------------------------------some chapter selected style            end--------------------------










    .chapters{
        margin-top: 1.8rem;
        &::before{
            content: '章节:';
            position: absolute;
            left: 0;
            top: 0;
            transform: translateY(-100%);
        }
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
        &::after{
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
        &>.chapter{ 
            //chapter的y方向padding初始值
            padding:{
                top:$unselected-padding-y;
                bottom:$unselected-padding-y;
            }
            //本体跟下划线都有过度，
            &,&::after{
                //本体的过度是padding，
                //下划线的过度是width
                transition: all $transition-time ease-out;
            }
            // 下划线
            &::after{
                // 召唤实体
                content:'';
                display:block;
                //一根线
                height: .6px;
                background: $unselectd-color;
                width: 22%;
                
                // 位置
                margin:.18rem auto;
                
            }
        }
    }
</style>
<script lang='ts'>
interface ChapterItem{
    title:string,
    aheadTo:{name:string,params?:any,query?:any},
}
import {UNSET_NUMBER ,dispatch} from '../../utils/utils';
import {Vue ,Component, Watch } from 'vue-property-decorator';
import { RawLocation, Route } from 'vue-router';
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
        },
        /* {
            title:'测试',
            aheadTo:{name:'test'}
        } */
    ];
    //当前被选中的Chapter 的 Index
    //当前选中的chapter，会有一个active的类名
    //这个属性用来指明active在哪个chapter身上
    selectedIndex:number=0;

    //路由变化，引起箭头的改变
    @Watch('$route')
    handleRouteChange(newRoute:Route,oldRoute:Route):void{
        switch(newRoute.name){
            case 'main':
                this.selectedIndex=1;
                break;
            case 'comments':
                this.selectedIndex=2;
                break;
            case 'articel':
                //不是自我介绍的，就跳到主页，不然跳到个人介绍项
                if(+newRoute.query.articelID!==INTRODUCTION_ARTICRL_ID)
                    this.selectedIndex=1
                else
                    this.selectedIndex=0;
                break;
            default :
                this.selectedIndex=1;
        }
    }


    handleClickItem(index:number):void{
        //修改 selectedIndex 让他到指定地方
        this.$router.push(this.chapterItems[index].aheadTo);

        dispatch('handleClickChapterItem',this);
            
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