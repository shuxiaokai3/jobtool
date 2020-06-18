<template>
    <div class="s-header">
        <div class="title d-flex a-center">
            <span class="ml-2 f-bg text-bold">{{ $root.VUE_BASE_CONFIG.pagesConfig.headerTitle }}</span>
        </div>
        <div class="operation">
            <div title="设置" class="op-list el-icon-setting"></div>
        </div>
        <div class="menu f-sm">
            <div class="menu-item dropdown">
                <el-dropdown>
                    <span class="cursor-pointer">
                        <span>{{ userInfo.loginName }}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item>新消息推送</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            userInfo: {},
            activeId: -1,
        };
    },
    created() {
    },
    mounted() {
        this.initUserInfo();
        this.userInfo = sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : ""
    },
    methods: {
        //初始化用户基本信息
        initUserInfo() {
            const localUserInfo = sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : "";
            if (localUserInfo) {
                this.userInfo = localUserInfo;
            } else {
                this.axios.get("/api/security/user_base_info").then(res => {
                    this.userInfo = res.data;
                    sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                }).catch(err => {
                    this.$errorThrow(err, this);
                });
            }
        },
        //选择跳转
        handleJumpToHome() {
            if (this.$route.path !== "/v1/home") {
                this.$router.push("/v1/home")
            }
        },
        //=====================================退出登录====================================//
        logout() {
            sessionStorage.clear();
            localStorage.clear();
            this.$router.replace("/login");
            this.$store.commit("layout/clearTabs");
        },
    }
};
</script>



<style lang="scss">
.s-header {
    flex: 0 0 size(40);
    padding: 0 size(20);
    background: $white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $gray-400;
    position: relative;
    z-index: $zIndex-header;
    height: size(40);
    .menu {
        display: flex;
        height: 100%;
        .menu-item {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 size(20);
            cursor: pointer;
            transition: all .2s;
            &:hover {
                background: $gray-200;
            }
            &.active {
                color: $theme-color;
                background: $gray-300;
            }
        }
    }
    .operation {
        margin-left: auto;
        .op-list {
            width: size(40);
            height: size(40);
            line-height: size(40);
            text-align: center;
            font-size: fz(16);
            cursor: pointer;
            &:hover {
                background: $gray-200;
            }
        }
    }
}
</style>
