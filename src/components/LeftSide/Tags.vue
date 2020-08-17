<template>
    <div class="tags">
        <span>
            标签...
        </span>
        <ul v-if='tags.length>0' class="d-flex flex-wrap tag-collection py-2">
            <li @click="handleClickTag(t.ID)" v-for='(t,index) in tags' :key="index" :class="{'active':activeIndex===index}" class="tag-item ml-1 mt-2">
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
//常量
import {UNSET_NUMBER}  from '../../utils/utils';
//接口 
import {TagVM} from '../../types/index';
import { AxiosInstance } from 'axios';


@Component({
    components:{
        Loading,
    }
})
export default class Tags extends Vue{
    @Prop({required:false,default:UNSET_NUMBER}) selectedTagID!:number
    //标签们
    tags:TagVM[]=[({
        ID:UNSET_NUMBER,
        Name:'全部',
    } )];


    //告知父元素点了哪个tagID 
    @Emit('on-click-tag')
    onClickTag(tagID?:number){}
    created(){
        //初始化标签数据
        (this.$axios as AxiosInstance)({
            method:'get',
            url:GET_ALL_TAG,
        })
            .then(({data:{Data}})=>{
                this.tags=[...this.tags,...Data as TagVM[]];
            });
    }

    
    // 点了标签触发
    //,告知父组件点了哪个tagID的标签
    handleClickTag(tagdID:number):void{
        let curTagID:number|undefined=tagdID===UNSET_NUMBER?undefined:tagdID
        this.onClickTag(curTagID);
    }



    //根据对应选择的tagID，筛选出当前选中的TagVM的Index
    get activeIndex():number{
        let selected:TagVM=this.tags.filter(el=>el.ID===this.selectedTagID)[0];
        return this.tags.indexOf(selected);

    }
}
</script>