/**
    创建者：shuxiaokai
    创建时间：2020-01-15 13:31"
    模块名称：restful模板curd弹窗
    备注：xxxx
*/
<template>
    <el-dialog title="新增restful模板" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="80%">
        <div class="restful-body">
            <el-form ref="form" :model="formInfo" :rules="rules" label-width="100px">
                <el-form-item label="模板名称：" prop="name">
                    <el-input v-model="formInfo.name" name="name" size="mini" placeholder="请输入模板名称" class="w-30" maxlength="100" clearable></el-input>
                </el-form-item>
            </el-form>
            <s-collapse title="GET请求">
                <el-divider content-position="left">请求头</el-divider>
                <s-tree :data="formInfo.getParams.header"></s-tree>
                <el-divider content-position="left">请求参数</el-divider>
                <s-tree :data="formInfo.getParams.requestParams"></s-tree>
                <el-divider content-position="left">返回参数</el-divider>
                <s-tree :data="formInfo.getParams.responseParams"></s-tree>
            </s-collapse>
            <s-collapse title="POST请求">
                <el-divider content-position="left">请求头</el-divider>
                <s-tree :data="formInfo.postParams.header"></s-tree>
                <el-divider content-position="left">请求参数</el-divider>
                <s-tree :data="formInfo.postParams.requestParams"></s-tree>
                <el-divider content-position="left">返回参数</el-divider>
                <s-tree :data="formInfo.postParams.responseParams"></s-tree>
            </s-collapse>
            <s-collapse title="PUT请求">
                <el-divider content-position="left">请求头</el-divider>
                <s-tree :data="formInfo.putParams.header"></s-tree>
                <el-divider content-position="left">请求参数</el-divider>
                <s-tree :data="formInfo.putParams.requestParams"></s-tree>
                <el-divider content-position="left">返回参数</el-divider>
                <s-tree :data="formInfo.putParams.responseParams"></s-tree>
            </s-collapse>
            <s-collapse title="DELETE请求">
                <el-divider content-position="left">请求头</el-divider>
                <s-tree :data="formInfo.delParams.header"></s-tree>
                <el-divider content-position="left">请求参数</el-divider>
                <s-tree :data="formInfo.delParams.requestParams"></s-tree>
                <el-divider content-position="left">返回参数</el-divider>
                <s-tree :data="formInfo.delParams.responseParams"></s-tree>
            </s-collapse>
        </div>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddRestfulTemplate">确认添加</el-button>
            <el-button type="danger" size="mini" @click="closeModel">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean
        },
    },
    data() {
        return {
            //=====================================请求参数====================================//
            formInfo: {
                name: "", //--------------------------名称
                projectId: this.$route.query._id, //--项目id
                getParams: {
                    header: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //------------------------header参数
                    requestParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //-----------------请求参数
                    responseParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //----------------返回参数                    
                },
                postParams: {
                    header: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //------------------------header参数
                    requestParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //-----------------请求参数
                    responseParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //----------------返回参数                    
                },
                putParams: {
                    header: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //------------------------header参数
                    requestParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //-----------------请求参数
                    responseParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //----------------返回参数                    
                },
                delParams: {
                    header: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //------------------------header参数
                    requestParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //-----------------请求参数
                    responseParams: [{
                        id: "-1",
                        key: "",
                        value: "",
                        description: "",
                        type: "",
                        required: true
                    }], //----------------返回参数                    
                },
            },
            //=====================================验证参数====================================//
            rules: {
                name: [{ required: true, message: "请填写模板名称", trigger: "blur" }]
            },
            //=====================================其他参数====================================//
            activeName: "s-e",
            loading: false,
        };
    },
    created() {
        
    },
    methods: {
        /** 
            @description  添加restful模板
            @autor        shuxiaokai
            @create       2020-02-01 20:48"
            @params       null
            @return       null
        */
        handleAddRestfulTemplate() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const params = {
                        name: this.formInfo.name,
                        projectId: this.$route.query._id,
                        getParams: {
                            header: this.filterParams(this.formInfo.getParams.header),
                            requestParams: this.filterParams(this.formInfo.getParams.requestParams),
                            responseParams: this.filterParams(this.formInfo.getParams.responseParams),
                        },
                        postParams: {
                            header: this.filterParams(this.formInfo.postParams.header),
                            requestParams: this.filterParams(this.formInfo.postParams.requestParams),
                            responseParams: this.filterParams(this.formInfo.postParams.responseParams),
                        },
                        putParams: {
                            header: this.filterParams(this.formInfo.putParams.header),
                            requestParams: this.filterParams(this.formInfo.putParams.requestParams),
                            responseParams: this.filterParams(this.formInfo.putParams.responseParams),
                        },
                        delParams: {
                            header: this.filterParams(this.formInfo.delParams.header),
                            requestParams: this.filterParams(this.formInfo.delParams.requestParams),
                            responseParams: this.filterParams(this.formInfo.delParams.responseParams),
                        },
                    };
                    this.axios.post("/api/doc/restful_template", params).then(() => {
                        this.$message.success("添加成功");
                        this.$emit("close");
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                    });                    
                } 
            });
        },
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
            @description  关闭弹窗
            @autor        shuxiaokai
            @create       2019-10-19 22:39"
            @params       null
            @return       null
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>

<style lang="scss">
    .restful-body {
        height: 50vh;
        min-height: 350px;
        overflow: auto;
    }
</style>
