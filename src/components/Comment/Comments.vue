
<template>
    <div class="comments">
        <!-- 提交评论部分 -->
        <div class="media">
            <avatar class="comments-write-avatar mr-3" name='' :portrait='observerPortrait'></avatar>
            <div class="media-body">
                <vf class="row" :info='validInfo' @on-validation-end='handleVlidated'>
                    <vi class="form-group col-md-6 col-12" :isValid='validState.name' errHint='请先设置昵称'>
                        <input   v-model="validInfo.name.value"  class="form-control form-control-sm" :placeholder="namePlaceHolder" type="text"/>
                    </vi>
                    <vi class="form-group col-md-6 col-12"  :isValid='validState.contact' errHint='不填/填邮箱/填个人网站'>
                        <input v-model="validInfo.contact.value"  :placeholder="contactPlaceholder"  type="text" class="form-control form-control-sm" />
                    </vi>
                    <vi class="form-group col-12" :isValid='validState.comment' errHint='提交评论不为空'>
                        <textarea :placeholder="placeholder"   v-model="validInfo.comment.value"  rows="3" class="form-control form-control-sm"></textarea>
                    </vi>
                </vf>
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
            <button @click="resetInputingComment" class="btn btn-outline-danger ml-3" v-show="isCanReset">取消回复</button>
            <!-- 提交按钮 -->
            <button class="btn btn-outline-dark ml-3" @click="handleClickSubmitBtn">提交</button>
        </div>
        <!-- 评论列表 -->
        <transition name="loading-switching" mode="out-in">
            <loading v-if="isLoading" class="d-inline text-center"></loading>
            <ul v-else class="main-list mt-4">
                <li class="mb-5 pb-3" v-for='(h,index) in commentHierarchies'  :key="index">
                    <cmt class="main-com " @click.native="handleClickComment(h.comment.CommentID,h.comment.ObserverID,h.comment.ObserverName)" :user='user' :comment='h.comment'>
                        <ul class="sub-list " v-if='h.subComments&&h.subComments.length>0'>
                            <li v-for="(subcomment,index) in h.subComments" :key="index">
                                <cmt class="sub-com"  @click.native="handleClickComment(h.comment.CommentID,subcomment.ObserverID,subcomment.ObserverName)" :user='user' :comment='subcomment'></cmt>
                            </li>
                        </ul>
                    </cmt>
                </li>
            </ul>
        </transition>
        
    </div>
</template>
<style lang="scss">
    .comments{
        /* 输入框不可调节 */
        textarea{resize: none;}
        .comments-write-avatar{
            width:3rem;
        }
        .main-list{
            .main-com{
                & *{
                    font-size: 1.1rem;
                }
                .sub-list{
                    .sub-com{
                        & * {
                            font-size: 0.8rem;
                        }
                    }
                }
            }
        }
        
    }
</style>
<script lang="ts">
import {Vue ,Component ,Prop, Watch, Emit} from 'vue-property-decorator';
import {mixins} from 'vue-class-component'
// 组件
import Comment from '@com/Comment/Comment.vue';
import Avatar from '@com/Avatar.vue';
import RequestWatcher from '@com/RequestWatcher.vue';
import ValidForm from '@com/ValidForm/ValidForm.vue';
import ValidInput from '@com/ValidForm/ValidInput.vue';
import Loading from '@com/loading.vue';
// mixins
import UserTrace from '@mixins/UserTrace.vue';
// 类型
import { AxiosInstance } from 'axios';
import {ValidInfo ,User ,CommentViewModel as VM,SentComment as sentCMT} from '../../types/index'
// url,常量
import {UPLOAD_COMMENT as SUBMIT,GET_COMMENTS as FETCH,UPDATE_USER} from '../../utils/url';
import Footer from '@/components/Footer.vue';
import { UNSER_VIEREW_NAME } from '@/utils/utils';
//方法
import {latestUser } from '../../utils/userMgr/index';
//改值代表未设置值【无效值
const UNSER_NUMBER:number=-1;
// 评论层级
interface CommentHierarchy{
    comment:VM,
    subComments:VM[],
}
//评论上下文【要被提交的可修改信息
interface InputingComment{
    //被回复的用户的ID
    responded:{Name?:string,ID?:number},
    // 父评论的ComentID
    superiorCommentID?:number,
    
}
interface ValidDump{
    [attr:string]:ValidInfo,
}
/* 


                        new comment
*/



@Component({
    components:{
        // 评论组件
        cmt:Comment,
        // 头像组件
        Avatar,
        // 请求监听
        RequestWatcher,

        'vf':ValidForm,
        'vi':ValidInput,

        Loading,
    }
})
export default class Comments extends mixins(UserTrace){
    //给哪个content的评论
    @Prop({type:Number,required:true}) readonly contentID!:number;
    
    
    user:User=<User>{};
    
    //评论们【从ajax那里接收来的，需要被get commentHierarchy()整理成评论层级才会变成能显示的东西
    comments:VM[]=[];
    // 当前输入评论及状态
    commentState:InputingComment={
        // 评论ID
        superiorCommentID:undefined,
        // 被回复的人
        responded:{},
    };
    //需要验证的输入规则
    validInfo:ValidDump={
        name:{
            attr:'name',
            validator:(value:string)=>{
                let regex:RegExp=/^[^\f\n\r]{0,6}$/;
                // 既没有设置过用户名又没有写过任何字
                if(!latestUser().Name&&!value.trim()) return false;
                return regex.test(value)
            },
            value:'',
        },
        contact:{
            attr:'contact',
            //联系方式要么不填，要么填邮箱或者网址
            validator:(value:string)=>{
                let regexs:RegExp[]=[
                    /^$/,//空串
                    /^(\S+:\/\/)?\w+@\w+\.\w+(\b|\/)$/, //邮箱
                    /(\S+:\/\/)?(\S+\.){2,}\S+/, //网址
                ]
                for(let i=0;i<regexs.length;i++){
                    if(regexs[i].test(value))
                        return true;
                }
                return false;
            },
            value:''
        },
        comment:{
            attr:'comment',
            // 输入评论不是空串就好
            validator:value=>/\S+/.test(value),
            value:'',
        }
    }
    validState:any={
        name:true,
        contact:true,
        comment:true,
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
    //路由更新的时候
    @Watch('$route')
    handleRouteUpdate():void{
        // 清除已经输入的文字信息
        this.resetInputingComment();
        //清空输入的用户信息
        this.resetInputingUser();
    }
    created(){ 
        // 初始化user信息
        this.user=latestUser();
        // 此处请求评论列表跟 onUserInited 中请求评论并不冲突
        //有userID就是已经UserIntited执行过了。
        if(this.user.ID){
            this.isLoading=true
            this.requestGetComments()
                .then(({data:{Data}})=>{
                    this.comments=Data;
                })
                .finally(()=>{
                    this.isLoading=false;
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
    //有输入用户信息的话提交下用户信息
    async handleClickSubmitBtn():Promise<any>{
        
        /* 拦截 */

        // 正当有请求中则不让再次发起请求
        if(this.isLoading) return ;
        //有验证不通过的话不提交
        if(Object.keys(this.validState).some(name=>this.validState[name]===false)) {
            this.request=Promise.reject('请先完成验证');
            return ;
        }

        /* 提交请求 */

        // 当前输入值的快照
        let curInputing=Object.assign({},this.validInfo);
        let curCommentState:InputingComment=Object.assign({},this.commentState);
        //发起提交评论请求。如果有输入用户信息，一起提交用户请求
        let requests:Promise<any>[]=[
            this.requestUploadComment(),//上传评论的请求
        ];
        if(curInputing.contact.value||curInputing.name.value)
            requests.push(this.requestAlterUser({
                Name:curInputing.name.value||undefined,//预防空字符串
                Contact:curInputing.contact.value||undefined,
            } as User))
        this.request=Promise.allSettled(requests);
        await this.request
            //处理接受到的数据
            .then(([com_reply,user_reply])=>{
                if(user_reply&&user_reply.status==="fulfilled"){
                    let newUser:User=<User>{};
                    curInputing.name.value&&(()=>{newUser.Name=curInputing.name.value})();
                    curInputing.contact.value&&(()=>{newUser.Contact=curInputing.contact.value})();
                    //修改全局用户信息
                    this.$mergeUser(newUser);
                }
                if(com_reply.status==='fulfilled'){
                    let {value:{data:{Data:{CommentID,ContentID}}}} = com_reply;
                    let newComment:VM={//提交成功后的新评论的数据模型
                            ContentID,
                            CommentID,
                            Time:new Date(),
                            Approval:0,
                            IsAppreciated:false,
                            ObserverID:this.user.ID,
                            ObserverName:this.user.Name,
                            ObsererPortrait:this.user.Portrait,
                            Text:curInputing.comment.value,
                            IsInspected:false,
                            SuperiorCommentID:curCommentState.superiorCommentID,
                            ResposedViewerName:curCommentState.responded.Name||UNSER_VIEREW_NAME,
                            ResponsedViewerID:curCommentState.responded.ID||UNSER_NUMBER,
                        }
                    //添加新评论
                    this.comments.push(newComment);
                }
            })
            //清除数据
            .finally(()=>{
                this.resetInputingComment();
                this.resetInputingUser();//注册下一个then
            })
            .then(()=>{
                // this.handleVlidated(根据验证结果修改bool值以控制是否显示错误提示文字）执行后才执行此微任务
                //取消验证状态
                Object.keys(this.validState).forEach(name=>{
                    this.validState[name]=true;
                })
            })
        this.isLoading=false;
    }
    // 点击评论触发事件
    //参数:父级评论ID,被回复的人的ID,被回复的人的名字
    //作用:设置输入评论框上,写回复谁谁谁
    handleClickComment(superiorCommentID?:number,respondedUserID?:number,respondedUserName?:string){
        this.commentState.superiorCommentID=superiorCommentID;
        this.commentState.responded={
            Name:respondedUserName,
            ID:respondedUserID,
        }
    }
    //验证结束后处理验证结果
    handleVlidated(attr:string[]):void{
        //先把所有结果设置为true，单独挑出验证失败的设置验证结果为false
        Object.keys(this.validState).forEach(name=>{
            this.validState[name]=true;
        })
        attr.forEach(name=>{
            this.validState[name]=false;
        })
    }
    // 发起请求提交评论
    requestUploadComment():Promise<any>{
        return (this.$axios as AxiosInstance)({
            url:SUBMIT,
            data:this.sentComment,
            method:'POST',
        });
    }
    // 发起请求整个评论列表
    requestGetComments():Promise<any>{
        return (this.$axios as AxiosInstance)({
            method:'get',
            url:FETCH,
            params:{
                contentID:this.contentID,
            }
        })
    }
    //发起请求更改用户名
    requestAlterUser(user:User):Promise<any>{
        return (this.$axios as AxiosInstance)({
            url:UPDATE_USER,
            method:'get',
            params:user,
        })
    }
    // 清空输入的评论
    resetInputingComment():void{
        this.validInfo.comment.value='';
        this.commentState.responded={};
        this.commentState.superiorCommentID=undefined;
    }
    //清空输入的用户信息
    resetInputingUser():void{
        this.validInfo.name.value=this.validInfo.contact.value='';
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
                // 大概同上,此块是主评论的处理
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
        if(this.commentState.responded.ID&&this.commentState.responded.ID!==UNSER_NUMBER)
            return `回复 : ${this.commentState.responded.Name||UNSER_VIEREW_NAME}`;
        return `写下你的评论...`;
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
            Content:this.validInfo.comment.value,
            // 再哪个content下的评论
            UnderContentID:+this.contentID,
            // 评论者的ID
            ObserverID:this.user.ID,
            //被回复的人的ID
            RespondedViewerID:this.commentState.responded.ID,
            //此被提交评论的父评论ID[如果有]
            SuperiorCommentID:this.commentState.superiorCommentID,
        } as sentCMT;
    }
    // 是否可以重置评论的输入
    get isCanReset():boolean{
        // 有输入的文字评论,或则有选定要回复的人时,就可以重置评论未为输入状态
        return this.validInfo.comment.value||this.commentState.responded.ID&&this.commentState.responded.ID!=UNSER_NUMBER
    }




    // 输入用户名的placeholder
    get namePlaceHolder():string{
        if(this.user.Name)
            return this.user.Name;
        return '用户名  *  必填';
    }
    //输入联系方式的placeholder
    get contactPlaceholder():string{
        if(this.user.Contact)
            return '(つ﹏⊂)..get,捂住不给看';
        return '联系方式  选填邮箱/个人网站';
    }
    
}
</script>