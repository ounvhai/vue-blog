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
      // articel路由
      path:'/',
      name:'tmp',
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
      path:'Articels/:tagID',
      name:'main',
      component:()=>import('@views/ArticelList.vue'),
      props:true,
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
      component:()=>import("@views/CommentBlock.vue"),
      props:{
        contentID:CONTENT_ID_OF_COMMENT,
      }
    }, 
    
  ],
});
