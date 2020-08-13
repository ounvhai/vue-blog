<template>
    <form class="user-info media">
        <!-- 
            用户名必填
            联系方式 选填

         -->
         <avatar class="user-info-avatar mr-3" name='' :portrait='user.Portrait'></avatar>
             <form class="media-body form-row gutter-20">
                 <div class="form-group w-50 pr-3">
                     <label >用户名</label>
                     <input type="text" class="form-control">
                     <small class="form-text text-muted">提示语</small>
                 </div>
                 <div class="form-group w-50 pl-3">
                     <label >用户名</label>
                     <input type="text" class="form-control">
                     <small class="form-text text-muted">提示语</small>
                 </div>
             </form>
    </form>
</template>
<style lang="scss">
    .user-info{
        .user-info-avatar{
            width: 3rem;
        }
    }
</style>
<script lang="ts">
import { Component, Prop, Vue ,Mixins} from 'vue-property-decorator';

// 组件
import UserTrace from '@mixins/UserTrace.vue';
import Avatar from '@com/Avatar.vue';
//类型
import { User } from '@/types';
//方法
import {latestUser } from '../utils/userMgr/index'
// import {hasCookie} from '../utils/utils';

@Component({
    components:{
        Avatar,
    }
})
export default class UserInfo extends Mixins(UserTrace){



    user:User=<User>{};

    isInited:boolean=false;
    created(){
        this.user=latestUser();
    }
    //继承而来的方法
    onUserUpdate(latestUser:User):void{
        this.user=latestUser;
    }
    //继承而来的方法
    onUserInited(latestUser:User):void{

    }
}
</script>
