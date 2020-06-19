/* 
    @description  banner页面
    @author        shuxiaokai
    @create       2019-07-21 09:24"
*/
<template>
    <div class="s-banner">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu 
                    :default-active="activeIndex"
                    class="el-menu-list"
                    mode="vertical"
                    active-text-color="#409EFe"
                    background-color="#304155"
                    text-color="#bfcbd9"
                    :collapse-transition="false"
                    :unique-opened="false"
                    @click.native.stop="stopBubble"
                    @select="handleSelect"
            >
                <template v-for="(item, index) in banner">
                    <!-- 外链接 -->
                    <template v-if="checkNavType(item) === 1">
                        <a :key="index" target="__blank" @click.stop="handleClickLink(item.path)">
                            <el-menu-item :index="item.path">
                                <!-- <svg class="svg-icon" aria-hidden="true">
                                    <use :xlink:href="item.icon"></use>
                                </svg> -->
                                <span class="iconfont mr-2" :class="item.icon"></span>
                                <span slot="title">{{ item.name }}</span>
                            </el-menu-item>
                        </a>
                    </template>
                    <!-- 嵌套的nav -->
                    <template v-if="checkNavType(item) === 2">
                        <nest-nav :key="index" :data="item"></nest-nav>
                    </template>
                    <!-- 单独的nav -->
                    <template v-if="checkNavType(item) === 3">
                        <router-link :key="index" :to="item.path">
                            <el-menu-item :index="item.path">
                                <!-- <svg class="svg-icon" aria-hidden="true">
                                    <use :xlink:href="item.icon"></use>
                                </svg> -->
                                <span class="iconfont mr-2" :class="item.icon"></span>
                                <span slot="title">{{ item.name }}</span>
                            </el-menu-item>
                        </router-link>
                    </template>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import NestNav from "./item.vue";
// import { throttle } from "@/lib/utils";
export default {
    components: {
        "nest-nav": NestNav
    },
    data() {
        return {
            activeIndex: "",
            isMobile: false
        };
    },
    computed: {
        banner() {
            return this.$store.state.layout.banner;
        },
    },
    watch: {
        $route(val) {
            this.activeIndex = val.path;
        },
    },
    created() {
        this.activeIndex = this.$route.path;
        this.$store.commit("layout/changePermission");
    },
    methods: {
        //阻住冒泡
        stopBubble() {},
        handleSelect() {},
        /*
            @describe:  查询导航栏类型， 1代表外链接， 2代表嵌套导航， 3代表单层导航
        */
        checkNavType(item) {
            let isNest = true;
            let isLink = false;
            if (item.children == null || (Array.isArray(item.children) && item.children.length === 0)) {
                //判断是否是嵌套
                isNest = false;
                if (item.isLink || (typeof item.path === "string" && (item.path.startsWith("http://") || item.path.startsWith("https://")))) {
                    //判断是否为外链
                    isLink = true;
                }
            }
            if (isLink) {
                return 1;
            } else if (isNest) {
                return 2;
            } else {
                return 3;
            }
        },
        //=====================================外联跳转====================================//
        handleClickLink() {
          
        },
    }
};
</script> 



<style lang="scss">
.s-banner {
    height: 100%;
    flex: 0 0 size(200);
    overflow-x: hidden;
    &.fold {
        width: size(62) !important;
    }
    &.mobile {
        transform: translate3D(-#{size(200)}, 0, 0);
    }
    &.mobile_expand {
        z-index: 11;
        transform: translate3D(0px, 0, 0);
    }
    .scrollbar-wrapper {
        height: 100%;
        overflow-x: hidden;
    }
    .el-scrollbar,
    .el-scrollbar__view {
        height: 100%;
    }
    .el-menu-list {
        height: 100%;
    }
    .el-menu-item * {
        vertical-align: baseline;
    }
}
</style>
