/*
    创建者：shuxiaokai
    创建时间：2020-07-06 17:57
    模块名称：文档书写区域区域
    备注：xxxx
*/
<template>
    <div class="content">
        <!-- 请求区域 -->
        <div class="request mb-5">
            <div class="config w-50">
                <div class="d-flex mb-2">
                    <el-input v-model="request.url.path" placeholder="请输入内容" size="small" @blur="checkUrlRule">
                        <div slot="prepend" class="request-input">
                            <el-select v-model="request.methods">
                                <el-option value="get" label="get"></el-option>
                                <el-option value="post" label="post"></el-option>
                                <el-option value="put" label="put"></el-option>
                                <el-option value="delete" label="delete"></el-option>
                            </el-select>
                        </div>
                    </el-input> 
                    <el-button type="success" size="small">发送请求</el-button>
                </div>
                <div class="d-flex a-center">
                    <span class="flex0">接口描述：</span>
                    <el-input v-model="request.description" size="small" placeholder="请输入接口描述" class="w-100" maxlength="255" clearable></el-input>
                </div>
                <div>
                    
                </div>
            </div>
            <div class="result">
            </div>
        </div>
        <s-params-tree :tree-data="request.requestParams"></s-params-tree>
    </div>
</template>

<script>
import paramsTree from "./components/params-tree"
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
        };
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        //验证请求url格式是否正确
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
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.content {
    padding: size(20);
    .request {
        display: flex;
        width: 80%;
        .request-input {
            display: flex;
            align-items: center;
            height: 100%;
            .el-select {
                width: 100px;
            }
        }
        .config {}
    }
}
</style>
