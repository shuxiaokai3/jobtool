/*
    创建者：shuxiaokai
    创建时间：2019-09-11 15:39
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div>
        <s-tabs @change="handleTabsChange"></s-tabs>
        <s-doc v-if="allTabs.length > 0" :id="currentTabId"></s-doc>   
    </div>
</template>

<script>
import tabs from "./doc-tabs/doc-tabs"
import doc from "./doc-info/doc-info"
export default {
    components: {
        "s-doc": doc,
        "s-tabs": tabs,
    },
    data() {
        return {
            currentTabId: ""
        };
    },
    computed: {
        allTabs() {
            return this.$store.state.viewTabs.tabs
        },
        currentTab() {
            return this.$store.state.viewTabs.currentTab;
        }
    },
    created() {
        //this.initTabs();
    },
    methods: {
        initTabs() {
            // const cacheTabs = localStorage.getItem("tabs") || "[]";
            // const projectTabs = JSON.parse(cacheTabs).filter(val => val.projectId === this.$route.query._id);
            // this.$store.commit("changeAllTabs", projectTabs)
        },
        //=====================================操作相关====================================//
        handleTabsChange(item) {
            console.log(item)
        },
    }
};
</script>



<style lang="scss">
</style>
