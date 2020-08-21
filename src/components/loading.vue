<template>
    <svg  width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise loading" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z"/>
        <path fill-rule="evenodd" d="M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z"/>
    </svg>
</template>
<style lang="scss">
    .loading{
        animation: loading 2s linear infinite ;
        font-size: 1.8rem;
    }
    @keyframes loading{
        0%{
            transform: rotateZ(0deg);
        }
        100%{
            transform: rotateZ(360deg);
        }
    }
</style>
<script lang="ts">
import {Vue ,Component ,Prop} from 'vue-property-decorator';
@Component
export default class Loading extends Vue{
}
</script>