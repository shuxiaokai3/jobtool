/*
    创建者：shuxiaokai
    创建时间：2019-10-29 13:18"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="可用性测试" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="70%">
        <div class="test-wrap">
            <div v-if="data.requestParams" class="left">
                <s-collapse title="基本信息">
                    <div>
                        <div class="mb-1">
                            <span class="gray-900">请求地址：</span>
                            <span>{{ data.url.host ? data.url.host : host }}</span>
                            <span>{{ data.url.path }}</span>
                        </div>
                        <div class="mb-1">
                            <span class="gray-900">请求方式：</span>
                            <span class="green">{{ data.methods.toUpperCase() }}</span>
                        </div>
                    </div>
                </s-collapse>
                <s-collapse title="请求头">
                    <div>
                        <div v-for="(item, index) in data.header" :key="index" class="d-flex mb-1">
                            <span v-if="item.key" class="flex0 gray-900">{{ item.key }}：</span>
                            <span class="text-ellipsis" :title="item.value">{{ item.value }}</span>
                        </div>
                    </div>
                </s-collapse>
                <s-collapse title="请求参数">
                    <pre class="request-params">{{ requestParams.str }}</pre>
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
            <div class="right">
                <s-collapse title="返回值">
                    <pre class="request-params">{{ responseData }}</pre>
                </s-collapse>
            </div>
        </div>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddTest">测试</el-button>
            <el-button :loading="loading" type="primary" size="mini" @click="fillResponse">测试结果填充返回值</el-button>
            <el-button type="danger" size="mini" @click="closeModel">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getType } from "@/lib/utils"
import { BaseConfig } from "@/config.default"
import axios from "axios"
export default {
    props: {
        isShow: {
            type: Boolean
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    data() {
        return {
            //=====================================成功参数====================================//
            successCodeArr: [], 
            missFieldArr: [], //缺失字段
            exceedFieldArr: [], //超出字段
            checkResult: [], //参数是否一致
            //=====================================测试步骤====================================//
            steps: { // -2代表未测试 -1代表请求中 0代表失败  1代表成功
                isAccessible: -2, // 是否可访问
                isGoodRequest: -2, // 请求是否失败 code === 200 才代表成功
                isConsistency: -2, // 返回值是否对应
            },
            //=====================================其他参数====================================//
            responseData: "", //返回值
            host: location.origin,
            loading: false,
            activeNames: "1"
        };
    },
    computed: {
        // 请求参数
        requestParams() {
            const result = {};
            const params = {};
            const foo = (treeData, result) => {
                for (let i = 0; i < treeData.length; i++) {
                    if (treeData[i].key == null || treeData[i].key.trim() === "") {
                        continue;
                    }
                    if (treeData[i].children && treeData[i].children.length > 0) {
                        this.$set(result, treeData[i].key + "-###-" + treeData[i].description, {});
                        foo(treeData[i].children, result[treeData[i].key + "-###-" + treeData[i].description]);
                    } else {
                        this.$set(result, treeData[i].key + "-###-" + treeData[i].description, treeData[i].type === "number" ? Number(treeData[i].value) : treeData[i].value);
                    }
                }
            }
            foo(this.data.requestParams, result);
            
            const foo2 = (treeData, result) => {
                for (let i = 0; i < treeData.length; i++) {
                    if (treeData[i].key == null || treeData[i].key.trim() === "") {
                        continue;
                    }
                    if (treeData[i].children && treeData[i].children.length > 0) {
                        this.$set(result, treeData[i].key, {});
                        foo2(treeData[i].children, result[treeData[i].key]);
                    } else {
                        const type = treeData[i].type;
                        if (type === "number") {
                            this.$set(result, treeData[i].key, Number(treeData[i].value));
                        } else if (type === "array") {
                            try {
                                this.$set(result, treeData[i].key, JSON.parse(treeData[i].value));
                            } catch (error) {
                                this.$message.error("数据格式不正确");
                            }
                        } else {
                            this.$set(result, treeData[i].key, treeData[i].value);
                        }
                    }
                }
            }
            foo2(this.data.requestParams, params);


            const treeStrData = JSON.parse(JSON.stringify(result))
            let resultStr = ""; //结果
            const spaceNum = 4; //基础空格数量
            const space = " ".repeat(spaceNum); //空格字符串

            const bar = (treeData, space) => {
                let str = "";
                for (const i in treeData) {
                    if (getType(treeData[i]) === "object") {
                        str += `${space}${i.split("-###-")[0]}: {\n${bar(treeData[i], space + "    ", 1)}${space}}, \n`;
                    } else {
                        str += `${space}${i.split("-###-")[0]}: ${treeData[i]}, ${i.split("-###-")[1] ? "//" + i.split("-###-")[1] : ""} \n`;
                    }
                }          
                return str;      
            }
            resultStr = bar(treeStrData, space);
            return {
                str: resultStr,
                data: params
            }
        },
        // 请求参数
        responseParams() {
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
            foo(this.data.responseParams, result);
            return result;
        },
        //请求头
        header() {
            const result = {};
            for (let i = 0; i < this.data.header.length; i++) {
                if (this.data.header[i].key === "") {
                    continue;
                }
                result[this.data.header[i].key] = this.data.header[i].value;
            }
            return result;
        },
    },
    created() {
        this.getSuccessCode();
    },
    methods: {
        //=====================================获取数据====================================//
        getSuccessCode() {
            const params = {
                isSuccess: "1",
                projectId: this.$route.query._id,
            }
            this.axios.get("/api/project/doc_code", { params }).then(res => {
                this.successCodeArr = res.data.rows.map(val => val.code);
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },

        //=====================================前后台交互====================================//
        /* 
            @description  开启测试
            @author        shuxiaokai
            @create       2019-10-29 13:18"
        */
        handleAddTest() {
            /*eslint-disable*/ 
            this.steps.isAccessible = -1;
            this.steps.isGoodRequest = -1;
            this.steps.isConsistency = -1;
            let params = {};

            const host = this.data.url.host ? this.data.url.host : this.host;
            const baseURL = (process.env.NODE_ENV === "development") ? BaseConfig.devUrl : BaseConfig.proUrl
            this.header["x-host"] = host;

            const requestConfig = {
                method: this.data.methods || "get",
                url: baseURL + "/proxy" + this.data.url.path,
                headers: this.header,
            }
            if (this.data.methods === "get") {
                requestConfig.params = this.requestParams.data;
            } else {
                requestConfig.data = this.requestParams.data;
                // params = this.requestParams.data;
            }
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
                this.responseData = err;
                this.$errorThrow(err, this);
            });
        },

        //=====================================其他操作====================================//
        /* 
            @description  关闭弹窗
            @author        shuxiaokai
            @create       2019-10-19 22:39"
            @params       null
            @return       null
        */
        closeModel() {
            this.$emit("close");
        },
        //将测试返回值填充为文档返回值
        fillResponse() {
            if (getType(this.responseData) === "object") {
                console.log(this.responseData)
            }
        },
        /* 
            @description  查看返回参数是否一致
            @author        shuxiaokai
            @create       2019-11-13 17:54"
            @params       返回参数
        */
        checkReponseData(remoteData) {
            this.missFieldArr = [];
            this.exceedFieldArr = [];
            const foo = (resourceData, remoteData, result) => {
                for(let i in resourceData) {
                    if (resourceData.hasOwnProperty(i)) {
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
            foo(this.responseParams, remoteData, this.missFieldArr);
            foo(remoteData, this.responseParams, this.exceedFieldArr);
        },

        /* 
            @description  处理请求折叠面板
            @author        shuxiaokai
            @create       2019-10-29 18:54"
            @params       
            @return       null
        */
        handleChangeCollapse() {

        },
    }
};
</script>



<style lang="scss">
    .test-wrap {
        display: flex;
        .left {
            flex: 0 0 50%;
        }
        .right {
            flex: 1;
        }
    }
    .request-params {
        max-height: 200px;
        overflow: auto;
        .el-dialog__body {
            padding-top: 1px;
        }
    }
</style>
