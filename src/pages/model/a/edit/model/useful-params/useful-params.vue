/*
    创建者：shuxiaokai
    创建时间：2019-11-21 16:40"
    模块名称：curd弹窗
    备注：xxxx
*/
<template>
    <el-dialog title="配置常用参数" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="70%">
        <div class="d-flex code-list">
            <!-- 新增数据 -->
            <div class="w-30">
                <el-divider content-position="left">添加自定义参数</el-divider>
                <el-form ref="form" :model="formInfo" :rules="rules" label-width="120px">
                    <el-form-item label="参数名称：" prop="label">
                        <el-input v-model="formInfo.label" name="name" size="mini" placeholder="复杂类型无参数" class="w-100" maxlength="100" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="参数值：" prop="value">
                        <el-input v-model="formInfo.value" :disabled="formInfo.dataType === 'array' || formInfo.dataType === 'object'" name="name" size="mini" placeholder="复杂类型无参数值" class="w-100" maxlength="100" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="参数类型：" prop="dataType">
                        <el-select v-model="formInfo.dataType" name="" placeholder="请选择类型" size="mini" class="w-100">
                            <el-option label="String" value="string"></el-option>
                            <el-option label="Number" value="number"></el-option>
                            <el-option label="Boolean" value="boolean"></el-option>
                            <el-option label="Object" value="object"></el-option>
                            <el-option label="List | Array" value="array"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否必填：" prop="required">
                        <el-checkbox v-model="formInfo.required" label="必填"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="参数描述:" prop="description">
                        <el-input v-model="formInfo.description" rows="3" type="textarea" show-word-limit name="name" size="mini" placeholder="请输入参数描述" class="w-100" maxlength="255" clearable></el-input>
                    </el-form-item>
                    <div class="d-flex j-end">
                        <el-button v-success="successLoading" :loading="loading2" type="primary" size="mini" @click="handleAddCode">确认添加</el-button>
                    </div>
                </el-form>                
            </div>
            <!-- 数据展示 -->
            <div class="ml-1 flex1">
                <el-divider content-position="left">数据展示</el-divider>
                <el-table v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" :data="tableInfo" stripe border size="mini" height="300px">
                    <el-table-column label="参数名称" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active">{{ scope.row.label }}</span>
                            <el-input v-show="scope.row._active" v-model="editingParams.label" size="mini" placeholder="请输入" maxlength="25" clearable @blur="handleBlurLabel(scope.row, editingParams.label)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数值" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active">{{ scope.row.value }}</span>
                            <el-input v-show="scope.row._active" v-model="scope.row.value" size="mini" placeholder="请输入" maxlength="25" clearable></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数类型" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active">{{ scope.row.dataType }}</span>
                            <el-select v-show="scope.row._active" v-model="scope.row.dataType" placeholder="请选择类型" size="mini" class="w-100">
                                <el-option label="String" value="string"></el-option>
                                <el-option label="Number" value="number"></el-option>
                                <el-option label="Boolean" value="boolean"></el-option>
                                <el-option label="Object" value="object"></el-option>
                                <el-option label="List | Array" value="array"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否必填" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active">{{ scope.row.required ? "是" : "否" }}</span>
                            <el-checkbox v-show="scope.row._active" v-model="scope.row.required" label="必填"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数描述" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active">{{ scope.row.description }}</span>
                            <el-input v-show="scope.row._active" v-model="scope.row.description" size="mini" placeholder="请输入" maxlength="25" clearable></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button v-show="!scope.row._active && !isEditing" type="text" size="mini" @click="editLine(scope.row)">编辑</el-button>
                            <el-button v-show="scope.row._active" type="text" size="mini" @click="handleSubmitEdit(scope.row)">确认</el-button>
                            <el-button v-show="scope.row._active" type="text" size="mini" @click="cancelEditCode(scope.row)">取消</el-button>
                            <el-button type="text" size="mini" @click="deleteTableData(scope.row._id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="d-flex j-end mt-1">
                    <el-pagination layout="total, sizes, prev, pager, next" :total="total" background :page-sizes="pageSizes" :page-size="formInfo.pageSize" :current-page="formInfo.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
                </div>                
            </div>
        </div>

    </el-dialog>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            //=====================================请求参数====================================//
            formInfo: {
                label: "", //-----------------参数中文含义
                value: "", //-----------------参数值
                dataType: "string", //--------------参数类型
                required: true, //-----------是否必填
                description: "", //-----------描述
            },
            //=====================================表格参数====================================//
            formInfo2: {
                pageNum: 1, //-------------------------------------------------------当前页数
                pageSize: this.$root.VUE_BASE_CONFIG.tableConfig.pageSize, //--------每页参数    
                startTime: "", //----------------------------------------------------起始日期
                endTime: "", //------------------------------------------------------结束日期         
            },
            total: 0, //-------------------------------------------------------------数据总数
            tableInfo: [], //--------------------------------------------------------表格数据
            pageSizes: this.$root.VUE_BASE_CONFIG.tableConfig.pageSizes, //----------每页条数数组
            editingParams: {}, //正在编辑的参数
            //=====================================验证参数====================================//
            rules: {
                label: [{ required: true, message: "请填写参数名称", trigger: "blur" }],
                dataType: [{ required: true, message: "请填写参数类型", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            loading: false, //======================表格加载效果
            loading2: false, //=====================添加按钮加载效果
            successLoading: false, //===============是否添加成功
            isEditing: false, //是否正在编辑
        };
    },
    watch: {
        "formInfo.dataType"(val) {
            if (val === "array" || val === "object") {
                this.formInfo.value = "";
            }
        }
    },
    created() {
        this.getData();
    },
    methods: {
        //=====================================表格相关====================================//
        /**
            @description  获取表格数据
            @author        shuxiaokai
            @create       2019-11-12 13:57"
        */
        getData() {
            this.loading = true;
            const params = {
                projectId: this.$route.query._id
            };
            this.axios.get("/api/project/docs_params", { params }).then(res => {
                this.tableInfo = res.data.rows;
                this.total = res.data.total;
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        // 分页
        handleSizeChange(size) {
            this.formInfo2.pageNum = 1;
            this.formInfo2.pageSize = size;
            this.getData();
        },
        // 改变页码
        handleCurrentChange(page) {
            this.formInfo2.pageNum = page;
            this.getData();
        },
        //=====================================前后端交互操作====================================//
        //新增表格数据
        handleAddCode() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading2 = true;
                    const params = {
                        ...this.formInfo,
                        projectId: this.$route.query._id
                    };
                    this.successLoading = false;
                    this.axios.post("/api/project/docs_params", params).then(() => {
                        this.successLoading = true;
                        this.getData();
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading2 = false;
                    });                    
                } 
            });
        },
        //删除表格数据
        deleteTableData(_id) {
            this.$confirm("此操作将永久删除此条记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                const params = {
                    ids: [_id]
                };
                this.axios.delete("/api/project/docs_params", { data: params }).then(() => {
                    this.getData();
                }).catch(err => {
                    this.$errorThrow(err, this);
                }).finally(() => {
                    this.loading = false;
                });
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        //修改表格数据
        handleSubmitEdit(row) {
            row._active = false;
            const params = row;
            this.axios.put("/api/project/docs_params", params).then(() => {
                
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //取消修改
        cancelEditCode(row) {
            row._active = false;
            this.isEditing = false;
        },
        //=====================================其他操作====================================//
        handleBlurLabel(row, label) {
            if (label.trim() !== "") {
                row.label = label;
            } 
            this.isEditing = false;
        },
        editLine(row) {
            this.$set(row, "_active", true);
            this.isEditing = true;
            this.editingParams = JSON.parse(JSON.stringify(row));
        },
        /* 
            @description  关闭弹窗
            @author        shuxiaokai
            @create       2019-10-19 22:39"
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>

