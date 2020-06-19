/*
    创建者：shuxiaokai
    创建时间：2019-11-12 13:44"
    模块名称：状态码弹窗
    备注：xxxx
*/
<template>
    <el-dialog title="自定义状态码" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="70%">
        <div class="d-flex code-list">
            <!-- 新增状态码 -->
            <div class="w-30">
                <el-divider content-position="left">添加状态码</el-divider>
                <el-form ref="form" :model="formInfo" :rules="rules" label-width="120px">
                    <el-form-item label="状态码：" prop="code">
                        <el-input-number v-model="formInfo.code" size="mini" placeholder="例如:200" :step="1" class="w-100" controls-position="right"></el-input-number>
                    </el-form-item>
                    <el-form-item label="含义：" prop="name">
                        <el-input v-model="formInfo.name" name="name" size="mini" placeholder="例如：请求成功" class="w-100" maxlength="100" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="是否代表成功：">
                        <el-radio-group v-model="formInfo.isSuccess">
                            <el-radio :label="true">成功</el-radio>
                            <el-radio :label="false">失败</el-radio>
                        </el-radio-group>
                        <div class="d-flex center w-20">
                            <el-popover placement="top-start" width="200" trigger="hover" content="用户请求测试，请求返回状态码与成功状态码相匹配时候表面请求成功">
                                <i slot="reference" class="el-icon-warning orange ml-2"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                        <el-input v-model="formInfo.remark" name="name" size="mini" placeholder="填写一些备注" class="w-100" maxlength="100" clearable></el-input>
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
                    <el-table-column prop="code" label="状态码" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active">{{ scope.row.code }}</span>
                            <input v-show="scope.row._active" v-model.number="scope.row.code" v-focus="scope.row._active" placeholder="不能为空" autocomplete="false" type="number" class="w-50">
                            <span v-show="!scope.row._active" class="el-icon-edit ml-1 hover-teal cursor-pointer" @click="editLine(scope.row, 'code', '_active')"></span>
                            &nbsp;<span v-show="scope.row._active" type="text" class="cursor-pointer hover-theme-color" @click="handleEditCode(scope.row, 'code', '_active')">确认</span>&nbsp;
                            <span v-show="scope.row._active" type="text" class="cursor-pointer hover-theme-color" @click="cancelEditCode(scope.row, '_active')">取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="中文含义" align="center" width="150px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active2">{{ scope.row.name }}</span>
                            <input v-show="scope.row._active2" v-model="scope.row.name" v-focus="scope.row._active" placeholder="不能为空" autocomplete="false" type="text" class="w-50">
                            <span v-show="!scope.row._active2" class="el-icon-edit ml-1 hover-teal cursor-pointer" @click="editLine(scope.row, 'name', '_active2')"></span>
                            &nbsp;<span v-show="scope.row._active2" type="text" class="cursor-pointer hover-theme-color" @click="handleEditCode(scope.row, 'name', '_active2')">确认</span>&nbsp;
                            <span v-show="scope.row._active2" type="text" class="cursor-pointer hover-theme-color" @click="cancelEditCode(scope.row, '_active2')">取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" width="250px">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active3">{{ scope.row.remark }}</span>
                            <input v-show="scope.row._active3" v-model="scope.row.remark" v-focus="scope.row._active" placeholder="不能为空" name="name" type="text" class="w-50">
                            <span v-show="!scope.row._active3" class="el-icon-edit ml-1 hover-teal cursor-pointer" @click="editLine(scope.row, 'remark', '_active3')"></span>
                            &nbsp;<span v-show="scope.row._active3" type="text" class="cursor-pointer hover-theme-color" @click="handleEditCode(scope.row, 'remark', '_active3')">确认</span>&nbsp;
                            <span v-show="scope.row._active3" type="text" class="cursor-pointer hover-theme-color" @click="cancelEditCode(scope.row, '_active3')">取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isSuccess" label="是否代表成功" align="center">
                        <template slot-scope="scope">
                            <span v-show="!scope.row._active4" :class="{green: scope.row.isSuccess}">{{ `${scope.row.isSuccess ? "成功" : "失败"}` }}</span>
                            <!-- <el-radio-group v-show="scope.row._active4" v-model="scope.row.isSuccess" size="mini">
                                <el-radio :label="true">成功</el-radio>
                                <el-radio :label="false">失败</el-radio>
                            </el-radio-group> -->
                            <div v-show="scope.row._active4" class="d-inline-block">
                                <input id="one" v-model="scope.row.isSuccess" style="vertical-align: -2px" type="radio" :value="true">
                                <label for="one">成功</label>     
                                <input id="two" v-model="scope.row.isSuccess" style="vertical-align: -2px" type="radio" :value="false">
                                <label for="two">失败</label>                              
                            </div>

                            <span v-show="!scope.row._active4" class="el-icon-edit ml-1 hover-teal cursor-pointer" @click="editLine(scope.row, 'isSuccess', '_active4')"></span>
                            &nbsp;<span v-show="scope.row._active4" type="text" class="cursor-pointer hover-theme-color" @click="handleEditCode(scope.row, 'isSuccess', '_active4')">确认</span>&nbsp;
                            <span v-show="scope.row._active4" type="text" class="cursor-pointer hover-theme-color" @click="cancelEditCode(scope.row, '_active4')">取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100px">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" @click="deleteTableData(scope.row._id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="d-flex justify-end mt-1">
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
            type: Boolean
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
                pageNum: 1, //-------------------------------------------------------当前页数
                pageSize: this.$root.VUE_BASE_CONFIG.tableConfig.pageSize, //--------每页参数    
                startTime: "", //----------------------------------------------------起始日期
                endTime: "", //------------------------------------------------------结束日期         
            },
            total: 0, //-------------------------------------------------------------数据总数
            tableInfo: [], //--------------------------------------------------------表格数据
            pageSizes: this.$root.VUE_BASE_CONFIG.tableConfig.pageSizes, //----------每页条数数组
            //=====================================验证参数====================================//
            rules: {
                code: [{ required: true, message: "请填写状态码", trigger: "blur" }],
                name: [{ required: true, message: "请填写中文含义", trigger: "blur" }]
            },
            //=====================================其他参数====================================//
            loading: false, //表格加载效果
            loading2: false, //添加按钮加载效果
            successLoading: false, //是否添加成功
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //=====================================表格相关====================================//
        /* 
            @description  获取项目列表
            @author        shuxiaokai
            @create       2019-11-12 13:57"
        */
        getData() {
            this.loading = true;
            const params = {
                projectId: this.$route.query._id,
            };
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
                this.axios.delete("/api/project/doc_code", { data: params }).then(res => {
                    if (res.data.ok === 1) {
                        const index = this.tableInfo.findIndex(val => val._id === _id);
                        this.tableInfo.splice(index, 1);
                    }
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
        handleEditCode(row, key, activeKey) {
            if (row[key] == null || row[key] === "") {
                row[key] = row._tempEditValue_;
                row[activeKey] = false;
                return;
            }
            const params = {};
            params[key] = row[key];
            params._id = row._id;
            this.axios.put("/api/project/doc_code", params).then(res => {
                
            }).catch(err => {
                this.$errorThrow(err, this);
            });
            row[activeKey] = false;
            console.log(row)
        },
        //取消修改
        cancelEditCode(row, activeKey) {
            row[activeKey] = false;
        },

        //=====================================其他操作====================================//
        editLine(row, key, activeKey) {
            row._tempEditValue_ = row[key]
            this.$set(row, activeKey, true);
        },
        /* 
            @description  新增状态码
            @author        shuxiaokai
            @create       2019-11-12 13:44"
            @params       null
            @return       null
        */
        handleAddCode() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading2 = true;
                    const params = {
                        ...this.formInfo,
                        projectId: this.$route.query._id
                    };
                    this.successLoading = false;
                    this.axios.post("/api/project/doc_code", params).then(res => {
                        this.successLoading = true;
                        this.tableInfo.push(res.data);
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading2 = false;
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



<style lang="scss">
    .code-list {
        .el-radio {
            margin-right: 5px;
        }
    }
</style>
