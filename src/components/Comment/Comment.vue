<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
// 组件
import Avatar from '@com/Avatar.vue';
import Opinion from '@com/Opinion.vue';
// 类型
import {SentComment as Sent ,CommentViewModel as VM, User } from '../../types/index'; 
// 常量
import {UNSET_NUMBER, UNSER_VIEREW_NAME} from '../../utils/utils';
//方法
import moment from 'moment';
@Component({
    components:{
        Avatar,
        Opinion,
    },
    filters:{
        public_time:function(value:string):string{
            let formated:string=moment(value).locale('zh-cn').format('lll');
            return formated
        }
    }
})
export default class Comment extends Vue {
    // 评论
    @Prop({required:true}) comment!:VM;
    //当前用户的信息
    @Prop({required:true}) user!:User;

    //告知父组件，点了toggle按钮
    @Emit('on-click-opinion') 
    handleClickOpinion():number{
       return this.comment.ContentID;
    }
    created(){
        this.comment.IsObserverAdmin
    }

   
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
        <div class="comment-main ">
            <!-- 头像 -->
            <avatar class="comment-avatar d-inline-block" name='' :portrait='comment.ObsererPortrait'/>
            <small v-if="comment.IsInspected===false" class="text-warning ml-2">
                审核中
            </small>
            <!-- 自己的评论放 一个 【自己标识】 -->
            <small  v-if="comment.ObserverID===user.ID" class="simple ml-2 text-muted">(自己)</small>
            <small class=" ml-2 badge badge-secondary" v-if='comment.IsObserverAdmin'>
                站长
            </small> 
            <span class="emphasize ml-2">{{observerName}}</span>
            <template v-if="isReplyOther">
                <small class=" simple text-muted ml-2">回复</small>
                <small v-if="comment.ResponsedViewerID===user.ID" class="simple text-muted ml-2">(自己)</small> 
                <small v-if='comment.IsObserverAdmin' class="badge badge-secondary ml-2">
                    站长
                </small> 
                <span  class="emphasize ml-2">{{reponsedViewerName}}</span>
            </template>
            ： 
            <span class=" emphasize mr-5">{{context}}</span>
            <span class="simple text-muted mr-4">{{publicTime | public_time}}</span>
            <span @click.stop="handleClickOpinion" > 
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="mr-1 bi bi-suit-heart-fill " fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path class="fading" :class="[comment.IsAppreciated?'text-danger':'text-muted']"  d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                </svg>
                <span  class="fading" :class="[comment.IsAppreciated?'text-danger':'text-muted']">
                    {{comment.Approval}}
                </span>
            </span> 
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
                .simple{
                    font-size: .85em;
                }
                .emphasize{
                    font-size: 1.1em;
                }
                .fading{
                    transition: all .5s ease-out;
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