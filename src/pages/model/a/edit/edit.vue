/*
    创建者：shuxiaokai
    创建时间：2019-09-10 21:26
    模块名称：接口编辑页面
    备注：
*/
<template>
    <div ref="doc" class="doc">
        <!-- 左侧banner -->
        <div class="left">
            <div class="left-tool">
                <h2 class="gray-700 f-lg text-center">{{ $route.query.name }}</h2>
                <div class="mt-2">
                    <s-search></s-search>
                </div>
                <s-operation @addFile="handleAddFile" @addFolder="handleAddFolder"></s-operation>
            </div>
            <s-doc-nav ref="doc-nav" class="doc-nav"></s-doc-nav>
        </div> 
        <!-- 右侧编辑界面 -->
        <div class="right">
            <s-doc-tabs></s-doc-tabs>
            <s-doc-detail></s-doc-detail>
        </div>
    </div>
</template>

<script>
import operation from "./components/doc-operation/doc-operation"
import docSearch from "./components/doc-search/doc-search"
import docBanner from "./components/doc-banner/doc-banner"
import docTabs from "./components/doc-tabs/doc-tabs"
import docDetail from "./components/doc-detail/doc-detail.vue"
export default {
    components: {
        "s-operation": operation,
        "s-search": docSearch,
        "s-doc-nav": docBanner,
        "s-doc-tabs": docTabs,
        "s-doc-detail": docDetail,
    },
    data() {
        return {

        };
    },
    computed: {
        currentActiveNode() {
            return this.$store.state.tabs.currentTab[this.$route.query._id]
        }
    },
    mounted() {

    },
    methods: {
        handleAddFile() {
            this.$refs["doc-nav"].addNewFile();
        },
        handleAddFolder() {
            this.$refs["doc-nav"].addNewFolder();
        },
    }
};
</script>



<style lang="scss">
.doc {
    height: calc(100vh - 60px);
    display: flex;
    .left {
        width: 300px;
        height: 100%;
        border-right: 1px solid $gray-400;
        display: flex;
        flex-direction: column;
        .left-tool {
            position: relative;
            padding: 20px 20px 10px 20px;
            background: rgb(244, 244, 244);
        }
    }
    .right {
        height: 100%;
        flex: 1;
    }
}
</style>
