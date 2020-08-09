<script lang="ts">
import {Vue ,Component } from 'vue-property-decorator';

// 方法
import {registUpdatedHandler ,registInitedHandler} from '../utils/userMgr/index';
import { User } from '../types';

@Component
export default class UserTrace extends Vue{
    // 是否监听用户信息的更新,默认绑定
    isWatchUserUpdated:boolean=true;
    // 是否监听用户信息的初始化，默认绑定
    isWatchUserInited:boolean=true;

    created(){
        // 绑定监听-全局用户信息更新时触发回调
        this.isWatchUserUpdated&&registUpdatedHandler(this.onUserUpdate)
        // 绑定监听-全局用户信息初始化后触发仅一次的回调
        this.isWatchUserInited&&registInitedHandler(this.onUserInited);
    }
    // 需要在子类重写，通过 UserTrace 绑定了Inited钩子后，用户信息第一次更新被触发
    onUserUpdate(latestUser:User):void{}
    //需要在子类重写 绑定Update钩子后，用户信息在每一次更新后触发
    // 如若有绑定Inited钩子，则第一次更新的时候会调用Inited的钩子，不会触发此钩子
    onUserInited(latestUser:User):void{}
}
</script>