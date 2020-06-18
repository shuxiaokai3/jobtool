/*
    创建者：shuxiaokai
    创建时间：2019-10-20 20:55"
    模块名称：类型维护
    备注：xxxx
*/
<template>
    <s-curd-model v-if="isShow" title="项目类型维护" @close="$emit('close')">
        <!-- 新增数据 -->
        <template slot="left">
            <div class="d-flex j-between flex-column h-100">
                <el-form ref="form" :model="formInfo" :rules="rules" label-width="100px" class="pr-2">
                    <el-form-item label="类型名称：" prop="projectTypeName">
                        <el-input v-model="formInfo.projectTypeName" name="name" size="mini" placeholder="例如：业务系统" class="w-100" maxlength="100" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div class="d-flex j-end">
                    <el-button size="mini" type="success" :loading="loading2" @click="handleAddProjectType">确认添加</el-button>
                </div>
            </div>
        </template>
        <!-- 展示与修改数据 -->
        <div slot="right" v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)">
            <el-table :data="tableInfo" stripe border size="mini" height="400px">
                <el-table-column prop="projectTypeName" label="类型名称" align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.__active" v-model="scope.row.projectTypeName" size="mini" class="w-100" maxlength="100" clearable></el-input>
                        <span v-else>{{ scope.row.projectTypeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.__active" v-model="scope.row.remark" size="mini" class="w-100" maxlength="100" clearable></el-input>
                        <span v-else>{{ scope.row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" align="center">
                    <template slot-scope="scope">
                        {{ new Date(scope.row.createdAt).toLocaleDateString() }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-show="!scope.row.__active && !isEditing" type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-show="scope.row.__active" type="text" size="mini" @click="handleSubmitEdit(scope.row)">确认</el-button>
                        <el-button v-show="scope.row.__active" type="text" size="mini" @click="handleCancelEdit(scope.row)">取消</el-button>
                        <el-button type="text" @click="handleDeleteProjectType(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="d-flex justify-end mt-1">
                <el-pagination layout="total, sizes, prev, pager, next" :total="total" background :page-sizes="pageSizes" :page-size="formInfo2.pageSize" :current-page="formInfo2.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
    </s-curd-model>
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
            //=====================================新增数据参数====================================//
            formInfo: {
                projectTypeName: "", //---------项目类型名称
                remark: "", //------------------项目类型备注
            },
            //=====================================验证参数====================================//
            rules: {
                projectTypeName: [{ required: true, message: "请填写类型名称", trigger: "blur" }]
            },
            //=====================================表格参数====================================//
            formInfo2: {
                pageNum: 1, //------------------------------------------------------当前页数
                pageSize: this.$root.VUE_BASE_CONFIG.tableConfig.pageSize, //--------每页参数    
                startTime: "", //----------------------------------------------------起始日期
                endTime: "", //------------------------------------------------------结束日期         
            },
            total: 0, //------------------------------------------------------------数据总数
            tableInfo: [], //--------------------------------------------------------表格数据
            pageSizes: this.$root.VUE_BASE_CONFIG.tableConfig.pageSizes, //----------每页条数数组
            //=====================================修改数据====================================//
            oldEditingData: {}, //上一次编辑的数据
            //=====================================其他参数====================================//
            loading: false, //项目列表加载 
            loading2: false, // 添加按钮加载
            isEditing: false, //是否正在编辑
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //=====================================新增====================================//
        /** 
         * @description        添加项目类型
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-30 10:44
         * @update             2019-12-30 10:44
         */
        handleAddProjectType() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading2 = true;
                    this.loading = true;
                    this.axios.post("/api/project/add_project_type", this.formInfo).then(() => {
                        this.getData();
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                        this.loading2 = false;
                    });                    
                } 
            });
        },
        //=====================================查看(表格相关)====================================//
        /** 
         * @description        获取项目列表
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-30 10:42
         * @update             2019-12-30 10:42
         */
        getData() {
            this.loading = true;
            this.axios.get("/api/project/project_type_list").then(res => {
                this.tableInfo = res.data.rows;
                this.total = res.data.total;
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        //分页
        handleSizeChange(size) {
            this.formInfo2.pageNum = 1;
            this.formInfo2.pageSize = size;
            this.getData();
        },
        handleCurrentChange(page) {
            this.formInfo2.pageNum = page;
            this.getData();
        },
        //=====================================修改====================================//
        /** 
         * @description        让当前行处于修改状态
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-30 13:21
         * @update             2019-12-30 13:21
         */
        handleEdit(row) {
            this.$set(row, "__active", true);
            this.isEditing = true;
            this.oldEditingData = JSON.parse(JSON.stringify(row));
        },
        /** 
         * @description        确认修改当前行
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-30 13:21
         * @update             2019-12-30 13:21
         */
        handleSubmitEdit(row) {
            row.__active = false;
            const params = row;
            this.axios.put("/api/project/project_type", params).then(() => {
                this.$message.success("修改成功");
                this.isEditing = false;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        /** 
         * @description        取消修改
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-30 13:22
         * @update             2019-12-30 13:22
         */
        handleCancelEdit(row) {
            Object.assign(row, this.oldEditingData)
            row.__active = false;
            this.isEditing = false;
        },
        //=====================================删除====================================//
        /** 
        * @description        删除一个项目类型
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2019-12-30 10:42
        * @update             2019-12-30 10:42
        */
        handleDeleteProjectType(_id) {
            this.$confirm("此操作将永久删除该类型, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("/api/project/project_type", { data: { ids: [_id] }}).then(() => {
                    this.$message.success("删除成功");
                    this.getData();
                }).catch(err => {
                    this.$errorThrow(err, this);
                });  
            }).catch(() => {
                    
            });
        },
        //=====================================其他====================================//
        /** 
        * @description        关闭弹窗
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2019-12-30 10:42
        * @update             2019-12-30 10:42
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>



<style lang="scss">

</style>
