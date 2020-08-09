<template>
    <div class="articel-display">
        <h6>{{title}}</h6>
        <div class="articel-content-info">
            内容物,con tentInfo
        </div>
        <!-- 下划线 --> 
        <hr />
        {{context}}
        <div class="pages">
            <label @click="handleClickPage(LastPage)" class='last'>{{LastPage.Title}}</label>
            <label @click="handleClickPage(NextPage)" class='next'>{{NextPage.Title}}</label>
        </div>
        <slot></slot> 
    </div>
</template>
<script lang="ts"> 


/* 重新开数据库 */


import {Vue ,Component ,Prop, Watch ,Emit} from 'vue-property-decorator';
//types
import {ArticelVM as VM, NaviInfo as Page} from '../../types/index';
import {Route } from 'vue-router';
// 常量
import {UNSET_NUMBER } from '../../utils/utils';


@Component
export default class ArticelDisplay extends Vue{
    @Prop({required:true,default:{ContentID:2,ArticelID:1,Title:'假定标题',Text:'假定内容   >_..',Time:new Date(),GratfulCount:2,CommentCount:2,TagID:1,TagName:'标签名'}}) articel!:VM;
    @Prop({required:true}) pages!:Page[]
    
    @Emit('flip-over')
    flipOver(page:Page):void{}
    
    handleClickPage(page:Page):void{
        if(page.ArticelID!==UNSET_NUMBER)
            this.flipOver(page);
    }

    // 标题
    get title():string{
        return this.articel.Title;
    }
    get context():string{
        return this.articel.Text;
    }
    

    get NextPage():Page{
        return [...this.pages].filter(instance=>instance&&instance.ArticelID>this.articel.ArticelID)[0]||this.defaultPage;
    }
    get LastPage():Page{
        return [...this.pages].filter(instance=>instance&&instance.ArticelID<this.articel.ArticelID)[0]||this.defaultPage;
    }
    get defaultPage():Page{
        return {Title:'没有啦',ArticelID:UNSET_NUMBER,ContentID:UNSET_NUMBER} as Page;
    }

}
</script>