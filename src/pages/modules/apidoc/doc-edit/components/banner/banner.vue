/*
    创建者：shuxiaokai
    创建时间：2020-06-24 20:33
    模块名称：文档管理banner导航页面
    备注：xxxx
*/
<template>
    <div class="banner">
        <!-- 工具栏 -->
        <div class="tool">
            <h2 class="gray-700 f-lg text-center">测试文档</h2>
            <el-input v-model="query" class="doc-search" placeholder="支持文档名称，文档url搜索" clearable @input="handleSearchTree"></el-input>
            <div class="tool-icon d-flex j-between mt-1 px-1">
                <el-tooltip class="item" effect="dark" content="新增文件夹" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true" @click="handleOpenAddFolderDialog();docParentId = '';">
                        <use xlink:href="#iconxinzengwenjian"></use>
                    </svg>                        
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="新增文件" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true" @click="handleOpenAddFileDialog();docParentId = '';">
                        <use xlink:href="#iconwenjian"></use>
                    </svg>               
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="历史记录" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#iconlishi"></use>
                    </svg>               
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="预览文档" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#iconpreview"></use>
                    </svg>               
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="导出" :open-delay="300">
                    <s-download url="/api/project/doc_word" :params="{ projectId: $route.query._id }">
                        <svg class="svg-icon" aria-hidden="true">
                            <use xlink:href="#icondaochu"></use>
                        </svg>                    
                    </s-download>
                </el-tooltip>
            </div>
        </div>
        <!-- 树形文档导航 -->
        <div class="doc-nav">
            <el-tree 
                    ref="docTree"
                    :data="navTreeData" 
                    node-key="id" 
                    empty-text="点击按钮新增文档"
                    :expand-on-click-node="true" 
                    @node-contextmenu="handleContextmenu"
                    :highlight-current="true"
            >
                <template slot-scope="scope">
                    <div 
                        class="custom-tree-node"
                        :class="{'has-hover': hoverNodeId}"
                        tabindex="1"
                        @keydown="handleKeydown($event, scope.data)"
                        @mouseover="hoverNodeId = scope.data._id"
                        @mouseout="hoverNodeId = ''"
                    >
                        <!-- file渲染 -->
                        <template v-if="!scope.data.isFolder">
                            <span v-if="scope.data.item.methods === 'get'" class="label green">get</span>
                            <span v-else-if="scope.data.item.methods === 'post'" class="label yellow">post</span>
                            <span v-else-if="scope.data.item.methods === 'put'" class="label blue">put</span>
                            <span v-else-if="scope.data.item.methods === 'delete'" class="label red">del</span>  
                            <img v-else :src="require('@/assets/imgs/apidoc/file.png')" width="16px" height="16px"/> 
                            <span v-if="renameNodeId !== scope.data._id" :title="scope.data.docName" class="node-name text-ellipsis ml-1">{{ scope.data.docName }}</span>
                            <input v-else v-model="scope.data.docName" placeholder="不能为空" type="text" class="rename-ipt f-sm ml-1" @blur="handleChangeNodeName(scope.data)" @keydown.enter="handleChangeNodeName(scope.data)">
                        </template>
                        <!-- 文件夹渲染 -->
                        <template v-if="scope.data.isFolder">
                            <img :src="require('@/assets/imgs/apidoc/folder.png')" width="16px" height="16px"/>    
                            <span v-if="renameNodeId !== scope.data._id" :title="scope.data.docName" class="node-name text-ellipsis ml-1">{{ scope.data.docName }}</span>
                            <input v-else v-model="scope.data.docName" placeholder="不能为空" type="text" class="rename-ipt f-sm ml-1" @blur="handleChangeNodeName(scope.data)" @keydown.enter="handleChangeNodeName(scope.data)">
                            <el-dropdown 
                                v-show="hoverNodeId === scope.data._id"
                                class="node-more ml-auto mr-2"
                                trigger="click"
                                @command="(command) => { this.handleSelectDropdown(command, data) }"
                                @click.native.stop="() =>{}"
                            >
                                <span class="el-icon-more"></span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="scope.data.isFolder" command="addFile">新建文档</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.data.isFolder" command="addFolder">新建文件夹</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.data.isFolder" command="addTemplate">以模板新建</el-dropdown-item>
                                    <el-dropdown-item command="rename">重命名</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>                      
                        </template>
                    </div>
                </template>
            </el-tree>
        </div>
        <!-- 弹窗 -->
        <s-add-folder-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :pid="docParentId" @success="handleAddFileAndFolderCb"></s-add-folder-dialog>
        <s-add-file-dialog v-if="dialogVisible2" :visible.sync="dialogVisible2" :pid="docParentId" @success="handleAddFileAndFolderCb"></s-add-file-dialog>
    </div>
</template>

<script>
import Vue from "vue"
import { findoNode } from "@/lib/utils"
import addFolderDialog from "../../dialog/add-folder"
import addFileDialog from "../../dialog/add-file"
import contextmenu from "./components/contextmenu"
export default {
    components: {
        "s-add-folder-dialog": addFolderDialog,
        "s-add-file-dialog": addFileDialog,
    },
    computed: {
        navTreeData() { //----树形导航数据
            return this.$store.state.apidoc.banner;
        }
    },
    data() {
        return {
            //=====================================文档增删改查====================================//
            query: "", //----------------导航
            docParentId: "", //----------文档父id
            contextmenu: null, //--------右键弹窗
            renameNodeId: "", //------正在重命名的节点
            //=====================================其他参数====================================//
            hoverNodeId: "", //----------控制导航节点更多选项显示
            dialogVisible: false, //-----新增文件夹弹窗
            dialogVisible2: false, //----新增文件弹窗
        };
    },
    mounted() {
        this.$store.dispatch("apidoc/getDocBanner", { _id: this.$route.query.id });
        this.init();
    },
    methods: {
        //=====================================初始化相关====================================//
        init() {
            document.documentElement.addEventListener("click", (e) => {
                e.stopPropagation();
                this.clearContextmenu();
            })
        },
        //=====================================导航操作==================================//
        //创建鼠标右键dom元素
        handleContextmenu(e, data, node) {
            e.stopPropagation();
            this.clearContextmenu(); //清除contextmenu
            // console.log(data)
            const ContextmenuConstructor = Vue.extend(contextmenu);
            const x = e.clientX; //当前点击位置
            const y = e.clientY; //当前点击位置
            const operations = data.isFolder ? ["file", "folder", "template", "rename", "delete"] : ["rename", "delete", "copy"]
            this.contextmenu = new ContextmenuConstructor({
                propsData: {
                    operations,
                    left: x,
                    top: y
                },
            }).$mount();
            document.body.appendChild(this.contextmenu.$el);
            this.contextmenu.$on("file", () => {
                this.docParentId = data._id;
                this.handleOpenAddFileDialog();
            })
            this.contextmenu.$on("folder", () => {
                this.docParentId = data._id;
                this.handleOpenAddFolderDialog();
            })
            this.contextmenu.$on("rename", () => {
                this.$set(data, "_docName", data.docName); //文档名称备份,防止修改名称用户名称填空导致异常
                this.renameNodeId = data._id;
                this.$nextTick(() => {
                    document.querySelector(".rename-ipt").focus();                    
                })
            })
            this.contextmenu.$on("delete", () => {
                this.handleDeleteItem(data, node);
            })
            this.contextmenu.$on("template", () => {
                this.addRestFul(data);
            })
            this.contextmenu.$on("copy", () => {
                this.copyDoc(data);
            })
        },   
        //处理节点上面keydown快捷方式(例如f2重命名)
        handleKeydown(e, data) {
            if (e.code === "F2") {
                this.renameNodeId = data._id;
                this.$nextTick(() => {
                    document.querySelector(".rename-ipt").focus();                    
                })
            }
        }, 
        //添加文件夹或文档成功回调函数
        handleAddFileAndFolderCb(data) {
            const pNode = findoNode(this.docParentId, this.navTreeData, null, { id: "_id" });
            if (!pNode) {
                this.navTreeData.push(data)
            }else if (data.isFolder) {
                pNode.children.unshift(data);
            } else {
                pNode.children.push(data);
            }
        },
        // //添加文档成功回调函数
        // handleAddFileCb() {

        // },
        //=====================================前后端交互====================================//
        handleSearchTree() {},
        //删除某一项
        handleDeleteItem(data, node) {
            const deleteId = data._id
            this.$confirm(`此操作将永久删除 ${data.docName} 节点, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("/api/project/doc", { data: { _id: deleteId }}).then(() => {
                    const pNode = node.parent;
                    if (pNode && pNode.level !== 0) {
                        const nodeIndex = pNode.children.findIndex(val => val._id === deleteId);
                        pNode.splice(nodeIndex, 1)
                    } else {
                        const nodeIndex = this.navTreeData.findIndex(val => val._id === deleteId);
                        this.navTreeData.splice(nodeIndex, 1);
                    }
                }).catch(err => {
                    this.$errorThrow(err, this);
                });            
            }).catch((err) => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        //重命名某个节点
        handleChangeNodeName(data) {
            if (data.docName.trim() === "") {
                data.docName = data._docName;
                return;
            }
            const params = {
                _id: data._id,
                docName: data.docName
            };
            this.axios.put("/api/project/change_doc_info", params).then(() => {
            }).catch(err => {
                data.docName = data._docName; //修改出错后回复文档名称
                this.$errorThrow(err, this);
            });
            this.renameNodeId = "";
        },
        //=====================================弹窗相关====================================//  
        //打开文件新增弹窗
        handleOpenAddFolderDialog() {
            this.dialogVisible = true;
        },
        //打开文件新增弹窗
        handleOpenAddFileDialog() {
            this.dialogVisible2 = true;
        },
        //=====================================其他操作=====================================//
        //清除contextmenu
        clearContextmenu() {
            if (this.contextmenu) {
                document.body.removeChild(this.contextmenu.$el);
                this.contextmenu = null;
            }            
        },
    }
};
</script>



<style lang="scss">
.banner {
    width: size(300);
    height: 100%;
    border-right: 1px solid $gray-400;
    display: flex;
    flex-direction: column;
    .tool {
        position: relative;
        padding: 0 size(20);
        height: size(150);
        background: $gray-200;
        // 搜索框样式
        .doc-search {
            border-radius: 20px;
            .el-input__inner {
                border-radius: 20px;
            }
        }        
        // 快捷方式样式
        .tool-icon {
            position: relative;
            .svg-icon {
                width: size(25);
                height: size(25);
                padding: size(5);
                cursor: pointer;
                &:hover {
                    background: $gray-400;
                }
            }            
        }
    }
    .doc-nav {
        height: calc(100vh - #{size(60)} - #{size(150)});
        .custom-tree-node {
            display: flex;
            align-items: center;
            height: 30px;
            width: 100%;
            .label {
                display: inline-block;
                width: 25px;
            }
            .node-name {
                display: inline-block;
                max-width: 180px;
            }
        }
    }

}
</style>
