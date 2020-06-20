/*
    创建者：shuxiaokai
    创建时间：2019-10-28 10:21
    模块名称：左侧banner
    备注：xxxx
*/
<template>
    <div class="left">
        <div class="left-tool">
            <h2 class="gray-700 f-lg text-center">{{ projectName }}</h2>
            <div class="mt-2">
                <el-input v-model="filterTreeData" placeholder="关键字,支持首字母,全拼" clearable @input="handleSearchTree"></el-input>
            </div>
            <div class="d-flex j-center">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        切换项目<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in projectEnum" :key="index" :command="item._id">{{ item.projectName }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="tree-nav">
            <el-tree
                    ref="docTree"
                    :data="data" 
                    node-key="id" 
                    empty-text="暂无数据"
                    :expand-on-click-node="true" 
                    :render-content="renderContent" 
                    :allow-drop="handleCheckNodeCouldDrop"
                    :default-expanded-keys="defaultExpandKeys"
                    :filter-node-method="filterNode"
                    :highlight-current="true"
                    @node-click="handleNodeClick" 
            >
            </el-tree>
        </div>
    </div>
</template>

<script>
import { findoNode } from "@/lib/utils"
import debounce from "@/lib/function/debounce"
// import pinyin from "pinyin"
export default {
    data() {
        return {
            filterTreeData: "", //=============================关键字搜索
            defaultExpandKeys: [], //==========================默认展开数据
            searchResult: [], //搜索结果
            data: [], //=======================================树形导航数据
            projectId: "", //项目id
            projectEnum: [], //项目枚举
            //=====================================其他参数====================================//
            loading: false,
        };
    },
    computed: {
        currentActiveNode() {
            return this.$store.state.viewTabs.currentTab;
        },
        projectName() { //项目名称
            const project = this.projectEnum.find(val => val._id === this.$route.query._id);
            if (project) {
                return project.projectName;
            } else {
                return "";
            }
        },
    },
    watch: {
        "$store.state.viewTabs.currentTab": {
            handler(val) {
                this.defaultExpandKeys = [];
                this.defaultExpandKeys.push(val.id);
            },
            deep: true
        }
    },
    mounted() {
        this.projectId = this.$route.query._id
        this.getDocTreeData();
        this.getProjectEnum(); //获取项目枚举
    },
    methods: {
        //=====================================数据获取====================================//
        //获取树形菜单数据
        getDocTreeData() {
            this.loading = true;
            this.axios.get(`/api/project/doc_tree_node?_id=${this.projectId}`).then(res => {
                const result = res.data
                const foo = (data) => {
                    for (let i = 0; i < data.length; i++) {
                        data[i].id = data[i]._id;
                        data[i].isRemoteData = true; //是否为远程返回数据
                        data[i].label = data[i].docName;
                        data[i].__isNew = false;
                        data[i].nodeType = data[i].isFolder ? "folder" : "file";
                        if (!data[i].children) {
                            data[i].children = []
                        }
                        delete data[i]._id;
                        delete data[i].docName;
                        delete data[i].isFolder;
                        delete data[i].projectId;
                        if (data[i].children && data[i].children.length > 0) {
                            foo(data[i].children);
                        }
                    }                    
                }
                foo(result);
                this.data = result;
                if (!localStorage.getItem("viewCurrentTab")) {
                    const currentActiveNode = findoNode(this.$route.query.docId.toString(), this.data);
                    this.$store.commit("addViewTabs", {
                        projectId: this.$route.query._id,
                        id: this.$route.query.docId.toString(),
                        title: currentActiveNode.label,
                        method: currentActiveNode.item.methods
                    });
                    this.$store.commit("changeCurrentViewTabs", this.$route.query.docId); 
                    this.defaultExpandKeys.push(this.$route.query.docId);                   
                } else {
                    this.$store.commit("changeCurrentViewTabs", JSON.parse(localStorage.getItem("viewCurrentTab")).id); 
                    this.defaultExpandKeys.push(JSON.parse(localStorage.getItem("viewCurrentTab")).id);
                }
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        getProjectEnum() {
            this.axios.get("/api/project/project_enum").then(res => {
                this.projectEnum = res.data;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================树形组件渲染====================================//
        //渲染树形组件
        renderContent(h, { node, data }) {
            const folderBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABNUlEQVRYR2O8NcvV4A/D//mMjAwGDMSA//8fcLD+NVRMPPCBGOWE1DBen+28gIGBMZ6QQmT5//8ZLmil7TEkRQ8utYzXZ7kcYGBksCfZsP//F2im7U0kWR+aBvIdQKHNoFBkYWBMRHEAl6Q+A5ekHoVG49f+9+cXhvdX10MV/V+I4gA5716aOwBk86OtJQzfnl9kYPjPcBDsAE5OJns2NiYGflV3BlZecZqGAMjwj7d2Mnx994Lh+/e/Bxmfr3C/w8fHpkxzW7FY8OnTr7uM7zZ4fWBnY+YfCAf8/PX346gDRkOA8cs23wOMDGQUxVRItf8ZGA6OOmA0BEZDYDQERkNgNARGQ2A0BBi/bvNdwMDAQFLnlAptEZgRCxm/bPUyYGRgbmBgZPCnosGEjfrPsPE/w98GALlfxBWV0GZvAAAAAElFTkSuQmCC";
            const fileBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACRElEQVRYR+2XQWtTQRDH//NMqkmgeRS1qR6MFws1hx48iZD6CYyg4EkRquitfgFTv4B60SJCq3dBPQoe0oOgeDBBqUI9RKRqUJtXq01e0vdG5tm0NSTZ102iRBx4PNjZnf3t7MzuDmFNLsy8jsNx0gROAWTW2nX+DOQNF8dvnk9kVeOp1uHi7VcTIFxjIEfMlrQbRIH+SHDQIARUhkS/UnHMcsVdg2eLXDqqgtgE8DIDouTUeMJrKxbZtMl+ASDuZ3Lpk5lbxOzcIkbj/cjmvwFQQzQFKBTtFBPf9zv5ZoAzyb2wVlbx8HlBCdEU4GOxNElEaV2A+K4Qsu+WPQhmXjKYxhptR1cBBF4F0XUAgfhk2ZjOLDiVqvO93hN/BKAVREcBns5beJT7gmg44GVCvRQsG28+/IABPLkxnjgi+o4CiMG7swvIfy61jN1YNPg1fXJ4Z1cAVFlz5d5bDJl9S5dPHPAOrI574N8DkBSSfS1XXdXiGuqTIwMYGxlY1215C0pVF8/mvbtJS+RElK8mWwbQmrXFoP8AvecByYJbj99rh8LwnghOHR5qLwhVR2srOjMShBneeNH13hZo+77JwN70wF+NAZlc7gJdkYfJsUO728sCSUXdy2jQ3I5Q0GgPQHf1jcb5DkKdwsQPqG8AKc3KKGeJaJ8fw377CECoj3JXTx8crXuS/SpOwcgyYaM4DQdifotTFcRq1d2xbDsxMC5NnUtc/w1AynNynElmThFRVGVMRy8lGhE9KG2LTNw5u99b5E8iCxg/2kxzLAAAAABJRU5ErkJggg==";
            let fileTypeDom = null;
            if (!data.item) {
                fileTypeDom = (<img src={fileBase64} width="16px" height="16px" />);
            } else if (data.item.methods === "get") {
                fileTypeDom = (<span class="green">{ data.item.methods }</span>);
            } else if (data.item.methods === "post") {
                fileTypeDom = (<span class="yellow">{ data.item.methods }</span>);
            } else if (data.item.methods === "put") {
                fileTypeDom = (<span class="blue">{ data.item.methods }</span>);
            } else if (data.item.methods === "delete") {
                fileTypeDom = (<span class="red">del</span>);
            }

            const textBg = (this.currentActiveNode && this.currentActiveNode.id === data.id && data.nodeType === "file") ? "bg-active" : "";
            const textColor = this.searchResult.find(val => val._id === data.id) ? "red" : "";
            // console.log(textColor, data)
            return (
                <div class={["custom-tree-node"]} on-mouseover={(e) => {e.target.classList.add("active")}} on-mouseleave={(e) => {e.target.classList.remove("active")}}>
                    { node.data.nodeType === "file" ? fileTypeDom : <img src={folderBase64} width="16px" height="16px" /> }
                    {node.data.__isNew ? (
                        <input
                            vModel={node.data.label}
                            type="text"
                            class="new-input"
                            placeholder="请输入名称..."
                            on-keydown={e => this.handleKeydown(e, node.data)}
                            on-blur={this.handleNewInputBlur.bind(
                                this,
                                node.data
                            )}
                        />
                    ) : (
                        <span class={["node-name", "text-ellipsis", "ml-1", textBg, textColor]} title={node.label}>{node.label}</span>
                    )}
                </div>
            );
        },
        //=====================================树形组件操作相关====================================//
        //处理拖拽
        handleCheckNodeCouldDrop(draggingNode, dropNode, type) {
            // console.log(draggingNode, dropNode.data.nodeType, type)
            if (draggingNode.data.nodeType === "file" && dropNode.data.nodeType === "folder" && type !== "inner") { //不允许文件在文件夹前面
                return type !== "prev";
            }
            if (dropNode.data.nodeType === "file") { 
                return type !== "inner";
            } else {
                return true
            }
        },
        //点击节点
        handleNodeClick(data) {
            //this.defaultExpandKeys.push(data.id || data._id);
            if (data.label.trim() === "") {
                return;
            }
            //this.currentActiveNode = node.data;
            if (this.mouseContext) {
                document.body.removeChild(this.mouseContext);
                this.mouseContext = null;
            }
            if (data.nodeType === "folder") {
                return;
            }
            this.$store.commit("addViewTabs", {
                projectId: this.$route.query._id,
                id: data.id.toString(),
                title: data.label.toString(),
                method: data.item.methods
            });
            this.$store.commit("changeCurrentViewTabs", data.id.toString())
            this.$route.query.docId = data.id.toString();
            // console.log(data, node, store)
        },
        //=====================================快捷方式操作相关====================================//
        //关键字搜索
        handleSearchTree() {
            this.search();
        },
        search: debounce(function() {
            this.defaultExpandKeys = [];
            this.searchResult = [];
            const params = {
                projectId: this.$route.query._id,
                url: this.filterTreeData.trim()
            };
            this.axios.get("/api/project/filter_doc", { params }).then(res => {
                if (res.data.length === 0) {
                    this.defaultExpandKeys = [];
                    this.searchResult = [];
                } else {
                    this.defaultExpandKeys = Array.from(new Set(this.defaultExpandKeys.concat(res.data.map(val => val._id))))
                    this.searchResult = Array.from(new Set(this.searchResult.concat(res.data.map(val => val))));                    
                }
                this.$refs.docTree.filter();
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        }),
        //过滤关键字
        filterNode(value, data) {
            const matchName = !!this.searchResult.find(val => val.docName === data.label);
            const matchUrl = !!this.searchResult.find(val => val._id === data.id);
            const matchAll = this.filterTreeData.trim() === "";
            return matchName || matchUrl || matchAll;
            // const firstLetterStr = pinyin(data.label, {
            //     style: pinyin.STYLE_FIRST_LETTER
            // }).map(val => val[0]);  
            // const normalStr = pinyin(data.label, {
            //     style: pinyin.STYLE_NORMAL
            // }).map(val => val[0]); 
            
            // const matchLabel = data.label.includes(value);
            // const matchFirstLetter = firstLetterStr.includes(value);
            // const matchNormalStr = normalStr.includes(value);

            // console.log(firstLetterStr, value, normalStr, this.loopMatchStr(normalStr, value))

            // return matchLabel || matchFirstLetter || matchNormalStr;
        },
        /* 
            @description  循环匹配关键字
            @author        shuxiaokai
            @create       2019-11-15 17:31"
            @params       
            @return       null
        */
        loopMatchStr() {
            // let len = strArr.length;
            // let result = {
            //     isMatch: false,
            //     matchIndex: -1,
            // };
            // let index = -1;
            // for(let i = 0; i < len; i++) {
            //     if (strArr[i].includes(str)) {
                   
            //     }
            // }
        },
        //=====================================前后端交互====================================//
        //切换项目
        handleCommand(val) {
            if (val === this.$route.query._id) {
                return
            }
            this.$router.push({
                path: "/d",
                query: {
                    _id: val
                }
            });
            this.projectId = val;
            this.getDocTreeData();
        },
    
        //=====================================其他操作====================================//
    }
};
</script>



<style lang="scss">

</style>
