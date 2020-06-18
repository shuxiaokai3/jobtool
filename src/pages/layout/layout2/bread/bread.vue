
<template>
    <!-- 面包屑 -->
    <div class="breadcrumb hidden-sm-and-down">
        <div class="gray-500 f-sm pl-1">
            <i class="iconfont icon-dizhi"></i>&nbsp;&nbsp;
            <span class="mr-2">当前位置:</span>
        </div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(item,index) in breadcrumbName" :key="index" :to="item.to">{{ item.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div v-if="couldShowGoBackTip" class="back" @click="goBack">
            <i class="el-icon-back"></i>&nbsp;
            <el-button type="text">返回上级</el-button>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            
        };
    },
    computed: {
        breadcrumbName() {
            return this.$route.meta.bread;
        },
        couldShowGoBackTip() {
            let couldShowGoBackTip = false;
            if (this.$route.meta && this.$route.meta.couldShowGoBackTip) {
                couldShowGoBackTip = true;
            }
            return couldShowGoBackTip
        },
    },
    watch: {
        "$route.meta": {
            handler() {
                // console.log(222)
            },  
            deep: true
        }
    },
    created() {},
    mounted() {
        
    },
    methods: {
        goBack() {
            this.$router.back();
        },
    }
};
</script>



<style lang="scss">
    .breadcrumb {
        height: size(40);
        display: flex;
        align-items: center;
        position: relative;
        background: $white;
        box-shadow: $box-shadow-sm;
        z-index: $zIndex-bread;
        .back {
            margin-left: auto;
            margin-right: 40px;;
        }
    }
</style>
