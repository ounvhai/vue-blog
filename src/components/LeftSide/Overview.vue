<template>
    <div class="overview">
        <div class="name h4 text-center">Kirds</div>
        <div class="text-center pt-4">
            <p>热衷冒险的保守派</p>
            <p>一只总是被人认为是柯基名叫皮皮的不知名小串串的铲屎官</p>
            <p>喜欢自己动手做甜品<s>很简单但是很好次</s></p>
            <p>自愈型小确丧</p>
        </div>
    </div>
</template>
<style lang="scss">
    @import '../../style/variable';
    .overview{
        .name{
            font-weight: $font-weight*1.5;
        }
    }
</style>
<script lang="ts">
import {Vue ,Component } from 'vue-property-decorator';

@Component
export default class Overview extends Vue{

}
</script>