<script lang='ts'>
import {Vue ,Component ,Emit ,Prop} from 'vue-property-decorator';

import UserInfo from './UserInfo.vue';

@Component({
    components:{ 
        UserInfo,  
    }
})
export default class Test extends Vue{
    
}
</script>
<style lang="scss">
    .bi{
        width:30px;
        height: 30px;;
    }
</style>
<template>
    <user-info>
        
    </user-info>
</template>