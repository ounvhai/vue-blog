
<template>
    <div class="comments">
        <!-- 提交评论部分 -->
        <div class="media">
            <avatar class="comments-write-avatar mr-3" name='' :portrait='observerPortrait'></avatar>
            <div class="media-body">
                <vf class="row" :info='validInfo' @on-validation-end='handleVlidated'>
                    <vi class="form-group col-md-6 col-12"  attr='name'>
                        <input   v-model="validInfo.name.value"  class="form-control form-control-sm" :placeholder="namePlaceHolder" type="text"/>
                    </vi>
                    <vi class="form-group col-md-6 col-12"  attr='contact'>
                        <input   v-model="validInfo.contact.value"  :placeholder="contactPlaceholder"  type="text" class="form-control form-control-sm" />
                    </vi>
                    <vi class="form-group col-12"  attr='comment'>
                        <textarea  :placeholder="placeholder"   v-model="validInfo.comment.value"  rows="3" class="form-control form-control-sm"></textarea>
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
                    尝试中....
                </template>
            </Request-Watcher>
            
            <!-- 取消输入状态按钮 -->
            <button @click="resetInputingComment" class="btn btn-outline-danger ml-3" v-show="isCanReset">取消回复</button>
            <!-- 提交按钮 -->
            <button class="btn btn-outline-dark ml-3" @click="handleClickSubmitBtn">提交</button>
        </div>
        <!-- 评论列表 -->
        <transition name="loading-switching" mode="out-in">
            <loading v-if="isLoading" class="comments-loading  my-4  position-relative text-center"></loading>
            <ul v-else class="main-list mt-4">
                <li class="mb-5 pb-3" v-for='(h,index) in commentHierarchies'  :key="index">
                    <cmt class="main-com text-center" @on-click-opinion='handleToggleOpinion' @click.native="handleClickComment(h.comment,false)" :user='user' :comment='h.comment'>
                        <ul class="sub-list " v-if='h.subComments&&h.subComments.length>0'>
                            <li v-for="(subcomment,index) in h.subComments" :key="index">
                                <cmt class="sub-com" @on-click-opinion='handleToggleOpinion'  @click.native="handleClickComment(subcomment,true)" :user='user' :comment='subcomment'></cmt>
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
        .comments-loading{
            // 居中
            left:50%;
            transform: translateX(-50%);
        }
        .main-list{
            .main-com{
                font-size: 1rem;
                margin-top: 7rem;
                .sub-list{
                    padding: 0;
                    .sub-com{
                        font-size: 0.7rem;
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
import {OpinionState} from '../../utils/varia';
// url,常量
import {UPLOAD_COMMENT as SUBMIT,GET_COMMENTS as FETCH,UPDATE_USER ,TOGGLE as TOGGLE_OPINION} from '../../utils/url';
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
    responded:{Name?:string,ID?:number,isAdmin?:boolean},
    // 父评论的ComentID
    superiorCommentID?:number,
    
}
interface ValidDump{
    [attr:string]:ValidInfo,
}


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
            validator:function(value:string):Promise<any>{
                let regex:RegExp=/^[^\f\n\r]{0,6}$/;
                // 既没有设置过用户名又没有写过任何字
                if(!latestUser().Name&&!value.trim()) { 
                    return Promise.reject(`请先填写用户名 O u O`);
                }
                if(regex.test(value)){ 
                    return Promise.resolve();
                }
                else{ 
                    return Promise.reject('0 < 用户名长度 < = 6')
                } 
            },
            value:'',
        },
        contact:{
            attr:'contact',
            //联系方式要么不填，要么填邮箱或者网址
            validator:(value:string):Promise<any>=>{
                let regexs:RegExp[]=[
                    /^$/,//空串
                    /^(\S+:\/\/)?\w+@\w+\.\w+(\b|\/)$/, //邮箱
                    /(\S+:\/\/)?(\S+\.){2,}\S+/, //网址
                ]
                for(let i=0;i<regexs.length;i++){
                    if(regexs[i].test(value.trim())){
                        return Promise.resolve();//只要匹配到合适的条件就Ok
                    }
                }
                return Promise.reject('不填/邮箱/网址 格式');
            },
            value:''
        },
        comment:{
            attr:'comment',
            // 输入评论不是空串就好
            validator:(value:string):Promise<any>=>{
                let regexp=/[^\f\r\n]+/;
                return regexp.test(value)?Promise.resolve():Promise.reject('请先填写评论')
            },
            value:'',
        }
    }
    //是否所有的输入都通过验证了？
    //由验证后触发的回调handleVlidated（） 修改
    isAllValid:boolean=false; 
    //是否在请求中
    isLoading:boolean=false;
    //Opinion是否正在请求取反
    isTogglingOpinion:boolean=false;
    // 请求中的promise
    request:Promise<any>|null=null;
    //设定rquest显示时间的timer
    requestTimer:number=-1; 



    //评论上传成功后被调用
    @Emit('on-comment-uploaded')
    handleCommentUploaded(){}
    //contentID发生变时更新评论列表
    @Watch('contentID')
    handleContentIDChange():void{
        // 请求新的评论
        this.requestGetComments()
            .then(({data:{Data}})=>{
                this.comments=Data;
            })
        // 清除已经输入的文字信息
        this.resetInputingComment();
        //清空输入的用户信息
        this.resetInputingUser();
        this.isLoading=false;
        this.isAllValid=false;
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
        this.user=latestUser;
        this.requestGetComments()
            .then(({data:{Data}})=>{
                this.comments=Data; 
            })
    }
    // 继承自UserTrace（mixins），每当用户信息更新时触发。
    //如果评论列表中有自己评论的信息，就修改信息以影响显示
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
    //每次验证结束后
    // 使用此回调记录数据
    handleVlidated(attr:string[]):void{
        this.isAllValid=attr.length<=0;
    }
    // 点击提交按钮
    //提交,接受新评论
    //有输入用户信息的话提交下用户信息
    async handleClickSubmitBtn():Promise<any>{
        
        /* 拦截 */

        // 正当有请求中则不让再次发起请求
        if(this.isLoading) return ;

        //有输入过任何内容才能进行下一步
        //再2秒内显示错误提示
        if(!!this.validInfo.comment.value===false) {
            clearTimeout(this.requestTimer)
            this.requestTimer=setTimeout(()=>{
                this.request=null;
            },2000);
            this.request=Promise.reject('请先输入评论内容')
            return ;
        }
        //验证没过的不给提交
        //在2秒内显示错误提示
        if(this.isAllValid===false) {
            clearTimeout(this.requestTimer);
            this.requestTimer=setTimeout(() => {
                this.request=null;
            }, 2000);
            this.request=Promise.reject('请先完成验证')
            return ;
        }
        

        /* 提交请求 */

        // 当前输入值的快照
        let curInputing=Object.assign({},this.validInfo);
        let curCommentState:InputingComment=Object.assign({},this.commentState);
        //发起提交评论请求。如果有输入用户信息，一起提交用户请求
        let requests:Promise<any>[]=[
            //上传评论的请求
            this.requestUploadComment()
                .then(({data})=>{
                    let {Data:{CommentID,ContentID}} = data;
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
                            IsObserverAdmin:this.user.IsAmdin,//自己提交的评论
                            IsTheResponsedAdmin:false
                        }
                    //添加新评论
                    this.comments.push(newComment);
                }),
        ];
        //有提供任何被验证过的用户信息的话发起请求修改全局用户信息
        if(curInputing.contact.value||curInputing.name.value)
            requests.push(
                this.requestAlterUser({
                    Name:curInputing.name.value||undefined,//预防空字符串
                    Contact:curInputing.contact.value||undefined,
                } as User)
                    .then(()=>{
                        // 根据提交成功的输入值，修改全局用户信息
                        let newUser:User=<User>{};
                        if(curInputing.name.value)
                            newUser.Name=curInputing.name.value;
                        if(curInputing.contact.value)
                            newUser.Contact=curInputing.contact.value;
                        this.$mergeUser(newUser);
                    })
            )
        //设置request，准备根据请求的promise状态输出对应提示
        this.request=Promise.all(requests);
        clearTimeout(this.requestTimer);
        await this.request;
        // 清除输入文字。、
        this.resetInputingComment();
        this.resetInputingUser();
        //request出现结果显示提示后2秒后消失提示
        this.requestTimer=setTimeout(() => {
            this.request=null;
        }, 2000);
        // 重置状态
        this.isLoading=false;
    }
    //对于某条comment点击了Opinion
    //对某个content取反
    async handleToggleOpinion(contentID:number):Promise<any>{
        if(this.isTogglingOpinion) return ;//防止重复提交
        this.isTogglingOpinion=true;
        await (this.$axios as AxiosInstance)({
            method:'get',
            url:TOGGLE_OPINION,
            params:{
                contentID,
            }
        }).then(({data:{Data:{ContentID,UserOponion}}})=>{//传送回的是OpinionVM的模型
            let affectedComment:VM=this.comments.filter(el=>el.ContentID===ContentID)[0];
            switch(UserOponion){
                case OpinionState.Unset:
                    affectedComment.IsAppreciated=false;
                    affectedComment.Approval--;
                    break;
                case OpinionState.Gratful:
                    affectedComment.IsAppreciated=true;
                    affectedComment.Approval++;
                    break;
            }
        })
        this.isTogglingOpinion=false;
    }
    // 点击评论触发事件
    //记录要回复的人是谁
    handleClickComment(commentVM:VM,isSubComment:boolean){
        this.commentState.responded={
            Name:commentVM.ObserverName,
            ID:commentVM.ObserverID,
            isAdmin:commentVM.IsObserverAdmin,
        }
        this.commentState.superiorCommentID=isSubComment?commentVM.SuperiorCommentID:commentVM.CommentID;
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
                userID:this.user.ID,
            }
        })
    }
    //发起请求更改用户名
    requestAlterUser(user:User):Promise<any>{
        return (this.$axios as AxiosInstance)({
            url:UPDATE_USER,
            method:'post',
            data:{
                viewer:user,
                userID:this.user.ID,
            },
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