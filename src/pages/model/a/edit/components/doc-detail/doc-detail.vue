/*
    创建者：shuxiaokai
    创建时间：2019-09-11 18:05
    模块名称：文档编辑详情
    备注：xxxx
*/
<template>
    <el-form v-show="allTabs && allTabs.length > 0" ref="form" v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" :model="request" :rules="rules" class="doc-detail px-4" label-width="1px">
        <!-- 服务器和相关配置 -->
        <el-divider content-position="left">域名地址</el-divider>
        <div class="global-config d-flex a-center">
            <el-form-item label-width="1px">
                <el-radio-group v-model="request.url.host">
                    <el-radio v-for="(item, index) in hostEnum" :key="index" :label="item.url">{{ item.name }}</el-radio>
                </el-radio-group>                    
            </el-form-item>
            <div class="ml-auto">
                <el-button icon="el-icon-setting" size="mini" type="primary" @click="isShow = true;">新增域名</el-button>
                <el-button icon="el-icon-setting" size="mini" @click="isShow2 = true;">域名维护</el-button>
                <el-button icon="el-icon-attract" size="mini" @click="isShow5 = true;">请求注入</el-button>
            </div>
        </div>
        <!-- 请求url相关信息 -->
        <el-divider content-position="left">填写请求信息</el-divider> 
        <div class="request-wrap d-flex">
            <div class="w-100">
                <el-form-item prop="url.path">
                    <div class="d-flex w-100">
                        <el-input v-model="request.url.path" placeholder="请输入内容" @blur="checkUrlRule">
                            <div slot="prepend" class="request-input">
                                <el-select v-model="request.methods">
                                    <el-option value="get" label="get"></el-option>
                                    <el-option value="post" label="post"></el-option>
                                    <el-option value="put" label="put"></el-option>
                                    <el-option value="delete" label="delete"></el-option>
                                </el-select>
                            </div>
                        </el-input>                    
                        <el-popover placement="top-start" width="200" trigger="hover" content="为了统一请求格式，get请求参数放在url上面，其余请求全部以JSON形式放在body中">
                            <i slot="reference" class="el-icon-warning orange mx-2"></i>
                        </el-popover>
                    </div>                    
                </el-form-item>
                <pre v-if="request.url.host || request.url.path">{{ request.url.host }}{{ request.url.path }}</pre>
            </div>
        </div>
        <!-- 请求描述 -->
        <el-divider content-position="left">接口描述</el-divider>
        <div class="mt-3 mb-1">
            <el-form-item label-width="1px" prop="description">
                <el-input v-model="request.description" placeholder="一句话描述你的接口..."></el-input>
            </el-form-item>
        </div>
        <br>
        <el-divider content-position="left">请求体</el-divider>
        <!-- 请求参数 -->
        <s-doc-tree 
                title="请求参数"
                tree-type="request"
                :data="request.requestParams" 
                :saved-params="savedParamsEnum" 
                :preset-enum="presetParams.requestEnum" 
                :is-ready="isReady" 
                :plain="request.methods.toLowerCase() === 'get'"
                :methods="request.methods" 
                @close="getPresetParamsEnum">
        </s-doc-tree>
        <!-- 响应参数 -->
        <s-doc-tree 
                title="响应参数"
                tree-type="response"
                :data="request.responseParams" 
                :saved-params="savedParamsEnum" 
                :preset-enum="presetParams.responseEnum" 
                :is-ready="isReady" 
                :methods="request.methods" 
                @close="getPresetParamsEnum">
        </s-doc-tree>
        <!-- 请求头 -->
        <s-doc-tree 
                title="请求头"
                closed
                tree-type="header"
                :data="request.header" 
                :saved-params="savedParamsEnum" 
                :preset-enum="presetParams.headerEnum" 
                :is-ready="isReady" 
                :methods="request.methods" 
                @close="getPresetParamsEnum">
        </s-doc-tree>
        <el-divider content-position="left">操作</el-divider>
        <div class="d-flex center">
            <el-button :loading="loading2" size="small" type="success" @click="tempSaveProject">
                <span v-if="loading2">同步中</span>
                <span v-else>同步</span>
            </el-button>
            <el-button size="small" @click="isShow4 = true">状态码维护</el-button>
            <el-button :loading="loading3" size="small" @click="isShow3 = true">可用性测试</el-button>
        </div>
        <s-host-model v-if="isShow" :is-show="isShow" @close="isShow = false;getHostEnum();"></s-host-model>
        <s-host-list-model v-if="isShow2" :is-show="isShow2" @close="isShow2 = false;getHostEnum();"></s-host-list-model>
        <s-request-test-model v-if="isShow3" :is-show="isShow3" :data="request" @close="isShow3 = false;"></s-request-test-model>
        <s-code-list-model v-if="isShow4" :is-show="isShow4" @close="isShow4 = false;"></s-code-list-model>
        <s-request-inject-model v-if="isShow5" :is-show="isShow5" @close="isShow5 = false;"></s-request-inject-model>
    </el-form>
</template>

<script>
import uuid from "uuid/v4"
import axios from "axios" 
import docTree from "@/pages/model/a/edit/components/doc-tree/doc-tree"
import hostModel from "@/pages/model/a/edit/model/host/host"
import hostListModel from "@/pages/model/a/edit/model/host-list/host-list"
import requestTestModel from "@/pages/model/a/edit/model/request-test/request-test"
import codeListModel from "@/pages/model/a/edit/model/code-list/code-list"
import requestInject from "@/pages/model/a/edit/model/request-inject/request-inject"
import { forEachForest } from "@/lib/utils"
import qs from "qs"
const CancelToken = axios.CancelToken;
export default {
    components: {
        "s-doc-tree": docTree,
        "s-host-model": hostModel,
        "s-host-list-model": hostListModel,
        "s-request-test-model": requestTestModel,
        "s-code-list-model": codeListModel,
        "s-request-inject-model": requestInject,
    },
    data() {
        return {
            //=====================================请求基本信息====================================//
            request: {
                methods: "get", //---------------请求方式
                url: {
                    host: "", //-----------------主机(服务器)地址
                    path: "", //-----------------接口路径
                }, //----------------------------请求地址信息
                requestParams: [
                    {
                        key: "", //--------------请求参数键
                        value: "", //------------请求参数值
                        type: "", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ],
                responseParams: [
                    {
                        key: "", //--------------请求参数键
                        value: "", //------------请求参数值
                        type: "", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ],
                header: [
                    {
                        key: "", //--------------请求头键
                        value: "", //------------请求头值
                        type: "string", //-------请求头值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ], //----------------------------请求头信息
                description: "", //--------------请求描述
            },
            //=====================================数据校验====================================//
            rules: {
                "url.path": [{ required: true, message: "请填写请求路径", trigger: "blur" }],
                "description": [{ required: true, message: "请描述你的接口", trigger: "blur" }]
            },
            //=====================================枚举参数====================================//
            hostEnum: [], //服务器参数列表
            savedParamsEnum: [], //已保存参数枚举
            //=========================================================================//
            presetParams: {
                headerEnum: [],
                requestEnum: [],
                responseEnum: [],
            }, //参数组枚举
            //=====================================其他参数====================================//
            debounceFn: null, //去抖函数
            cancel: [], //取消请求
            isReady: false, //是否请求数据完成
            isShow: false, //新增服务器弹窗
            isShow2: false, //服务器维护
            isShow3: false, //连通性测试
            isShow4: false, //错误状态码
            isShow5: false, //请求注入
            loading: false, //获取文档详情加载
            loading2: false, //新增文档加载
            loading3: false, //可用性测试加载
        };
    },
    computed: {
        allTabs() {
            return this.$store.state.tabs.tabs[this.$route.query._id]
        },
        currentFileTab() {
            if (this.$store.state.tabs.currentFileTab) {
                return this.$store.state.tabs.currentFileTab[this.$route.query._id];
            } else {
                return null;
            }
        }
    },
    watch: {
        "$store.state.tabs.currentFileTab": {
            handler() {
                //临时保存修改参数不应该请求数据
                if (!this.loading2) {
                    this.getData();
                }
            },
            deep: true
        },
        request: {
            handler(val) {
                if (this.loading) {//切换文档导致的文档详情变化不应该被监听，否则会导致文档被覆盖
                    return;
                }
                console.time("本地存储时间");
                let tempSaveDocs = sessionStorage.getItem("tempSaveDocs") || "[]";
                tempSaveDocs = JSON.parse(tempSaveDocs)
                const currentDocs = tempSaveDocs.find(val => val.id === this.currentFileTab.id);
                if (currentDocs) {
                    currentDocs.docs = val;
                } else {
                    tempSaveDocs.push({
                        id: this.currentFileTab.id,
                        projectId: this.$route.query._id,
                        updateTime: Date.now(),
                        updateLocal: new Date().toLocaleDateString() + new Date().toLocaleTimeString(),
                        docs: val                        
                    });
                }
                sessionStorage.setItem("tempSaveDocs", JSON.stringify(tempSaveDocs))
                console.timeEnd("本地存储时间");
                if (!this.debounceFn) {
                    this.debounceFn = this.$utils.debounce(this.tempSaveProject, 2000);
                    this.debounceFn();
                } else {
                    this.debounceFn();
                }
            },
            deep: true
        },
    },
    mounted() {
        this.getPresetParamsEnum(); //获取参数组枚举
        this.getParamsEnum(); //获取自定义参数枚举
    },
    methods: {
        //=====================================获取数据====================================//
        /** 
         * @description        获取文档详细数据
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2020-01-15 13:29
         * @update             2020-01-15 13:29
         */
        getData() {
            if (!this.currentFileTab) {
                return;
            }
            const params = {
                _id: this.currentFileTab.id
            };
            if (this.cancel.length > 0) {
                this.cancel.forEach(c => {
                    c();
                })
            }
            this.loading = true;
            this.isReady = false;
            this.axios.get("/api/project/doc_detail", {
                params,
                cancelToken: new CancelToken((c) => {
                    this.cancel.push(c);
                })
            }).then(res => {
                Object.assign(this.request, res.data.item);
                forEachForest(this.request.responseParams, (val) => {
                    if (val.children && val.children.length > 0) {
                        val.children.push({
                            id: uuid(),
                            key: "",
                            value: "",
                            description: "",
                            type: "",
                            required: true
                        });
                    }
                })
                this.request.description = this.currentFileTab.title;
                this.getHostEnum(); //获取host枚举
                this.isReady = true;
                this.checkResponseData();
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        /** 
         * @description        是否使用缓存
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-04 08:56
         * @update             2019-12-04 08:56
         */
        couldUseRemote(time) {
            const remoteTime = new Date(time).getTime();
            let tempSaveDocs = sessionStorage.getItem("tempSaveDocs") || "[]";
            tempSaveDocs = JSON.parse(tempSaveDocs);
            const localDoc = tempSaveDocs.find(val => val.id === this.currentFileTab.id);
            if (localDoc && localDoc.updateTime < remoteTime) {
                return true;
            } else if (localDoc && localDoc.updateTime >= remoteTime) {
                return false;
            } else {
                return true;
            }
        },
        /** 
        * @description        获取参数组枚举信息
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2020-01-15 13:27
        * @update             2020-01-15 13:27
        */
        getPresetParamsEnum() {
            const params = { 
                projectId: this.$route.query._id
            };
            this.axios.get("/api/project/doc_preset_params_enum", { params }).then(res => {
                this.presetParams.headerEnum = res.data.filter(val => val.presetParamsType === "header");
                this.presetParams.requestEnum = res.data.filter(val => val.presetParamsType === "request");
                this.presetParams.responseEnum = res.data.filter(val => val.presetParamsType === "response");
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================获取枚举数据====================================//
        /** 
        * @description        获取host枚举
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2020-01-15 13:17
        * @update             2020-01-15 13:17
        */
        getHostEnum() {
            const params = {
                projectId: this.$route.query._id
            };
            this.axios.get("/api/project/doc_service", { params }).then(res => {
                if (res.data.length === 0) {
                    this.hostEnum = [{ url: "http://127.0.0.1:7001", name: "示例地址" }];
                } else {
                    this.hostEnum = res.data;
                }
                
                if (!this.request.url.host) {
                    this.request.url.host = this.hostEnum[0] ? this.hostEnum[0].url : "";
                }
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        /** 
         * @description        获取用户自定义请求参数信息
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-11-22 17:52
         * @update             2019-11-22 17:52
         */
        getParamsEnum() {
            const params = {
                projectId: this.$route.query._id
            };
            this.axios.get("/api/project/docs_params", { params }).then(res => {
                this.savedParamsEnum = res.data.rows;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================辅助操作====================================//
        /** 
         * @description        去除无效参数
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2020-01-15 13:27
         * @update             2020-01-15 13:27
         */
        filterParams(params) {
            const result = [];
            if (!Array.isArray(params)) {
                throw new Error("校验参数必须为数组类型");
            }
            const foo = (params, result) => {
                for (let i = 0; i < params.length; i++) {
                    if (!params[i].key && !params[i].description && !params[i].type && !params[i].value) {
                        continue;
                    } else {
                        const data = JSON.parse(JSON.stringify(params[i]));
                        delete data.children;
                        this.$set(data, "children", [])
                        data.children = [];
                        result.push(data);
                        if (params[i].children && params[i].children.length > 0) {
                            foo(params[i].children, result[result.length - 1].children);
                        }                        
                    }
                }                
            }
            foo(JSON.parse(JSON.stringify(params)), result);
            return result;
        },
        /** 
            @description  验证返回值，将某些空数组值修改为有数据
            @autor        shuxiaokai
            @create       2019-10-29 13:50"
            @params       
            @return       null
        */
        checkResponseData() {
            const paramsInterface = {
                key: "", //--------------请求参数键
                value: "", //------------请求参数值
                type: "", //-------------请求参数值类型
                description: "", //------描述
                required: true, //-------是否必填
                children: [], //---------子参数
            }
            if (this.request.requestParams.length === 0) {
                this.request.requestParams.push(JSON.parse(JSON.stringify(paramsInterface))); 
            }
            if (this.request.responseParams.length === 0) {
                this.request.responseParams.push(JSON.parse(JSON.stringify(paramsInterface)));
            }
            if (this.request.header.length === 0) {
                this.request.header.push(JSON.parse(JSON.stringify(paramsInterface)));
            }
        },
        /** 
         * @description        验证请求url格式是否正确
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-02 16:29
         * @update             2019-12-02 16:29
         */
        checkUrlRule() {
            const hostHasSlash = this.request.url.host.endsWith("/");
            const pathHasSlash = this.request.url.path.startsWith("/");
            this.convertQueryToParams();

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
        //=====================================提交操作====================================//
        /** 
        * @description        发布文档
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2020-01-15 13:27
        * @update             2020-01-15 13:27
        * @param {any}        variable - 任意类型变量       
        * @param {String=}    [name=xxx] - 任意类型变量       
        * @param {Number}     age - 数字类型       
        * @return {String}    返回字符串
        */
        tempSaveProject() {
            const params = {
                _id: this.currentFileTab.id,
                projectId: this.$route.query._id,
                item: {
                    methods: this.request.methods,
                    url: {
                        host: this.request.url.host, //-----------------主机(服务器)地址
                        path: this.request.url.path, //-----------------接口路径
                    }, //----------------------------请求地址信息
                    requestParams: this.filterParams(this.request.requestParams),
                    responseParams: this.filterParams(this.request.responseParams),
                    header: this.filterParams(this.request.header), 
                    description: this.request.description, //--------------请求描述
                }
            };
            this.loading2 = true;
            this.axios.post("/api/project/fill_doc", params).then(() => {
                this.$store.commit("changeTabInfo", {
                    projectId: this.$route.query._id,
                    tabId: this.currentFileTab.id,
                    method: this.request.methods,
                })
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading2 = false;
            });  
        },
        /* 
            @description  连通性测试
            @autor        shuxiaokai
            @create       2019-10-29 13:10"
            @params       
            @return       null
        */
        submitValidTest() {
          
        },
    }
};
</script>



<style lang="scss">
    .doc-detail  {
        .el-collapse-item__header {
            background: $gray-100;
        }
    }
    .request-input {
        display: flex;
        align-items: center;
        height: 100%;
        .el-select {
            width: 100px;
        }
    }
    .params {
        .el-tree-node__content {
            height: 50px;
        }
        .el-tree-node__content:hover {
            background: #fff;
        }
        .el-input__inner {
            border-radius: 0;
            border: none;
            border-bottom: 1px solid $gray-200;
        }
        .custom-tree-node {
            width: 100%;
        }
    }
    .manage-params {
        width: 220px;
        height: 40px;
        background: $gray-200;
    }
</style>
