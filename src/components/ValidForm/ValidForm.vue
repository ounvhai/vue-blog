<template>
    <div class="valid-form">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Emit ,Prop, Watch} from 'vue-property-decorator';

import {ValidInfo } from '../../types/index';

interface ValidInfoCollection{
    [attr:string]:ValidInfo
}

@Component
export default class ValidForm extends Vue{
    //被验证的数据 
    @Prop({type:Object})  info!:ValidInfoCollection

    //验证结束的时候把校验出错的对象的attr传出去
    @Emit('on-validation-end')
    handleValidationEnd(errAttrs:string[]){}
    @Watch('info',{deep:true})
    handleInfoChange(){
        let err:string[]=[]
        Object.keys(this.info).forEach(name=>{
            let validInfo:ValidInfo=this.info[name];
            if(validInfo.validator(validInfo.value)===false)
                err.push(name);
        })
        this.handleValidationEnd(err);
    }


}
</script>