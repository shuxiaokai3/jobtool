<template>
    <div class="tabs">
        <div class="my-tabs d-flex hidden-sm-and-down">
            <draggable id="tabList" v-model="tabs" animation="150" class="tab-list" @end="dragEnd">
                <div v-for="(item, index) in tabs" :key="index" :title="item.title" class="item d-flex a-center" :class="{active: currentTab.id === item.id}" :data-index="index" @click="selectCurrentTab($event, item, index)" @contextmenu="handleRightClick($event, item, index)">
                    <span :class="{green: item.method === 'get', yellow: item.method === 'post', blue: item.method === 'put', red: item.method === 'delete'}">
                        {{ item.method.toUpperCase() }}
                    </span>&nbsp;&nbsp;
                    <span class="item-text">{{ item.title }}</span>
                    <i class="iconfont el-icon-close close" @click="closeTab($event, item, index)"></i>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable"
export default {
    components: {
        draggable,
    },
    data() {
        return {
            tabs: [],
            ctx: null, //tab右键弹框
            //======================================其他参数===================================//
            activeIndex: 0,
        };
    },
    computed: {
        currentTab() {
            return this.$store.state.viewTabs.currentTab
        }
    },
    watch: {
        "$store.state.viewTabs.tabs": {
            handler(val) {
                this.tabs = val;
            },
            deep: true
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        //=====================================初始化====================================//
        init() {
            //取消鼠标右键实例对象
            document.body.addEventListener("click", () => {
                if (this.ctx) {
                    document.body.removeChild(this.ctx);
                    this.ctx = null;
                }
            });
            this.$el.addEventListener("contextmenu", e => {
                e.returnValue = false;
            });
            const currentTabs = localStorage.getItem("viewTabs") ? JSON.parse(localStorage.getItem("viewTabs")) : [];
            const projectTabs = currentTabs.filter(val => val.projectId === this.$route.query._id);
            this.$store.commit("changeAllViewTabs", projectTabs);
        },
        //=====================================获取远程数据====================================//

        //=====================================tabs操作====================================//
        //tabs拖拽结束
        dragEnd(evt) {
            if (evt.oldIndex === this.activeIndex) {
                this.activeIndex = evt.newIndex;
            }
        },
        //=====================================前后端交互====================================//

        //=====================================其他操作====================================//
        //改变右键菜单背景色
        triggerBackground(dom) {
            dom.addEventListener("mouseover", e => {
                e.stopPropagation();
                e.target.style.background = "#eee";
            });
            dom.addEventListener("mouseout", e => {
                e.stopPropagation();
                e.target.style.background = "#fff";
            });
        },

        //关闭标签
        closeTab(e, item, index) {
            e.stopPropagation();
            if (this.tabs.length === 1) { //必须存在一个标签
                return;
            }
            this.$store.commit("removeViewTabs", item.id);
            if (this.activeIndex === index) {
                if (this.tabs[index]) {//右侧还存在标签
                    this.activeIndex = index;
                    this.$store.commit("changeCurrentViewTabs", this.tabs[index].id);
                } else {//右侧不存在标签
                    this.activeIndex = index - 1;
                    this.$store.commit("changeCurrentViewTabs", this.tabs[index - 1].id);
                }
            }
        },
        //选择当前标签
        selectCurrentTab(e, item, index) {
            this.activeIndex = index;
            this.$store.commit("changeCurrentViewTabs", item.id);
            this.$emit("change", item);
        },
        //右键菜单
        handleRightClick(e, item, index) {
            const x = e.clientX; //当前点击位置
            const y = e.clientY; //当前点击位置
            if (this.ctx) {
                document.body.removeChild(this.ctx);
                this.ctx = null;
            }
            //创建右键弹框
            this.ctx = document.createElement("div");
            this.ctx.style.position = "fixed";
            this.ctx.style.left = x + "px";
            this.ctx.style.top = y + "px";
            this.ctx.style.zIndex = 9999;
            const html = `
                <div style="background: #fff; border-radius: 4px; box-shadow: 1px 4px 10px #aaa;padding: 0 0;">
                    <div style="line-height: 2em;cursor: pointer;padding: .3em 2em;border-top-clickLeft-radius: 4px;border-top-right-radius: 4px;" class="c1">关闭右侧</div>
                    <div style="line-height: 2em;cursor: pointer;padding: .3em 2em;" class="c2">关闭左侧</div>
                    <div style="line-height: 2em;cursor: pointer;padding: .3em 2em;" class="c3">关闭标签</div>
                    <div style="line-height: 2em;cursor: pointer;padding: .3em 2em;" class="c4">关闭其他</div>                    
                </div>
            `;
            this.ctx.innerHTML = html;
            document.body.appendChild(this.ctx);
            //绑定相应事件
            const c1 = document.querySelector(".c1");
            const c2 = document.querySelector(".c2");
            const c3 = document.querySelector(".c3");
            const c4 = document.querySelector(".c4");
            // 获取dom和当前绑定事件元素
            // const current = e.currentTarget; //currentTarget必须立即赋值，否则在其他事件里面currentTarget不可见
            // const doms = document.querySelector("#tabList");
            //关闭右侧
            c1.addEventListener("click", () => {
                if (this.tabs.length !== 1) {
                    this.$store.commit("deleteViewTabs", {
                        start: index + 1,
                        num: this.tabs.length - index - 1
                    });
                }
                this.activeIndex = index;
            });
            //关闭左侧
            c2.addEventListener("click", () => {
                if (this.tabs.length !== 1) {
                    this.$store.commit("deleteViewTabs", { start: 0, num: index });
                }
                this.activeIndex = 0;
                this.$store.commit("changeCurrentViewTabs", item.id);
            });
            //关闭当前标签
            c3.addEventListener("click", () => {
                if (this.tabs.length === 1) { //必须存在一个标签
                    return;
                }
                this.$store.commit("removeViewTabs", item.id);
                if (this.activeIndex === index) {
                    if (this.tabs[index]) {//右侧还存在标签
                        this.activeIndex = index;
                        this.$store.commit("changeCurrentViewTabs", this.tabs[index].id);
                    } else {//右侧不存在标签
                        this.activeIndex = index - 1;
                        this.$store.commit("changeCurrentViewTabs", this.tabs[index - 1].id);
                    }
                }
            });
            //关闭其他标签
            c4.addEventListener("click", () => {
                if (this.tabs.length !== 1) {
                    this.$store.commit("deleteViewTabs", {
                        start: index + 1,
                        num: this.tabs.length - index - 1
                    });
                    this.$store.commit("deleteViewTabs", { start: 0, num: index });
                    this.activeIndex = 0;
                    this.$store.commit("changeCurrentViewTabs", item.id);
                }
            });
            this.triggerBackground(c1);
            this.triggerBackground(c2);
            this.triggerBackground(c3);
            this.triggerBackground(c4);
            //=========================================================================//
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
            // text-align: center;
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

            &:first-of-type {
                &::before {
                    content: "";
                    display: inline-block;
                    height: 50%;
                    position: absolute;
                    transform: translate(0, -50%);
                    left: 0;
                    top: 50%;
                    width: 1px;
                    background: #aaa;
                }
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
                background: #aaa;
            }
            &.active {
                background: #f0f3fa;
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
    .utils {
        display: flex;
        align-items: center;
        .icons {
            height: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 18px;
            &:hover {
                background: $gray-400;
            }
        }
    }
}
</style>
