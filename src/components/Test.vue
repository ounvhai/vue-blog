<script lang='ts'>
import {Vue ,Component ,Emit ,Prop} from 'vue-property-decorator';

//组件
import ValidForm from './ValidForm/ValidForm.vue';
import ValidItem from './ValidForm/ValidInput.vue'

import Loading from './loading.vue';
//类型
import {ValidInfo} from '../types/index';
@Component({
    components:{ 
        Loading,
    }
})
export default class Test extends Vue{
    
}
</script>
<style lang="scss">
    .l{
        font-size: 2.8rem;
        // font-weight: 100;
    }
</style>
<template>
    <div class="test text-center">
        <loading class="l "></loading>
    </div>
</template>