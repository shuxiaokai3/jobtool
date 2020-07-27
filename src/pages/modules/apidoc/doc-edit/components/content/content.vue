/*
    创建者：shuxiaokai
    创建时间：2020-07-06 17:57
    模块名称：文档书写区域区域
    备注：xxxx
*/
<template>
    <div v-if="tabs && tabs.length > 0" class="edit-content d-flex">
        <div v-loading="loading2" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="border-right-teal w-65">
            <!-- 基本配置 -->
            <div class="request mb-2">
                <div class="edit-title w-100 f-bg mb-2" contenteditable @input="handleChangeTitle($event)" @blur="handleTitleBlur($event)" @focus="handleTitleFocus">{{ request._description }}</div>
                <div class="mb-2">
                    <el-radio-group v-model="request.url.host" size="mini">
                        <el-popover placement="top-start" trigger="hover" :close-delay="0" :content="origin">
                            <el-radio slot="reference" :label="origin" border>本地</el-radio>
                        </el-popover>
                        <el-popover v-for="(item, index) in hostEnum" :key="index" :close-delay="0" placement="top-start" trigger="hover" :content="item.url">
                            <el-radio slot="reference" :label="item.url" border>{{ item.name }}</el-radio>
                        </el-popover>
                    </el-radio-group>
                    <el-button type="text" size="small" @click="dialogVisible = true;">域名维护</el-button>
                </div>
                <div class="d-flex a-center w-100">
                    <!-- 接口 -->
                    <div class="d-flex w-100">
                        <s-v-input 
                                v-model="request.url.path"
                                :error="request.url.path.trim() === '' && urlInvalid"
                                placeholder="只需要输入接口地址，前面不需要加域名，加了会被忽略"
                                size="small"
                                @blur="checkUrlRule"
                                @keyup.enter.native="checkUrlRule"
                        >
                            <div slot="prepend" class="request-input">
                                <el-select v-model="request.methods" @change="handleChangeRequestMethods">
                                    <el-option value="get" label="get"></el-option>
                                    <el-option value="post" label="post"></el-option>
                                    <el-option value="put" label="put"></el-option>
                                    <el-option value="delete" label="delete"></el-option>
                                </el-select>
                            </div>                        
                        </s-v-input>
                        <el-button :loading="loading3" type="success" size="small" @click="sendRequest">发送请求</el-button>
                        <el-button :loading="loading" type="primary" size="small" @click="saveRequest">保存接口</el-button>
                        <el-button type="primary" size="small" @click="dialogVisible2 = true" @close="dialogVisible2 = false">全局变量</el-button>
                    </div>
                </div>         
                <div class="d-flex">
                </div>       
                <pre class="w-100">{{ request.url.host }}{{ request.url.path }}</pre>
                <div class="w-100 mt-2">
                    <el-radio-group v-model="request.requestType">
                        <el-radio :disabled="request.methods !== 'get'" label="query">query</el-radio>
                        <el-radio :disabled="request.methods === 'get'" label="json">json</el-radio>
                        <el-radio :disabled="request.methods === 'get' || request.methods === 'put' || request.methods === 'delete'" label="formData">formData</el-radio>
                        <el-radio disabled label="x-www-form-urlencoded">x-www-form-urlencoded</el-radio>
                    </el-radio-group>
                </div>
                <hr>
            </div>
            <!-- 请求参数 -->
            <div>
                <s-params-tree :tree-data="request.requestParams" title="请求参数" :is-form-data="request.requestType === 'formData'" showCheckbox :plain="request.methods === 'get'"></s-params-tree>
                <s-params-tree :tree-data="request.responseParams" title="响应参数"></s-params-tree>
                <s-params-tree :tree-data="request.header" title="请求头" plain :fold="foldHeader" :valid-key="false"></s-params-tree>            
            </div>            
        </div>
        <div class="w-35 flex1">
            <s-response ref="response" :request-data="request"></s-response>
        </div>
        <s-host-manage v-if="dialogVisible" :visible.sync="dialogVisible"></s-host-manage>
        <s-variable-manage v-if="dialogVisible2" :visible.sync="dialogVisible2"></s-variable-manage>
    </div>
    <div v-else>
        
    </div>
</template>

<script>
import axios from "axios" 
import paramsTree from "./components/params-tree"
import response from "./components/response"
import hostManage from "./dialog/host-manage"
import variableManage from "./dialog/variable-manage"
import { dfsForest, findParentNode } from "@/lib/utils"
import uuid from "uuid/v4"
import qs from "qs"
const CancelToken = axios.CancelToken;
export default {
    components: {
        "s-params-tree": paramsTree,
        "s-host-manage": hostManage,
        "s-variable-manage": variableManage,
        "s-response": response,
    },
    data() {
        return {
            //=====================================请求基本信息====================================//
            request: {
                methods: "get", //---------------请求方式
                requestType: "query",
                url: {
                    host: "", //-----------------主机(服务器)地址
                    path: "", //-----------------接口路径
                }, //----------------------------请求地址信息
                requestParams: [
                    {
                        id: uuid(),
                        key: "", //--------------请求参数键
                        value: "", //------------请求参数值
                        type: "string", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ],
                responseParams: [
                    {
                        id: uuid(),
                        key: "", //--------------请求参数键
                        value: "", //------------请求参数值
                        type: "string", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ],
                header: [
                    {
                        id: uuid(),
                        key: "", //--------------请求头键
                        value: "", //------------请求头值
                        type: "string", //-------请求头值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ], //----------------------------请求头信息
                description: "在这里输入文档描述", //--------------请求描述
                _description: "", //-------------请求描述拷贝
            },
            origin: location.origin,
            //=====================================域名相关====================================//
            hostEnum: [], //---------------------域名列表
            //=====================================其他参数====================================//
            urlInvalid: false, //----------------url是否合法
            cancel: [], //-----------------------需要取消的接口
            loading: false, //-------------------保存接口
            loading2: false, //------------------获取文档详情接口
            loading3: false, //------------------发送请求状态
            foldHeader: true, //-----------------是否折叠header，当校验错误时候自动展开header
            dialogVisible: false, //-------------域名维护弹窗
            dialogVisible2: false, //------------全局变量管理弹窗

        };
    },
    computed: {
        currentSelectDoc() { //当前选中的doc
            return this.$store.state.apidoc.activeDoc[this.$route.query.id];
        },
        tabs() { //-----------全部tabs
            return this.$store.state.apidoc.tabs[this.$route.query.id];
        },
    },
    watch: {
        currentSelectDoc: {
            handler(val, oldVal) {
                if (val) {
                    if (!oldVal || val._id !== oldVal._id) {
                        this.getDocDetail();
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.getHostEnum(); //获取host枚举值
    },
    methods: {
        //=====================================获取数据====================================//
        //获取文档详情
        getDocDetail() {
            if (!this.currentSelectDoc || !this.currentSelectDoc._id) { //没有id不请求数据
                return
            }
            const params = {
                _id: this.currentSelectDoc._id
            };
            if (this.cancel.length > 0) {
                this.cancel.forEach(c => {
                    c("取消请求");
                })
            }
            setTimeout(() => { //hack让请求加载不受取消影响
                this.loading2 = true;
            })
            this.axios.get("/api/project/doc_detail", {
                params,
                cancelToken: new CancelToken((c) => {
                    this.cancel.push(c);
                })
            }).then(res => {
                if (res === undefined) { //取消接口
                    return
                }
                if (res.data === null) { //接口不存在提示用户删除接口
                    this.confirmInvalidDoc();
                    return;
                }
                Object.assign(this.request, res.data.item);
                const reqParams = this.request.requestParams;
                const resParams = this.request.responseParams;
                const headerParams = this.request.header;
                const reqParamsLen = this.request.requestParams.length;
                const resParamsLen = this.request.responseParams.length;
                const headerParamsLen = this.request.header.length;
                const reqLastItemIsEmpty = (reqParams[reqParamsLen - 1] && reqParams[reqParamsLen - 1].key === "" && reqParams[reqParamsLen - 1].value === "");
                const resLastItemIsEmpty = (resParams[resParamsLen - 1] && resParams[resParamsLen - 1].key === "" && resParams[resParamsLen - 1].value === "");
                const headerLastItemIsEmpty = (headerParams[headerParamsLen - 1] && headerParams[headerParamsLen - 1].key === "" && headerParams[headerParamsLen - 1].value === "");
                if (reqParamsLen === 0 || !reqLastItemIsEmpty) this.request.requestParams.push(this.generateParams());
                if (resParamsLen === 0 || !resLastItemIsEmpty) this.request.responseParams.push(this.generateParams());
                if (headerParamsLen === 0 || !headerLastItemIsEmpty) this.request.header.push(this.generateParams());
                if (this.request.url.host === "") this.request.url.host = location.origin;
                this.request._description = res.data.item.description || "在这里输入文档描述";
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading2 = false;
            });
            
        },
        //接口不存在提醒用户，可能是同时操作的用户删掉了这个接口导致接口不存在
        confirmInvalidDoc() {
            this.$confirm("当前接口不存在，可能已经被删除!", "提示", {
                confirmButtonText: "关闭接口",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.commit("apidoc/deleteTabById", {
                    projectId: this.$route.query.id,
                    deleteIds: [this.currentSelectDoc._id]
                });
                if (!this.tabs.find(val => val._id === this.currentSelectDoc._id)) { //关闭左侧后若在tabs里面无法找到选中节点，则取第一个节点为选中节点
                    this.$store.commit("apidoc/changeCurrentTab", {
                        projectId: this.$route.query.id,
                        activeNode: this.tabs[this.tabs.length - 1],
                    });
                }
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        generateParams() {
            return {
                id: uuid(),
                key: "", //--------------请求头键
                value: "", //------------请求头值
                type: "string", //-------请求头值类型
                description: "", //------描述
                required: true, //-------是否必填
                children: [], //---------子参数
            };
        },
        //=====================================基础数据请求====================================//
        //获取host枚举值
        getHostEnum() {
            const params = {
                projectId: this.$route.query.id,
            };
            this.axios.get("/api/project/doc_service", { params }).then(res => {
                this.hostEnum = res.data;
            }).catch(err => {
                console.error(err);
            })
        },
        //=====================================请求url处理====================================//  
        //验证请求url格式是否正确
        checkUrlRule() {
            this.urlInvalid = false;
            if (this.request.url.path.trim() === "") { //为空不做处理
                this.urlInvalid = true;
                return;
            }
            if (this.request.methods === "get") { //只允许get请求将查询参数转换为请求参数
                this.convertQueryToParams();
            }
            this.request.url.path = "/" + this.request.url.path; //在首部添加/方式纯字符串被替换掉
            const whiteListReg = /[^0-9a-zA-Z./:&=?#-_]+/g; //有效的url字符串
            this.request.url.path = this.request.url.path.replace(whiteListReg, ""); //去除白名单以外的无效字符
            const pathReg = /(\/?https?:\/\/)?([a-zA-Z0-9.]+)?(:\d+)?/;
            const queryReg = /\?.*/;
            this.request.url.path = this.request.url.path.replace(pathReg, ""); //去除协议，域名，端口
            this.request.url.path = this.request.url.path.replace(queryReg, "");
            this.request.url.path = this.request.url.path.replace(/#/, ""); //去除#
            this.request.url.path = this.request.url.path.replace(/\/+\d+$/, ""); //去除末尾/3这类restful接口
            this.request.url.path = this.request.url.path.replace(/\/*/, ""); //去除前面多余的/
            const hostHasSlash = this.request.url.host.endsWith("/");
            const pathHasSlash = this.request.url.path.startsWith("/");
            if (hostHasSlash && !pathHasSlash) {
                return
            } else if (!hostHasSlash && pathHasSlash) {
                return
            } else if (!hostHasSlash && !pathHasSlash) {
                this.request.url.path = "/" + this.request.url.path;
            } else if (hostHasSlash && pathHasSlash) {
                this.request.url.path = this.request.url.path.slice(1);
            }
        },
        //将请求url后面查询参数转换为params
        convertQueryToParams() {
            let queryString = this.request.url.path.split("?") || "";
            queryString = queryString ? queryString[1] : "";
            const queryParams = qs.parse(queryString);
            for (const i in queryParams) {
                const reqParams = this.request.requestParams;
                if (!reqParams.find(val => val.key === i)) {
                    this.request.requestParams.unshift({
                        id: uuid(),
                        key: i, //--------------请求参数键
                        value: queryParams[i], //------------请求参数值
                        type: "string", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    })
                }
            }
            this.request.url.path = this.request.url.path.replace(/\?.*$/, "");
        },
        //改变请求方法
        handleChangeRequestMethods(val) {
            if (val === "get") { //get请求需要清空嵌套数据
                this.request.requestParams.forEach(params => {
                    params.children = [];
                })
                this.request.requestType = "query"; 
            } else if (val === "post") {
                if (this.request.requestType === "query" || this.request.requestType === "x-www-form-urlencoded") {
                    this.request.requestType = "json";
                }
            } else if (val === "put") {
                this.request.requestType = "json";
            } else if (val === "delete") {
                this.request.requestType = "json";
            }
        },
        //=====================================title编辑处理====================================//
        //改变title
        handleChangeTitle(e) {
            this.request.description = e.target.innerText
        },
        //改变blur
        handleTitleBlur(e) {
            if (this.request.description.trim() === "") {
                this.request.description = this.request._description;
                e.target.innerText = this.request.description;
            } else {
                this.request._description = e.target.innerText;
            }
        },
        //focus 全选title
        handleTitleFocus(e) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(e.target);
            selection.addRange(range);
        },
        //=====================================发送请求====================================//
        //发送请求
        sendRequest() {
            // console.log(JSON.parse(JSON.stringify(this.request)))
            const validParams = this.validateParams();
            if (!validParams) {
                this.$message.error("xxx");
            } else {
                this.loading3 = true;
                this.$refs["response"].sendRequest().finally(() => {
                    this.loading3 = false;
                });
            }
        },
        //=====================================保存接口====================================//
        saveRequest() {
            const validParams = this.validateParams();
            if (validParams) {
                const params = {
                    _id: this.currentSelectDoc._id,
                    projectId: this.$route.query.id,
                    item: {
                        requestType: this.request.requestType,
                        methods: this.request.methods,
                        url: {
                            host: this.request.url.host, 
                            path: this.request.url.path, 
                        },
                        requestParams: this.request.requestParams,
                        responseParams: this.request.responseParams,
                        header: this.request.header, 
                        description: this.request.description, 
                    }
                };
                this.loading = true;
                this.axios.post("/api/project/fill_doc", params).then(() => {
                    this.$store.commit("changeTabInfo", {
                        projectId: this.$route.query.id,
                        tabId: this.currentSelectDoc._id,
                        method: this.request.methods,
                    })
                }).catch(err => {
                    this.$errorThrow(err, this);
                }).finally(() => {
                    this.loading = false;
                }); 
            }
        },
        //=====================================其他操作=====================================//
        //检查参数是否完备
        validateParams() {
            let isValidRequest = true;
            if (this.request.url.path.trim() === "") { //请求url未填写
                this.urlInvalid = true;
                isValidRequest = false;
            }
            //=====================================检查参数是否必填或者按照规范填写====================================//
            dfsForest(this.request.responseParams, {
                rCondition(value) {
                    return value.children;
                },
                rKey: "children",
                hooks: (data, index, pData) => {
                    const isComplex = (data.type === "object" || data.type === "array");
                    if (pData.length - 1 === index) { //最后一个数据不做处理
                        return;
                    }
                    const p = findParentNode(data.id, this.request.responseParams);
                    const isParentArray = (p && p.type === "array");
                    if (!isParentArray && data.key.trim() === "") { //非空校验
                        this.$set(data, "_keyError", true);
                        isValidRequest = false;
                    } else if (!isParentArray && !data.key.match(/^[a-zA-Z0-9]*$/)) { //字母数据
                        this.$set(data, "_keyError", true);
                        isValidRequest = false;
                    }       
                    if (!isComplex && data.value.trim() === "") {
                        this.$set(data, "_valueError", true);
                        isValidRequest = false;
                    }
                    if (data.description.trim() === "") {
                        this.$set(data, "_descriptionError", true);
                        isValidRequest = false;
                    }
                }
            });
            dfsForest(this.request.requestParams, {
                rCondition(value) {
                    return value.children;
                },
                rKey: "children",
                hooks: (data, index, pData) => {
                    const isComplex = (data.type === "object" || data.type === "array");
                    if (pData.length - 1 === index) { //最后一个数据不做处理
                        return;
                    }
                    const p = findParentNode(data.id, this.request.requestParams);
                    const isParentArray = (p && p.type === "array");
                    if (!isParentArray && data.key.trim() === "") { //非空校验
                        this.$set(data, "_keyError", true);
                        isValidRequest = false;
                    } else if (!isParentArray && !data.key.match(/^[a-zA-Z0-9]*$/)) { //字母数据
                        this.$set(data, "_keyError", true);
                        isValidRequest = false;
                    }       
                    if (!isComplex && data.value.trim() === "") {
                        this.$set(data, "_valueError", true);
                        isValidRequest = false;
                    }
                    if (!data.description || data.description.trim() === "") {
                        this.$set(data, "_descriptionError", true);
                        isValidRequest = false;
                    }
                }
            });
            dfsForest(this.request.header, {
                rCondition(value) {
                    return value.children;
                },
                rKey: "children",
                hooks: (data, index, pData) => {
                    const isComplex = (data.type === "object" || data.type === "array");
                    if (pData.length - 1 === index) { //最后一个数据不做处理
                        return;
                    }
                    const p = findParentNode(data.id, this.request.header);
                    const isParentArray = (p && p.type === "array");
                    if (!isParentArray && data.key.trim() === "") { //非空校验
                        this.$set(data, "_keyError", true);
                        isValidRequest = false;
                        this.foldHeader = false;
                    }      
                    if (!isComplex && data.value.trim() === "") {
                        this.$set(data, "_valueError", true);
                        isValidRequest = false;
                        this.foldHeader = false;
                    }
                    if (!data.description || data.description.trim() === "") {
                        this.$set(data, "_descriptionError", true);
                        isValidRequest = false;
                        this.foldHeader = false;
                    }
                }
            });
            return isValidRequest;
        },
    }
};
</script>



<style lang="scss">
.edit-content {
    padding: size(10) size(20);
    .request {
        .request-input {
            display: flex;
            align-items: center;
            .el-select {
                width: 100px;
            }
        }
        .edit-title {
            padding: size(5) size(10);
            height: size(38);
            border: 1px solid transparent;
            &:hover {
                border: 1px dashed $gray-500;
            }        
        }
        .el-radio {
            margin-right: size(10);
        }
    }
    
}
</style>
