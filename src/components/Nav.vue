<template>
    <div  class="navigation d-flex text-center">
        <!-- 导航组件 -->
        <!-- 
            是否可以跳转
                当前路由
                名字跳转去相同的路由名&&路由参数
         -->
         <div class="item py-2">空白</div>
         <div class="navigation-item item px-5 py-2" v-for="(item,index)  in navItems" :key='index'>{{item.title}}</div>
    </div>
</template>
<style lang="scss">
    .navigation{
        .item{
            cursor: pointer;
            width: auto;
            // 默认所有item都是内容自适应。但是第一个要把余下的空位都占了
            flex:0 0 auto;
            &:nth-child(1){
                flex:1 0 auto;
            }
            // 描边
            &[class*='navigation-item']{
                box-shadow: -1px 0.5px 0 0px var(--my-web-color);
            }
        }
    }
</style>
<script lang='ts'>
interface NavItem{
    title:string,
    aheadTo:RawLocation,

}
import {Vue ,Component } from 'vue-property-decorator';
import VueRouter, { Route } from 'vue-router';

// 类型
import {RawLocation} from 'vue-router'
@Component
export default class Nav extends Vue{
    
    navItems:NavItem[]=[
        {
            title:'感想',
            aheadTo:{name:'',params:{}},
        },
        {
            title:'杂文',
            aheadTo:{name:'',params:{}}
        }
    ];
    
    /* 是否在当前路由 */
    isInLocation(toRoute:Route):boolean{
        return false;
    }
}
</script>