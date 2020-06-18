/*
    创建者：shuxiaokai
    创建时间：2019-06-27 16:09
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-select v-model="search" placeholder="搜索相关页面  例如：抽样" filterable remote :remote-method="handleSearch" clearable @change="handleChangeRoutes">
        <el-option v-for="(item, index) in matchRoutes" :key="index" :label="item.name" :value="item.path">
            <span class="fl">{{ item.name }}</span>
            <!-- 不给用户看具体路由 -->
            <span v-if="$root.VUE_BASE_CONFIG.isProcess" class="fr gray-500">{{ item.path }}</span>
        </el-option>
    </el-select>
</template>

<script>
export default {
    data() {
        return {
            search: "", //搜索的关键词
            allRoutes: [], //所有可被检索的路由
            matchRoutes: [], //匹配上的路由
        };
    },
    created() {
        this.initAllRoutes();
        // console.log(this.allRoutes)
    },
    methods: {
        /* 
            @description  初始化路由，将可检索路由赋值
            @autor        shuxiaokai
            @create       2019-07-31 17:04"
        */
        initAllRoutes() {
            const getRoutes = (data) => {
                data.forEach(val => {
                    let keywords = [];
                    if (val.meta && val.meta.keywords) {
                        keywords = val.meta.keywords;
                    }
                    this.allRoutes.push({
                        name: val.name || "",
                        path: val.path || "",
                        keywords: keywords                        
                    });
                    if (val.children) {
                        getRoutes(val.children);
                    }
                })
            }
            getRoutes(this.$router.options.routes);
        },
        handleSearch(val) {
            //存在关键字才允许搜索
            this.matchRoutes = this.allRoutes.filter((route) => {
                // const isFirstLevel = route.path.match("/");
                // const isMatchName = (route.name.indexOf(val) !== -1);
                const isMatchKeywords = route.keywords.some(keywords => {
                    return val.includes(keywords);
                });
                return isMatchKeywords;
            });
            // console.log(this.matchRoutes)
        },
        handleChangeRoutes(val) {
            this.$router.push(`/v1/${val}`);
            this.search = ""
        },
    }
};
</script>



<style lang="scss">
.search {
    .el-input__inner {
        border: none;
        border-bottom: 1px solid $teal;
        border-radius: 0;
    }
    .el-select {
        width: 100%;
    }
}
</style>
