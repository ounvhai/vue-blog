<template>
    <div class="left-side position-relative">
            <transition name='mask-fade'>
                <!-- 背景，在小屏幕下显示，md开始不用 -->
                <div  v-show="isSeen" @click="handleClickMask" class="mask position-fixed  d-md-none   bg-dark"></div>
            </transition>
            <transition name="content-fade" @after-enter='handleOpen' @after-leave='handleClosed'>
                <div v-show="isSeen" class="content d-flex flex-column justify-content-start position-fixed col-md-3 col-8 ">
                    <img 
                        src="../../assets/pipi.gif" 
                        alt="网站logo" 
                        class="img w-25 position-relative "
                    />
                    <overview class=''></overview>
                     <chapter />
                    <tag @on-click-tag='handleClickTag' :selectedTagID='tagID'></tag>
                </div>
            </transition>
    </div>
</template>
<style lang="scss">
    // （过度）动画的显示，消失时间
    $fade-time:.2s;
    .left-side{
        height: 0;
        .mask{
            z-index: 1;
            top: 0;
            bottom: 0; 
            left: 0;
            right: 0;

            // bootstrap的d-block优先级用到！important，不用，所以d-block写到这里
            display: block;
        }
        .content{
            &>*{
                flex:0 1 auto;
            
            }
            z-index: 2;
            // 位置
            top: 0;
            bottom: 0;
            left:0;
            transform: translateX(0%);
            transform-origin: 50%;
            // 右边阴影
            box-shadow: 1px 0 3px 0 var(--my-web-color);

            overflow: hidden;

            .img{
                border-radius: 50%;
                // 居中
                left:50%;
                transform:translateX(-50%);
            }
        }
    }




    // 遮罩mask的出现，消失动画
    @keyframes left-side-mask-fading{
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
    // 内容部分的显示消失动画
    // 使用important是因为用到bootstrap的d-block，所以这个凑个优先级
    @keyframes left-side-content-fading {
        0%{
            transform: translateX(-100%);
            opacity: 0;
        }
        100%{
            transform: translateX(0%);
            opacity: 1;
        }
    }
    // 遮罩mask的显示消失类
    .mask-fade-enter-active{
        animation: left-side-mask-fading $fade-time ease-in;
    }
    .mask-fade-leave-active{
        animation:left-side-mask-fading $fade-time ease-in reverse;
    }
    // 内容部分的显示消失类
    .content-fade-enter-active{
        animation: left-side-content-fading $fade-time ease-in ;
    }
    .content-fade-leave-active{
        animation:left-side-content-fading $fade-time ease-out reverse;
    }
</style>
<script lang='ts'>
import {Vue ,Component ,Prop, Emit} from 'vue-property-decorator';


// 组件
// import Assistant from './Assistant.vue';
import Chapter from './Chapters.vue';
import Overview from './Overview.vue';
import Tag from './Tags.vue';
@Component({
    components:{
        // Assistant,
        Chapter,
        Overview,
        Tag,
    }
})
export default class LeftSide extends Vue{
    // 是否显示
    @Prop({type:Boolean}) isSeen!:boolean;
    

    //告诉父元素点了遮罩
    @Emit('on-click-mask') clickMask():void{};
    // 告诉父元素组件关闭完了
    @Emit('on-closed') handleClosed():void{}
    @Emit('on-open') handleOpen():void{}
    // 点击遮罩事件
    handleClickMask(){
        // 告诉父组件修改isSeen
        this.clickMask();
    }
    //触发了tag标签
    //跳转到指定路由
    handleClickTag(toTagID?:number):void{
        let curTagID:number|undefined=this.$route.params?this.$route.params.tagID:undefined;
        if((this.$route.name==="main"&& curTagID === toTagID)===false){//要跳转到的路由不是现在的路由即可跳转
            this.$router.push({
                name:'main',
                params:{
                    'tagID':toTagID,
                }
            });
        }
    }
    //如果在name=main的路由下且有tagID.那就返回指定ID
    get tagID():number|undefined{
        if(this.$route.name==='main' && this.$route.params && this.$route.params.tagID)
            return +this.$route.params.tagID;
    }
}
</script>