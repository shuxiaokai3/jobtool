/*
    创建者：shuxiaokai
    创建时间：2020-01-07 21:07
    模块名称：文档过滤
    备注：xxxx
*/
<template>
    <el-input v-model="filterTreeData" class="doc-search" placeholder="关键字,支持首字母输入" clearable @input="handleSearchTree"></el-input>
</template>

<script>
import debounce from "@/lib/function/debounce"
export default {
    data() {
        return {
            filterTreeData: ""
        };
    },
    created() {

    },
    methods: {
        //关键词搜索
        handleSearchTree() {
            this.search();
        },
        search: debounce(function() {
            this.defaultExpandKeys = [];
            this.searchResult = [];
            const params = {
                projectId: this.$route.query._id,
                url: this.filterTreeData.trim()
            };
            this.axios.get("/api/project/filter_doc", { params }).then(res => {
                if (res.data.length === 0) {
                    this.defaultExpandKeys = [];
                    this.searchResult = [];
                } else {
                    this.defaultExpandKeys = Array.from(new Set(this.defaultExpandKeys.concat(res.data.map(val => val._id))))
                    this.searchResult = Array.from(new Set(this.searchResult.concat(res.data.map(val => val))));                    
                }
                this.$parent.$refs.docTree.filter();
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        }),
    }
};
</script>



<style lang="scss">
.doc-search {
    border-radius: 20px;
    .el-input__inner {
        border-radius: 20px;
    }
}
</style>
