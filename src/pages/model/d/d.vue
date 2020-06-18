/*
    创建者：shuxiaokai
    创建时间：2019-09-10 21:26
    模块名称：文档查看
    备注：xxxx
*/
<template>
    <div class="doc-view">
        <s-banner class="left"></s-banner>
        <s-details class="right"></s-details>
    </div>
</template>

<script>
import banner from "./banner/banner.vue"
import details from "./details/details.vue"
export default {
    components: {
        "s-banner": banner,
        "s-details": details
    },
    data() {
        return {

        };
    },
    created() {
        document.title = "文档查看"
    },
    methods: {

    }
};
</script>



<style lang="scss">
.doc-view {
    height: calc(100vh - 60px);
    display: flex;
    .left {
        flex: 0 0 auto;
        width: 300px;
        height: 100%;
        border-right: 1px solid $gray-400;
        display: flex;
        flex-direction: column;
        .left-tool {
            position: relative;
            padding: 20px 20px 10px 20px;
            background: rgb(244, 244, 244);
            .el-input {
                border-radius: 20px;
                .el-input__inner {
                    border-radius: 20px;
                }
            }
        }

        .blank_tree {
            flex: 1;
        }
        .el-tree-node__content {
            height: 35px;
        }
        .custom-tree-node {
            display: flex;
            align-items: center;
            height: 30px;
            width: 100%;
            .node-name {
                display: inline-block;
                max-width: 180px;
            }
            .bg-active {
                background: $theme-color;
                color: #fff;
            }
            &.active {
                .node-more {
                    display: inline-block;
                } 
            }
            .node-more {
                display: none;
            }
            .new-input {
                margin-left: 10px;
            }
        }
    }
    .right {
        flex: 1;
    }
}
</style>
