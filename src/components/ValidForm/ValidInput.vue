<template>
    <div class="valid-item">
        <slot></slot>
        <state :request='curState'></state>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Emit ,Prop ,Watch} from 'vue-property-decorator';

//组件
import RequestState from '../RequestWatcher.vue';

@Component({
    components:{
        state:RequestState,
    },
})
export default class ValidInput extends Vue{

    @Prop({required:true}) attr!:string
    
    errHint:string|null=null;

    
     created(){
         this.$on('on-valid-end',(errs:{[attr:string]:string})=>{ 
             if(errs[this.attr])
                this.errHint=errs[this.attr];
            else
                this.errHint=null;
         })
     }
     get curState():Promise<any>{
         if(this.errHint)
            return Promise.reject(this.errHint)
        return Promise.resolve();
     }


    

}
</script>
