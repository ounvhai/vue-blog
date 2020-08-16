<template>
    <div class="tags">
        <span>
            标签...
        </span>
        <ul v-if='hasAnyTag' class="d-flex flex-wrap tag-collection py-2">
            <li @click="handleClickTag(index)" v-for='(t,index) in tags' :key="index" :class="{'active':activeIndex===index}" class="tag-item ml-1 mt-2">
                <small class="tag-name  d-inline-block px-2 py-1 ">{{t.Name}}</small>
            </li>
        </ul>
        <loading v-else></loading>
    </div>
</template>
<style lang="scss">
    .tags{
        opacity: 0.8;
        .tag-collection{
            padding-left: unset;
            .tag-item{
                flex:0 0 auto;
                cursor: pointer;
                // 文字标签被点击选中的样式
                &[class*='active'] > .tag-name{
                    background: black;
                    color:#eee;
                }
                // 未被点击选中的文字标签鼠标悬浮样式
                &:not([class*='active']):hover > .tag-name{
                    background-color: adjust-color($color: #eee, $lightness: -3%)
                }
                // 文字标签的一般样式
                .tag-name{
                    // 椭圆边框
                    border-radius: 10%;
                    // 底色
                    background: #eee;
                }
                
            }
        }
    }
</style>
<script lang="ts">
import {Vue ,Component ,Prop, Watch, Emit} from 'vue-property-decorator';

//组件
import Loading from '../loading.vue';
//路径
import {GET_ALL_TAG} from '../../utils/url';
//接口 
import {TagVM} from '../../types/index';
import { AxiosInstance } from 'axios';


@Component({
    components:{
        Loading,
    }
})
export default class Tags extends Vue{
    //标签们
    tags:TagVM[]=[];

    activeIndex:number=0;
    @Emit('on-click-tag')
    onClickTag(index:number){}
    created(){
        this.requestTags()
            .then(({data:{Data}})=>{
                this.tags=Data as TagVM[];
                
            });
    }
    // 点了标签触发
    // 更新activeIndex,告知父组件点了哪个标签
    handleClickTag(index:number):void{
        //点击相同标签则返回
        if(index===this.activeIndex) return ;
        this.activeIndex=index;
        // 告诉父组件点了标签
        this.onClickTag(index);
    }
    requestTags():Promise<any>{
        return (this.$axios as AxiosInstance)({
            method:'get',
            url:GET_ALL_TAG,
        })
    }
    get hasAnyTag():boolean{
        return this.tags&&this.tags.length>0
    }
}
</script>