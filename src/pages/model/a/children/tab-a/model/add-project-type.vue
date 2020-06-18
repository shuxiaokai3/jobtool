/*
    创建者：shuxiaokai
    创建时间：2019-10-19 22:15
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="新增项目类型" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
            <el-form-item label="类型名称：" label-width="150px" prop="projectTypeName">
                <el-input v-model="formInfo.projectTypeName" name="name" size="mini" placeholder="例如：业务系统" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddProjectType">确认添加</el-button>
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
                projectTypeName: "", //---------项目类型名称
                remark: "", //------------------项目类型备注
            },
            //=====================================验证参数====================================//
            rules: {
                projectTypeName: [{ required: true, message: "请填写类型名称", trigger: "blur" }]
            },
            //=====================================其他参数====================================//
            loading: false
        };
    },
    created() {

    },
    methods: {
        /* 
            @description  添加项目类型
            @autor        shuxiaokai
            @create       2019-10-19 22:34"
            @params       null
            @return       null
        */
        handleAddProjectType() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.axios.post("/api/project/add_project_type", this.formInfo).then(res => {
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
