/*
    创建者：shuxiaokai
    创建时间：2020-07-06 17:57
    模块名称：文档书写区域区域
    备注：xxxx
*/
<template>
    <div class="edit-content">
        <!-- 请求区域 -->
        <div class="request mb-5">
            <!-- 接口描述 -->
            <div class="edit-title w-50 f-bg mb-2" contenteditable @input="handleChangeTitle($event)" @blur="handleTitleBlur($event)">{{ request._description }}</div>
            <div class="config w-50">
                <div class="d-flex mb-2">
                    <el-input v-model="request.url.path" placeholder="只需要输入接口地址，前面不需要加域名，加了会被忽略" size="small" @blur="checkUrlRule" @keyup.enter.native="checkUrlRule">
                        <div slot="prepend" class="request-input">
                            <el-select v-model="request.methods">
                                <el-option value="get" label="get"></el-option>
                                <el-option value="post" label="post"></el-option>
                                <el-option value="put" label="put"></el-option>
                                <el-option value="delete" label="delete"></el-option>
                            </el-select>
                        </div>
                    </el-input> 
                    <el-button type="success" size="small" @click="sendRequest">发送请求</el-button>
                </div>
            </div>
            <div class="result">
            </div>
        </div>
        <s-params-tree :tree-data="request.requestParams" title="请求参数" plain></s-params-tree>
        <s-params-tree :tree-data="request.responseParams" title="响应参数"></s-params-tree>
        <s-params-tree :tree-data="request.header" title="请求头" plain fold></s-params-tree>
    </div>
</template>

<script>
import paramsTree from "./components/params-tree"
import uuid from "uuid/v4"
import qs from "qs"
export default {
    components: {
        "s-params-tree": paramsTree
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
                        type: "string", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ],
                responseParams: [
                    {
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
        };
    },
    created() {

    },
    methods: {
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
        }
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.edit-content {
    padding: size(20);
    .request {
        // display: flex;
        width: 80%;
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
    }
}
</style>
