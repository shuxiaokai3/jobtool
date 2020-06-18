/*
    创建者：shuxiaokai
    创建时间：2019-10-20 20:14"
    模块名称：新增一个项目
*/
<template>
    <el-dialog title="新增项目" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
            <el-form-item label="项目名称：" label-width="150px" prop="projectName">
                <el-input v-model="formInfo.projectName" name="name" size="mini" placeholder="例如：xxx" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="项目类型：" prop="projectType">
                <el-select v-model="formInfo.projectType" size="mini" class="w-100" name="name" clearable filterable>
                    <el-option v-for="(item,index) in projectTypeEnum" :key="index" :value="item._id" :label="item.projectTypeName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddProject">确认添加</el-button>
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
                projectName: "", //------------------项目名称
                projectType: "", //------------------项目类型
                remark: "", //-----------------------项目备注
            },
            //=====================================枚举值======================================//
            projectTypeEnum: [], //项目类型枚举
            //=====================================验证参数====================================//
            rules: {
                projectName: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
                projectType: [{ required: true, message: "请选择项目类型", trigger: "change" }],
                remark: [{ required: true, message: "请填项目备注", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            loading: false
        };
    },
    created() {
        this.getProjectTypeEnum();
    },
    methods: {
        /* 
            @description  获取项目类型枚举
            @autor        shuxiaokai
            @create       2019-10-20 20:33"
            @params       null
            @return       null
        */
        getProjectTypeEnum() {
            this.axios.get("/api/project/project_type_enum").then(res => {
                this.projectTypeEnum = res.data;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================操作====================================//
        /* 
            @description  新增项目
            @autor        shuxiaokai
            @create       2019-10-20 20:14"
            @params       null
            @return       null
        */
        handleAddProject() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.axios.post("/api/project/add_project", this.formInfo).then(() => {
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
