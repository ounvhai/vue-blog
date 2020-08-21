<template>
    <div class="articel-list-item mt-4">
        <h3 class="title mb-3">{{Title}}</h3>
        <p class="context">{{content.repeat(30)}}</p>
        <div class="info float-right ">
            <label class=' mr-3'>
                <svg width="1em" style="transform:rotateZ(90deg)" height="1em" viewBox="0 0 16 16" class="bi bi-tags " fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                    <path fill-rule="evenodd" d="M5.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    <path d="M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                </svg>
                <small @click.stop="handleClickTag()" class="name ml-1" >{{TagName}}</small>
            </label>
            <label class="mr-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-right-quote" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M2 1h12a1 1 0 0 1 1 1v11.586l-2-2A2 2 0 0 0 11.586 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                    <path fill-rule="evenodd" d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
                </svg>
                <small  class="ml-1">{{CommentCount}}</small>
            </label>
            <label class="mr-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-alarm" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 15A6 6 0 1 0 8 3a6 6 0 0 0 0 12zm0 1A7 7 0 1 0 8 2a7 7 0 0 0 0 14z"/>
                    <path fill-rule="evenodd" d="M8 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.053.224l-1.5 3a.5.5 0 1 1-.894-.448L7.5 8.882V5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
                    <path fill-rule="evenodd" d="M11.646 14.146a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1-.708.708l-1-1a.5.5 0 0 1 0-.708zm-7.292 0a.5.5 0 0 0-.708 0l-1 1a.5.5 0 0 0 .708.708l1-1a.5.5 0 0 0 0-.708zM5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                    <path d="M7 1h2v2H7V1z"/>
                </svg>
                <small class="ml-1">{{Time | public_articel_time}}</small>
            </label>
        </div>
    </div>
</template>
<style lang="scss">
@import '../../style/mixin/utils';
    .articel-list-item{
        .title{
            margin-top: 6rem;
        }
        .context{
            //最多显示3行，超过就...号
            @include text-lines(3);
            // 折行
            word-break: break-all;
            word-wrap: break-word;
            // 字体样式
            text-indent: 2rem;
            line-height: 2rem;
        }
        .info{
            .name{
                cursor:-webkit-zoom-in;
                &:hover{
                    text-decoration: underline;
                }
            }
        }
    }
</style>
<script lang="ts">
import {Vue ,Component ,Prop, Watch ,Emit} from 'vue-property-decorator';

// 类型
import {ArticelVM as VM} from '../../types/index';

@Component
export default class ArticelListItem extends Vue{
    @Prop({required:true}) articel!:VM;

    //点击标签触发,返回标签的ID
    @Emit('on-tag-click')
    handleClickTag():number{
        return this.articel.TagID
    }

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
    get TagName():string{
        return this.articel.TagName;
    }
}
</script>