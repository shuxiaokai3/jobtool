/*
    创建者：shuxiaokai
    创建时间：2020-07-07 15:56
    模块名称：
    备注：xxxx
*/
<template>
    <el-collapse v-model="activeCollapse" class="collapse-wrap">
        <el-collapse-item name="1">
            <template slot="title">
                请求头
            </template>
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
                            <el-button type="text" title="添加嵌套数据" icon="el-icon-plus" @click="addNestTreeData(scope.data)"></el-button>
                            <el-button class="mr-2" title="删除当前项" type="text" icon="el-icon-close" @click="deleteTreeData(scope)"></el-button>
                            <div class="w-20 mr-2 d-flex a-center">
                                <s-v-input 
                                        v-model="scope.data.key" 
                                        size="mini" :tip="keyTip"
                                        :error="scope.data._keyError"
                                        placeholder="参数名称，例如：age name job"
                                        @input="addNewLine(scope)"
                                        @blur="handleCheckKey(scope)">
                                </s-v-input>
                            </div>
                            <el-select v-model="scope.data.type" placeholder="类型" size="mini" class="w-10 mr-2" @change="handleChangeParamsType(scope.data)">
                                <el-option label="String" value="string"></el-option>
                                <el-option label="Number" value="number"></el-option>
                                <el-option label="Boolean" value="boolean"></el-option>
                                <el-option label="Object" value="object"></el-option>
                                <el-option label="List | Array" value="array"></el-option>
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
                                    :tip="requiredTip"
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
                                    placeholder="参数描述"
                                    @blur="handleCheckDescription(scope)">
                            </s-v-input>
                        </div>
                    </template>
                </el-tree>
            </div>             
        </el-collapse-item>
    </el-collapse>
</template>

<script>
import uuid from "uuid/v4"
export default {
    props: {
        treeData: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    data() {
        return {
            activeCollapse: "1",
            keyTip: {
                message: "必填，字母，数字并且必须为驼峰命名",
                reference: "http://baidu.com"
            },
            requiredTip: {
                message: "此项必填",
            }
        };
    },
    created() {

    },
    methods: {
        //添加嵌套数据
        addNestTreeData(data) {
            if (data.children == null) {
                this.$set(data, "children", [])
            }
            data.children.push(this.generateParams())
        },
        //删除数据
        deleteTreeData({ node, data }) {
            const parentNode = node.parent;
            const parentData = node.parent.data;
            if (parentNode.level === 0) { //根节点直接往数据里面push，非根节点往children里push
                const deleteIndex = parentData.findIndex(val => val.id === data.id)
                if (parentData.length - 1 === deleteIndex) { //不允许删除最后一个元素
                    return
                }
                parentData.splice(deleteIndex, 1)
            } else {
                const deleteIndex = parentData.children.findIndex(val => val.id === data.id)
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
            if (nodeIndex !== parentData.length - 1) { //只要不是最后一个值都需要坐数据校验 
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
                    this.$set(data, "_valueError", true)
                } else {
                    this.$set(data, "_valueError", false)
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
