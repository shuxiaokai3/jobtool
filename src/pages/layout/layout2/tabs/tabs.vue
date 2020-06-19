/** 
 * @description        文档tabs切换
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-01-13 14:43
 * @update             2020-01-13 14:43
 */
<template>
    <div class="s-tabs">
        <div class="my-tabs d-flex hidden-sm-and-down">
            <div class="handle left">
                <i class="el-icon-d-arrow-left"></i>
            </div>
            <draggable id="tabList" v-model="tabs" animation="150" class="tab-list">
                <div v-for="(item, index) in tabs" :key="index" :title="item.title" class="item d-flex a-center" :class="{active: $route.path === item.path}" :data-index="index" @click.stop="selectCurrentTab($event, item, index)" @contextmenu="handleRightClick($event, item, index)">
                    <span class="item-text">{{ item.title }}</span>
                    <i class="iconfont el-icon-close close" @click.stop="handleCloseCurrent(item, index)"></i>
                </div>
            </draggable>
            <div class="handle right">
                <i class="el-icon-d-arrow-right"></i>
            </div>
            <el-dropdown @command="handleCloseTab">
                <div class="easy-close el-icon-circle-close"></div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">关闭左侧</el-dropdown-item>
                    <el-dropdown-item command="2">关闭右侧</el-dropdown-item>
                    <el-dropdown-item command="3">关闭其他</el-dropdown-item>
                    <!-- <el-dropdown-item command="4">全部关闭</el-dropdown-item> -->
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable"
import contextmenu from "./children/contextmenu"
import Vue from "vue"
export default {
    components: {
        draggable,
    },
    data() {
        return {
            currentClickPath: null, //当前鼠标点击的路由，临时路由和浏览器显示url不一样
            mouseContext: null, //tab右键弹框
            //======================================其他参数===================================//
        };
    },
    computed: {
        tabs: {
            get() {
                return this.$store.state.layout.tabs
            },
            set(val) {
                this.$store.commit("layout/changeAllTabs", val);
            }
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        //=====================================初始化====================================//
        init() {
            //取消鼠标右键实例对象
            document.body.addEventListener("click", (e) => {
                e.stopPropagation();
                this.currentClickPath = this.$route.path; //点击空白区域，将其置为当前路由
                // e.stopImmediatePropagation();
                if (this.mouseContext) {
                    document.body.removeChild(this.mouseContext.$el);
                    this.mouseContext = null;
                }
            });
            this.$el.addEventListener("contextmenu", e => {
                e.returnValue = false;
            });
            //读取缓存的tabs信息
            const cacheTabs = sessionStorage.getItem("layoutTabs") ? JSON.parse(sessionStorage.getItem("layoutTabs")) : [];
            this.$store.commit("layout/changeAllTabs", cacheTabs);
        },
        handleCloseTab(command) {
            /*eslint-disable indent*/ 
            switch (command) {
                case "1":
                    this.handleCloseLeft();
                    break;
                case "2":
                    this.handleCloseRight();
                    break;
                case "3":
                    this.handleCloseOther();
                    break;
                case "4":
                    this.handleCloseAll();
                    break;
                default:
                    break;
            }
        },
        //=====================================其他操作====================================//
        //选择当前标签
        selectCurrentTab(e, item) {
            if (item.path === this.$route.path) {
                return
            }
            this.$router.push(item.fullPath);
        },
        //关闭当前标签
        handleCloseCurrent(item) {
            const currentPath = item ? item.path : this.currentClickPath;
            const currentIndex = this.tabs.findIndex(val => val.path === currentPath);
            this.$store.commit("layout/deleteTabByPosition", {
                start: currentIndex,
                num: 1
            });
            if (this.tabs[currentIndex]) {//右侧还存在标签
                if (this.$route.path !== this.tabs[currentIndex].path) {
                    this.$router.replace(this.tabs[currentIndex].fullPath);
                }
                // this.$router.replace(this.tabs[currentIndex].path);
            } else {//右侧不存在标签
                if (!this.tabs[currentIndex - 1] || this.tabs[currentIndex - 1].path === this.$route.path) {
                    return
                }
                if (this.$route.path !== this.tabs[currentIndex - 1].path) {
                    this.$router.replace(this.tabs[currentIndex - 1].fullPath);
                }
                // this.$router.replace(this.tabs[currentIndex - 1].path);
            }     
        },
        //关闭左侧
        handleCloseLeft() {
            // const currentPath = this.$route.path;
            const currentIndex = this.tabs.findIndex(val => val.path === this.currentClickPath);
            if (this.tabs.length !== 1) {
                this.$store.commit("layout/deleteTabByPosition", {
                    start: 0,
                    num: currentIndex
                });
            }
            if (this.$route.path !== this.tabs[0].path) {
                this.$router.replace(this.tabs[0].fullPath);
            }
        },
        //关闭右侧
        handleCloseRight() {
            const currentIndex = this.tabs.findIndex(val => val.path === this.currentClickPath);
            if (this.tabs.length !== 1) {
                this.$store.commit("layout/deleteTabByPosition", {
                    start: currentIndex + 1,
                    num: this.tabs.length - currentIndex - 1
                });
            }
            if (this.$route.path !== this.tabs[currentIndex].path) {
                this.$router.replace(this.tabs[currentIndex].fullPath);
            }
        },
        //关闭其他标签
        handleCloseOther() {
            const currentIndex = this.tabs.findIndex(val => val.path === this.currentClickPath);
            if (this.tabs.length !== 1) {
                this.$store.commit("layout/deleteTabByPosition", {
                    start: currentIndex + 1,
                    num: this.tabs.length - currentIndex - 1
                });
                this.$store.commit("layout/deleteTabByPosition", {
                    start: 0,
                    num: currentIndex 
                });
                if (this.$route.path !== this.tabs[0].path) {
                    this.$router.replace(this.tabs[0].fullPath);
                }
            }
        },
        //全部关闭
        handleCloseAll() {
            this.tabs = [];
        },
        //右键菜单
        handleRightClick(e, item) {
            e.stopPropagation();
            e.preventDefault();
            this.currentClickPath = item.path
            const ContextmenuConstructor = Vue.extend(contextmenu);
            const x = e.clientX; //当前点击位置
            const y = e.clientY; //当前点击位置
            if (this.mouseContext) {
                document.body.removeChild(this.mouseContext.$el);
                this.mouseContext = null;
            }
            this.mouseContext = new ContextmenuConstructor({
                propsData: {
                    left: x,
                    top: y
                },
            }).$mount();
            document.body.appendChild(this.mouseContext.$el);
            this.mouseContext.$on("closeRight", () => {
                this.handleCloseRight();
            })
            this.mouseContext.$on("closeLeft", () => {
                this.handleCloseLeft();
            })
            this.mouseContext.$on("closeCurrent", () => {
                this.handleCloseCurrent();
            })
            this.mouseContext.$on("closeOther", () => {
                this.handleCloseOther();
            })
        },
    }
};
</script>

<style lang="scss">
.s-tabs {
    width: 100%;
    height: 40px;
    background: $gray-200;
    display: flex;
    .my-tabs {
        padding-right: size(20);
        width: 100%;
        min-width: 300px;
        .handle {
            width: size(40);
            height: size(40);
            background: $gray-100;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:hover {
                background: $white;
            }
        }
        .easy-close {
            cursor: pointer;
            width: size(40);
            height: size(40);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .close {
        cursor: pointer;
        position: absolute;
        line-height: 1.5;
        top: 50%;
        transform: translate(0, -50%);
        right: 1rem;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &:hover {
            background: mix($gray-400, $white, 80%);
        }
    }
    .tab-list {
        width: 100%;
        line-height: size(40);
        height: size(40);
        display: flex;
        color: #5f6368;
        overflow-x: hidden;
        overflow-y: hidden;
        white-space: nowrap;
        .item {
            position: relative;
            font-size: 12px;
            flex: 1 1 20%;
            max-width: size(200);
            cursor: default;
            padding: 0 1rem;
            .item-text {
                display: inline-block;
                max-width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            background: $gray-300;
            .iconfont {
                font-size: size(16);
                display: flex;
                align-items: center;
            }
            &:hover {
                background: mix($gray-300, $white, 80%);
            }
            &::after {
                content: "";
                display: inline-block;
                height: 50%;
                position: absolute;
                transform: translate(0, -50%);
                right: 0;
                top: 50%;
                width: 1px;
                background: $gray-500;
            }
            &.active {
                background: $white;
                margin-left: -1px;
                &::after {
                    width: 0;
                }
                &::before {
                    width: 0;
                }
            }
        }
    }
}
</style>
