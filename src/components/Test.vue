<script lang='ts'>
import {Vue ,Component ,Emit ,Prop} from 'vue-property-decorator';

//组件
import ValidForm from './ValidForm/ValidForm.vue';
import ValidItem from './ValidForm/ValidInput.vue'
//类型
import {ValidInfo} from '../types/index';
@Component({
    components:{ 
        vForm:ValidForm,
        vInput:ValidItem,
    }
})
export default class Test extends Vue{
    test(err:string[]){
        Object.keys(this.validState).forEach(name=>{this.validState[name]=true})
        err.forEach(name=>{
            this.validState[name]=false;
        })
        console.log('watcher OK..',this.validState.name);
    }
    tag='kirds';
    valids:any={
        name:{
            attr:'name',
            value:'',
            validator:(value:string)=>{ 
                return false;
            },
        } as ValidInfo
    }
    validState:any={
        name:false,
    }
}
</script>
<style lang="scss">

</style>
<template>
    <div class="test">
        <v-form @on-validation-end='test' :info='valids'>
            <v-input :isValid='validState.name' errHint='错误提示'>
                <input v-model="valids.name.value" type="text">
                {{valids.name.value}}
            </v-input>
        </v-form>
    </div>
</template>