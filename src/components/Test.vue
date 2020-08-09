<script lang='ts'>
import {Vue ,Component ,Emit ,Prop} from 'vue-property-decorator';


// 组件
// import Avatar from './Avatar.vue';
// import Comment from './Comment.vue';
// import Comments from '@views/Comments.vue';
import Articel from '@com/Articel/Articel.vue';
import { CommentViewModel, User } from '../types';

@Component({
    components:{ 
        atc:Articel,
    }
})
export default class Test extends Vue{
    @Prop({type:Number,required:true})  articelID!:number;
    @Prop() contentID!:number;

    created(){
        console.log('');
    }
    
}
</script>

<template>
    <div class="t">
        <atc :articelID='articelID' :contentID='contentID' ></atc>
    </div>
</template>