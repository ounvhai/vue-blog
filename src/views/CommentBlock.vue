<template>
    <div class="comment-block">
        
        <h2 class="title">
            留言板
            <hr>
        </h2>
        <cmts class="" :contentID='contentID'></cmts>
    </div>
</template>
<style lang="scss">
    .comment-block{
        .title{
            margin-top: 7rem;
        }
    }
</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Comments from '@com/Comment/Comments.vue';
@Component({
    components:{
        cmts:Comments,
    }
})
export default class CommentBlock extends Vue{
    @Prop({required:true,}) contentID!:number;
}
</script>