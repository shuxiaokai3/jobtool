/*
    创建者：shuxiaokai
    创建时间：2020-07-07 15:56
    模块名称：
    备注：xxxx
*/
<template>
    <s-card2 :title="title" collapse :fold="fold" class="collapse-wrap">
        <div class="params-edit">
            <el-tree 
                    :data="treeData" 
                    :indent="50"
                    :highlight-current="true"
                    node-key="_id" 
                    :expand-on-click-node="false" 
                    default-expand-all
            >
                <template slot-scope="scope">
                    <div class="custom-tree-node">
                        <el-button type="text" :title="disableTitleTip" icon="el-icon-plus" :disabled="plain" @click="addNestTreeData(scope.data)"></el-button>
                        <el-button 
                                class="mr-2"
                                :disabled="!scope.node.nextSibling && scope.node.level === 1"
                                :title="`${(!scope.node.nextSibling && scope.node.level === 1) ? '此项不允许删除' : '删除当前项'}`"
                                type="text"
                                icon="el-icon-close"
                                @click="deleteTreeData(scope)">
                        </el-button>
                        <div class="w-20 mr-2 d-flex a-center">
                            <s-v-input 
                                    v-model="scope.data.key" 
                                    size="mini"
                                    :tip="keyTip"
                                    :error="scope.data._keyError"
                                    :disabled="scope.node.parent.data.type === 'array'"
                                    :title="`${scope.node.parent.data.type === 'array' ?  '父元素为list不必填写参数名称' : '参数名称，例如：age name job'}`"
                                    :placeholder="`${scope.node.parent.data.type === 'array' ?  '父元素为list不必填写参数名称' : '参数名称，例如：age name job'}`"
                                    @input="addNewLine(scope)"
                                    @blur="handleCheckKey(scope)"
                            >
                                <el-popover slot="tip" placement="top-start" trigger="hover" content="_id">
                                    <span slot="reference" class="theme-color ml-2">白名单</span>
                                </el-popover>
                            </s-v-input>
                        </div>
                        <el-select v-model="scope.data.type" :disabled="plain" :title="disableTypeTip" placeholder="类型" size="mini" class="mr-2" @change="handleChangeParamsType(scope.data)">
                            <el-option :disabled="scope.data.children && scope.data.children.length > 0" label="String" value="string"></el-option>
                            <el-option :disabled="plain || (scope.data.children && scope.data.children.length > 0)" label="Number" value="number"></el-option>
                            <el-option :disabled="plain || (scope.data.children && scope.data.children.length > 0)" label="Boolean" value="boolean"></el-option>
                            <el-option :disabled="plain" label="Object" value="object"></el-option>
                            <el-option :disabled="plain" label="List | Array" value="array"></el-option>
                        </el-select>
                        <el-select v-if="scope.data.type === 'boolean'" v-model="scope.data.value" placeholder="请选择" size="mini" class="w-25 mr-2">
                            <el-option label="true" value="true"></el-option>
                            <el-option label="false" value="false"></el-option>
                        </el-select>
                        <s-v-input 
                                v-if="scope.data.type !== 'boolean'"
                                :disabled="scope.data.type === 'array' || scope.data.type === 'object'"
                                title="对象和数组不必填写参数值"
                                v-model="scope.data.value"
                                size="mini"
                                :tip="valueTip"
                                :error="scope.data._valueError"
                                class="w-25 mr-2"
                                :placeholder="`${scope.data._valuePlaceholder || '参数值,例如：20 张三'}`"
                                @blur="handleCheckValue(scope)"
                        >
                        </s-v-input>
                        <el-checkbox v-model="scope.data.required" label="必选"></el-checkbox>
                        <s-v-input 
                                v-model="scope.data.description"
                                size="mini" 
                                :tip="requiredTip"
                                :error="scope.data._descriptionError"
                                class="w-40 ml-2"
                                placeholder="参数描述与备注"
                                @blur="handleCheckDescription(scope)">
                        </s-v-input>
                    </div>
                </template>
            </el-tree>
        </div>     
    </s-card2>
</template>

<script>
import uuid from "uuid/v4"
import { dfsForest } from "@/lib/utils"
export default {
    props: {
        title: { //-------------标题
            type: String,
            default: ""
        },
        treeData: { //----------树形结构数据
            type: Array,
            default() {
                return [];
            }
        },
        plain: { //-------------是否为扁平数据，扁平数据不允许嵌套并且数据类型只能为string
            type: Boolean,
            default: false
        },
        fold: { //--------------默认是否折叠
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            activeCollapse: "1",
            keyTip: {
                message: "字母,数字,驼峰命名",
                reference: "http://baidu.com"
            },
            valueTip: {
                message: "不能为空并且类型必须为数字",
            },
            requiredTip: {
                message: "不能为空",
            }
        };
    },
    computed: {
        disableTitleTip() {
            if (!this.plain) {
                return "点击添加嵌套数据"
            } else {
                return "当前类型只允许扁平数据，不允许存在复杂数据"
            }
        },
        disableTypeTip() {
            if (this.plain) {
                return "get请求或者header的值只允许为string"
            } else {
                return ""
            }
        }
    },
    created() {

    },
    methods: {
        //=====================================参数操作====================================//
        //添加嵌套数据
        addNestTreeData(data) {
            if (data.children == null) {
                this.$set(data, "children", [])
            }
            data.children.push(this.generateParams());
            data.value = "";
            this.$set(data, "_valueError", false);
            this.$set(data, "_valuePlaceholder", "对象和数组不必填写参数值");
            if (data.type === "object" || data.type === "array") {
                return
            } else { //默认设置为object
                data.type = "object"
            }
        },
        //删除数据
        deleteTreeData({ node, data }) {
            const parentNode = node.parent;
            const parentData = node.parent.data;
            if (parentNode.level === 0) { //根节点直接删除，非根节点在children里删除
                const deleteIndex = parentData.findIndex(val => val.id === data.id);
                if (parentData.length - 1 === deleteIndex) { //不允许删除最后一个元素
                    return;
                }
                parentData.splice(deleteIndex, 1);
            } else {
                const deleteIndex = parentData.children.findIndex(val => val.id === data.id);
                // if (parentData.children.length > 1 && deleteIndex === parentData.children.length - 1) { //子元素大于1的时候最后一个数据不允许被删除
                //     return;
                // } else {
                //     }
                parentData.children.splice(deleteIndex, 1)
            }
        },
        //新增一行
        addNewLine({ node, data }) {
            if (data.key && data.key.trim() !== "") {
                const parentNode = node.parent;
                const parentData = node.parent.data;
                if (parentNode.level === 0) { //根节点直接往数据里面push，非根节点往children里push
                    if (parentData[parentData.length - 1].key?.trim() !== "") {
                        parentData.push(this.generateParams());
                    }
                } else {
                    if (parentData.children[parentData.children.length - 1].key?.trim() !== "") {
                        parentData.children.push(this.generateParams());
                    }
                }
            }
        },
        //改变参数类型
        handleChangeParamsType(data) {
            if (data.type === "boolean") {
                data.value = "true";
            }

            if (data.type === "object" || data.type === "array") {
                if (data.type === "array" && data.children && data.children.length > 0) { //清空子元素所有参数名称
                    dfsForest(data.children, {
                        rCondition(value) {
                            return value.children;
                        },
                        rKey: "children",
                        hooks: (data) => {
                            data.key = "";
                        }
                    });
                }
                data.value = "";
                this.$set(data, "_valueError", false);
                this.$set(data, "_valuePlaceholder", "对象和数组不必填写参数值");
            } else {
                this.$set(data, "_valuePlaceholder", "");
            }
        },
        //=====================================数据校验====================================//
        //检查参数是否输入完备
        handleCheckKey({ node, data }) {
            const parentNode = node.parent;
            const parentData = node.parent.data;
            const nodeIndex = (parentNode.level === 0) ? parentData.findIndex(val => val.id === data.id) : parentData.children.findIndex(val => val.id === data.id);
            if (parentNode.level === 0 && parentData.length === 1) { //根元素第一个可以不必校验因为参数可以不必填
                return;
            }
            if (nodeIndex !== parentData.length - 1) { //只要不是最后一个值都需要做数据校验 
                if (data.key.trim() === "") { //非空校验
                    this.$set(data, "_keyError", true)
                } else if (!data.key.match(/^[a-zA-Z0-9]*$/)) { //字母数据
                    this.$set(data, "_keyError", true)
                } else {
                    this.$set(data, "_keyError", false)
                }                
            } 
        },
        //检查参数值
        handleCheckValue({ node, data }) {
            const parentNode = node.parent;
            const parentData = node.parent.data;
            const nodeIndex = (parentNode.level === 0) ? parentData.findIndex(val => val.id === data.id) : parentData.children.findIndex(val => val.id === data.id);
            if (data.type === "object" || data.type === "array") { //数据和对象不必校验
                return;
            }
            if (parentNode.level === 0 && parentData.length === 1) { //根元素第一个可以不必校验因为参数可以不必填
                return;
            }
            if (nodeIndex !== parentData.length - 1) { //只要不是最后一个值都需要坐数据校验 
                if (data.value.trim() === "") { //非空校验
                    this.valueTip.message = "不能为空"
                    this.$set(data, "_valueError", true);
                } else if (data.type === "number" && !data.value.match(/^-?(0\.\d+|[1-9]+\.\d+|[1-9]\d{0,20})$/)) { //纯数字校验
                    this.valueTip.message = "不能为空，并且值必须为数字"
                    this.$set(data, "_valueError", true);
                } else {
                    this.$set(data, "_valueError", false);
                }                
            } 
        },
        //检查参数描述
        handleCheckDescription({ node, data }) {
            const parentNode = node.parent;
            const parentData = node.parent.data;
            const nodeIndex = (parentNode.level === 0) ? parentData.findIndex(val => val.id === data.id) : parentData.children.findIndex(val => val.id === data.id);
            if (parentNode.level === 0 && parentData.length === 1) { //根元素第一个可以不必校验因为参数可以不必填
                return;
            }
            if (nodeIndex !== parentData.length - 1) { //只要不是最后一个值都需要坐数据校验 
                if (data.description.trim() === "") { //非空校验
                    this.$set(data, "_descriptionError", true)
                } else {
                    this.$set(data, "_descriptionError", false)
                }                
            } 
        },
        //=====================================组件间交互====================================//  
        //生成请求数据
        generateParams(type = "string") {
            return {
                id: uuid(),
                key: "",
                description: "",
                type: type,
                value: "",
                required: true
            }
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.collapse-wrap {
    .el-collapse-item__header {
        background: $gray-200;
    }
    .params-edit {
        .el-tree-node__content {
            height: 60px;
        }
        .el-input__inner {
            border-radius: 0;
            border: none;
            border-bottom: 1px solid $gray-300;
        }
        .custom-tree-node {
            width: 100%;
            display: flex;
            align-items: center;
        }
    }
}
</style>
