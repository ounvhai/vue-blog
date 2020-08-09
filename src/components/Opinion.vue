<template>
    <img @load="handleLogoLoaded" :src='src' class="opinion-img ">
</template>
<script lang="ts">
import {Vue ,Component ,Prop} from 'vue-property-decorator';

//什么都没有图片
import null_opinion from '../assets/opinion-null.gif';
//点赞图片
import ok_opinion from '../assets/opinion-1.gif';
@Component
export default class Opinion extends Vue{
    // 点赞了？
    @Prop({required:true,type:Boolean}) isZan!:boolean;
    //描述对象的conentID，【这个赞是给哪个content点的
    @Prop({required:true,type:Number}) contentID!:number;

    isLoading:boolean=false;
    //图片加载好后触发
    //logo是个正方向
    handleLogoLoaded(e:Event){
        var img:HTMLElement=<HTMLElement>e.target;
        img.style.height=img.getBoundingClientRect().width+'px';
    }
    //根据点赞情况，显示的图片
    get src():string{
        if(this.isZan) return ok_opinion;
        return null_opinion;
    }

}
</script>