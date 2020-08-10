<template>
    <div class="articel-display">
        <h5>{{title}}</h5>
        <div class="articel-content-info">
            <label :class="{'info-set':isGratful}"  @click="handleClickOpinion">
                点赞数:{{articel.GratfulCount}}
            </label>
            <label >
                评论：{{articel.CommentCount}}
            </label>
            <label>
                标签：{{articel.TagName}}
            </label>
            <label>
                发表时间{{articel.Time}}
            </label>
        </div>
        <!-- 下划线 --> 
        <hr />
        <p class="content">
            {{context}}{{context}}{{context}}{{context}}{{context}}
        </p>
        <div class="pages">
            <label @click="handleClickPage(LastPage)" class='page last  d-inline-block w-50'>
                <span class="">{{LastPage.Title}}</span>
            </label>
            <label @click="handleClickPage(NextPage)" class='page next text-right d-inline-block w-50'>
                <span>{{NextPage.Title}}</span>
            </label>
        </div>
        <slot></slot> 
    </div>
</template>
<style lang="scss">
    @import '../../style/mixin/utils';
    .articel-display{
        .content{
            text-indent: 2rem;
        }
        .pages{
            .page{
                &:nth-child(1){
                    span{
                        &::before{
                            content:'';
                            display: inline-block;
                            @include triangle-like(1.5rem,0.75rem);
                            transform:rotateZ(180deg) ;
                            margin:{
                                left: -1.5rem;
                                right: .5rem; 
                            }
                        }
                    }
                }
                &:nth-child(2){
                    span{
                        &::after{
                            content: '';
                            display: inline-block;
                            @include triangle-like(1.5rem,0.75rem);
                            margin:{
                                right: -1.5rem;
                                left:.5rem;
                            }
                        }
                    }
                }
            }
        }
    }
    .info-set{
        color: red;
    }
</style>
<script lang="ts"> 


/* 重新开数据库 */


import {Vue ,Component ,Prop, Watch ,Emit} from 'vue-property-decorator';
//types
import {ArticelVM as VM, NaviInfo as Page} from '../../types/index';
import {Route } from 'vue-router';
// 常量
import {UNSET_NUMBER } from '../../utils/utils';
import { OpinionState } from '@/utils/varia';


@Component
export default class ArticelDisplay extends Vue{
    @Prop({required:true,default:{ContentID:2,ArticelID:1,Title:'假定标题',Text:'假定内容   >_..',Time:new Date(),GratfulCount:2,CommentCount:2,TagID:1,TagName:'标签名'}}) articel!:VM;
    @Prop({required:true}) pages!:Page[]

    @Watch('articel')
    kk(){
        console.log(this.articel)
    }
    
    @Emit('flip-over')
    flipOver(page:Page):void{}
    @Emit('toggle-opinion')
    handleClickOpinion(){}
    
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
    
    get isGratful():boolean {
        let result:boolean= this.articel.UserOpinion===OpinionState.Gratful;
        console.log('isGrateful?',result);
        return result;
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