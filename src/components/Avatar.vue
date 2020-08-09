<template>
    <label class="avatar  d-inline-block">
        <img @load="handleImgLoaded" class="w-100" :src="defaultPortrait" alt="头像">
        <p v-if="name" class="avatar-name text-center">{{name}}</p>
    </label>
</template>
<style lang="scss">
    @import '../style/mixin/utils';
    .avatar{
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
    @Prop({type:String}) portrait!:string;
    
    // 图片加载好后触发
    handleImgLoaded(e:Event){
        // 每次图片加载好后，图片以宽为准成正方形
        var img:HTMLElement=e.target as HTMLElement;
        img.style.height=img.getBoundingClientRect().width+'px';
    }
    get defaultPortrait():string{
        if(this.portrait) return this.portrait;
        return avatar_png;
    }
    // get defaultName():string{
    //     if(this.name) return this.name;
    //     return "热心网友";
    // }
}
</script>