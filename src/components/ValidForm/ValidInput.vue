<template>
    <div class="valid-item">
        <slot></slot>
        <small>
            <state :request='curState'></state>
        </small>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Emit ,Prop} from 'vue-property-decorator';

//组件
import RequestState from '../RequestWatcher.vue';

@Component({
    components:{
        state:RequestState,
    },
})
export default class ValidInput extends Vue{
    // 是否通过验证
    @Prop({required:true,type:Boolean}) isValid!:boolean;
    //错误提示
    @Prop({required:true,}) errHint!:string;
    //成功提示
    @Prop({required:false,default:''}) successHint!:string;

    get curState():Promise<any>{
        if(this.isValid)
            return Promise.resolve(this.successHint);
        return Promise.reject(this.errHint)
    }
}
</script>