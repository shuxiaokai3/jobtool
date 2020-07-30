/*
    创建者：shuxiaokai
    创建时间：2020-07-10 20:13
    模块名称：请求返回信息
    备注：xxxx
*/
<template>
    <div class="response">
        <s-collapse title="基本信息">
            <div>
                <div class="my-2">
                    <span>请求地址：</span>
                    <span class="f-xs">{{ requestData.url.host }}</span>
                    <span class="f-xs">{{ requestData.url.path }}</span>
                </div>
                <div class="my-2">
                    <span>请求方式：</span>
                    <span class="f-xs green">{{ requestData.methods.toUpperCase() }}</span>
                </div>
            </div>
        </s-collapse>
        <s-collapse title="请求头">
            <template v-if="requestData.header.length > 1">
                <div v-for="(item, index) in requestData.header" :key="index" class="d-flex a-center mt">
                    <span v-if="item.key" class="flex0">{{ item.key }}：</span>
                    <span class="f-xs text-ellipsis" :title="item.value">{{ convertVariable(item.value) }}</span>
                </div>
            </template>
            <div v-else class="f-xs gray-500">暂无数据</div>
        </s-collapse>
        <s-collapse title="请求参数">
            <pre>{{ requesStringParams.str }}</pre>
        </s-collapse>
        <s-collapse title="返回结果">
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
                <!-- <pre v-if="responseData && responseData.type === 'json'" class="res-data">{{ JSON.parse(responseData.data) }}</pre> -->
                <s-json v-if="responseData && responseData.type === 'json'" :data="JSON.parse(responseData.data)"></s-json>
                <span v-if="responseData && responseData.type === 'svg'" v-html="responseData.data"></span>
                <img v-if="responseData && responseData.type === 'image'" :src="responseData.data" alt="无法显示">
                <div v-if="responseData && responseData.type === 'text'" v-html="responseData.data" class="res-text"></div>
                <iframe v-else-if="responseData && responseData.type === 'pdf'" :src="responseData.data" class="res-pdf"></iframe>
            </div>
            <!-- <pre>{{ requestData.requestParams }}</pre> -->
            <s-json :data="jsonData"></s-json>
        </s-collapse>
    </div>
</template>

<script>
// import sJson from "./json.vue"
export default {
    components: {
        // "s-json": sJson
    },
    props: {
        requestData: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    computed: {
        //请求参数(对象类型)
        requestParams() {
            let copyData = JSON.parse(JSON.stringify(this.requestData.requestParams)); //扁平数据拷贝
            const result = this.convertPlainParamsToTreeData(copyData, true);
            return result;
        },
        //请求头(对象类型)
        headerParams() {
            const copyData = JSON.parse(JSON.stringify(this.requestData.header)); //扁平数据拷贝
            const result = this.convertPlainParamsToTreeData(copyData);
            return result;
        },
        //返回参数(对象类型)
        responseParams() {
            const copyData = JSON.parse(JSON.stringify(this.requestData.responseParams)); //扁平数据拷贝
            const result = this.convertPlainParamsToTreeData(copyData);
            return result;
        },
        //请求参数字符串类型
        requesStringParams() {
            const copyData = JSON.parse(JSON.stringify(this.requestData.requestParams)); //扁平数据拷贝
            const result = this.convertPlainParamsToStringTreeData(copyData);
            return result;
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
            jsonData: {
                x: "aaaa",
                y: [
                    {
                        x: 3
                    },
                    222,
                    {
                        xxx: 33,
                        yyy: true
                    }
                ],
            },
            responseData: null, //---返回结果对象
            loading: false, //-------返回结果加载状态
        };
    },
    created() {

    },
    methods: {
        //=====================================前后端交互====================================//
        sendRequest() {
            return new Promise((resolve) => {
                let requestParams = this.requestParams;
                if (this.requestData.requestType === "formData") {
                    requestParams = this.requestData.requestParams.filter(val => val.key && val.value).map(val => ({ key: val.key, type: val.type, value: val.value }));
                }
                this.loading = true;
                const params = {
                    url: this.requestData.url.host + this.requestData.url.path,
                    method: this.requestData.methods,
                    header: this.headerParams,
                    requestParams: requestParams,
                    requestType: this.requestData.requestType
                };
                this.axios.post("/proxy", params).then((res) => {
                    this.responseData = res.data
                }).catch(err => {
                    console.error(err);
                }).finally(() => {
                    resolve();
                    this.loading = false;
                });                
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
                    // const desc = plainData[i].description;
                    const isComplex = (type === "object" || type === "array");
                    let arrTypeResultLength = 0; //数组类型值长度，用于数组里面嵌套对象时候对象取值
                    // if (isComplex && key === "") { //复杂数据必须填写参数名称
                    //     continue;
                    // }
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
                            // console.log(result, key)
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
        }
    }
};
</script>



<style lang="scss">
.response {
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
