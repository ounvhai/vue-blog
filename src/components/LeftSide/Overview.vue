<template>
    <div class="overview">
        <div class="name my-4 h4 text-center">Ling</div>
        <ul class="list" style="padding:0">
            <li class="mr-1">
                <small class="d-inline">熟悉<span class="underline text-info">JavaScript</span>，理解<span class="underline text-info">闭包，作用域</span>。了解JavaScript执行过程中的<span class="underline  text-info">堆栈操作</span>，以及<span class="underline text-info">宏任务微任务的执行时机</span></small>
            </li>
            <li class="mr-1">
                <small class="d-inline">熟悉使用<span class="underline text-info">vue2</span>的基本使用，制作可重用的组件。</small>
            </li>
            <li class="mr-1"><small>熟悉<span class="underline text-info">常用css3</span>，简单地结合<span class="d-inline underline text-info">sass</span>的@mixin，@include,@function等尽量写出简洁的css代码</small></li>
            <li class="mr-1">
                <small class="d-inline">有<span class="underline text-info">面向对象基础（c#）</span>，使用<span class="underline text-info">entityframework+linq</span>对数据库进行增删查改</small>
            </li>
            <li class="mr-1">
               <small> 简单使用<span class="underline text-info">git</span>，命令行下查看状态，分支，提交，回退，</small>
            </li>
            <li>
                <small class="underline text-info"><a href="https://github.com/ounvhai/personal-blog">源码(链接)</a></small>
            </li>
        </ul>
    </div>
</template>
<style lang="scss">
    @import '../../style/variable';
    .overview{
        .name{
            font-weight: $font-weight*1.5;
        }
        .list{
            .underline{
                text-decoration: underline;
                margin:{
                    left:.5rem;
                    right: .5rem;
                }
                font-weight: 400;
            }
            li::before{
                //形态
                content:'';
                display: inline-block;
                width: 1rem;
                height: 1rem;
                background:black;
                border-radius: 50%;
                //缩小一半
                transform:scaleX(.5) scaleY(.5);
                margin:{
                    left: .5rem;
                    right:.5rem;
                }
            }
            
        }
    }
</style>
<script lang="ts">
import {Vue ,Component } from 'vue-property-decorator';

@Component
export default class Overview extends Vue{

}
</script>