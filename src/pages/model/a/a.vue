/*
    创建者：shuxiaokai
    创建时间：2019-09-09 21:56
    模块名称：项目列表主界面
*/
<template>
    <div :class="{'s-container': layout === 'layout'}">
        <el-tabs v-model="activeName">
            <el-tab-pane name="tab-a">
                <span slot="label"><i class="el-icon-tickets"></i> 项目列表</span>
            </el-tab-pane>
            <el-tab-pane name="tab-b">
                <span slot="label"><i class="el-icon-user"></i> 团队管理</span>
            </el-tab-pane>
        </el-tabs>
        <component :is="activeName"></component>
    </div>
</template>

<script>
import tabA from "./children/tab-a/tab-a"
import tabB from "./children/tab-b/tab-b"
export default {
    components: {
        "tab-a": tabA,
        "tab-b": tabB,
    },
    data() {
        return {
            activeName: "tab-a",
        };
    },
    computed: {
        layout() {
            return this.$store.state.config.pageConfig.layout
        }
    },
    mounted() {

    },
    methods: {
       
    }
};
</script>



<style lang="scss">
.s-container {
    width: 70%;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
}
</style>
