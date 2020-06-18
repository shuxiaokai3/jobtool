/*
    创建者：shuxiaokai
    创建时间：2020-02-05 13:27
    模块名称：业务逻辑区域
    备注：xxxx
*/
<template>
    <div class="page-wrap">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <div v-if="couldFresh">
                <keep-alive>
                    <router-view v-if="couldCache"></router-view>
                </keep-alive>
                <router-view v-if="!couldCache"></router-view>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    data() {
        return {
            couldCache: false
        };
    },
    computed: {
        couldFresh() {
            return this.$store.state.layout.freshCachePageFlag
        }
    },
    watch: {
        "$route": {
            handler() {
                this.couldCache = this.$route.meta.couldCache;
            },
            deep: true,
        },
    },
    created() {

    },
    methods: {

    }
};
</script>



<style lang="scss">
    .page-wrap {
        height: calc(100vh - #{size(120)});
        background: $gray-100;
        // overflow-y: auto;
        .scrollbar-wrapper {
            padding: size(20) size(20) 0;
            height: calc(100vh - #{size(140)});
            overflow-x: hidden;
        }
    }
</style>
