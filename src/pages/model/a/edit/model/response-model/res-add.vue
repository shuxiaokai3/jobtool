/*
    创建者：shuxiaokai
    创建时间：2019-11-06 22:44"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="新增参数组" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="60%">
        <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
            <el-form-item label="参数组名称：" prop="name">
                <el-input v-model="formInfo.name" name="name" size="mini" placeholder="参数组名称" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="参数组备注" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <div>
                <s-tree :data="formInfo.items" :plain="plain"></s-tree>
            </div>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddPresetParams">确认添加</el-button>
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
        type: {
            type: String,
            default: ""
        },
        plain: { //树形菜单是否允许存在children
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            //=====================================请求参数====================================//
            formInfo: {
                items: [{
                    id: "-1",
                    key: "",
                    value: "",
                    description: "",
                    type: "",
                    required: true
                }], //参数组详情
                name: "", //参数组名称
                remark: "", //参数组备注
                presetParamsType: this.type,
            },
            //=====================================验证参数====================================//
            rules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
                remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            loading: false
        };
    },
    created() {

    },
    methods: {
        /* 
            @description  新增参数组名称
            @author        shuxiaokai
            @create       2019-11-06 22:44"
            @params       null
            @return       null
        */
        handleAddPresetParams() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const params = {
                        items: this.formInfo.items.filter(val => val.key && val.description && val.type && val.value), //参数组详情
                        name: this.formInfo.name, //参数组名称
                        remark: this.formInfo.remark, //参数组备注
                        presetParamsType: this.type,
                        projectId: this.$route.query._id
                    };
                    this.loading = true;
                    this.axios.post("/api/project/doc_preset_params", params).then(() => {
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
            @author        shuxiaokai
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
