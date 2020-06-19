/*
    创建者：shuxiaokai
    创建时间：2019-10-28 10:43"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="服务器列表" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-table v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" :data="tableInfo" stripe border size="mini" height="450px">
            <el-table-column label="服务器名称" align="center">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.__isEditing && scope.$index === currentEditingIndex" v-model="scope.row.name" size="mini" placeholder="服务器名称不能为空" class="w-100" maxlength="100" clearable></el-input>
                    <span v-else>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="服务器地址" align="center">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.__isEditing && scope.$index === currentEditingIndex" v-model="scope.row.url" size="mini" placeholder="服务器地址不能为空" class="w-100" maxlength="100" clearable></el-input>
                    <span v-else>{{ scope.row.url }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.__isEditing && scope.$index === currentEditingIndex" v-model="scope.row.remark" size="mini" class="w-100" maxlength="100" clearable></el-input>
                    <span v-else>{{ scope.row.remark }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center" width="130px">
                <template slot-scope="scope">
                    <el-button v-show="!scope.row.__isEditing && (scope.$index === currentEditingIndex || currentEditingIndex === -1)" type="text" size="mini" @click="editService(scope.row, scope.$index)">修改</el-button>
                    <el-button v-show="scope.row.__isEditing" type="text" size="mini" @click="saveService(scope.row)">保存</el-button>
                    <el-button v-show="scope.row.__isEditing" type="text" size="mini" @click="cancleEditService(scope.row)">取消</el-button>
                    <el-button type="text" size="mini" @click="deleteService(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="d-flex justify-end mt-1">
            <el-pagination layout="total, sizes, prev, pager, next" :total="total" background :page-sizes="pageSizes" :page-size="formInfo.pageSize" :current-page="formInfo.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
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
            //=====================================表格参数====================================//
            formInfo: {
                pageNum: 1, //------------------------------------------------------当前页数
                pageSize: this.$root.VUE_BASE_CONFIG.tableConfig.pageSize, //--------每页参数   
                projectId: this.$route.query._id, //项目id 
            },
            total: 0, //------------------------------------------------------------数据总数
            tableInfo: [], //--------------------------------------------------------表格数据
            pageSizes: this.$root.VUE_BASE_CONFIG.tableConfig.pageSizes, //----------每页条数数组
            //=====================================验证参数====================================//
            rules: {
                aaa: [{ required: true, message: "请填写类型名称", trigger: "blur" }]
            },
            //=====================================其他参数====================================//
            loading: false,
            currentEditingIndex: -1, //当前正在被编辑的行号
            oldEditingValue: {}, //历史数据信息
        };
    },
    created() {
        this.getData();
    },
    methods: {
        /* 
            @description  获取项目列表
            @author        shuxiaokai
            @create       2019-10-28 10:58"
        */
        getData() {
            this.loading = true;
            this.axios.get("/api/project/doc_service", { params: this.formInfo }).then(res => {
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
            this.formInfo.pageNum = 1;
            this.formInfo.pageSize = size;
            this.getData();
        },
        //改变页码
        handleCurrentChange(page) {
            this.formInfo.pageNum = page;
            this.getData();
        },
        /* 
            @description  删除服务器
            @author        shuxiaokai
            @create       2019-10-28 10:49"
            @params {String} _id 当前数据id      
            @return       null
        */
        deleteService(id) {
            this.$confirm("此操作将永久删除该服务器数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                const params = {
                    ids: [id]
                };
                this.axios.delete("/api/project/doc_service", { data: params }).then(() => {
                    this.getData();
                }).catch(err => {
                    this.$errorThrow(err, this);
                });
            }).catch((err) => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        /** 
         * @description        修改服务器信息
         * @author             shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-29 15:07
         * @update             2019-12-29 15:07
         * @param {Row}        row - 行信息       
         * @param {Number}     index - 当前被编辑的行号       
         */
        editService(row, index) {
            this.$set(row, "__isEditing", true);
            this.oldEditingValue = JSON.parse(JSON.stringify(row));
            this.currentEditingIndex = index;
        },
        /** 
         * @description        保存服务器信息修改
         * @author             shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-29 15:14
         * @update             2019-12-29 15:14
         * @param {Row}        row - 行信息       
         */
        saveService(row) {
            if (row.name.trim() === "") {
                this.$message.warning("名称不能为空");
                return;
            } 
            if (row.url.trim() === "") {
                this.$message.warning("url不能为空");
                return;
            }
            const params = Object.assign({
                projectId: this.$route.query._id
            }, row)
            this.axios.put("/api/project/doc_service", params).then(() => {
                this.$set(row, "__isEditing", false);
                this.currentEditingIndex = -1;                
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        /** 
         * @description        取消保存
         * @author             shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-29 15:25
         * @update             2019-12-29 15:25
         * @return {String}    返回字符串
         */
        cancleEditService(row) {
            // console.log(this.oldEditingValue)
            // row.name = this.oldEditingValue.name;
            // row.url = this.oldEditingValue.url;
            // row.value = this.oldEditingValue.value;
            // console.log(row)
            Object.assign(row, this.oldEditingValue);
            this.$set(row, "__isEditing", false);
            this.currentEditingIndex = -1;
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

</style>
