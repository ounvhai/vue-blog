import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 事件总线单例
import {getEventBus } from './utils/eventBus';
// ajax
import Axios from './utils/http';
//更新用户信息
import {updateUser } from './utils/userMgr/index';


// 主题
import "@style/main.scss";
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; 
// import 'bootstrap'


Vue.config.productionTip = false;
// 事件总线
Vue.prototype.$eventbus=getEventBus();
// Axios
Vue.prototype.$axios=Axios;
//update Global User
Vue.prototype.$mergeUser=updateUser;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
