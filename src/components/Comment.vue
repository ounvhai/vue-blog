<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// 组件
import Avatar from './Avatar.vue';
import Opinion from '@com/Opinion.vue';
// 类型
import {SentComment as Sent ,CommentViewModel as VM, User } from '../types/index'; 
// 常量
import {UNSET_NUMBER, UNSER_VIEREW_NAME} from '../utils/utils.ts';
@Component({
    components:{
        Avatar,
        Opinion,
    },
})
export default class Comment extends Vue {
    // 评论
    @Prop({required:true}) comment!:VM;
    //当前用户的信息
    @Prop({required:true}) user!:User;
    
    //评论者的用户名
    get observerName():string{
        return this.comment.ObserverName||UNSER_VIEREW_NAME;
    }
    // 是否回复他人的评论
    get isReplyOther():boolean{//用户ID,数据库表是从1开始的,不担心
        // 是不是回复他人主要看 this.comment.ResponsedViewerID,只要不是undefined,null,-1就行
        let reponserdID:number|null|undefined=this.comment.ResponsedViewerID;
        if(reponserdID!==null&&reponserdID!==undefined&&typeof reponserdID==="number"&&reponserdID!==UNSET_NUMBER)
            return true;
        return false;
    }
    // 被回复的人的用户名
    get reponsedViewerName():string{//可能用户并没有改过名字是空字符串
        if(this.isReplyOther) return (this.comment.ResposedViewerName as string)||UNSER_VIEREW_NAME;
        return '';
    }
    // 评论内容
    get context():string{
        return this.comment.Text;
    }
    // 评论发表时间
    get publicTime():Date|string{
        return this.comment.Time;
    }
    //当前评论的ContentID
    get contentID():number{
        return this.comment.ContentID;
    }
}
</script>
<template>
    <div class="comment">
        <div class="comment-main d-flex">
            <!-- 头像 -->
            <avatar class="comment-avatar " name='' :portrait='comment.ObsererPortrait'/>
            <!-- 回复的内容 -->
            <div class="context d-inline">
                <span class="responder">
                    <span v-if="comment.ObserverID===user.ID" class="text-muted">(自己)</span> 
                    {{observerName}}
                    <template v-if="isReplyOther">
                        <span class="text-muted">回复</span>
                        <span v-if="comment.ResponsedViewerID===user.ID" class="text-muted">(自己)</span> 
                        {{reponsedViewerName}}
                    </template>
                    ：
                </span>
                {{context}}
                <span class="text-muted">{{publicTime}}</span>
            </div>
            <!-- 点赞 -->
            <!-- <Opinion class="comment-opnion" :isZan='false' :contentID='contentID'></Opinion> -->
        </div>
        <slot></slot>
    </div>
</template>
<style lang="scss">
    .comment{
        .comment-main{
            // 头像
            .comment-avatar{
                // 头像宽度内容自适应
                flex:0 0 auto;
                width: 1.3rem;
            }
            // 评论内容
            .context{
                //中间自适应
                flex:1 1 auto;
                .responder{
                    
                }
            }
            // 点赞符号
            .comment-opnion{
                flex: 0 0 auto;
                width: 1.5rem;
            }
        }
        
    }
</style>