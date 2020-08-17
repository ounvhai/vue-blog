<template>
    <label class="avatar ">
        <img v-if='isUseDefaultPortrait'  @load="handleImgLoaded" @click="handleClickPortrait" class="w-100" :src="portrait" alt="头像">
        <svg v-else  @load="handleImgLoaded" @click="handleClickPortrait"  viewBox="0 0 16 16" class="bi bi-person-fill w-100 d-inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg>
        <small v-if="name" class="avatar-name text-center d-inline-block">{{name}}</small>
    </label>
</template>
<style lang="scss">
    @import '../style/mixin/utils';
    .avatar{
        &:hover{
            cursor: pointer;
        }
        .avatar-name{
            // 这里用的EM哒
            font-size: 1em;
            // 只能显示一行的名字
            $line-count:1;
            @include text-lines($line-count);
            // 长度稍微长一长
            margin:{
                left:-25%;
                right: -25%;
            }
        }
    }
</style>
<script lang='ts'>
import {Vue ,Component ,Emit ,Prop, Ref} from 'vue-property-decorator';
// 图片
import avatar_png from '../assets/avatar.png';
//常量
import {UNSER_VIEREW_NAME } from '../utils/utils'

@Component
export default class Avatar extends Vue{
    // 用户名
    @Prop({type:String,required:false,default:UNSER_VIEREW_NAME}) name!:string;
    // 头像链接
    @Prop({type:String}) portrait!:string|null|undefined;

    @Emit('on-click-portrait')
    handleClickPortrait():void{}
    
    // 图片加载好后触发
    handleImgLoaded(e:Event){
        // 每次图片加载好后，图片以宽为准成正方形
        var img:HTMLElement=e.target as HTMLElement;
        img.style.height=img.getBoundingClientRect().width+'px';
        console.log('avatar On Loaded');
    }
    get isUseDefaultPortrait():boolean{
        return !!this.portrait;
    }
}
</script>