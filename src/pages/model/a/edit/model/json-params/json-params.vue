/*
    创建者：shuxiaokai
    创建时间：2019-11-25 14:26"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="数据转换" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-divider content-position="left">支持标准json,json5</el-divider>
        <div class="d-flex j-end">
            <el-button type="text" @click="formatJSON">格式化JSON</el-button>   
        </div>
        <div class="coder-wrap">
            <s-code-editor v-model="jsonParams" type="json" @ready="handleCodeReady"></s-code-editor>
        </div>
        <span slot="footer">
            <el-button type="primary" size="mini" @click="addNewParams">确认添加</el-button>
            <el-button type="danger" size="mini" @click="closeModel">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import json5 from "json5"
import uuid from "uuid/v4"
export default {
    props: {
        isShow: {
            type: Boolean
        },
    },
    data() {
        return {
            jsonParams: "",
            editorInstance: null,
        };
    },
    methods: {
        handleCodeReady(editor) {
            this.editorInstance = editor;
        },
        formatJSON() {
            try {
                this.editorInstance.setValue(JSON.stringify(json5.parse(this.jsonParams), null, "\t"));
            } catch (e) {
                console.error(e);
                this.$message.error("无法解析该字符串");
            }
        },
        // 新增数据参数转换
        addNewParams() {
            try {
                const convertResult = this.convertObjectToParams(json5.parse(this.jsonParams))
                console.log(convertResult)
                this.$emit("addData", convertResult);
                this.$emit("close");
            } catch (e) {
                console.error(e);
                this.$message.error("无法解析该字符串");
            }
        },
        /** 
         * @description        将对象转换为后台接受的请求参数
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-11-25 15:14
         * @update             2019-11-25 15:14
         * @param {Object}     obj - 标准对象       
         * @return {Object}    符合后台接受规范的数据
         * 
         * @example 返回值  
         *  description: "项目类型名称"
         *  key: "code"
         *  required: true
         *  type: "string"
         *  value: "0"
         *  id: "xxx",
         *  children
         * 
         * 
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

        convertApiDoc() {
            // const params = {
            //     description: "项目类型名称",
            //     key: "code",
            //     required: true,
            //     type: "string",
            //     value: "0",
            //     id: "xxx",
            // }
            // const baseInfoReg = /@api\s*\{(get|post|put|delete|options|head)\}\s*((\w|\/)*)/i; //第一个元素为请求方法,第二个元素为请求路径
        },
        
        //=========================================================================//
        /* 
            @description  关闭弹窗
            @autor        shuxiaokai
            @create       2019-10-19 22:39"
            @params       null
            @return       null
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>



<style lang="scss">
    .coder-wrap {
        height: 300px;
        overflow-y: auto;
    }
</style>
