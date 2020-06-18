/*
    创建者：shuxiaokai
    创建时间：2019-11-27 16:42"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="请求注入(用于获取权限凭证)" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
            <el-form-item label="变量名称：" label-width="150px" prop="aaa">
                <el-input v-model="formInfo.aaa" name="name" size="mini" placeholder="例如：token" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="请求地址：" label-width="150px" prop="aaa">
                <el-input v-model="formInfo.aaa" name="name" size="mini" placeholder="例如：xxx" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="请求参数：" label-width="150px" prop="aaa">
                <el-input v-model="formInfo.aaa" name="name" size="mini" placeholder="例如：xxx" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="formInfo.bbb" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddRequestInject">确认添加</el-button>
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
                name: "", //------------------项目类型名称
                url: "", //------------------项目类型备注
            },
            //=====================================验证参数====================================//
            rules: {
                aaa: [{ required: true, message: "请填写类型名称", trigger: "blur" }]
            },
            //=====================================其他参数====================================//
            loading: false
        };
    },
    created() {

    },
    methods: {
        /* 
            @description  接口注入
            @autor        shuxiaokai
            @create       2019-11-27 16:42"
            @params       null
            @return       null
        */
        handleAddRequestInject() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    // this.axios.post("xxx", this.formInfo).then(res => {
                    //     this.$message.success("添加成功");
                    //     this.$emit("close");
                    // }).catch(err => {
                    //     this.$errorThrow(err, this);
                    // }).finally(() => {
                    //     this.loading = false;
                    // });                    
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
