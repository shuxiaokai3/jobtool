/*
    创建者：shuxiaokai
    创建时间：2019-09-10 21:26
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div ref="doc" class="doc">
        <s-left></s-left>
        <div class="right">
            <s-right></s-right> 
        </div>
    </div>
</template>

<script>
import left from "./doc-banner/doc-banner.vue"
import right from "./doc-detail/doc-detail.vue"
export default {
    components: {
        "s-left": left,
        "s-right": right
    },
    data() {
        return {

        };
    },
    mounted() {

    },
    methods: {

    }
};
</script>



<style lang="scss">

</style>
