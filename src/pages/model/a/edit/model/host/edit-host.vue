/*
    创建者：shuxiaokai
    创建时间：2019-10-28 10:26"
    模块名称：新增host
    备注：xxxx
*/
<template>
    <el-dialog title="编辑host" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
            <el-form-item label="服务器名称：" label-width="150px" prop="name">
                <el-input v-model="formInfo.name" name="name" size="mini" placeholder="例如：xxx" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="服务器地址：" label-width="150px" prop="url">
                <el-input v-model="url" name="name" size="mini" placeholder="域名不包含端口，ip地址必须包含端口" class="w-100" maxlength="100" clearable>
                    <el-select slot="prepend" v-model="protocol" placeholder="请选择" class="d-flex w-100px">
                        <el-option label="http://" value="http://"></el-option>
                        <el-option label="https://" value="https://"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="结果：">
                {{ protocol + url }}
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddHost">确认添加</el-button>
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
        id: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            //=====================================请求参数====================================//
            formInfo: {
                name: "", //-----------------服务器名称
                url: "", //------------------服务器地址
                remark: "", //---------------服务器备注
            },
            protocol: "http://", //协议
            url: "", //url
            //=====================================验证参数====================================//
            rules: {
                url: [{ required: true, message: "请填写服务器名称", trigger: "blur" }],
                name: [{ required: true, message: "请填写服务器地址", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            loading: false
        };
    },
    watch: {
        protocol() {
            this.formInfo.url = this.protocol + this.url;
        },
        url() {
            this.formInfo.url = this.protocol + this.url;
        },
        id: {
            handler() {
                this.getData();
            },
            immediate: true
        },
    },
    created() {

    },
    methods: {
        getData() {
            const params = {
                projectId: this.$route.query._id,
                id: this.id
            }
            this.axios.get("/api/project/doc_service_info", { params }).then(res => {
                this.formInfo = res.data;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        /* 
            @description  新增host
            @autor        shuxiaokai
            @create       2019-10-28 10:26"
            @params       null
            @return       null
        */
        handleAddHost() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const params = Object.assign({
                        projectId: this.$route.query._id
                    }, this.formInfo)
                    this.axios.post("/api/project/doc_service", params).then(() => {
                        this.$message.success("添加成功");
                        this.$emit("close");
                    }).catch(err => {
                        this.errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                    });                    
                } 
            });
        },
        /* 
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

</style>
