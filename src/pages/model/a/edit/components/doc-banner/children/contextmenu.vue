/*
    创建者：shuxiaokai
    创建时间：2020-01-11 18:36
    模块名称：节点右键菜单
    备注：
*/
<template>
    <div class="ctx-wrap" :style="{left: left + 'px', top: top + 'px'}">
        <div v-show="operations.includes('file')" class="item-list" @click="handleClickItem('file')">新建文件</div>
        <div v-show="operations.includes('folder')" class="item-list" @click="handleClickItem('folder')">新建文件夹</div>
        <div v-show="operations.includes('restful')" class="item-list" @click="handleClickItem('restful')">新建RESTFUL</div>
        <div v-show="operations.includes('rename')" class="item-list" @click="handleClickItem('rename')">重命名</div>
        <div v-show="operations.includes('copy')" class="item-list" @click="handleClickItem('copy')">复制接口</div>                    
        <div v-show="operations.includes('delete')" class="item-list" @click="handleClickItem('delete')">删除</div>                    
    </div>
</template>

<script>
export default {
    props: {
        operations: {
            type: Array,
            default() {
                return ["file", "folder"];
            }
        },
        left: {
            type: Number,
            default: 0
        },
        top: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            
        };
    },
    created() {

    },
    methods: {
        handleClickItem(type) {
            /*eslint-disable indent*/
            switch (type) {
                case "file":
                    this.$emit("file")
                    break;
                case "folder":
                    this.$emit("folder")
                    break;
                case "restful":
                    this.$emit("restful")
                    break;
                case "rename":
                    this.$emit("rename")
                    break;
                case "delete":
                    this.$emit("delete")
                    break;
                case "copy":
                    this.$emit("copy")
                    break;
                default:
                    break;
            } 
        },
    }
};
</script>



<style lang="scss">
    .ctx-wrap {
        position: fixed;
        background: $white;
        border-radius: $border-radius-sm;
        box-shadow: $box-shadow-sm;
        z-index: 20;
        .item-list {
            line-height: 2em;
            padding: .3em 2em;
            cursor: pointer;
            &:hover {
                background: $gray-300;
            }
        }
    }
</style>
