import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 自我介绍的文章ID
export const INTRODUCTION_ARTICRL_ID=1;
//自我介绍的content ID
export const INTRODUCTION_CONTENT_ID=2;
//评论板块的contentID
export const CONTENT_ID_OF_COMMENT=1;


export default new Router({
  routes: [
    {
      /* articel路由 */
      path:'/',
      redirect:{name:'articel',query:{
        articelID:INTRODUCTION_ARTICRL_ID,
        contentID:INTRODUCTION_CONTENT_ID,
      }},
    },
    {
      path:'/',
      name:'articel',
      props:(route)=>({
        articelID:route.query.articelID,
        contentID:route.query.contentID,
      }),
      component:()=>import('@com/Articel/Articel.vue'),
    },
    {
      /* 测试路由 */
      path:'/t',
      name:'test',
      component:()=>import('@com/Test.vue'),
      props:{
        articelID:INTRODUCTION_ARTICRL_ID,
        contentID:INTRODUCTION_CONTENT_ID,
      }
    },
    {/* 留言板 */
      path:'/Comments',
      name:'comments',
      component:()=>import("@views/Comments.vue"),
      props:{
        contentID:CONTENT_ID_OF_COMMENT,
      }
    },
    {
      /* 主页路由 */
      path:'/Main',
      name:'main',
      component:()=>import('@views/Main.vue'),
    },
    {
      /* 标签组件 */
      path:'',
      name:'contents',
      component:()=>import('@views/Tags.vue'),
      children:[
        {
          /* 文章列表组件 */
          path:'/Articels',
          name:'articels',
          component:()=>import("@views/ArticelList.vue"),
        },
        {
          // 心情组件
          path:'/Emotions',
          name:'emotions',
          component:()=>import("@views/EmotionList.vue"),
        }
      ]
    }
  ],
});
