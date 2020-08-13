<template>
    <div class="articel-list-item">
        <h3>{{Title}}</h3>
        <p>{{content}}</p>
        <div class="info">
            <span>评论{{CommentCount}}</span>
            <span>时间{{Time}}</span>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue ,Component ,Prop, Watch ,Emit} from 'vue-property-decorator';

// 类型
import {ArticelVM as VM} from '../../types/index';
@Component
export default class ArticelListItem extends Vue{
    @Prop({required:true}) articel!:VM;

    get Title():string{
        return this.articel.Title;
    }
    get content():string{
        return this.articel.Text;
    }
    get CommentCount():number{
        return this.articel.CommentCount;
    }
    get Time():string{
        return this.articel.Time.toString();
    }
}
</script>