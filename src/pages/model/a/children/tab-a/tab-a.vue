/*
    创建者：shuxiaokai
    创建时间：2019-09-09 22:05
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="a-tab-a">
        <div class="search">
            <div class="search-item">
                <el-input v-model="projectName" placeholder="搜索项目名称" prefix-icon="el-icon-search" @input="filterProject"></el-input>
            </div>
            <div class="d-flex center mr-5">
                <el-checkbox-group v-model="selectProjectTypeArr" @change="getAllProject">
                    <el-checkbox v-for="(item, index) in projectTypeEnum" :key="index" :label="item._id">{{ item.projectTypeName }}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="d-flex center">
                <el-button size="small" type="success" icon="el-icon-plus" @click="dialogVisible2 = true">新建项目</el-button>
                <el-button size="small" icon="el-icon-edit" @click="dialogVisible3 = true">类型维护</el-button>
            </div> 
        </div>
        <div class="doc-wrap mt-3">
            <div v-for="(item, index) in projectList" :key="index" class="doc-list">
                <div class="doc-header">
                    <div class="title theme-color text-ellipsis">{{ item.projectName }}</div>
                    <div class="operator">
                        <div title="编辑">
                            <i class="el-icon-edit"></i>
                        </div>
                        <div title="分享">
                            <i class="el-icon-share"></i>
                        </div>
                        <div title="删除" @click="deleteProject(item._id)">
                            <i class="el-icon-delete"></i>
                        </div>
                        <div title="详情">
                            <i class="el-icon-more"></i>
                        </div>
                    </div>
                </div>
                <div class="d-flex j-end a-center gray-500 mt-2">
                    <span>最新更新:</span>
                    <span title="最新更新">{{ new Date(item.updatedAt).toLocaleDateString() }}</span>&nbsp;&nbsp;
                </div>
                <div class="doc-bottom d-flex">
                    <div>
                        <span class="f-sm">接口数:</span>
                        <span class="teal">{{ item.num }}</span>
                    </div>
                    <div class="ml-auto">
                        <el-button type="primary" size="mini" @click="enterToProject(item._id, item.projectName)">进入</el-button>
                    </div>
                </div>
            </div>
        </div>
        <s-project-model v-if="dialogVisible2" :is-show="dialogVisible2" @close="dialogVisible2 = false;getAllProject()"></s-project-model>
        <s-project-type-list-model v-if="dialogVisible3" :is-show="dialogVisible3" @close="dialogVisible3 = false;getProjectType()"></s-project-type-list-model>
    </div>
</template>

<script>
import projectModel from "./model/add-project"
import projectListModel from "./model/crud-project-type"
/*eslint-disable vue/no-reserved-keys*/
export default {
    components: {
        "s-project-model": projectModel,
        "s-project-type-list-model": projectListModel,
    },
    data() {
        return {
            projectName: "", //----------项目名称
            formInfo: { //---------------查询参数
                projectType: ""
            },
            projectList: [], //----------项目列表
            __projectList: [], //----------项目列表备份
            selectProjectTypeArr: [], //-已选择项目类型数组
            //=====================================枚举值====================================//
            projectTypeEnum: [],
            //=====================================其他参数====================================//
            dialogVisible2: false, //新增项目弹窗
            dialogVisible3: false, //类型维护弹窗
        };
    },
    watch: {
        selectProjectTypeArr: {
            handler(val) {
                this.formInfo.projectType = val.join(",");
            },
            deep: true
        }
    },
    created() {
        this.getProjectType();
        this.getAllProject();
    },
    methods: {
        handleSelect() {},
        handleIconClick() {},
        //=====================================操作相关====================================//
        // 过滤项目名称
        filterProject() {
            this.projectList = this.__projectList.filter(val => {
                return val.projectName.match(new RegExp(this.projectName, "gi"));
            });
        },
        // 进入api文档
        enterToProject(_id, name) {
            this.$router.push({ path: "/v1/a/edit", query: { _id, name }});
        },
        // 编辑名称
        // 删除项目
        deleteProject(_id) {
            this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("/api/project/delete_project", {
                    data: { ids: [_id] }
                }).then(() => {
                    this.projectList = this.projectList.filter(val => val._id !== _id);
                    this.__projectList = this.projectList.filter(val => val._id !== _id);
                    this.$message.success("删除成功");
                }).catch(err => {
                    this.$message.success("删除失败");
                    this.$errorThrow(err, this);
                });            
            }).catch(() => {
                    
            });
        },
        //=====================================获取所有项目====================================//
        getAllProject() {
            const params = this.formInfo;
            this.axios.get("/api/project/project_list", { params }).then(res => {
                this.projectList = res.data.rows;
                this.__projectList = res.data.rows;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================获取枚举值====================================//
        getProjectType() {
            this.axios.get("/api/project/project_type_enum").then(res => {
                this.projectTypeEnum = res.data;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        }
    }
};
</script>



<style lang="scss">
.a-tab-a {
    .search {
        display: flex;
        .search-item {
            width: 200px;
            margin-right: 20px;
        }
    }

    .doc-wrap {
        display: flex;
        flex-wrap: wrap;
    }
    .doc-list {
        width: 300px;
        height: 150px;
        border: 1px solid $gray-200;
        box-shadow: $box-shadow-sm;
        margin-right: 30px;
        margin-bottom: 30px;
        padding: 10px;
        position: relative;
        .doc-header {
            height: 40px;
            display: flex;
            align-items: center;
            .title {
                max-width: 150px;
            }
            .operator {
                margin-left: auto;
                display: flex;
                & > div {
                    width: 25px;
                    height: 25px;
                    margin-right: 5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:hover {
                        background: $gray-200;
                    }
                }
            }
        }
        .doc-bottom {
            width: 100%;
            position: absolute;
            padding: 10px;
            bottom: 10px;
            display: flex;
            align-items: center;
            left: 0;
        }
        .start {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            bottom: 10px;
            right: 10px;
            cursor: pointer;
            &:hover {
                background: $gray-200;
            }
            i {
                font-size: 18px;
            }
        }
    }
}
</style>
