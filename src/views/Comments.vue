
<style lang="scss">
    .comments{
        .comments-submit{
            .comments-write-avatar{
                flex:0 0 auto;
                width: 3.8rem;
            }
            .input-area{
                flex:1 1 auto;
                textarea{
                    resize: none;
                }
            }
        }
         
    }
</style>
<template>
    <div class="comments ">
        <slot name="front"></slot>
        <!-- 提交评论的部分 -->
        <div class="comments-submit d-flex">
            <avatar class="comments-write-avatar mr-3" name='' :portrait='observerPortrait'></avatar>
            <div class="form-group input-area">
                <textarea v-model="inputing.txt" :placeholder="placeholder" rows="5" class="form-control"></textarea>
            </div>
        </div>
        <slot name="behind-submit"></slot>
        <div class="d-flex justify-content-end">
            <!-- 请求状态 -->
            <Request-Watcher class="text-center" :request='request'>
                <template #done>
                    评论提交成功
                </template>
                <template #err>
                    评论失败~
                </template>
                <template #loading>
                    请求中...
                </template>
            </Request-Watcher>
            <!-- 取消输入状态按钮 -->
            <button @click="resetInputingComment" class="btn btn-outline-dark ml-3" v-show="isCanReset">取消回复</button>
            <!-- 提交按钮 -->
            <button class="btn btn-outline-dark ml-3" @click="handleClickSubmitBtn">提交</button>
        </div>
        <!-- 评论列表 -->
        <ul class="comment-list">
            <li v-for='(h,index) in commentHierarchies' :key="index">
                <!--方法参数: superiorCommentID?:number,respondedUserID?:number,respondedUserName?:string -->
                <cmt @click.native="handleClickComment(h.comment.CommentID,h.comment.ObserverID,h.comment.ObserverName)" :user='user' :comment='h.comment'>
                    <ul class="sub-comment-list" v-if='h.subComments&&h.subComments.length>0'>
                        <li v-for="(subcomment,index) in h.subComments" :key="index">
                            <cmt @click.native="handleClickComment(h.comment.CommentID,subcomment.ObserverID,subcomment.ObserverName)" :user='user' :comment='subcomment'></cmt>
                        </li>
                    </ul>
                </cmt>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">




import {Vue ,Component ,Prop, Watch, Emit} from 'vue-property-decorator';
import {mixins} from 'vue-class-component'
// 组件
import Comment from '@com/Comment.vue';
import Avatar from '@com/Avatar.vue';
import RequestWatcher from '@com/RequestWatcher.vue';
// mixins
import UserTrace from '@mixins/UserTrace.vue';
// 类型
import { User ,CommentViewModel as VM,SentComment as sentCMT} from '../types';
import { AxiosInstance } from 'axios';
// url
import {UPLOAD_COMMENT as SUBMIT,GET_COMMENTS as FETCH} from '../utils/url.ts';
import Footer from '@/components/Footer.vue';
import { UNSER_VIEREW_NAME } from '@/utils/utils';
//方法
import {latestUser } from '../utils/userMgr/index';
//改值代表未设置值【无效值
const UNSER_NUMBER:number=-1;
// 评论层级
interface CommentHierarchy{
    comment:VM,
    subComments:VM[],
}
//评论上下文【要被提交的可修改信息
interface InputingComment{
    // 评论文字
    txt:string,
    //被回复的用户的ID
    responded:{Name?:string,ID?:number},
    // 父评论的ComentID
    superiorCommentID?:number,
}
@Component({
    components:{
        // 评论组件
        cmt:Comment,
        // 头像组件
        Avatar,
        // 请求监听
        RequestWatcher,
    }
})
export default class Comments extends mixins(UserTrace){
    //给哪个content的评论
    @Prop({type:Number,required:true}) readonly contentID!:number;
    
    
    user!:User;
    
    //评论们【从ajax那里接收来的，需要被get commentHierarchy整理成评论层级才会变成能显示的东西
    comments:VM[]=[];
    // 当前输入评论的状态
    inputing:InputingComment={
        txt:'',
        superiorCommentID:undefined,
        // 被回复的人
        responded:{},
    }
    //是否在请求中
    isLoading:boolean=false;
    // 请求中的promise
    request:Promise<any>|null=null;

    //评论上传成功后被调用
    @Emit('on-comment-uploaded')
    handleCommentUploaded(){}
    //contentID发生变时更新评论列表
    @Watch('contentID')
    handleContentIDChange():void{
        this.requestGetComments()
            .then(({data:{Data}})=>{
                this.comments=Data;
            })
    }
    created(){ 
        this.user=latestUser();
        // 此处请求评论列表跟 onUserInited 中请求评论并不冲突
        //有userID就是已经UserIntited执行过了。
        if(this.user.ID){
            this.requestGetComments()
                .then(({data:{Data}})=>{
                    this.comments=Data;
                    console.log('评论：',this.comments);
                });
        }
    }
    // 继承自UserTrace（mixins）,全局第一次更新用户信息的时候触发
    //因为请求评论需要用到用户ID，所以先等用户信息更新有用户ID再请求
    onUserInited(latestUser:User):void{
        this.requestGetComments()
            .then(({data:{Data}})=>{
                this.comments=Data;
            })
    }
    // 继承自UserTrace（mixins），每当用户信息更新时触发。
    onUserUpdate(latestUser:User):void{
        // 更新显示的用户名
        this.user=latestUser; 
        // 更新评论集合中，自己评论用到的名字跟头像
        this.comments.forEach((vm:VM)=>{
            if(vm.ObserverID===latestUser.ID){
                vm.ObserverName=latestUser.Name;
                vm.ObsererPortrait=latestUser.Portrait;
            }
        })
    }
    // 点击提交按钮
    //提交,接受新评论
    async handleClickSubmitBtn():Promise<any>{
        // 正当有请求中则不让再次发起请求
        if(this.isLoading) return ;
        // 没输入文字则提示没输入
        if(!!this.inputing.txt===false){
            // 显示对应情况的提示语
            this.request=new Promise((ok,err)=>{err(' ** 请先填写评论')});
            return;
        } 
        //提交评论时的数据快照
        let inputNow:InputingComment=Object.assign({},this.inputing);
        this.isLoading=true;
        this.request= this.requestUploadComment()
        this.request.
            then(({data})=>{
                // 追加新评论
                let {ContentID ,CommentID }=data.Data;
                var newComment:VM={
                    ContentID,
                    CommentID,
                    Time:new Date(),
                    Approval:0,
                    IsAppreciated:false,
                    ObserverID:this.user.ID,
                    ObserverName:this.user.Name,
                    ObsererPortrait:this.user.Portrait,
                    ResposedViewerName:inputNow.responded.Name||UNSER_VIEREW_NAME,
                    ResponsedViewerID:inputNow.responded.ID||UNSER_NUMBER,
                    Text:inputNow.txt,
                    SuperiorCommentID:inputNow.superiorCommentID,
                    IsInspected:false,
                }
                this.comments.push(newComment);
                // 清空输入状态
                this.resetInputingComment();
                this.handleCommentUploaded();
            })
        await this.request;
        this.isLoading=false;
    }
    // 点击评论触发事件
    //参数:父级评论ID,被回复的人的ID,被回复的人的名字
    handleClickComment(superiorCommentID?:number,respondedUserID?:number,respondedUserName?:string){
        this.inputing.superiorCommentID=superiorCommentID;
        this.inputing.responded={
            Name:respondedUserName,
            ID:respondedUserID,
        }
    }
    // 请求提交评论
    requestUploadComment():Promise<any>{
        return (this.$axios as AxiosInstance)({
            url:SUBMIT,
            data:this.sentComment,
            method:'POST',
        });
    }
    // 请求评论列表
    requestGetComments():Promise<any>{
        return (this.$axios as AxiosInstance)({
            method:'get',
            url:FETCH,
            params:{
                contentID:this.contentID,
            }
        })
    }
    // 重置输入的评论
    resetInputingComment():void{
        this.inputing={
            txt:'',
            responded:{},
            superiorCommentID:undefined,
        }
    }
    //整理评论层级 成 可以用作显示的结构
    //先分好每个评论的组别层级,每个组是一个CommentHierarchy实例
    //然后把得到的CommentHierarchy 数组去空,排序一下
    get commentHierarchies():CommentHierarchy[]{
        // 使用commentID作每个CommentHierarchy 实例的标识
        //commentID只是暂时用作标识,用来标识组别的.
        let format:CommentHierarchy[]=[];
        this.comments.forEach((vm:VM)=>{
            //如果该评论是子级评论,则先确保hierarchy存在format中
            //然后把放入hierarchy中
            if(isSubComment(vm)){
                // 获得一个 CommentHierarchy 实例,存在就从format中获取,不存在就新建一个
                let hierarchy:CommentHierarchy=AccessHierarchy(vm.SuperiorCommentID);
                // 确保format中有这个 CommentHierarchy 实例
                if(format.indexOf(hierarchy)===-1) format[vm.SuperiorCommentID as number]=hierarchy;
                // 子评论添加到 CommentHierarchy 实例中
                hierarchy.subComments.push(vm);
            }else{
                // 大概同上,主评论的处理
                let hierarchy:CommentHierarchy=AccessHierarchy(vm.CommentID);
                if(format.indexOf(hierarchy)===-1) format[vm.CommentID]=hierarchy;
                hierarchy.comment=vm;
            }
        })
        //去空,主评论越新越前
        let final= format.filter((instance:CommentHierarchy)=>instance).sort((a:CommentHierarchy,b:CommentHierarchy)=>b.comment.CommentID-a.comment.CommentID);
        return final;
        // 是否子评论
        function isSubComment(vm:VM):boolean{
            return vm.SuperiorCommentID!==undefined&&vm.SuperiorCommentID!==UNSER_NUMBER
        }
        // 获得CommentHierarchy实例.存在则返回现有值,不存在则返回新建值
        function AccessHierarchy(hierarchyID?:number):CommentHierarchy{
            if(hierarchyID&&format[hierarchyID])
                return format[hierarchyID];
            return {
                comment:{} as VM,
                subComments:[],
            } as CommentHierarchy;
        }
        
    }
    // 输入评论框显示的默认语
    // 跟选择要回复的人有关
    get placeholder():string{
        //如果有指定要回复的人
        if(this.inputing.responded.ID&&this.inputing.responded.ID!==UNSER_NUMBER)
            return `回复 : ${this.inputing.responded.Name||UNSER_VIEREW_NAME}`;
        return `写下你的评论...`;
    }
    // 当前用户的用户名称
    get observerName():string{
        if(this.user.Name) return this.user.Name;
        return '热心网友-'+this.user.ID;
    }
    // 当前用户的头像
    get observerPortrait():string|null{
        if(this.user) return this.user.Portrait;
        return null;
    }
    // 要被提交的评论信息
    get sentComment():sentCMT{ 
        return {
            // 评论内容
            Content:this.inputing.txt,
            // 再哪个content下的评论
            UnderContentID:+this.contentID,
            // 评论者的ID
            ObserverID:this.user.ID,
            //被回复的人的ID
            RespondedViewerID:this.inputing.responded.ID,
            //此被提交评论的父评论ID[如果有]
            SuperiorCommentID:this.inputing.superiorCommentID,
        } as sentCMT;
    }
    // 是否可以重置评论的输入
    get isCanReset():boolean{
        // 有输入的文字评论,或则有选定要回复的人时,就可以重置评论未为输入状态
        return (!!this.inputing.txt)||(!!this.inputing.responded.ID&&this.inputing.responded.ID>UNSER_NUMBER);
    }
    
}
</script>