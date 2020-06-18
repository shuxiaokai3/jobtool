/*
    创建者：shuxiaokai
    创建时间：2020-01-07 21:10
    模块名称：文档导航栏
    备注：xxxx
*/
<template>
    <div class="doc-nav">
        <div class="tree-nav">
            <el-tree 
                    ref="docTree"
                    :data="data" 
                    node-key="id" 
                    :draggable="!isEditing"
                    empty-text="点击按钮新增文档"
                    :expand-on-click-node="false" 
                    :render-content="renderContent" 
                    :allow-drop="handleCheckNodeCouldDrop"
                    :default-expanded-keys="defaultExpandKeys"
                    :highlight-current="true"
                    @node-drop="handleNodeDropSuccess"
                    @node-expand="nodeExpand" 
                    @node-collapse="nodeCollapse" 
                    @current-change="handleNodeChange" 
                    @node-click="handleNodeClick" 
                    @node-contextmenu="handleContextmenu"
            >
            </el-tree>
        </div>
        <div class="flex1" @contextmenu="handleContextmenuBlankTree"></div>
        <s-restful-model v-if="isShow" :is-show="isShow" :pid="restfulPid" @close="isShow = false;"></s-restful-model>
    </div>
</template>

<script>
import { findoNode, findParentNode, findChildrenNodeIds } from "@/lib/utils"
import contextmenu from "./children/contextmenu"
import restful from "@/pages/model/a/edit/model/add-restful/add-restful"
import Vue from "vue"
import uuid from "uuid/v4"
export default {
    components: {
        "s-restful-model": restful
    },
    data() {
        return {
            mouseContext: null, //=============================鼠标右键实例
            copyData: [], //===================================拷贝以后的树形导航数据
            renameNodeLabel: "", //============================被更改名称的node
            restfulPid: "", //restful弹窗父元素id
            //=====================================其他参数====================================//
            isShow: false, //是否展示restful弹窗
        };
    },
    computed: {
        isEditing() {
            return this.$store.state.docs.isEditing; //编辑时禁止拖拽
        },
        data() {
            return this.$store.state.docs.rowDocBanner;
        },
        currentActiveNode: {
            set(val) {
                this.$store.commit("changeCurrentTab", {
                    projectId: this.$route.query._id,
                    id: val.id || val._id,
                    title: val.label || val.docName,
                    method: val.item ? val.item.methods : "get",
                    nodeType: val.nodeType,
                })
            },
            get() {
                return this.$store.state.tabs.currentTab[this.$route.query._id];
            }
        },
        currentFileTab: {
            set(val) {
                this.$store.commit("changeCurrentFileTab", {
                    projectId: this.$route.query._id,
                    id: val.id || val._id,
                    title: val.label || val.docName,
                    method: val.item ? val.item.methods : "get",
                    nodeType: val.nodeType
                })
            },
            get() {
                return this.$store.state.tabs.currentFileTab[this.$route.query._id];
            }
        },
        defaultExpandKeys() {
            const fileTab = this.$store.state.tabs.currentFileTab[this.$route.query._id];
            const currentTab = this.$store.state.tabs.currentTab[this.$route.query._id];
            if (currentTab && fileTab) {
                return [fileTab.id, currentTab.id];
            } else if (currentTab) { //修复新增文档无法展开
                return [currentTab.id];
            } else {
                return [];
            }
        },
    },
    mounted() {
        this.bindBodyClick(); 
        this.getDocTreeData();
    },
    methods: {
        //全局点击移除contextmenu
        bindBodyClick() {
            document.body.addEventListener("click", (e) => {
                e.stopPropagation();
                if (this.mouseContext) {
                    document.body.removeChild(this.mouseContext.$el)
                    this.mouseContext = null;
                }
            })            
        },
        //=====================================数据获取====================================//
        //获取树形菜单数据
        getDocTreeData() {
            this.$store.dispatch("getDocBanner", { _id: this.$route.query._id });
        },
        //=====================================树形组件渲染====================================//
        //渲染树形组件
        renderContent(h, { data }) {
            const navTagDom = this.getRenderNavTag(data);
            const navTitleDom = this.getRenderNavTitleDom(data);
            const navMoreDom = this.getRenderNavMoreDom(data);
            return (
                <div class={["custom-tree-node"]} on-mouseover={(e) => {e.target.classList.add("active")}} on-mouseleave={(e) => {e.target.classList.remove("active")}}>
                    { navTagDom }
                    { navTitleDom }
                    { navMoreDom }
                </div>
            );
        },
        //渲染导航前面类型标识符
        getRenderNavTag(data) {
            const folderBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABNUlEQVRYR2O8NcvV4A/D//mMjAwGDMSA//8fcLD+NVRMPPCBGOWE1DBen+28gIGBMZ6QQmT5//8ZLmil7TEkRQ8utYzXZ7kcYGBksCfZsP//F2im7U0kWR+aBvIdQKHNoFBkYWBMRHEAl6Q+A5ekHoVG49f+9+cXhvdX10MV/V+I4gA5716aOwBk86OtJQzfnl9kYPjPcBDsAE5OJns2NiYGflV3BlZecZqGAMjwj7d2Mnx994Lh+/e/Bxmfr3C/w8fHpkxzW7FY8OnTr7uM7zZ4fWBnY+YfCAf8/PX346gDRkOA8cs23wOMDGQUxVRItf8ZGA6OOmA0BEZDYDQERkNgNARGQ2A0BBi/bvNdwMDAQFLnlAptEZgRCxm/bPUyYGRgbmBgZPCnosGEjfrPsPE/w98GALlfxBWV0GZvAAAAAElFTkSuQmCC";
            const fileBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACRElEQVRYR+2XQWtTQRDH//NMqkmgeRS1qR6MFws1hx48iZD6CYyg4EkRquitfgFTv4B60SJCq3dBPQoe0oOgeDBBqUI9RKRqUJtXq01e0vdG5tm0NSTZ102iRBx4PNjZnf3t7MzuDmFNLsy8jsNx0gROAWTW2nX+DOQNF8dvnk9kVeOp1uHi7VcTIFxjIEfMlrQbRIH+SHDQIARUhkS/UnHMcsVdg2eLXDqqgtgE8DIDouTUeMJrKxbZtMl+ASDuZ3Lpk5lbxOzcIkbj/cjmvwFQQzQFKBTtFBPf9zv5ZoAzyb2wVlbx8HlBCdEU4GOxNElEaV2A+K4Qsu+WPQhmXjKYxhptR1cBBF4F0XUAgfhk2ZjOLDiVqvO93hN/BKAVREcBns5beJT7gmg44GVCvRQsG28+/IABPLkxnjgi+o4CiMG7swvIfy61jN1YNPg1fXJ4Z1cAVFlz5d5bDJl9S5dPHPAOrI574N8DkBSSfS1XXdXiGuqTIwMYGxlY1215C0pVF8/mvbtJS+RElK8mWwbQmrXFoP8AvecByYJbj99rh8LwnghOHR5qLwhVR2srOjMShBneeNH13hZo+77JwN70wF+NAZlc7gJdkYfJsUO728sCSUXdy2jQ3I5Q0GgPQHf1jcb5DkKdwsQPqG8AKc3KKGeJaJ8fw377CECoj3JXTx8crXuS/SpOwcgyYaM4DQdifotTFcRq1d2xbDsxMC5NnUtc/w1AynNynElmThFRVGVMRy8lGhE9KG2LTNw5u99b5E8iCxg/2kxzLAAAAABJRU5ErkJggg==";
            let result = {};
            if (data.nodeType === "file") {
                if (!data.item) {
                    result = (<img src={fileBase64} width="16px" height="16px" />);
                } else if (data.item.methods === "get") {
                    result = (<span class="label green">{ data.item.methods }</span>);
                } else if (data.item.methods === "post") {
                    result = (<span class="label yellow">{ data.item.methods }</span>);
                } else if (data.item.methods === "put") {
                    result = (<span class="label blue">{ data.item.methods }</span>);
                } else if (data.item.methods === "delete") {
                    result = (<span class="label red">del</span>);
                }
            } else if (data.nodeType === "folder") {
                result = (<img src={folderBase64} width="16px" height="16px"/>);
            }
            return result;
        },
        //渲染导航title文字或者编辑时候的输入框
        getRenderNavTitleDom(data) {
            const isActiveTitle = this.currentFileTab && this.currentFileTab.id === data.id && data.nodeType === "file"
            if (data.__isNew) {
                return (
                    <input
                        vModel={data.label}
                        type="text"
                        class="new-input"
                        placeholder="回车或者失焦保存"
                        on-keydown={e => this.handleEnterSave(e, data)}
                        on-blur={this.handleNewInputBlur.bind(this, data)}
                    />
                );
            } else {
                return (<span class={["node-name", "text-ellipsis", "ml-1", isActiveTitle ? "bg-active" : ""]} title={data.label}>{data.label}</span>)
            }
        },
        //渲染导航文字末尾更多选项
        getRenderNavMoreDom(data) {
            return (
                <el-dropdown class="node-more ml-auto mr-2" trigger="click" on-command={(command) => { this.handleSelectDropdown(command, data) }}>
                    <span class="el-icon-more"></span>
                    <el-dropdown-menu slot="dropdown">
                        { data.nodeType === "file" ? "" : <el-dropdown-item command="newFile">新建文件</el-dropdown-item> }
                        { data.nodeType === "file" ? "" : <el-dropdown-item command="newFolder">新建文件夹</el-dropdown-item> }
                        { data.nodeType === "file" ? "" : <el-dropdown-item command="newResource">新建RESTRUL</el-dropdown-item> }
                        <el-dropdown-item command="rename">重命名</el-dropdown-item>
                        <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            );
        },
        //=====================================处理键盘鼠标事件====================================//
        //文档下拉框选择 重命名，删除，新增...
        handleSelectDropdown(command, data) {
            /*eslint-disable indent*/
            switch (command) {
                case "newFile":
                    this.addNewFile(data);
                    break;
                case "newFolder":
                    this.addNewFolder(data);
                    break;
                case "rename":
                    this.renameNode(data);
                    break;
                case "delete":
                    this.deleteCurrentNode(data);
                    break;
                case "newResource":
                    this.addRestFul(data);
                    break;
                default:
                    break;
            }
        },
        //监听文档输入，处理回车保存事件
        handleEnterSave(e, data) {
            if (e.keyCode === 13 && data.label.trim() !== "") {
                e.target.blur();
            }
        },
        //创建鼠标右键dom元素
        handleContextmenu(e, data) {
            e.stopPropagation();
            console.log(data)
            // this.currentActiveNode = data;
            const ContextmenuConstructor = Vue.extend(contextmenu);
            const x = e.clientX; //当前点击位置
            const y = e.clientY; //当前点击位置
            if (this.mouseContext) {
                document.body.removeChild(this.mouseContext.$el);
                this.mouseContext = null;
            }
            const operations = data.nodeType === "folder" ? ["file", "folder", "restful", "rename", "delete"] : ["rename", "delete", "copy"]
            this.mouseContext = new ContextmenuConstructor({
                propsData: {
                    operations,
                    left: x,
                    top: y
                },
            }).$mount();
            document.body.appendChild(this.mouseContext.$el);
            this.mouseContext.$on("file", () => {
                this.addNewFile(data);
            })
            this.mouseContext.$on("folder", () => {
                this.addNewFolder(data);
            })
            this.mouseContext.$on("rename", () => {
                this.renameNode(data);
            })
            this.mouseContext.$on("delete", () => {
                this.deleteCurrentNode(data);
            })
            this.mouseContext.$on("restful", () => {
                this.addRestFul(data);
            })
            this.mouseContext.$on("copy", () => {
                this.copyDoc(data);
            })
        },
        //点击空白处弹出新增根节点
        handleContextmenuBlankTree(e) {
            e.stopPropagation();
            e.preventDefault();
            this.currentActiveNode = {};
            const ContextmenuConstructor = Vue.extend(contextmenu);
            const x = e.clientX; //当前点击位置
            const y = e.clientY; //当前点击位置
            if (this.mouseContext) {
                document.body.removeChild(this.mouseContext.$el);
                this.mouseContext = null;
            }
            this.mouseContext = new ContextmenuConstructor({
                propsData: {
                    operations: ["file", "folder"],
                    left: x,
                    top: y
                },
            }).$mount();
            document.body.appendChild(this.mouseContext.$el);
            this.mouseContext.$on("file", () => {
                this.addNewFile();
            })
            this.mouseContext.$on("folder", () => {
                this.addNewFolder();
            })
            this.mouseContext.$on("rename", () => {
                this.renameNode();
            })
            this.mouseContext.$on("delete", () => {
                this.deleteCurrentNode();
            })
            this.mouseContext.$on("restful", () => {
                this.addRestFul();
            })
        },
        //新增文件或者文件夹blur触发
        handleNewInputBlur(data) {
            this.$store.commit("changeEditingState", false);
            if (data.isRemoteData) { //如果是远程数据，说明blur触发的是修改
                if (data.label.trim() === "" || data.label === this.renameNodeLabel) { //命名为空或者命名没有改变不做处理
                    data.label = this.renameNodeLabel;
                } else {
                    const params = {
                        _id: data.id,
                        docName: data.label
                    };
                    this.axios.put("/api/project/change_doc_info", params).then(res => {
                        data.id = res.data._id;
                        // this.currentActiveNode = data;
                    }).catch(err => {
                        data.label = this.renameNodeLabel;
                        this.$errorThrow(err, this);
                    });
                }
                data.__isNew = false;
            } else { //否则触发新增
                if (data.label.trim() === "") { //如果未填写则删除空文档
                    if (findParentNode(data.id, this.data)) {
                        if (data.nodeType === "folder") {
                            findParentNode(data.id, this.data).children.shift();
                        } else {
                            findParentNode(data.id, this.data).children.pop();
                        }
                    } else {
                        if (data.nodeType === "folder") {
                            this.data.shift();
                        } else {
                            this.data.pop();
                        }
                    }
                } else {
                    this.addNewDoc(data);
                }
            }
        },

        //=====================================树形组件操作相关====================================//
        //处理拖拽
        handleCheckNodeCouldDrop(draggingNode, dropNode, type) {
            if (draggingNode.data.nodeType === "file" && dropNode.data.nodeType === "folder" && type !== "inner") { //不允许文件在文件夹前面
                return type !== "prev";
            }
            if (dropNode.data.nodeType === "file") { 
                return type !== "inner";
            } else {
                return true
            }
        },
        //拖拽成功时候触发
        handleNodeDropSuccess(node, dropNode, type) {
            const params = {
                _id: node.data.id, //当前节点id
                pid: "", //父元素
                ancestors: dropNode.data.ancestors, //拖拽以后当前节点祖先节点
                sort: 0, //当前节点排序效果
            };
            let pNode = null; 
            if ((node.level !== dropNode.level) || (node.level === dropNode.level && type === "inner")) { //将节点放入子节点中
                params.ancestors = []; //放入某个文件夹，需要清空历史祖先元素
                pNode = findParentNode(node.data._id, this.data);
                console.log(node.data, this.data, pNode)
                params.pid = pNode ? pNode.id : "";
                while (pNode != null) {
                    params.ancestors.push(pNode.id);
                    pNode = findParentNode(pNode._id, this.data);
                }
            } else if (node.level === dropNode.level && type !== "inner") {
                params.pid = node.data.pid;
                pNode = findParentNode(node.data._id, this.data);
                while (pNode != null) {
                    params.ancestors.push(pNode.id);
                    pNode = findParentNode(pNode._id, this.data);
                }
            }
            if (type === "after") { //说明这个节点是第一个节点
                params.sort = dropNode.data.sort - 1;
            } else if (type === "before") {
                params.sort = dropNode.data.sort + 1;
            } else if (type === "inner") {
                params.sort = Date.now();
            }
            this.axios.put("/api/project/change_doc_pos", params).then(() => {
                this.getDocTreeData();
                //this.defaultExpandKeys = [...this.defaultExpandKeys, ...params.ancestors];
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //点击节点
        handleNodeClick(data) {
            if (data.label.trim() === "") {
                return;
            }
            this.currentActiveNode = data;
            if (this.mouseContext) {
                document.body.removeChild(this.mouseContext.$el);
                this.mouseContext = null;
            }
            if (data.nodeType === "file") {
                this.$store.commit("addTab", {
                    projectId: this.$route.query._id,
                    id: data.id.toString(),
                    title: data.label.toString(),
                    method: data.item.methods,
                    nodeType: data.nodeType,
                });
                this.$route.query.docId = data.id.toString();                
            }
        },
        //节点改变的时候
        handleNodeChange() {
            this.clearContextNode();
        },
        //节点打开
        nodeExpand() {
           this.clearContextNode();
        },
        //节点收缩
        nodeCollapse() {
            this.clearContextNode();
        },
        //=====================================前后端交互====================================//
        //请求远程添加树形组件
        addNewDoc(data) {
            const params = {
                docName: data.label.slice(0, 30), //最多30位
                isFolder: data.nodeType === "folder",
                pid: findParentNode(data.id, this.data) ? findParentNode(data.id, this.data).id : "",
                projectId: this.$route.query._id
            };
            this.axios.post("/api/project/new_doc", params).then(res => {
                data.id = res.data._id;
                data.label = res.data.docName;
                data.nodeType = res.data.isFolder ? "folder" : "file";
                if (data.nodeType === "file") {
                    this.$store.commit("addTab", {
                        projectId: this.$route.query._id,
                        id: res.data._id.toString(),
                        title: res.data.docName.toString(),
                        method: "get",
                        nodeType: data.nodeType,
                    });
                    this.currentActiveNode = res.data;
                    this.currentFileTab = res.data;
                    this.$route.query.docId = res.data._id.toString();
                }
                this.getDocTreeData();
            }).catch(err => {
                this.$errorThrow(err, this);
            });
            data.__isNew = false;
        },
        //新建文件
        addNewFile(data) {
            // console.log(data, 2)
            if (!data) { //不存在节点信息，通过点击按钮新建
                const activeNode = findoNode(this.currentActiveNode ? this.currentActiveNode.id : "", this.data); //当前选中的节点
                if (activeNode.children && activeNode.children.filter(val => val.isFolder === false).length > 8) {
                    this.$confirm("单文件夹文档数量超过8个将变得难以阅读!", "提示", {
                        confirmButtonText: "强制提交",
                        cancelButtonText: "放弃",
                        type: "warning"
                    }).then(() => {
                        if (activeNode) { 
                            const nodeType = activeNode.nodeType;
                            if (nodeType === "folder") { //如果是文件夹那么在它子元素下面插入元素
                                activeNode.children.push(this.generateNodeInterface());
                            } else if (nodeType === "file") {   
                                const pNode = findParentNode(activeNode, this.data);
                                if (!pNode) {
                                    this.data.push(this.generateNodeInterface());
                                } else {
                                    pNode.children.push(this.generateNodeInterface());
                                }
                            }
                        } else { //不存在选中的节点，那么就在根元素上面插入节点
                            this.data.push(this.generateNodeInterface());   
                        }
                        setTimeout(() => {
                            document.querySelector(".new-input").focus(); //hack,存在多个更新事件
                            this.$store.commit("changeEditingState", true);
                        })            
                    }).catch(err => {
                        if (err === "cancel" || err === "close") {
                            return;
                        }
                        this.$errorThrow(err, this);
                    });
                } else {
                    if (activeNode) { 
                        const nodeType = activeNode.nodeType;
                        if (nodeType === "folder") { //如果是文件夹那么在它子元素下面插入元素
                            activeNode.children.push(this.generateNodeInterface());
                        } else if (nodeType === "file") {   
                            const pNode = findParentNode(activeNode, this.data);
                            if (!pNode) {
                                this.data.push(this.generateNodeInterface());
                            } else {
                                pNode.children.push(this.generateNodeInterface());
                            }
                        }
                    } else { //不存在选中的节点，那么就在根元素上面插入节点
                        this.data.push(this.generateNodeInterface());   
                    }
                    setTimeout(() => {
                        document.querySelector(".new-input").focus(); //hack,存在多个更新事件
                        this.$store.commit("changeEditingState", true);
                    })  
                }
            } else { //存在节点信息，通过鼠标右键触发
                if (data.children && data.children.filter(val => val.isFolder === false).length > 8) {
                    this.$confirm("单文件夹文档数量超过8个将变得难以阅读!", "提示", {
                        confirmButtonText: "强制提交",
                        cancelButtonText: "放弃",
                        type: "warning"
                    }).then(() => {
                        const nodeType = data.nodeType;
                        if (nodeType === "folder") { //如果是文件夹那么在它子元素下面插入元素
                            // this.defaultExpandKeys.push(data.id); //展开文件夹
                            data.children.push(this.generateNodeInterface());
                        } else if (nodeType === "file") {
                            const pNode = findParentNode(data.id, this.treeData)
                            pNode.children.push(this.generateNodeInterface());
                        }      
                        setTimeout(() => {
                            document.querySelector(".new-input").focus(); //hack,存在多个更新事件
                            this.$store.commit("changeEditingState", true);
                        })                  
                    }).catch(err => {
                        if (err === "cancel" || err === "close") {
                            return;
                        }
                        this.$errorThrow(err, this);
                    });
                } else {
                    const nodeType = data.nodeType;
                    if (nodeType === "folder") { //如果是文件夹那么在它子元素下面插入元素
                        // this.defaultExpandKeys.push(data.id); //展开文件夹
                        data.children.push(this.generateNodeInterface());
                    } else if (nodeType === "file") {
                        const pNode = findParentNode(data.id, this.treeData)
                        pNode.children.push(this.generateNodeInterface());
                    }      
                    setTimeout(() => {
                        document.querySelector(".new-input").focus(); //hack,存在多个更新事件
                        this.$store.commit("changeEditingState", true);
                    })  
                }
            }
        },
        //新建文件夹
        addNewFolder(data) {
            if (!data) { //不存在节点信息，通过点击按钮新建
                const activeNode = findoNode(this.currentActiveNode ? this.currentActiveNode.id : "", this.data); //当前选中的节点
                if (activeNode) { //
                    const nodeType = activeNode.nodeType;
                    if (nodeType === "folder") { //如果是文件夹那么在它子元素下面插入元素
                        activeNode.children.unshift(this.generateNodeInterface("folder"));
                    } else if (nodeType === "file") {
                        const pNode = findParentNode(activeNode, this.data);
                        if (!pNode) { //在根元素上面新建
                            this.data.unshift(this.generateNodeInterface("folder")); 
                        } else {
                            pNode.children.unshift(this.generateNodeInterface("folder"));
                        }
                    }
                } else { //不存在选中的节点，那么就在根元素上面插入节点
                    this.data.unshift(this.generateNodeInterface("folder"));   
                }
            } else { //存在节点信息，通过鼠标右键触发
                const nodeType = data.nodeType;
                if (nodeType === "folder") { //如果是文件夹那么在它子元素下面插入元素
                    //this.defaultExpandKeys.push(data.id); //展开文件夹
                    data.children.unshift(this.generateNodeInterface("folder"));
                } else if (nodeType === "file") {
                    const pNode = findParentNode(data.id, this.data)
                    if (!pNode.children) {
                        this.data.unshift(this.generateNodeInterface("folder")); 
                    } else {
                        pNode.children.unshift(this.generateNodeInterface("folder"));
                    }
                }
            }
            setTimeout(() => {
                document.querySelector(".new-input").focus(); //hack,存在多个更新事件
                this.$store.commit("changeEditingState", true);
            })
        },
        //新建restful
        addRestFul(data) {
            this.restfulPid = data.id;
            this.isShow = true;
        },
        //重命名文件
        renameNode(data) {
            data.__isNew = true;
            this.renameNodeLabel = data.label;
            setTimeout(() => {
                document.querySelector(".new-input").focus(); //hack,存在多个更新事件  
                this.$store.commit("changeEditingState", true);
            })
        },
        //删除当前节点
        deleteCurrentNode(data) {
            this.$confirm(`此操作将永久删除 ${data.label} 节点, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("/api/project/doc", { data: { _id: data.id }}).then(() => {
                    this.getDocTreeData();
                }).catch(err => {
                    this.$errorThrow(err, this);
                });            
                const pNode = findParentNode(data.id, this.data);
                //this.defaultExpandKeys.push(pNode ? pNode.id : "");
                if (pNode) {
                    for (let i = 0; i < pNode.children.length; i++) {
                        if (pNode.children[i].id === data.id) {
                            pNode.children.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === data.id) {
                            this.data.splice(i, 1);
                            break;
                        }
                    }
                }
                this.closeOpenTabs(data);
            }).catch((err) => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        //拷贝节点
        copyDoc(data) {
            const params = {
               _id: data._id
            };
            this.axios.post("/api/project/copy_doc", params).then(res => {
                data.id = res.data._id;
                data.label = res.data.docName;
                data.nodeType = res.data.isFolder ? "folder" : "file";
                if (data.nodeType === "file") {
                    this.$store.commit("addTab", {
                        projectId: this.$route.query._id,
                        id: res.data._id.toString(),
                        title: res.data.docName.toString(),
                        method: res.data.item.methods,
                        nodeType: data.nodeType,
                    });
                    this.currentFileTab = res.data;
                    this.$route.query.docId = res.data._id.toString();
                }
                this.getDocTreeData();
            }).catch(err => {
                this.$errorThrow(err, this);
            });
            data.__isNew = false;
        },
        //=====================================其他操作====================================//
        //添加一个节点基础信息
        generateNodeInterface(type = "file") {
            return {
                id: uuid(),
                label: "",
                nodeType: type,
                children: [],
                __isNew: true
            };
        },
        //清除鼠标右键dom节点信息
        clearContextNode() {
            if (this.mouseContext) {
                document.body.removeChild(this.mouseContext.$el);
                this.mouseContext = null;
            }
        },
        //删除节点以后需要关闭已经打开的tab
        closeOpenTabs(data) {
            const deleteIdsArr = findChildrenNodeIds(data);
            deleteIdsArr.forEach(id => {
                this.$store.commit("deleteTab", {
                    projectId: this.$route.query._id,
                    id
                });
            })
        },
    }
};
</script>



<style lang="scss">
    .doc-nav {
        flex: 1;
        display: flex;
        flex-direction: column;
        // .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        //     background: none;
        // }
        // .el-tree-node__content:hover {
        //     background: $gray-200!important;
        // }
        .el-tree-node__content {
            height: 35px;
        }
        // .custom-tree-node {
        //     &:hover {
        //         background: $gray-200;
        //     }
        // }
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
</style>
