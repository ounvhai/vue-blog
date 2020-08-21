<script lang="ts">
import {Vue ,Component, Prop, Watch, Emit} from 'vue-property-decorator';
import instance from '../utils/http';

// 未设定值的标识
const REQUEST_WATCHER_TIMER=-1;
interface State{
    isDone:boolean,
    isLoading:boolean,
    isErr:boolean,
}
interface Messages{
    done?:string,
    err?:string,
}


// 由slot设定promise的三种状态中每种状态的显示值，通过promise传入的显示值更优先显示
@Component
export default class RequestWatcher extends Vue{
    @Prop({required:true}) request!:Promise<any>|null;
    // promsie的各个状态
    state:State={
        isDone:false,
        isLoading:false,
        isErr:false,
    }
    hints:Messages={
        done:undefined,
        err:undefined,
    }
    created(){
        if(this.request instanceof Promise)
            this.handleRequestChange(this.request);
    }
    @Watch('request')
    handleRequestChange(newValue:Promise<any>){
        //不是promise实例就不
        this.resetState();
        if((newValue instanceof Promise)===false) return ;
        this.state.isLoading=true;
        // 观察Promise的各个状态并切换hint
        (this.request as Promise<any>)
            .then((data)=>{
                this.resetState();
                this.state.isDone=true;
                // 如果传入的不是一个对象【axios会传回一个对象】,那就修改hint
                if(data&&typeof data!=="object"){
                    this.hints.done=data as string;
                }
            })
            .catch((data)=>{
                this.resetState();
                this.state.isErr=true;
                if(data&&typeof data!=="object"){
                    this.hints.err=data as string;
                }
            })
    }
    // 重新初始化
    // 初始化promise的状态标识&&各个状态的提示语
    resetState(){
        this.state={
            isDone:false,
            isErr:false,
            isLoading:false,
        }
        this.hints={
            done:undefined,
            err:undefined,
        }
    }
    
}
</script>
<style lang="scss">
    .request-watcher-enter-active{
        animation: request-watcher-fading .2s ease-out;
    }
    .request-watcher-leave-active{
        animation: request-watcher-fading .2s ease-out reverse;
    }
    @keyframes request-watcher-fading{
        0%{
            opacity: 0.38;
        }
        100%{
            opacity: 1;
        }
    }
</style>
<template>
    <div class="request-watcher" >
        <transition name="request-watcher" mode="out-in">
            <small v-if='state.isLoading===true' key='loading' class="text-warning">
                <slot  name="loading"></slot>
            </small>
            <small v-else-if='state.isDone===true' key='done' class="text-success">
                <template v-if='hints.done'>
                    {{hint.done}}
                </template>
                <slot v-else name="done">
                </slot>
            </small>
            <small v-else-if='state.isErr===true' key="err" class="text-danger">
                <template v-if='hints.err'>
                    {{hints.err}}
                </template>
                <slot v-else name="err">
                </slot>
            </small>
        </transition>
    </div>
</template>