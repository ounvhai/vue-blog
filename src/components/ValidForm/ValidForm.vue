<template>
    <div class="valid-form">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Emit ,Prop, Watch} from 'vue-property-decorator';

import {ValidInfo ,/* ErrHint */} from '../../types/index';

interface ValidInfoCollection{
    [attr:string]:ValidInfo
}


@Component({
    name:'valid-form'
})
export default class ValidForm extends Vue{
    //被验证的数据 
    @Prop({type:Object})  info!:ValidInfoCollection
 

    //验证结束的时候把校验出错的对象的attr传出去
    @Emit('on-validation-end')
    handleValidationEnd(errAttrs:string[]){}

    //外界的输入事件引起 this.info改变
    //然后就验证,
    //有不通过验证的,保留他的key和提示信息hint,子组件validinput会根据key显示错误
    //然后把错误的key值传出去给外面.
    @Watch('info',{deep:true})
    async handleInfoChange(){ 
        //错误的信息（{错误属性名：错误提示}）
        let _errs:{[name:string]:string}={};
        await Object.keys(this.info).forEach(async attr=>{
            let validInfo:ValidInfo=this.info[attr];
            await validInfo.validator(validInfo.value) //执行完这步，并注册下面的微任务.
                .catch(function(hint){
                    //把验证错误的key和提示放进一个对象
                    _errs[attr]=hint;
                })
        })
        
        // 告诉儿子们是哪个属性错了，错误提示是什么，对应属性名的儿子自己对号入座
        this.$children.forEach((el:Vue)=>{
            el.$emit('on-valid-end',_errs) 
        })
        // 告诉此组件的爸爸 ，哪个属性出错了 
        this.handleValidationEnd(Object.keys(_errs));
    }


}
</script>