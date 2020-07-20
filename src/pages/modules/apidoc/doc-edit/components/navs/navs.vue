/*
    创建者：shuxiaokai
    创建时间：2020-07-03 16:40
    模块名称：文档tabs切换
    备注：xxxx
*/
<template>
    <div class="tabs">
        <div class="my-tabs d-flex hidden-sm-and-down">
            <draggable id="tabList" v-model="tabs" animation="150" class="tab-list">
                <div 
                        v-for="(item, index) in tabs"
                        :key="index"
                        :title="item.docName"
                        :class="{active: currentSelectDoc && currentSelectDoc._id === item._id}"
                        class="item d-flex a-center"
                        :data-index="index"
                        @click="selectCurrentTab(item)"
                        @contextmenu="handleRightClick($event, item, index)"
                >
                    <span 
                            :class="{ green: item.item.methods === 'get', yellow: item.item.methods === 'post', blue: item.item.methods === 'put', red: item.item.methods === 'delete'}"
                            class="mr-2"
                    >
                        {{ item.item.methods.toUpperCase() }}
                    </span>
                    <span class="item-text">{{ item.docName }}</span>
                    <i class="iconfont el-icon-close close" @click.stop="handleCloseCurrent(item, index)"></i>
                </div>
            </draggable>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable"
import contextmenu from "./components/contextmenu"
import Vue from "vue"
export default {
    components: {
        draggable,
    },
    data() {
        return {
            mouseContext: null, //tab右键弹框
            //======================================其他参数===================================//
        };
    },
    computed: {
        tabs: {
            get() {
                return this.$store.state.apidoc.tabs[this.$route.query.id];
            },
            set(val) { //拖拽tabs会导致数据写入
                this.$store.commit("apidoc/updateAllTabs", {
                    projectId: this.$route.query.id,
                    tabs: val
                });
            }
        },
        currentSelectDoc() {
            return this.$store.state.apidoc.activeDoc[this.$route.query.id];
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        //=====================================初始化====================================//
        init() {
            //取消鼠标右键实例对象
            document.body.addEventListener("click", () => {
                if (this.mouseContext) {
                    document.body.removeChild(this.mouseContext.$el);
                    this.mouseContext = null;
                }
            });
            this.$el.addEventListener("contextmenu", e => {
                e.returnValue = false;
            });
            //获取本地tabs信息
            const projectId = this.$route.query.id;
            const tabs = localStorage.getItem("apidoc/editTabs") ? JSON.parse(localStorage.getItem("apidoc/editTabs")) : {};
            const locatActiveDoc = localStorage.getItem("apidoc/activeTab") ? JSON.parse(localStorage.getItem("apidoc/activeTab")) : {};
            const currentProjectTabs = tabs[projectId] || [];
            const activeDoc = locatActiveDoc[projectId] || {};
            this.$store.commit("apidoc/updateAllTabs", {
                projectId,
                tabs: currentProjectTabs
            });
            this.$store.commit("apidoc/changeCurrentTab", {
                projectId,
                activeNode: activeDoc
            });
        },
        //=====================================tabs操作====================================//
        //选择当前标签
        selectCurrentTab(item) {
            this.$store.commit("apidoc/changeCurrentTab", {
                projectId: this.$route.query.id,
                activeNode: item,
            });
        },
        //关闭当前标签
        handleCloseCurrent(item, index) {
            this.$store.commit("apidoc/deleteTabByPosition", {
                projectId: this.$route.query.id,
                start: index,
                num: 1
            });
            if (item._id === this.currentSelectDoc._id) { //如果删除的是当前选择的doc
                if (!this.tabs[index]) { //删除位置不存在节点则下一个元素作为选中的tab
                    if (this.tabs[index - 1]) { //选择上一个元素作为
                        this.$store.commit("apidoc/changeCurrentTab", {
                            projectId: this.$route.query.id,
                            activeNode: this.tabs[index - 1],
                        });
                    }
                } else {
                    this.$store.commit("apidoc/changeCurrentTab", {
                        projectId: this.$route.query.id,
                        activeNode: this.tabs[index],
                    });
                }
            } 
        },
        //关闭右侧
        handleCloseRight(item, index) {
            if (this.tabs.length !== 1) { //只剩一个tab删除无意义不做处理
                this.$store.commit("apidoc/deleteTabByPosition", {
                    projectId: this.$route.query.id,
                    start: index + 1,
                    num: this.tabs.length - index - 1
                });
                if (!this.tabs.find(val => val._id === this.currentSelectDoc._id)) { //关闭右侧后若在tabs里面无法找到选中节点，则取最后一个节点为选中节点
                    this.$store.commit("apidoc/changeCurrentTab", {
                        projectId: this.$route.query.id,
                        activeNode: this.tabs[this.tabs.length - 1],
                    });
                }
            }
        },
        //关闭左侧
        handleCloseLeft(item, index) {
            if (this.tabs.length !== 1) { //只剩一个tab删除无意义不做处理
                this.$store.commit("apidoc/deleteTabByPosition", {
                    projectId: this.$route.query.id, 
                    start: 0,
                    num: index
                });
                if (!this.tabs.find(val => val._id === this.currentSelectDoc._id)) { //关闭左侧后若在tabs里面无法找到选中节点，则取第一个节点为选中节点
                    this.$store.commit("apidoc/changeCurrentTab", {
                        projectId: this.$route.query.id,
                        activeNode: this.tabs[0],
                    });
                }
            }
        },
        //关闭其他标签
        handleCloseOther(item, index) {
            if (this.tabs.length !== 1) {
                this.$store.commit("apidoc/deleteTabByPosition", {
                    projectId: this.$route.query.id,
                    start: index + 1,
                    num: this.tabs.length - index - 1
                });
                this.$store.commit("apidoc/deleteTabByPosition", {
                    projectId: this.$route.query.id,
                    start: 0,
                    num: index 
                });
                this.$store.commit("apidoc/changeCurrentTab", {
                    projectId: this.$route.query.id,
                    activeNode: this.tabs[0],
                });
            }
        },
        //右键菜单
        handleRightClick(e, item, index) {
            e.stopPropagation();
            e.preventDefault();
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
                this.handleCloseRight(item, index);
            })
            this.mouseContext.$on("closeLeft", () => {
                this.handleCloseLeft(item, index);
            })
            this.mouseContext.$on("closeCurrent", () => {
                this.handleCloseCurrent(item, index);
            })
            this.mouseContext.$on("closeOther", () => {
                this.handleCloseOther(item, index);
            })
        },
    }
};
</script>

<style lang="scss">
.tabs {
    width: 100%;
    height: 40px;
    background: #eee;
    display: flex;
    .my-tabs {
        width: 90%;
        min-width: 300px;
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
            background: #ccc;
        }
    }
    .tab-list {
        width: 100%;
        line-height: 40px;
        height: 40px;
        display: flex;
        color: #5f6368;
        overflow-x: hidden;
        overflow-y: hidden;
        white-space: nowrap;
        .item {
            position: relative;
            font-size: 12px;
            flex: 1 1 20%;
            max-width: 200px;
            cursor: default;
            padding: 0 1rem;
            .item-text {
                display: inline-block;
                max-width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            background: rgb(222, 225, 230);
            &:hover {
                background: #e2e2e2;
            }
            .iconfont {
                font-size: 16px;
                display: flex;
                align-items: center;
            }
            &.active {
                background: #f0f3fa;
            }
        }
    }
}
</style>
