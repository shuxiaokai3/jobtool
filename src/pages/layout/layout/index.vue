/*
    创建者：shuxiaokai
    创建时间：2019-09-06 11:31
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="s-content">
        <div class="s-header hidden-md-and-down">
            <div class="header-left fl">
                <el-menu :default-active="activeMenu" mode="horizontal" background-color="#343a40" text-color="#fff" active-text-color="#ffd04b" :router="true">
                    <el-menu-item>
                        <span class="f-lg" @click="jumpToHome">内部管理工具</span>
                    </el-menu-item>
                    <el-menu-item v-for="(item, index) in menus" :key="index" :index="item.path">{{ item.name }}</el-menu-item>
                    <!-- <el-menu-item index="/v1/b/b">项目地址</el-menu-item>
                    <el-menu-item index="/v1/c/c">文件管理</el-menu-item>
                    <el-menu-item index="/v1/e/e">在线面试</el-menu-item>
                    <el-menu-item index="/v1/g/g">权限管理</el-menu-item> -->
                    <!-- <el-menu-item index="/v1/h/h">代码走查</el-menu-item> -->
                </el-menu>
            </div>
            <div class="header-right fr"></div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeMenu: "/v1/a/a"
        };
    },
    computed: {
        menus() {
            return this.$store.state.permission.menus;
        }
    },
    created() {
        this.initCurrentMenu();
    },
    methods: {
        initCurrentMenu() {
            this.activeMenu = this.$route.path;
        },
        //跳转到首页
        jumpToHome() {
            this.$router.push("/v1/a/a");
        },
    }
};
</script>



<style lang="scss">
.s-content {
    width: 100%;
    height: 100%;
    .s-header {
        background: $gray-800;
        height: 60px;
        .header-left {
            height: 100%;
        }
        .header-right {
            height: 100%;
        }
    }
}
</style>
