/*
    创建者：shuxiaokai
    创建时间：2020-07-10 20:13
    模块名称：请求返回信息
    备注：xxxx
*/
<template>
    <div class="response">
        <s-collapse title="基本信息" class="baseInfo">
            <div>
                <div class="my-2 d-flex a-center">
                    <span class="flex0">请求地址：</span>
                    <s-ellipsis-content :value="requestData.url.host + requestData.url.path" max-width="100%"></s-ellipsis-content>
                </div>
                <div class="my-2">
                    <span>请求方式：</span>
                    <span class="f-xs green">{{ requestData.methods.toUpperCase() }}</span>
                </div>
                <div class="d-flex mb-1">
                    <div>
                        <span>连通&nbsp;</span>
                        <span v-if="currentCondition.connected === -1" class="gray-600 el-icon-question"></span>
                        <span v-else-if="currentCondition.connected === 0" class="red el-icon-error"></span>
                        <span v-else-if="currentCondition.connected === 1" class="green el-icon-success"></span>
                        <span class="mx-1 gray-400">|</span>
                    </div>
                    <div :title="currentCondition.status">
                        <span>状态码&nbsp;</span>
                        <span v-if="currentCondition.status === -1" class="gray-600 el-icon-question"></span>
                        <span v-else-if="currentCondition.status >= 200 && currentCondition.status < 300" class="green el-icon-success"></span>
                        <span v-else class="red el-icon-error"></span>
                        <span class="mx-1 gray-400">|</span>
                    </div>
                    <div :title="`不超过10kb,当前${currentCondition.size}kb`">
                        <span>大小&nbsp;</span>
                        <span v-if="currentCondition.size === 0" class="gray-600 el-icon-question"></span>
                        <span v-else-if="currentCondition.size >= 10" class="red el-icon-error"></span>
                        <span v-else class="green el-icon-success"></span>
                        <span class="mx-1 gray-400">|</span>
                    </div>
                    <div>
                        <span>本地参数&nbsp;</span>
                        <span v-if="currentCondition.localParams === -1" class="gray-600 el-icon-question"></span>
                        <span v-else-if="currentCondition.localParams === 0" class="red el-icon-error"></span>
                        <span v-else class="green el-icon-success"></span>
                        <span class="mx-1 gray-400">|</span>
                    </div>
                    <div :title="`${currentCondition.responseErrorType}`">
                        <span>返回参数&nbsp;</span>
                        <span v-if="currentCondition.remoteResponse === -1" class="gray-600 el-icon-question"></span>
                        <span v-else-if="currentCondition.remoteResponse === 0" class="red el-icon-error"></span>
                        <span v-else class="green el-icon-success"></span>
                        <span class="mx-1 gray-400">|</span>
                    </div>
                </div>
            </div>
        </s-collapse>
        <s-collapse title="请求头">
            <template v-if="requestData.header.length > 1">
                <div v-for="(item, index) in requestData.header" :key="index" class="d-flex a-center mt">
                    <span v-if="item.key" class="flex0">{{ item.key }}：</span>
                    <s-ellipsis-content :value="convertVariable(item.value)" :max-width="200"></s-ellipsis-content>
                </div>
            </template>
            <div v-else class="f-xs gray-500">暂无数据</div>
        </s-collapse>
        <s-collapse title="请求参数">
            <s-tree-json :data="requestParams"></s-tree-json>
        </s-collapse>
        <s-collapse title="返回参数">
            <s-tree-json :data="requestData.responseParams"></s-tree-json>
        </s-collapse>
        <s-collapse title="远程结果">
            <div v-if="responseData" class="f-xs d-flex j-end mb-2">
                <div>
                    <span>Status：</span>
                    <span v-if="responseData.status >= 200 && responseData.status <= 299" class="green">{{ responseData.status }}</span>
                    <span v-else-if="responseData.status >= 300 && responseData.status <= 399" class="yellow">{{ responseData.status }}</span>
                    <span v-else-if="responseData.status >= 400 && responseData.status <= 599" class="red">{{ responseData.status }}</span>
                </div>
                <div class="mx-2">
                    <span>Time：</span>
                    <span v-if="responseData.rt >= 0 && responseData.rt <= 2000" class="green">{{ responseData.rt }}ms</span>
                    <span v-else class="red">{{ responseData.rt }}ms</span>
                </div>
                <div>
                    <span>Size：</span>
                    <span v-if="responseData.size >= 0 && responseData.size <= 10" class="green">{{ responseData.size }}kb</span>
                    <span v-else class="red">{{ responseData.size }}kb</span>
                </div>
            </div>
            <div v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)">
                <s-json v-if="responseData && responseData.type === 'json'" :data="responseData.data" :check-data="checkJsonData" @export="handleExport"></s-json>
                <span v-else-if="responseData && responseData.type === 'svg'" v-html="responseData.data"></span>
                <img v-else-if="responseData && responseData.type === 'image'" :src="responseData.data" alt="无法显示">
                <pre v-else-if="responseData && responseData.type === 'text'" v-text="responseData.data" class="res-text"></pre>
                <iframe v-else-if="responseData && responseData.type === 'pdf'" :src="responseData.data" class="res-pdf"></iframe>
                <pre v-else>{{ responseData }}</pre>
            </div>
            
        </s-collapse>
    </div>
</template>

<script>
import { dfsForest } from "@/lib/utils"
import uuid from "uuid/v4"
export default {
    components: {},
    props: {
        requestData: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    computed: {
        //返回参数(对象类型)
        responseParams() {
            const copyData = JSON.parse(JSON.stringify(this.requestData.responseParams)); //扁平数据拷贝
            const result = this.convertPlainParamsToTreeData(copyData);
            return result;
        },
        requestParams() {
            const copyData = JSON.parse(JSON.stringify(this.requestData.requestParams)); //扁平数据拷贝
            dfsForest(copyData, {
                rCondition(value) {
                    return value?.children;
                },
                rKey: "children",
                hooks: (val, i, forestData, parent) => {
                    if (val && !val._select) {
                        if (!parent) {
                            copyData.splice(i, 1);
                        } else {
                            parent.children.splice(i, 1);
                        }
                    }
                }
            });
            return copyData;
        },
        //预发布满足提交的条件
        currentCondition() {
            return this.$store.state.apidocRules.currentCondition
        },
        //当前选中的doc
        currentSelectDoc() { 
            return this.$store.state.apidoc.activeDoc[this.$route.query.id];
        },
        //全局变量
        variables() {
            return this.$store.state.apidoc.variables || [];
        },
       
    },
    watch: {
        currentSelectDoc: {
            handler(val) {
                if (val) {
                    this.responseData = null;
                }
            },
            deep: true
        }
    },
    data() {
        return {
            responseData: null, //---返回结果对象
            checkJsonData: null, //--用于对比本地书写的返回参数与实际返回参数
            loading: false, //-------返回结果加载状态
        };
    },
    created() {

    },
    methods: {
        //=====================================前后端交互====================================//
        sendRequest() {
            return new Promise((resolve, reject) => {
                let copyData = JSON.parse(JSON.stringify(this.requestData)); //扁平数据拷贝
                let requestParams = this.convertPlainParamsToTreeData(copyData.requestParams, true);
                const headerParams = this.convertPlainParamsToTreeData(copyData.header);
                if (this.requestData.requestType === "formData") {
                    requestParams = this.requestData.requestParams.filter(val => val.key && val.value).map(val => ({ key: val.key, type: val.type, value: val.value }));
                }
                this.loading = true;
                const params = {
                    url: this.requestData.url.host + this.requestData.url.path,
                    method: this.requestData.methods,
                    header: headerParams,
                    requestParams: requestParams,
                    requestType: this.requestData.requestType
                };
                window.postMessage({
                    type: "jobtool_proxy_web_request",
                    data: params
                });
                window.addEventListener("message", (msg) => {
                    const responseType = msg.data?.type
                    const response = msg.data?.data;
                    if (responseType === "jobtool_proxy_web_response") {
                        this.loading = false;
                        this.responseData = response;
                        if (this.responseData?.type === "excel") {
                            const arrayData = this.responseData.data.data
                            let ab = new ArrayBuffer(arrayData.length);
                            let view = new Uint8Array(ab);
                            for (var i = 0; i < arrayData.length; ++i) {
                                view[i] = arrayData[i];
                            }
                            const blob = new Blob([view], {
                                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            });
                            let blobUrl = "";
                            blobUrl = URL.createObjectURL(blob);
                            const downloadElement = document.createElement("a");
                            downloadElement.href = blobUrl;
                            downloadElement.download = decodeURIComponent(this.responseData.fileName) || "未命名"; //下载后文件名
                            document.body.appendChild(downloadElement);
                            downloadElement.click(); //点击下载
                            document.body.removeChild(downloadElement); //下载完成移除元素
                            window.URL.revokeObjectURL(blobUrl); //释放掉blob对象
                            resolve();
                        } else {
                            this.checkResponseParams();
                            resolve(response);
                        }
                    } else if (responseType === "jobtool_proxy_web_response_error") {
                        reject(msg.data);
                    }
                });
                
                // this.axios.post("/proxy", params).then((res) => {
                //     this.responseData = res.data;
                //     if (this.responseData?.type === "excel") {
                //         const arrayData = this.responseData.data.data
                //         let ab = new ArrayBuffer(arrayData.length);
                //         let view = new Uint8Array(ab);
                //         for (var i = 0; i < arrayData.length; ++i) {
                //             view[i] = arrayData[i];
                //         }
                //         const blob = new Blob([view], {
                //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                //         });
                //         let blobUrl = "";
                //         blobUrl = URL.createObjectURL(blob);
                //         const downloadElement = document.createElement("a");
                //         downloadElement.href = blobUrl;
                //         downloadElement.download = decodeURIComponent(this.responseData.fileName) || "未命名"; //下载后文件名
                //         document.body.appendChild(downloadElement);
                //         downloadElement.click(); //点击下载
                //         document.body.removeChild(downloadElement); //下载完成移除元素
                //         window.URL.revokeObjectURL(blobUrl); //释放掉blob对象
                //         resolve();
                //     } else {
                //         this.checkResponseParams();
                //         resolve(res.data);
                //     }
                // }).catch(err => {
                //     console.error(err);
                //     reject();
                // }).finally(() => {
                //     this.loading = false;
                // });                
            })
        },
        //=====================================组件间交互====================================//  
        //将扁平数据转换为树形结构数据
        convertPlainParamsToTreeData(plainData, jumpChecked) {
            const result = {};
            const foo = (plainData, result) => {
                for(let i = 0,len = plainData.length; i < len; i++) {
                    if (jumpChecked && !plainData[i]._select) { //若请求参数未选中则不发送请求
                        continue;
                    }
                    const key = plainData[i].key.trim();
                    const value = this.convertVariable(plainData[i].value);
                    const type = plainData[i].type;
                    const resultIsArray = Array.isArray(result);
                    const isComplex = (type === "object" || type === "array");
                    let arrTypeResultLength = 0; //数组类型值长度，用于数组里面嵌套对象时候对象取值
                    if (!isComplex && (key === "" || value === "")) { //非复杂数据需要填写参数名称才可以显示
                        continue
                    }
                    /*eslint-disable indent*/ 
                    switch (type) {
                        case "number": //数字类型需要转换为数字，转换前所有值都为字符串
                            resultIsArray ? result.push(Number(value)) : result[key] = Number(value);
                            break;
                        case "boolean": //字符串类型不做处理
                            resultIsArray ? result.push(result[key] = (value === "true" ? true : false)) : (result[key] = (value === "true" ? true : false));
                            break;
                        case "object":
                            resultIsArray ? (arrTypeResultLength = result.push({})) : (result[key] = {});
                            if (plainData[i].children && plainData[i].children.length > 0) {
                                foo(plainData[i].children, resultIsArray ? (result[arrTypeResultLength - 1]) : result[key]);
                            }
                            break;
                        case "array":
                            result[key] = [];
                            if (plainData[i].children && plainData[i].children.length > 0) {
                                foo(plainData[i].children, result[key]);
                            }
                            break;
                        default: //字符串或其他类型类型不做处理
                            resultIsArray ? result.push(value) : (result[key] = value);
                            break;
                    }
                }
            }
            foo(plainData, result);
            return result;
        },
        //将扁平数据转换为树形结构字符串数据
        convertPlainParamsToStringTreeData(plainData, jumpChecked) {
            const result = {
                str: ""
            };
            const createIndent = (level) => { //缩进级别
                const indent = 4;
                return " ".repeat(level * indent);
            }; 
            const createDash = (length) => { //创建短横线
                if (length < 0) length = 0; 
                return "-".repeat(length);
            }; 

            const foo = (plainData, level, inArray) => {
                let resultStr = "";
                for(let i = 0,len = plainData.length; i < len; i++) {
                    if (jumpChecked && !plainData[i]._select) { //若请求参数未选中则不发送请求
                        continue; 
                    }
                    const key = plainData[i].key.toString().trim();
                    let value = plainData[i].value;
                    const type = plainData[i].type;
                    const desc = plainData[i].description;
                    const required = plainData[i].required;
                    const isComplex = (type === "object" || type === "array");
                    // if (isComplex && key === "") { //复杂数据必须填写参数名称
                    //     continue;
                    // }
                    if (!isComplex && (value === "")) { //非复杂数据需要填写参数名称才可以显示
                        continue
                    }
                    /*eslint-disable indent*/ 
                    switch (type) {
                        case "number": { //数字类型需要转换为数字，转换前所有值都为字符串
                            const keyLength = inArray ? -2 : key.length; //-2是两个"占据的位置
                            const currentLength = 40 - level * 4 - 3 - keyLength - value.length;
                            resultStr += `${createIndent(level)}${inArray ? "" : key + ": "}${Number(value)}, //${createDash(currentLength)}${desc || ""}${required ? " (必填)" : ""}\n`;
                            result.str += `${createIndent(level)}${inArray ? "" : key + ": "}${Number(value)}, //${createDash(currentLength)}${desc || ""}${required ? " (必填)" : ""}\n`;
                            break;
                        }
                        case "boolean": {
                            const keyLength = inArray ? -2 : key.length; //-2是两个"占据的位置
                            const currentLength = 40 - level * 4 - 3 - keyLength - value.length;
                            resultStr += `${createIndent(level)}${inArray ? "" : key + ": "}${value}, //${createDash(currentLength)}${desc || ""}${required ? " (必填)" : ""}\n`;
                            result.str += `${createIndent(level)}${inArray ? "" : key + ": "}${value}, //${createDash(currentLength)}${desc || ""}${required ? " (必填)" : ""}\n`;
                            break;                            
                        }
                        case "object": {
                            const keyLength = inArray ? -2 : key.length; //-2是两个"占据的位置
                            const currentLength = 40 - level * 4 - 3 - keyLength;
                            if (plainData[i].children && plainData[i].children.length > 0) {
                                if (level === 0) {
                                    result.str += `${createIndent(level)}${inArray ? "" : key + ": "}{ //${createDash(currentLength)}${desc || ""}\n${foo(plainData[i].children, level + 1, false)}}`;
                                } else {
                                    resultStr = `${createIndent(level)}${inArray ? "" : key + ": "}{ //${createDash(currentLength)}${desc || ""}\n${foo(plainData[i].children, level + 1, false)}${createIndent(level)}}\n`;
                                }
                            } else {
                                if (level === 0) {
                                    result.str += `${createIndent(level)}${inArray ? "" : key + ": "}{ //${createDash(currentLength)}${desc || ""}\n}, \n`;
                                } else {
                                    resultStr = `${createIndent(level)}${inArray ? "" : key + ": "}{ //${createDash(currentLength)}${desc || ""}\n}, \n`;
                                }
                            }
                            break;                            
                        }
                        case "array": {
                            const currentLength = 40 - level * 4 - 3 - key.length;
                            if (plainData[i].children && plainData[i].children.length > 0) {
                                if (level === 0) {
                                    result.str += `${createIndent(level)}${key}: [ //${createDash(currentLength)}${desc || ""}\n${foo(plainData[i].children, level + 1, true)}]`;
                                } else {
                                    resultStr = `${createIndent(level)}${key}: [ //${createDash(currentLength)}${desc || ""}\n${foo(plainData[i].children, level + 1, true)}${createIndent(level)}]\n`;
                                }
                            } else {
                                if (level === 0) {
                                    result.str += `${createIndent(level)}${key}: [ //${createDash(currentLength)}${desc || ""}\n], \n`;
                                } else {
                                    resultStr = `${createIndent(level)}${key}: [ //${createDash(currentLength)}${desc || ""}\n], \n`;
                                }
                            }
                            break;                            
                        }
                        default: { //字符串或其他类型类型不做处理
                            const keyLength = inArray ? -2 : key.length; //-2是两个"占据的位置
                            let currentLength = 0;
                            if (value && value.length > 15) { //字符串长度超过15个字符的做截取操作
                                value = value.slice(0, 15) + "...";
                                currentLength = 40 - level * 4 - 3 - keyLength - value.length - 2;
                            } else {
                                currentLength = 40 - level * 4 - 3 - keyLength - value.length - 2;
                            }
                            resultStr += `${createIndent(level)}${inArray ? "" : key + ": "}"${value}", //${createDash(currentLength)}${desc || ""}${required ? " (必填)" : ""}\n`;
                            result.str += `${createIndent(level)}${inArray ? "" : key + ": "}"${value}", //${createDash(currentLength)}${desc || ""}${required ? " (必填)" : ""}\n`;
                            break;
                        }
                    }
                }
                return resultStr;
            }
            foo(plainData, 0, false);
            return result;
        },
        //导出数据
        handleExport(data) {
            const copyData =JSON.parse(JSON.stringify(data))
            dfsForest(copyData, {
                rCondition(value) {
                    return value.children;
                },
                rKey: "children",
                hooks: (val) => {
                    Object.assign(val, {
                        id: uuid(),
                        description: "", //------描述
                        required: true, //-------是否必填
                    })
                }
            });
            this.requestData.responseParams = copyData
            // console.log(copyData)
        },
        //检查返回值与响应参数是否一致
        checkResponseParams() {
            if (this.responseData?.type === "json") {
                const remoteParams = this.responseData.data;
                const localParams = this.responseParams;
                this.checkJsonData = localParams;
                let responseErrorType = null;
                const hasOwn = Object.hasOwnProperty;
                if (Object.keys(localParams).length === 0) {
                    responseErrorType = "lackKey"
                }
                const foo = (localData, remoteData) => {
                    for (let i in localData) { //不处理原型链上的数据
                        if (!hasOwn.call(localData, i)) {
                            continue;
                        }
                        const remoteKeys = Object.keys(remoteData); //-----远程keys
                        const localKeys = Object.keys(localData); //-------本地keys
                        const isLackKey = localKeys.some(val => !remoteKeys.includes(val)); //远程结果是否缺少对应字段
                        const isTooMuchKey = !remoteKeys.every(val => localKeys.includes(val)); //远程结果是否超出字段
                        //字段超出或者缺少判断
                        if (isLackKey) {
                            responseErrorType = "lackKey";
                            return;
                        }   
                        if (isTooMuchKey) {
                            responseErrorType = "tooMuchKey"
                            return
                        }
                        //判断字段类型是否一致
                        const localValue = localData[i];
                        const remoteValue = remoteData[i];
                        const localType = this.getType(localValue);
                        const remoteType = this.getType(remoteValue);
                        if (localType !== remoteType) {
                            responseErrorType = "typeError"
                            return
                        }
                        if (localType === "object") {
                            foo(localValue, remoteValue);
                        }
                        if (localType === "array") {
                            foo(localValue[0], remoteValue[0]);
                        }
                    }                    
                }
                foo(localParams, remoteParams);
                if (responseErrorType) {
                    this.$store.commit("apidocRules/changeCurrentCondition", {
                        remoteResponse: 0, 
                        responseErrorType, 
                    })
                } else {
                    this.$store.commit("apidocRules/changeCurrentCondition", {
                        remoteResponse: 1, 
                    })
                }
            }
        },
        //=====================================其他操作=====================================//
        convertVariable(val) {
            const matchedData = val.match(/{{\s*(\w+)\s*}}/);
            if (val && matchedData) {
                const varInfo = this.variables?.find(v => {
                    return v.name === matchedData[1];
                });
                if (varInfo) {
                    return val.replace(/{{\s*(\w+)\s*}}/, varInfo.value);
                } else {
                    return val;
                }
            } else {
                return val;
            }
        },
        //获取参数类型
        getType(value) {
            if (typeof value === "string") {
                return "string"
            } else if (typeof value === "number") { //NaN
                return "number"
            } else if (typeof value === "boolean") {
                return "boolean"
            } else if (Array.isArray(value)) {
                return "array"
            } else if (typeof value === "object" && value !== null) {
                return "object"
            } else { // null undefined ...
                return "string"
            }
        },

    }
};
</script>



<style lang="scss">
.response {
    height: calc(100vh - 120px);
    overflow-y: auto;
    .baseInfo {
        position: sticky;
        top: 0;
        background: $white;
        z-index: 1;
    }
    .res-data {
        min-height: size(100);
        max-height: size(300);
    }
    .res-text {
        width: 100%;
        max-height: size(300);
        overflow: auto;
    }
    .res-pdf {
        width: 100%;
        height: size(300);
    }
}
</style>
