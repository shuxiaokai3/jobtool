<template>
    <!-- index值不能重复，否则会导致折叠出问题 -->
    <el-submenu :index="data.path">
        <!-- 存在children -->
        <template v-if="data.children && data.children.length > 0" slot="title">
            <!-- <svg class="svg-icon" aria-hidden="true">
                <use :xlink:href="data.icon"></use>
            </svg>  -->
            <span class="iconfont mr-2" :class="data.icon"></span>
            <span slot="title">{{ data.name }}</span>
        </template>
        <!-- 递归调用 -->
        <template v-if="data.children && data.children.length > 0">
            <template v-for="(item, index2) in data.children">
                <nest-nav v-if="item.children && item.children.length > 0" :key="index2" :data="item"></nest-nav>
                <!-- 外链接 -->
                <template v-else-if="checkNavType(item) === 1">
                    <a :key="index2" target="__blank" @click.stop="handleClickLink(item.path)">
                        <el-menu-item :index="item.path">
                            <!-- <svg class="svg-icon" aria-hidden="true">
                                <use :xlink:href="item.icon"></use>
                            </svg> -->
                            <span class="iconfont mr-2" :class="item.icon"></span>
                            <span slot="title">{{ item.name }}</span>
                        </el-menu-item>
                    </a>
                </template>
                <!-- ${item.path}${index2} fix：path重复导致选择路由无法高亮 -->
                <router-link v-else :key="`${item.path}${index2}`" :to="item.path">
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

        <el-menu-item v-if="!data.children" :index="data.path">{{ data.name }}</el-menu-item>

        
    </el-submenu>  
</template>

<script>
export default {
    name: "NestNav",
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {},
    methods: {
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
        handleClickLink(path) {
            console.log(path)
            if (path.includes("reportCommon")) { //报告
                window.open(`${path}`, "_blank");
            } else if (path.includes("public")) { //风险统计
                const map = localStorage.getItem("tongjiMap");
                const name = localStorage.getItem("tongjiUserRealName");
                const token = localStorage.getItem("tongjiToken");
                const province = localStorage.getItem("tongjiProvince");
                const isRegion = localStorage.getItem("tongjiProvinceName");
                const nature = localStorage.getItem("tongjiNature");
                window.open(`${path}?token=${token}&map=${map}&userName=${name}&province=${province}&isRegion=${isRegion}&nature=${nature}#/i`);            
            } else if (path.includes("visual-web")) {
                const token = localStorage.getItem("dapinToken");
                const regionName = localStorage.getItem("dapinRegion");
                window.open(`${path}?token=${token}&regionName=${regionName}`, "_blank");
            } else {
                window.open(`${path}`, "_blank");
            }
        },
    }
};
</script>

<style lang="scss">

</style>
