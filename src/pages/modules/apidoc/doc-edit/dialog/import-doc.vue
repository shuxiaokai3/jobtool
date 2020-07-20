/*
    创建者：shuxiaokai
    创建时间：2020-07-20 11:21"
    模块名称：导入第三方文档
    备注：xxxx
*/
<template>
    <s-dialog title="导入第三方文档" :isShow="visible" @close="handleClose">
        <el-upload
                class="w-100"
                drag
                action=""
                :http-request="requestHook">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只支持postman 2.1版本json</div>
        </el-upload>
        <div slot="footer">
            <el-button size="mini" type="primary" @click="handleSubmit">确定</el-button>
            <el-button size="mini" type="warning" @click="handleClose">取消</el-button>
        </div>
    </s-dialog>
</template>

<script>
import { dfsForest } from "@/lib/utils"
import uuid from "uuid/v4"
export default {
    props: {
        visible: { //弹窗是否显示
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            docs: [], //导入的文档列表
        };
    },
    created() {
        
    },
    methods: {
        requestHook(e) {
            console.log(2222, e.file)
            e.file.text().then(jsonText => {
                // console.log(JSON.parse(jsonText))
                this.convertPostmanData(JSON.parse(jsonText));
            })
        },
        //
        convertPostmanData(data) {
            const result = [];
            const docs = data.item;
            let sortTime = Date.now();
            //给文档添加一个id
            dfsForest(docs, {
                rCondition: (value) => {
                    return value.item && value.item.length > 0;
                },
                hooks: (value) => {
                    value.id = uuid();
                },
                rKey: "item"
            });
            //将文档转换为规范的格式
            dfsForest(docs, {
                rCondition: (value) => {
                    return value.item && value.item.length > 0;
                },
                hooks: (value, index, arr, pNode) => {
                    const doc = this.generateDocInterface();
                    doc.pid = pNode ? pNode.id : "";
                    doc.uuid = value.id;
                    sortTime += 1000;
                    if (value.item) { //存在item则说明为folder
                        this.generateFolder(doc, {
                            docName: value.name,
                            projectId: this.$route.query.id,
                            sort: sortTime + index,
                        });
                        result.push(doc)
                    } else { //否则为文档
                        // console.log(value.request)
                        this.generateDoc(doc, {
                            docName: value.name,
                            projectId: this.$route.query.id,
                            sort: sortTime + index,
                            path: value.request.url.path ? ("/" + value.request.url.path.join("/")) : "",
                            methods: value.request.method.toLowerCase()
                        });
                        //生成文档header
                        value.request.header.forEach(val => { 
                            if (val.key) {
                                doc.item.header.push({
                                    key: val.key,
                                    type: "string",
                                    value: val.value,
                                    description: val.description,
                                    required: true
                                });
                            }
                        });
                        //将query转换为请求参数,注意一个请求参数既存在query又存在body将被认定为不规范数据，处理策略全部转换为查询参数
                        value.request && value.request.query && value.request.query.forEach(val => { //requestParams
                            if (val.docName.match(/计划草稿列表/)) {
                                console.log(val, 2222)
                            }
                            if (val.key) {
                                doc.item.requestParams.push({
                                    key: val.key,
                                    type: "string",
                                    value: val.value,
                                    description: val.description,
                                    required: true
                                });                                
                            }
                        });    
                        //将requestBody转换为请求参数
                        if (value.request.body && value.request.body.mode === "raw") {
                            try {
                                const raw = JSON.parse(value.request.body.raw);
                                const result = this.convertObjToPlainData(raw);
                                doc.item.requestParams = result;                                 
                            } catch (error) {
                                doc.item.requestParams = []; 
                            }
                        }
                        result.push(doc)
                    }
                },
                rKey: "item"
            });
            this.docs = result;
            console.log(result)
        },
        
        //将对象转换为扁平数据
        convertObjToPlainData(objData) {
            const result = [];
            const foo = (objData, result) => {
                if (Array.isArray(objData)) {
                    for (let i = 0; i < objData.length; i++) {
                        let value = objData[i]; //值
                        const resParams = {
                            key: i,
                            type: "string",
                            value: value,
                            description: "",
                            required: true,
                            children: []
                        };
                        if (this.$utils.getTag(value) === "string") { //简单类型不做处理
                            resParams.type = "string";
                        } else if (this.$utils.getTag(value) === "number") { //简单类型不做处理
                            resParams.type = "number";
                        } else if (this.$utils.getTag(value) === "boolean") { //简单类型不做处理
                            resParams.type = "boolean";
                        } else if (this.$utils.getTag(value) === "array") {
                            resParams.type = "array";
                            resParams.value = "";
                            foo(value, resParams.children);
                        } else if (this.$utils.getTag(value) === "object") {
                            resParams.type = "object";
                            resParams.value = "";
                            foo(value, resParams.children);
                        }
                        result.push(resParams);
                    }
                } else {
                    for (const i in objData) {
                        const hasOwn = Object.hasOwnProperty;
                        if (!hasOwn.call(objData, i)) {
                            continue;
                        }
                        let value = objData[i]; //值
                        const resParams = {
                            key: i,
                            type: "string",
                            value: value,
                            description: "",
                            required: true,
                            children: []
                        };
                        if (this.$utils.getTag(value) === "string") { //简单类型不做处理
                            resParams.type = "string";
                        } else if (this.$utils.getTag(value) === "number") { //简单类型不做处理
                            resParams.type = "number";
                        } else if (this.$utils.getTag(value) === "boolean") { //简单类型不做处理
                            resParams.type = "boolean";
                        } else if (this.$utils.getTag(value) === "array") {
                            resParams.type = "array";
                            resParams.value = "";
                            foo(value, resParams.children);
                        } else if (this.$utils.getTag(value) === "object") {
                            resParams.type = "object";
                            resParams.value = "";
                            foo(value, resParams.children);
                        }
                        result.push(resParams);
                    }
                }
            }
            foo(objData, result);
            return result;
        },
        //生成文档基础数据
        generateDocInterface() {
            return {
                item: {
                    url: {
                        host: "",
                        path: ""
                    },
                    description: "",
                    methods: "",
                    header: [],
                    requestParams: [],
                    responseParams: [],
                    otherParams: []
                },
                pid: "",
                docName: "",
                isFolder: false,
                projectId: "",
                sort: 0,
                enabled: true,
                publish: false
            };
        },
        //生成基础folder, 会改变第一个参数值
        generateFolder(doc, config) {
            doc.isFolder = true;
            doc.docName = config.docName;
            doc.projectId = config.projectId;
            doc.sort = config.sort;
        },
        //生成文档
        generateDoc(doc, config) {
            doc.isFolder = false;
            doc.docName = config.docName;
            doc.projectId = config.projectId;
            doc.sort = config.sort;
            doc.item.url.path = config.path;
            doc.item.methods = config.methods;
            doc.item.description = config.docName;
        },
        //=====================================组件间交互====================================//  
        handleSubmit() {
            this.axios.post("/api/project/doc_multi", { docs: this.docs }).then(() => {
                
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================其他操作=====================================//
        handleClose() {
            this.$emit("update:visible", false);
        },
    }
};
</script>



<style lang="scss">

</style>
