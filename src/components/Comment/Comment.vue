<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// 组件
import Avatar from '@com/Avatar.vue';
import Opinion from '@com/Opinion.vue';
// 类型
import {SentComment as Sent ,CommentViewModel as VM, User } from '../../types/index'; 
// 常量
import {UNSET_NUMBER, UNSER_VIEREW_NAME} from '../../utils/utils';
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
    <div class="comment ">
        <div class="comment-main d-flex justify-content-center">
            <!-- 头像 -->
            <avatar class="comment-avatar " name='' :portrait='comment.ObsererPortrait'/>
            <!-- 回复的内容 -->
            <p class="context d-inline">
                <span class="responder">
                    <!-- 自己的评论放 一个 【自己标识】 -->
                    <small v-if="comment.ObserverID===user.ID" class="text-muted">(自己)</small> 
                    <span >{{observerName}}</span>
                    <template v-if="isReplyOther">
                        <small class="text-muted mx-2">回复</small>
                        <small v-if="comment.ResponsedViewerID===user.ID" class="text-muted">(自己)</small> 
                        <span >{{reponsedViewerName}}</span>
                    </template>
                    ：
                </span>
                <span class="h6">{{context}}</span>
                <span class="text-muted">{{publicTime}}</span>
            </p>
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
                // flex:1 1 auto;
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