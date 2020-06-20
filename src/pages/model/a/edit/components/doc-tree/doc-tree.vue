/*
    创建者：shuxiaokai
    创建时间：2019-09-19 14:14
    模块名称：添加请求数据
    备注：xxxx
*/
<template>
    <el-collapse v-model="activeCollapse" class="tree-params-wrap">
        <el-collapse-item name="1">
            <template slot="title">
                <div class="d-flex a-center w-100">
                    <span class="d-flex a-center">
                        <span v-if="!activeCollapse.includes('1')" class="el-icon-caret-right"></span>
                        <span v-else class="el-icon-caret-bottom"></span>
                        <span>{{ title }}</span>                        
                    </span>
                    <div class="d-flex a-center" @click.stop="() => {}">
                        <span title="上传json文件" class="el-icon-upload f-bg mx-3 hover-orange" @click.stop="handleUploadRequestJson"></span>
                        <div class="checkbox-wrap" @click.stop="() => {}">
                            <el-checkbox-group v-model="commonParamsId" class="ml-1" @change="getPresetParamsInfo">
                                <el-checkbox v-for="(item, index) in presetEnum" :key="index" :label="item._id">{{ item.name }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="mt-1 ml-2" @click.stop="isShow = true">
                            <el-button size="mini" type="text">新增</el-button>   
                        </div>
                        <div class="mt-1 ml-1" @click.stop="isShow2 = true">
                            <el-button size="mini" type="text">维护</el-button>   
                        </div>
                        <div class="mt-1 d-flex center">
                            <el-popover placement="top-start" width="300" trigger="hover" content="可以将一些常见的参数组保存在这里，选择以后直接生成">
                                <i slot="reference" class="el-icon-warning orange ml-2"></i>
                            </el-popover>
                        </div>
                    </div>
                    <div class="flex1">
                        <div class="mt-1 ml-1 no-select">
                            <span :class="{orange: isFocus}" class="paste" @click.stop="focusHeader">选中粘贴</span>   
                        </div>
                    </div>
                </div>
            </template>
            <div class="params">
                <el-tree 
                        :data="data" 
                        :indent="30"
                        :highlight-current="true"
                        node-key="id" 
                        :expand-on-click-node="false" 
                        :render-content="renderContent" 
                        default-expand-all
                >
                </el-tree>
            </div>             
        </el-collapse-item>
        <s-response-params-add-model v-if="isShow" :type="treeType" :is-show="isShow" @close="isShow = false;$emit('close')"></s-response-params-add-model>
        <s-response-params-list-model v-if="isShow2" :type="treeType" :is-show="isShow2" @close="isShow2 = false;$emit('close')"></s-response-params-list-model>
        <s-params-add-model v-if="isShow3" :is-show="isShow3" @close="isShow3 = false;"></s-params-add-model>
        <s-json-params-model v-if="isShow4" :is-show="isShow4" @close="isShow4 = false;" @addData="handleAddJsonData"></s-json-params-model>
    </el-collapse>
</template>

<script>
import uuid from "uuid/v4"
import json5 from "json5"
import resListModel from "../../model/response-model/res-list"
import resAddModel from "../../model/response-model/res-add"
import paramsAddModel from "../../model/useful-params/useful-params"
import jsonParamsModel from "../../model/json-params/json-params"
export default {
    components: {
        "s-response-params-list-model": resListModel,
        "s-response-params-add-model": resAddModel,
        "s-params-add-model": paramsAddModel,
        "s-json-params-model": jsonParamsModel,
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        data: { //当前已经存在请求参数
            type: Array,
            default() {
                return [];
            }
        },
        methods: { //请求方法
            type: String,
            default: "get"
        },
        isReady: { //数据是否请求完毕
            type: Boolean,
            default: false,
        },
        presetEnum: { //预设请求参数
            type: Array,
            default() {
                return [];
            },
        },
        savedParams: { //用户自定义请求参数
            type: Array,
            default() {
                return [];
            },
        },
        closed: { //默认是否折叠
            type: Boolean,
            default: false,
        },
        treeType: { //当前docTree类型， 支持 request， response，header
            type: String, 
            default: "request"
        },
        plain: { //是否允许添加嵌套字段
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            activeCollapse: [], //当前展开折叠框
            presetParamsCopy: [], //存放上一次后台获取的参数组信息
            commonParamsId: [], //参数数组
            //=====================================其他参数====================================//
            isShow: false, //新增请求头弹框
            isShow2: false, //维护请求头弹框
            isShow3: false, //常用参数维护
            isShow4: false, //全局json数据转换
            isFocus: false
        };
    },
    watch: {
        isReady(val) {
            this.activeCollapse = this.closed ? "0" : "1";
            if (val && this.data && this.data[this.data.length - 1] && this.data[this.data.length - 1].key) {
                this.data.push({
                    id: uuid(),
                    key: "",
                    value: "",
                    description: "",
                    type: "",
                    required: true
                })
            }
        }
    },
    mounted() {
        document.body.addEventListener("click", (e) => {
            e.stopPropagation();
            // e.preventDefault();
            document.removeEventListener("paste", this.pasteData)
            this.isFocus = false;
        })
        this.activeCollapse = this.closed ? "0" : "1";
    },
    methods: {
        //=====================================初始化数据获取====================================//

        //=====================================初始化操作====================================//
        /* 
            @description  渲染函数
            @author        shuxiaokai
            @create       2019-09-18 20:15"
        */
        renderContent(h, { node, data }) {
            const scopedSlots = {
                default: ({ item }) => {
                    return (
                        <div class="d-flex between dropdown-wrap">
                            <div>{ item.label }</div>
                            <div class="gray-400 dropdown-wrap-desc">{ item.children.description }</div>
                        </div>
                    );
                },
            }
            return (
                <div class="custom-tree-node">
                    { this.plain ? "" : <el-button type="text" title="添加嵌套数据" icon="el-icon-plus" on-click={() => this.addNestTreeData(data)}></el-button> }
                    <el-button class="mr-2" title="删除当前项" type="text" icon="el-icon-close" on-click={() => this.deleteTreeData(node, data)}></el-button>
                    <el-autocomplete vModel={data.key} size="mini" highlight-first-item fetch-suggestions={this.requestRemoteSuggestion} scopedSlots={scopedSlots} placeholder="请输入内容" on-select={(val) => { this.handleSelectRemoteData(val, data) }} on-input={() => {this.addNewLine(data)}} ></el-autocomplete>
                    <el-dropdown trigger="click" show-timeout={0} on-command={(val) => { this.handleSelectParams(val, data) }}>
                        <span class="el-icon-paperclip"></span>
                        <div slot="dropdown">
                            <el-dropdown-menu>
                                <div class="manage-params d-flex a-center cursor-pointer" on-click={() => { this.isShow3 = true }}>
                                    <span class="ml-1">配置常见参数</span>
                                    <el-popover placement="top"trigger="hover" content="配置常见参数" class="ml-auto mr-1">
                                        <span slot="reference">
                                            <i class="el-icon-setting"></i>
                                        </span>    
                                    </el-popover>
                                </div>
                                { this.savedParams.map(val => {
                                    return <el-dropdown-item command={val}>
                                        <span class="d-flex between">
                                            <span>{val.label}</span>
                                            <span class="gray-500 text-ellipsis">{val.description}</span>
                                        </span>
                                    </el-dropdown-item>
                                }) }
                            </el-dropdown-menu>                        
                        </div>

                    </el-dropdown>
                    &nbsp;&nbsp;
                    {data.type === "boolean" ? (
                        <el-select vModel={data.value} placeholder="请选择" size="mini" class="w-15">
                            <el-option label="true" value="true"></el-option>
                            <el-option label="false" value="false"></el-option>
                        </el-select>
                    ) : (
                        <el-input vModel={data.value} size="mini" placeholder="参数值" maxlength="255" class="w-25"></el-input>
                    )}
                    &nbsp;&nbsp;
                    <el-select vModel={data.type} placeholder="类型" size="mini" class="w-10">
                        <el-option label="String" value="string"></el-option>
                        <el-option label="Number" value="number"></el-option>
                        <el-option label="Boolean" value="boolean"></el-option>
                        <el-option label="Object" value="object"></el-option>
                        <el-option label="List | Array" value="array"></el-option>
                    </el-select>
                    <el-checkbox vModel={data.required} label={this.treeType === "request" ? "必填" : "必有"} class="mx-1"></el-checkbox>
                    <el-input vModel={data.description} size="mini" placeholder="描述" maxlength="100" class="w-40 ml-1"></el-input>
                </div>
            );
        },
        //=====================================其他交互====================================//
        /* 
            @description  新增一行请求参数
            @author        shuxiaokai
            @create       2019-09-18 20:16"
            @params       data<Object>当前节点数据
        */
        addNewLine(data) {
            let parentNode = this.data;
            const findNode = (treeData, nodeId) => {
                for (let i = 0; i < treeData.length; i++) {
                    if (treeData[i].id === nodeId) {
                        if (parentNode.some(val => !val.key || val.key.trim() === "")) {
                            return;
                        } else {
                            parentNode.push({
                                id: uuid(),
                                key: "",
                                value: "",
                                description: "",
                                type: "",
                                required: true
                            })
                            return;
                        }
                    } else if (treeData[i].children != null && treeData[i].children.length > 0) {
                        parentNode = treeData[i].children;
                        findNode(treeData[i].children, nodeId);
                    }
                }
            }
            findNode(this.data, data.id);
        },
        /* 
            @description  新增一个嵌套请求参数
            @author        shuxiaokai
            @create       2019-09-19 10:45"
            @params       data<Object>当前节点数据
        */
        addNestTreeData(data) {
            if (data.children == null) {
                this.$set(data, "children", [])
            }
            data.children.push({
                id: uuid(),
                key: "",
                description: "",
                type: "",
                value: "",
                required: true
            })
        }, 
        /* 
            @description  删除请求参数
            @author        shuxiaokai
            @create       2019-09-19 10:44"
            @params       node<Object>当前节点
            @params       data<Object>节点数据
        */
        deleteTreeData(node, data) {
            const id = data.id || data._id;
            if (!id) {
                throw new Error("该节点不存在id值");
            }
            const rootData = this.data;
            let parentNode = rootData;
            if (node.level === 1 && this.data.length > 1) {
                for (let i = 0; i < this.data.length; i++) {
                    const dataId = this.data[i].id || this.data[i]._id
                    if (dataId === id && this.data[i].key.trim() !== "") {
                        console.log(JSON.parse(JSON.stringify(this.data)), this.data[i], data)
                        this.data.splice(i, 1)
                        return;
                    }
                }
            }
            const deleteNode = (treeData, deleteId) => {
                for (let i = 0; i < treeData.length; i++) {
                    if (treeData[i].id === deleteId) {
                        if (node.isLevel !== 1 && data.key.trim() === "" && parentNode.length !== 1) {
                            return
                        } else if (node.isLevel === 1 && data.key.trim() === "") {
                            return
                        } else if (rootData.length === 1 && (node.level === 1 || rootData[0].children == null || rootData[0].children.length === 0)) {
                            return;
                        } else {
                            treeData.splice(i, 1);
                            return;
                        }
                    } else if (treeData[i].children != null && treeData[i].children.length > 0) {
                        parentNode = treeData[i].children
                        deleteNode(treeData[i].children, deleteId);
                    }
                }
            }
            deleteNode(this.data, id);
        },
        /* 
            @description  获取远程联想数据
            @author        shuxiaokai
            @create       2019-10-28 11:29"
        */
        handleSelectRemoteData(val, data) {
            data.description = val.children.description;
            data.key = val.label;
            data.required = val.children.required;
            data.value = val.children.value;
            data.type = val.children.type;
            console.log(val, data)
        },
        /* 
            @description  配置常见请求头参数
            @author        shuxiaokai
            @create       2019-09-19 10:52"
        */
        handleSelectParams(val, data) {
            data.description = val.description;
            data.key = val.label;
            data.required = val.required;
            data.value = val.value;
            data.type = val.dataType;
            this.addNewLine(data);
        },
        /* 
            @description  上传请求json参数
            @author        shuxiaokai
            @create       2019-09-19 14:04"
        */
        handleUploadRequestJson() {
            this.isShow4 = true;
        },
        /** 
         * @description        处理json转换以后的数据
         * @author             shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-11-25 16:46
         * @update             2019-11-25 16:46
         */
        handleAddJsonData(data) {
            console.log(this.data, data)
            data.forEach((val, index) => { //跳过vue检测
                this.$set(this.data, index, val);
            })
        },
        //定位当前折叠菜单
        focusHeader() {
            this.isFocus = !this.isFocus;
            document.addEventListener("paste", this.pasteData)
        },
        pasteData(e) {
            const paste = (e.clipboardData || window.clipboardData).getData("text");
            e.preventDefault();
            try {
                const convertResult = this.convertObjectToParams(json5.parse(paste))
                this.handleAddJsonData(convertResult);
                // console.log(convertResult)
            } catch (e) {
                console.error(e);
                this.$message.error("无法解析该字符串");
            }
            
            console.log(paste)
        },
        /** 
         * @description        将对象转换为后台接受的请求参数
         * @author             shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-11-25 15:14
         * @update             2019-11-25 15:14
         * @param {Object}     obj - 标准对象       
         * @return {Object}    符合后台接受规范的数据
         */
        convertObjectToParams(obj) {
            const result = [];
            const foo = (treeData, result) => {
                for (const i in treeData) {
                    if (Array.isArray(treeData[i])) {
                        const data = {
                            id: uuid(),
                            description: "",
                            key: i,
                            required: true,
                            type: "array",
                            value: "",
                            children: [],
                        }
                        result.push(data)
                        const childData = data.children;
                        foo(treeData[i][0], childData);
                    } else if (typeof treeData[i] === "object") {
                        const data = {
                            id: uuid(),
                            description: "",
                            key: i,
                            required: true,
                            type: "object",
                            value: "",
                            children: [],
                        }
                        result.push(data)
                        const childData = data.children;
                        foo(treeData[i], childData);
                    } else {
                        result.push({
                            id: uuid(),
                            description: "",
                            key: i,
                            required: true,
                            type: typeof treeData[i],
                            value: treeData[i],
                            children: [],
                        })
                    }
                }
            }
            foo(obj, result);
            return result;
        },
        //=====================================前后端交互====================================//
        /* 
            @description  获取请求参数信息
            @author        shuxiaokai
            @create       2019-11-07 11:27"
        */
        getPresetParamsInfo() {
            let matchItems = [];
            this.commonParamsId.forEach(val => {
                const match = this.presetEnum.find(item => item._id === val);
                if (match) {
                    matchItems = matchItems.concat(match.items);
                }
            })
            console.log(this.commonParamsId, this.presetEnum, matchItems)
            this.presetParamsCopy = matchItems;
            matchItems.forEach(val => {
                if (!this.data.find(val2 => val.key === val2.key)) {
                    this.data.unshift(val);
                }
            })
            // if (this.commonParamsId.length === 0) {
            //     this.presetParamsCopy.forEach(val => {
            //         this.data.shift();
            //     });
            //     return;
            // }
            // this.commonParamsId.forEach(val => {
            //     const params = {
            //         _id: val
            //     };
            //     this.axios.get("/api/project/doc_preset_params", { params }).then(res => {
            //         this.presetParamsCopy = res.data.items;
            //         res.data.items.forEach(val => {
            //             this.data.unshift(val);
            //         })
            //     }).catch(err => {
            //         this.$errorThrow(err, this);
            //     });                
            // })
        },     
        //联想输入
        requestRemoteSuggestion(queryString, cb) {
            if (queryString.trim().length < 2) {
                cb([]);
                return;
            }
            const params = {
                name: queryString.trim().replace(/\\/, ""),
                projectId: this.$route.query._id
            };
            this.axios.get("/api/project/doc_params_mind", { params }).then(res => {
                cb(res.data);                
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
    }
};
</script>



<style lang="scss">
.checkbox-wrap {
    .el-checkbox {
        vertical-align: -7px;
    }
}
.dropdown-wrap-desc {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tree-params-wrap {
    .paste {
        display: inline-flex;
        height: 100%;
    }
}
</style>
