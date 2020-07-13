/*
    创建者：shuxiaokai
    创建时间：2020-07-06 17:57
    模块名称：文档书写区域区域
    备注：xxxx
*/
<template>
    <div class="edit-content d-flex">
        <div class="border-right-teal w-65">
            <!-- 基本配置 -->
            <div class="request mb-2">
                <div class="edit-title w-100 f-bg mb-2" contenteditable @input="handleChangeTitle($event)" @blur="handleTitleBlur($event)">{{ request._description }}</div>
                <div class="mb-2">
                    <el-radio-group v-model="request.url.host" size="mini">
                        <el-popover placement="top-start" trigger="hover" :close-delay="0" content="http://127.0.0.1:7004">
                            <el-radio slot="reference" label="http://127.0.0.1:7004" border>本地</el-radio>
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
                        <el-button type="success" size="small" @click="sendRequest">发送请求</el-button>
                    </div>
                </div>                
                <pre class="w-100">{{ request.url.host }}{{ request.url.path }}</pre>
            </div>
            <!-- 请求参数 -->
            <div>
                <s-params-tree :tree-data="request.requestParams" title="请求参数" :plain="request.methods === 'get'"></s-params-tree>
                <s-params-tree :tree-data="request.responseParams" title="响应参数"></s-params-tree>
                <s-params-tree :tree-data="request.header" title="请求头" plain fold></s-params-tree>            
            </div>            
        </div>
        <div class="w-35 flex1">
            <s-response :request-data="request"></s-response>
        </div>
        <s-host-manage v-if="dialogVisible" :visible.sync="dialogVisible" @close="getHostEnum"></s-host-manage>
    </div>
</template>

<script>
import paramsTree from "./components/params-tree"
import response from "./components/response"
import hostManage from "./dialog/host-manage"
import { dfsForest, findParentNode } from "@/lib/utils"
import uuid from "uuid/v4"
import qs from "qs"
export default {
    components: {
        "s-params-tree": paramsTree,
        "s-host-manage": hostManage,
        "s-response": response,
    },
    data() {
        return {
            //=====================================请求基本信息====================================//
            request: {
                methods: "get", //---------------请求方式
                url: {
                    host: "http://127.0.0.1:7004", //-----------------主机(服务器)地址
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
                _description: "在这里输入文档描述", //-------------请求描述拷贝
            },
            //=====================================域名相关====================================//
            hostEnum: [], //---------------------域名列表
            dialogVisible: false, //-------------域名维护弹窗
            //=====================================其他参数====================================//
        };
    },
    created() {
        this.getHostEnum(); //获取host枚举值
    },
    methods: {
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
            if (this.request.url.path.trim() === "") { //为空不做处理
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
        //=====================================发送请求====================================//
        //发送请求
        sendRequest() {
            console.log(JSON.parse(JSON.stringify(this.request)))
            const validParams = this.validateParams();
            if (!validParams) {
                this.$message.error("xxx");
            }
        },
        //检查参数是否完备
        validateParams() {
            let isValidRequest = true;
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
                    // console.log(data, pData, 9999)
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
            return isValidRequest;
        },
        //=====================================其他操作=====================================//

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
