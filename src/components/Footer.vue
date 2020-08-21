<template>
    <div  class="footer  my-5 text-center">
        <a class="beian" href="http://www.miit.gov.cn/">粤ICP备18120757号</a>
    </div>
</template>
<style lang="scss">
    .footer{
        .beian{
            color:black;
            &:hover{
                color:adjust-color($color: black, $lightness: 30%)
            }
        }
    }
</style>
<script lang="ts">
import {Vue ,Component } from 'vue-property-decorator';

@Component
export default class Footer extends Vue{

}
</script>