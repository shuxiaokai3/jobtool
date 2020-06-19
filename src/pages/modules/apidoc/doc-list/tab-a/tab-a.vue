/*
    创建者：shuxiaokai
    创建时间：2020-06-19 13:37
    模块名称：项目列表
    备注：xxxx
*/
<template>
    <div class="tab-a">
        <!-- 搜索条件 -->
        <div class="search-item d-flex a-center">
            <el-input v-model="projectName" placeholder="搜索项目名称" prefix-icon="el-icon-search" size="small" class="w-200px mr-3" @input="filterProject" clearable></el-input>
            <el-button size="small" type="success" icon="el-icon-plus" @click="dialogVisible2 = true">新建项目</el-button>
        </div> 
        <!-- 项目列表 -->
        <div class="project-wrap mt-3">
            <div v-for="(item, index) in projectList" :key="index" class="project-list">
                <div class="project-header">
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
                <div class="d-flex j-end a-center gray-500 mt-2">
                    <span>创建者:</span>
                    <span title="创建者">{{ new Date(item.updatedAt).toLocaleDateString() }}</span>&nbsp;&nbsp;
                </div>
                <div class="project-bottom d-flex">
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            projectList: [], //------项目列表
            projectListCopy: [], //--项目列表拷贝用户数据过滤
            projectName: "", //------搜索框项目名称
        };
    },
    created() {
        this.getProjectList(); //获取项目列表
    },
    methods: {
        //=====================================获取远程数据==================================//
        getProjectList() {
            const params = this.formInfo;
            this.loading = true;
            this.axios.get("/api/project/project_list", { params }).then(res => {
                this.projectList = res.data.rows;
                this.projectListCopy = res.data.rows;
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        //过滤项目
        filterProject() {
            this.projectList = this.projectListCopy.filter(val => {
                return val.projectName.match(new RegExp(this.projectName, "gi"));
            });
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss" scoped>
.tab-a {
    .project-wrap {
        display: flex;
        flex-wrap: wrap;
        @media only screen and (max-width: 1199px) {
            justify-content: center;
        }
    }
    .project-list {
        width: 300px;
        height: 180px;
        border: 1px solid $gray-200;
        box-shadow: $box-shadow-sm;
        margin-right: 30px;
        margin-bottom: 30px;
        padding: 10px;
        position: relative;
        @media only screen and (max-width: 1199px) {
            margin-right: 0;
            width: 100%;
        }
        .project-header {
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
        .project-bottom {
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
