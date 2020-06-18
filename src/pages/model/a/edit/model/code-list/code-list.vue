/**
    创建者：shuxiaokai
    创建时间：2020-01-15 13:31"
    模块名称：状态码curd弹窗
    备注：xxxx
*/
<template>
    <s-curd-model v-if="isShow" title="状态码维护" :left-width="300" @close="$emit('close')">
        <!-- 新增数据 -->
        <div slot="left" class="pr-2">
            <el-divider content-position="left">添加状态码</el-divider>
            <el-form ref="form" :model="formInfo" :rules="rules" label-width="120px">
                <el-form-item label="状态码：" prop="code">
                    <el-input-number v-model="formInfo.code" size="mini" placeholder="例如:200,必须为数字" :step="1" :min="0" class="w-100" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="含义：" prop="name">
                    <el-input v-model="formInfo.name" name="name" size="mini" placeholder="例如：请求成功" class="w-100" maxlength="100" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否代表成功：">
                    <el-radio-group v-model="formInfo.isSuccess" class="w-100">
                        <el-radio :label="true">成功</el-radio>
                        <el-radio :label="false">失败</el-radio>
                    </el-radio-group>
                    <!-- <div class="d-flex center w-20">
                        <el-popover placement="top-start" width="400" trigger="hover" content="用户请求测试，请求返回状态码与成功状态码相匹配时候表明请求成功">
                            <i slot="reference" class="el-icon-warning orange ml-2"></i>
                        </el-popover>
                    </div>  -->
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
                </el-form-item>
                <div class="d-flex j-end">
                    <el-button v-success="successLoading" :loading="loading2" type="primary" size="mini" @click="handleAddHost">确认添加</el-button>
                </div>
            </el-form>  
        </div>
        <!-- 数据展示 -->
        <div slot="right" v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="ml-1 flex1">
            <el-divider content-position="left">数据展示</el-divider>
            <el-table :data="tableInfo" stripe border size="mini" height="400px">
                <el-table-column label="状态码" align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.__active" v-model="scope.row.code" size="mini" class="w-100" maxlength="100" clearable></el-input>
                        <span v-else>{{ scope.row.code }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="中文含义" align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.__active" v-model="scope.row.name" size="mini" class="w-100" maxlength="100" clearable></el-input>
                        <span v-else>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.__active" v-model="scope.row.remark" size="mini" class="w-100" maxlength="100" clearable></el-input>
                        <span v-else>{{ scope.row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否代表成功" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-radio-group v-if="scope.row.__active" v-model="scope.row.isSuccess" size="mini">
                            <el-radio :label="true">成功</el-radio>
                            <el-radio :label="false">失败</el-radio>
                        </el-radio-group>
                        <!-- <el-input v-if="scope.row.__active" v-model="scope.row.isSuccess" size="mini" class="w-100" maxlength="100" clearable></el-input> -->
                        <span v-else>
                            <span v-if="scope.row.isSuccess">成功</span>
                            <span v-else>失败</span>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-button v-show="!scope.row.__active && !isEditing" type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-show="scope.row.__active" type="text" size="mini" @click="handleSubmitEdit(scope.row)">确认</el-button>
                        <el-button v-show="scope.row.__active" type="text" size="mini" @click="handleCancelEdit(scope.row)">取消</el-button>
                        <el-button type="text" size="mini" @click="handleDeleteProjectType(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="d-flex j-end mt-1">
                <el-pagination layout="total, sizes, prev, pager, next" :total="total" background :page-sizes="pageSizes" :page-size="formInfo.pageSize" :current-page="formInfo.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </div>                
        </div>
    </s-curd-model>
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
                code: 0, //------------------状态码
                name: "", //------------------中文含义
                remark: "", //----------------备注
                isSuccess: false, //----------是否代表成功
            },
            //=====================================表格参数====================================//
            formInfo2: {
                projectId: this.$route.query._id,
                pageNum: 1, //-------------------------------------------------------当前页数
                pageSize: this.$root.VUE_BASE_CONFIG.tableConfig.pageSize, //--------每页参数    
                startTime: "", //----------------------------------------------------起始日期
                endTime: "", //------------------------------------------------------结束日期         
            },
            total: 0, //-------------------------------------------------------------数据总数
            tableInfo: [], //--------------------------------------------------------表格数据
            pageSizes: this.$root.VUE_BASE_CONFIG.tableConfig.pageSizes, //----------每页条数数组
            oldEditingData: null,
            //=====================================验证参数====================================//
            rules: {
                code: [{ required: true, message: "请输入状态码", trigger: "blur" }],
                name: [{ required: true, message: "请输入状态码中文含义", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            isEditing: false,
            loading: false, //======================表格加载效果
            loading2: false, //=====================添加按钮加载效果
            successLoading: false, //===============是否添加成功
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //=====================================表格相关====================================//
        /** 
            @description  获取表格数据
            @autor        shuxiaokai
            @create       2019-11-12 13:57"
        */
        getData() {
            this.loading = true;
            const params = this.formInfo2;
            this.axios.get("/api/project/doc_code", { params }).then(res => {
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
        handleAddHost() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading2 = true;
                    const params = {
                        projectId: this.$route.query._id,
                        ...this.formInfo
                    };
                    this.successLoading = false;
                    this.axios.post("/api/project/doc_code", params).then(() => {
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
            this.axios.put("api/project/doc_code", params).then(() => {
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
        * @description        删除一个域名
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2019-12-30 10:42
        * @update             2019-12-30 10:42
        */
        handleDeleteProjectType(_id) {
            this.$confirm("此操作将永久删除该域名, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("api/project/doc_code", { data: { ids: [_id] }}).then(() => {
                    this.$message.success("删除成功");
                    this.getData();
                }).catch(err => {
                    this.$errorThrow(err, this);
                });  
            }).catch(() => {
                    
            });
        },
        //=====================================其他操作====================================//
        /** 
            @description  关闭弹窗
            @autor        shuxiaokai
            @create       2019-10-19 22:39"
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>

