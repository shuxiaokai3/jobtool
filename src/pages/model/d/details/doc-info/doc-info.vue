/*
    创建者：shuxiaokai
    创建时间：2019-11-14 17:35
    模块名称：文档详情
    备注：xxxx
*/
<template>
    <div class="d-flex doc-info">
        <div v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="px-2 w-50">
            <el-divider content-position="left">接口名称</el-divider>
            <div class="d-flex between">
                <div class="f-bg">{{ docInfo.docName }}</div>
                <div>
                    <span>xxx 最后修改于</span>
                    <span class="teal"> {{ new Date(docInfo.updatedAt).toLocaleString() }}</span>
                </div>
            </div>
            <div class="mt-2 d-flex a-center">
                <el-input v-model="presetHost" name="name" size="mini" :placeholder="`默认域名：${docInfo.item.url.host}`" class="w-50" maxlength="100"></el-input>
                <span class="ml-2 gray-500">优先使用修改过后的域名</span>
                <el-button :disabled="presetHost === ''" type="text" class="ml-4" @click="resetPresetHost">恢复</el-button>
            </div>
            <div class="d-flex mt-2">
                <el-tag>{{ docInfo.item.methods ? docInfo.item.methods.toUpperCase() : docInfo.item.methods }}</el-tag>
                <pre v-copy2="docInfo.item.url.path" class="flex1">{{ realUrl }}</pre>
                <div class="d-flex center">
                    <el-popover placement="top-start" width="200" trigger="hover" content="鼠标左键复制路径，右键复制完整路径">
                        <i slot="reference" class="el-icon-warning orange mx-1"></i>
                    </el-popover>
                </div>
                <el-button :loading="loading2" size="mini" type="success" @click="testRequest">请求测试</el-button>
                <el-button v-show="loading2" size="mini" type="danger" @click="cancleTestRequest">取消请求</el-button>
            </div>
            <el-divider content-position="left">请求参数</el-divider>
            <pre v-if="Object.keys(requestParams.data).length > 0" class="p-relative">{{ requestParams.str }}
                <div class="res-operation">
                    <div class="teal cursor-pointer" @click="handleCopySearch">复制为搜索</div>
                </div>
            </pre>
            <pre v-else>无</pre>
            <el-divider content-position="left">返回参数</el-divider>
            <pre v-if="Object.keys(responseParams.data).length > 0" class="p-relative">{{ responseParams.str }}
                <div class="res-operation">
                    <div class="teal cursor-pointer" @click="handleCopyTable">复制为表格</div>
                </div>
            </pre>
            <pre v-else>无</pre>
            <el-divider content-position="left">请求头</el-divider>
            <pre v-if="Object.keys(header.data).length > 0">{{ header.str }}</pre>
            <pre v-else>无</pre>
        </div>   
        <div class="w-50 py-5 px-5">
            <s-collapse title="返回值">
                <pre class="request-params">{{ responseData }}</pre>
            </s-collapse>
            <s-collapse title="测试结果">
                <div class="d-flex between align-center mb-1">
                    <span>接口连通情况</span>
                    <span v-if="steps.isAccessible === -2" class="el-icon-question"></span>
                    <span v-if="steps.isAccessible === -1" class="el-icon-loading"></span>
                    <span v-if="steps.isAccessible === 0" class="el-icon-error red"></span>
                    <span v-if="steps.isAccessible === 1" class="el-icon-success green"></span>
                </div>
                <div class="d-flex between align-center mb-1">
                    <span>
                        <span>
                            <span>请求是否失败(自定义状态码非</span>
                            <span v-for="(item, index) in successCodeArr" :key="index">{{ item }},&nbsp;</span>
                            <span>)</span>
                        </span>
                        <el-popover placement="top-start" width="350" trigger="hover" content="返回自定义状态码code不等于当前值则无法通过校验">
                            <i slot="reference" class="el-icon-warning orange ml-2"></i>
                        </el-popover>
                    </span>
                    <span v-if="steps.isGoodRequest === -2" class="el-icon-question"></span>
                    <span v-if="steps.isGoodRequest === -1" class="el-icon-loading"></span>
                    <span v-if="steps.isGoodRequest === 0" class="el-icon-error red"></span>
                    <span v-if="steps.isGoodRequest === 1" class="el-icon-success green"></span>
                </div>
                <div class="d-flex between align-center mb-1">
                    <span>
                        <span>返回参数是否一致</span>
                    </span>
                    <span v-if="steps.isConsistency === -2" class="el-icon-question"></span>
                    <span v-if="steps.isConsistency === -1" class="el-icon-loading"></span>
                    <span v-if="steps.isConsistency === 0" class="el-icon-error red"></span>
                    <span v-if="steps.isConsistency === 1" class="el-icon-success green"></span>
                </div>
                <hr>
                <div class="d-flex between align-center mb-1">
                    <span v-if="missFieldArr && missFieldArr.length > 0" class="ml-1">
                        <span>缺失参数：</span>
                        <span v-for="(item, index) in missFieldArr" :key="index" class="red">{{ item }}&nbsp;</span>
                    </span>
                    <span v-if="exceedFieldArr && exceedFieldArr.length > 0" class="ml-1">
                        <span>多余参数：</span>
                        <span v-for="(item, index) in exceedFieldArr" :key="index" class="red">{{ item }}&nbsp;</span>
                    </span>
                </div>
            </s-collapse>
        </div>   
        <s-copy-table-model v-if="isShow" :table-data="copyTableData" :url="docInfo.item.url.path" :is-show="isShow" @close="isShow = false;"></s-copy-table-model>  
        <s-copy-search-model v-if="isShow2" :table-data="copySearchData" :is-show="isShow2" @close="isShow2 = false;"></s-copy-search-model>  
    </div>
</template>

<script>
import { getType, flatTree } from "@/lib/utils"
import { BaseConfig } from "@/config.default.js"
import axios from "axios"
const CancelToken = axios.CancelToken;
import copyTable from "./model/copy-table"
import copySearch from "./model/copy-search"
export default {
    components: {
        "s-copy-table-model": copyTable,
        "s-copy-search-model": copySearch,
    },
    data() {
        return {

            //=====================================请求测试====================================//
            //测试步骤
            steps: { // -2代表未测试 -1代表请求中 0代表失败  1代表成功
                isAccessible: -2, // 是否可访问
                isGoodRequest: -2, // 请求是否失败 code === 200 才代表成功
                isConsistency: -2, // 返回值是否对应
            },
            successCodeArr: [], //成功状态码
            missFieldArr: [], //缺失字段
            exceedFieldArr: [], //超出字段
            checkResult: [], //参数是否一致
            responseData: null, //返回值
            presetHost: "", //用户预定义请求地址
            copyHost: "", //host的拷贝
            //=====================================文档信息====================================//
            docInfo: {
                item: {
                    requestParams: [],
                    responseParams: [],
                    header: [],
                    url: {}
                },
            },
            copyTableData: [], //拷贝为表格的数据
            copySearchData: [], //拷贝为搜索的数据
            //=====================================其他参数====================================//
            cancel: [], //待取消请求数组
            loading: false, //获取文档信息
            loading2: false, //请求测试
            isShow: false, //是否展示表格复制弹窗
            isShow2: false, //是否展示搜索复制弹窗
        };
    },
    computed: {
        // 请求参数
        requestParams() {
            const result = {};
            const params = {};
            this.addParamsDescription(this.docInfo.item.requestParams, result);
            this.convertParamsToJson(this.docInfo.item.requestParams, params);
            const treeStrData = JSON.parse(JSON.stringify(result))
            const copyStr = this.convertParamsToCopyStr(treeStrData);
            const resultStr = this.convertDescriptionParamsToFormatStr(treeStrData); //结果
            return {
                str: resultStr,
                data: params,
                copyStr
            }
        },  
        responseParams() {
            const result = {};
            const params = {};
            this.addParamsDescription(this.docInfo.item.responseParams, result);
            this.convertParamsToJson(this.docInfo.item.responseParams, params);
            const treeStrData = JSON.parse(JSON.stringify(result))
            //console.log(treeStrData)
            const copyStr = this.convertParamsToCopyStr(treeStrData);
            const resultStr = this.convertDescriptionParamsToFormatStr(treeStrData); //结果
            return {
                str: resultStr,
                data: params,
                copyStr
            }
        },  
        header() {
            const result = {};
            const params = {};
            this.addParamsDescription(this.docInfo.item.header, result);
            this.convertParamsToJson(this.docInfo.item.header, params);
            const treeStrData = JSON.parse(JSON.stringify(result))
            const copyStr = this.convertParamsToCopyStr(treeStrData);
            const resultStr = this.convertDescriptionParamsToFormatStr(treeStrData); //结果
            return {
                str: resultStr,
                data: params,
                copyStr
            }
        },   
        // 请求参数
        testResponseParams() {
            const result = {};
            const foo = (treeData, result) => {
                for (let i = 0; i < treeData.length; i++) {
                    if (treeData[i].key == null || treeData[i].key.trim() === "") {
                        continue;
                    }
                    if (treeData[i].children && treeData[i].children.length > 0) {
                        if (treeData[i].type === "array") {
                            this.$set(result, treeData[i].key, [{}]);
                            foo(treeData[i].children, result[treeData[i].key][0]);
                        } else {
                            this.$set(result, treeData[i].key, {});
                            foo(treeData[i].children, result[treeData[i].key]);
                        }
                    } else {
                        this.$set(result, treeData[i].key, treeData[i].value || null);
                    }
                }
            }
            foo(this.docInfo.item.responseParams, result);
            return result;
        },
        realUrl() {
            const ret = this.docInfo.item.url.host + this.docInfo.item.url.path || ""
            return ret.replace(/\?.*/g, "");
        }
        
    },
    watch: {
        "$store.state.viewTabs.currentTab": {
            handler(val) {
                this.getDocInfo(val.id)
            },
            deep: true
        },
        presetHost(val) {
            if (val.trim() !== "") {
                this.docInfo.item.url.host = val;
                localStorage.setItem("presetHost", val);
            } else {
                this.docInfo.item.url.host = this.copyHost;
            }
        }
    },
    created() {
        let docId = this.$route.query.docId
        if (localStorage.getItem("viewCurrentTab")) {
            docId = JSON.parse(localStorage.getItem("viewCurrentTab")).id  
        } 
        this.getSuccessCode();
        this.getDocInfo(docId);
        this.presetHost = localStorage.getItem("presetHost") || "";
    },
    methods: {
        //=====================================获取数据====================================//
        //获取文档信息
        getDocInfo(id) {
            const params = {
                projectId: this.$route.query._id,
                _id: id
            };
            this.loading = true;
            this.axios.get("/api/project/doc_detail", { params }).then(res => {
                this.docInfo = res.data
                this.copyHost = this.docInfo.item.url.host;
                if (localStorage.getItem("presetHost")) {
                    this.docInfo.item.url.host = localStorage.getItem("presetHost");
                }
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        //获取成功返回码
        getSuccessCode() {
            const params = {
                projectId: this.$route.query._id,
                isSuccess: "1"
            }
            this.axios.get("/api/project/doc_code", { params }).then(res => {
                this.successCodeArr = res.data.rows.map(val => val.code);
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================测试请求====================================//
        // 请求测试
        testRequest() {
            const headers = {};
            for (let i = 0; i < this.docInfo.item.header.length; i++) {
                if (this.docInfo.item.header[i].key === "") {
                    continue;
                }
                headers[this.docInfo.item.header[i].key] = this.docInfo.item.header[i].value;
            }
            
            this.steps.isAccessible = -1;
            this.steps.isGoodRequest = -1;
            this.steps.isConsistency = -1;

            const host = this.docInfo.item.url.host ? this.docInfo.item.url.host : this.host;
            headers["x-host"] = host.replace(/\?.*/g, "");
            const baseURL = (process.env.NODE_ENV === "development") ? BaseConfig.devUrl : BaseConfig.proUrl
            const url = (host + this.docInfo.item.url.path);
            console.log(url, 999)
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                this.$message.warning("请求url格式不对");
                return;
            }
            const requestConfig = {
                method: this.docInfo.item.methods || "get",
                url: (baseURL + "/proxy" + this.docInfo.item.url.path).replace(/\?.*/g, ""),
                headers,
                cancelToken: new CancelToken((c) => {
                    this.cancel.push(c);
                }),
            }
            if (this.docInfo.item.methods === "get") {
                requestConfig.params = this.requestParams.data;
            } else {
                requestConfig.data = this.requestParams.data;
            }

            this.loading2 = true;
            axios.request(requestConfig).then(res => {
                if (this.successCodeArr.includes(res.data.code)) {
                    this.steps.isAccessible = 1;
                    this.steps.isGoodRequest = 1;
                    this.steps.isConsistency = -2;
                    this.checkReponseData(res.data);
                    if (this.missFieldArr.length > 0 || this.exceedFieldArr.length > 0) {
                        this.steps.isConsistency = 0
                    } else {
                        this.steps.isConsistency = 1
                    }
                } else {
                    this.steps.isAccessible = 1;
                    this.steps.isGoodRequest = 0;
                    this.steps.isConsistency = -2;
                }
                this.responseData = res.data;
            }).catch(err => {
                if (err.response && err.response.status !== 200) {
                    this.steps.isAccessible = 0;
                    this.steps.isGoodRequest = 0;
                    this.steps.isConsistency = -2;
                } else {
                    this.steps.isAccessible = 0;
                    this.steps.isGoodRequest = 0;
                    this.steps.isConsistency = 0;
                }
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading2 = false;
            });
        },
        //取消请求测试
        cancleTestRequest() {
            if (this.cancel.length > 0) {
                this.cancel.forEach(c => {
                    c();
                })
            }
        },
        //=====================================其他操作====================================//
        //给请求参数添加描述信息
        addParamsDescription(treeData, result) {
            for (let i = 0; i < treeData.length; i++) {
                if (treeData[i].key == null || treeData[i].key.trim() === "") {
                    continue;
                }
                const key = treeData[i].key;
                const description = treeData[i].description;
                const required = treeData[i].required ? "" : "(非必填)";
                const type = treeData[i].type
                const str = key + "-###-" + description + "-###-" + required + "-###-" + type;
                if (treeData[i].children && treeData[i].children.length > 0) {
                    this.$set(result, str, {});
                    this.addParamsDescription(treeData[i].children, result[str]);
                } else {
                    this.$set(result, str, treeData[i].type === "number" ? Number(treeData[i].value) : treeData[i].value);
                }
            }
        },
        //将添加了描述的请求参数转换为具有一定格式的字符串
        convertDescriptionParamsToFormatStr(treeData) {
            let result = "";
            const spaceNum = 4; //基础空格数量
            const space = " ".repeat(spaceNum); //空格字符串
            const foo = (treeData, space) => {
                let str = "";
                for (const i in treeData) {
                    if (getType(treeData[i]) === "object") {
                        str += `${space}${i.split("-###-")[0]}: {\n${foo(treeData[i], space + "    ", 1)}${space}}, \n`;
                    } else {
                        str += `${space}${i.split("-###-")[0]}: ${treeData[i]}, ${i.split("-###-")[1] ? "//" + i.split("-###-")[1] + i.split("-###-")[2] : ""} \n`;
                    }
                }          
                return str;      
            }
            result = foo(treeData, space);
            return `{\n${result}}`;
        },
        convertParamsToCopyStr(treeData) {
            if (Object.keys(treeData).length === 0) {
                return "空";
            }
            let result = "";
            const spaceNum = 16; //基础空格数量
            const space = " ".repeat(spaceNum); //空格字符串
            let isFirstKey = true; //是否是第一个key用于处理vscode换行
            const commentLen = 50; //默认总长度为50，超过总长度不计算宽度

            const foo = (treeData, space) => {
                let str = "";
                const treeDataValueArr = [];
                for (const i in treeData) {
                    if (typeof treeData[i] !== "object") {
                        treeDataValueArr.push(treeData[i])
                    }
                }
                //const maxKeysLength = Object.keys(treeData).map(val => val.split("-###-")[0]).sort((a, b) => b.toString().length - a.toString().length)[0].length;
                // const maxValue = treeDataValueArr.sort((a, b) => b.toString().length - a.toString().length)[0];
 
                for (const i in treeData) {
                    if (getType(treeData[i]) === "object") { //存在嵌套
                        const key = i.split("-###-")[0];
                        const childStr = foo(treeData[i], space + "    ");
                        if (isFirstKey) {
                            str += `${key}: {\n${childStr}}, \n`;
                            isFirstKey = false;
                        } else {
                            str += `${space}${key}: {\n${childStr}${space}}, \n`;
                        }
                    } else {
                        const key = i.split("-###-")[0]; 
                        const comment = i.split("-###-")[1]; //参数值
                        const description = i.split("-###-")[2]; //是否必填
                        const type = i.split("-###-")[3];
                        const value = (type === "string" ? `"${treeData[i]}"` : treeData[i]) || "";
                        let valueLen = 0;
                        Array.from(value.toString()).forEach(val => {
                            if (val.charCodeAt() > 255) {
                                valueLen += 2;
                            } else {
                                valueLen++;
                            }
                        });
                        const currentLength = valueLen + key.toString().length + space.length;
                        const commentLength = (commentLen - currentLength > 0) ? (commentLen - currentLength) : 0;
                        if (isFirstKey) {
                            str += `${key}: ${value}, ${comment ? "//" + "-".repeat(commentLength) + comment + description : ""} \n`;
                            isFirstKey = false;
                        } else {
                            str += `${space}${key}: ${value}, ${comment ? "//" + "-".repeat(commentLength) + comment + description : ""} \n`;
                        }
                    }
                }          
                return str;      
            }
            result = foo(treeData, space);
            return result;
        },
        //将参数转换为json格式
        convertParamsToJson(treeData, result) {
            for (let i = 0; i < treeData.length; i++) {
                if (treeData[i].key == null || treeData[i].key.trim() === "") { //跳过key值为空的数据
                    continue;
                }
                if (treeData[i].children && treeData[i].children.length > 0) { //存在子数据则递归
                    this.$set(result, treeData[i].key, {});
                    this.convertParamsToJson(treeData[i].children, result[treeData[i].key]);
                } else { 
                    const type = treeData[i].type;
                    if (type === "number") {
                        this.$set(result, treeData[i].key, Number(treeData[i].value));
                    } else if (type === "array") {
                        try {
                            console.log(treeData[i].value)
                            this.$set(result, treeData[i].key, JSON.parse(treeData[i].value || "[]")); //fix 数组数据未填写导致解析不正确
                        } catch (error) {
                            console.error(error);
                            this.$message.error("数据格式不正确");
                        }
                    } else {
                        this.$set(result, treeData[i].key, treeData[i].value);
                    }
                }
            }
        },
        /* 
            @description  查看返回参数是否一致
            @autor        shuxiaokai
            @create       2019-11-13 17:54"
            @params       返回参数
        */
        checkReponseData(remoteData) {
            this.missFieldArr = [];
            this.exceedFieldArr = [];
            const foo = (resourceData, remoteData, result) => {
                for (const i in resourceData) {
                    const hasOwn = Object.hasOwnProperty;
                    if (hasOwn.call(resourceData, i)) {
                        if (remoteData[i] === undefined) {
                            result.push(i);
                        }
                        if (getType(resourceData[i]) === "object") {
                            if (getType(remoteData[i]) === "object") {
                                foo(resourceData[i], remoteData[i], result);
                            } else if (getType(remoteData[i]) === "array") {
                                foo(resourceData[i], remoteData[i][0], result);
                            }
                        } 
                        if (getType(resourceData[i]) === "array") {
                            if (getType(remoteData[i]) === "array") {
                                foo(resourceData[i][0], remoteData[i][0], result);
                            } else if (getType(remoteData[i]) === "object") {
                                foo(resourceData[i][0], remoteData[i], result);
                            }
                        }
                    }
                }                
            }
            foo(this.testResponseParams, remoteData, this.missFieldArr);
            foo(remoteData, this.testResponseParams, this.exceedFieldArr);
        },
        //恢复请求
        resetPresetHost() {
            this.presetHost = "";
            localStorage.removeItem("presetHost");
        },
        //=====================================复制操作====================================//
        handleCopyTable() { //复制为表格
            console.log(this.docInfo.item.responseParams, flatTree(this.docInfo.item.responseParams))
            this.copyTableData = flatTree(this.docInfo.item.responseParams)
            this.isShow = true;
        },
        handleCopySearch() { //复制为搜索
            this.copySearchData = flatTree(this.docInfo.item.requestParams).map(val => {
                return {
                    ...val,
                    __id: "id", //下拉选择id映射
                    __name: "name", //下拉选择name映射
                    __type: "input", //参数类型
                    __multi: false, //多选
                    __dateLimit: "none", //日期限制
                    __daterangeFlag: "1", //日期标注，用于区分日期段哪两个参数为一组
                    __time: "", // 开始日期还是结束日期，startTime:开始日期  endTime: 结束日期
                    __url: "", //请求url
                };
            })
            this.isShow2 = true;
        },
        
    }
};
</script>



<style lang="scss">
    .doc-info {
        .request-params {
            max-height: 400px;
            overflow: auto;
        }    
        .res-operation {
            position: absolute;
            top: 10px;
            right: 20px;
            padding: 0;
            display: flex;
        }    
    }
</style>
