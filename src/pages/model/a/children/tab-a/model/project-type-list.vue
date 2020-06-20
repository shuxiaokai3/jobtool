/*
    创建者：shuxiaokai
    创建时间：2019-10-20 20:55"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="项目类型列表" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <div>
            <el-table :data="tableInfo" stripe border size="mini" height="400px">
                <el-table-column prop="projectTypeName" label="类型名称" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="创建日期" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="handleDeleteProjectType(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="d-flex justify-end mt-1">
                <el-pagination layout="total, sizes, prev, pager, next" :total="total" background :page-sizes="pageSizes" :page-size="formInfo.pageSize" :current-page="formInfo.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
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
            //=====================================表格参数====================================//
            formInfo: {
                pageNum: 1, //------------------------------------------------------当前页数
                pageSize: this.$root.VUE_BASE_CONFIG.tableConfig.pageSize, //--------每页参数    
                startTime: "", //----------------------------------------------------起始日期
                endTime: "", //------------------------------------------------------结束日期         
            },
            total: 0, //------------------------------------------------------------数据总数
            tableInfo: [], //--------------------------------------------------------表格数据
            pageSizes: this.$root.VUE_BASE_CONFIG.tableConfig.pageSizes, //----------每页条数数组
            //=====================================其他参数====================================//
            loading: false, //项目列表加载 
            loading2: false, // 操作按钮加载
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
            @create       2019-10-20 21:00"
            @params       
            @return       null
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
            this.formInfo.pageNum = 1;
            this.formInfo.pageSize = size;
            this.getData();
        },
        handleCurrentChange(page) {
            this.formInfo.pageNum = page;
            this.getData();
        },
        /* 
            @description  删除一个项目类型
            @author        shuxiaokai
            @create       2019-10-20 20:55"
            @params       _id 项目id
            @return       null
        */
        handleDeleteProjectType(_id) {
            this.$confirm("此操作将永久删除该类型, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("/api/project/project_type", { data: { ids: [_id] }}).then(res => {
                    this.$message.success("删除成功");
                    this.getData();
                }).catch(err => {
                    this.$errorThrow(err, this);
                });  
            }).catch(() => {
                    
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

</style>
