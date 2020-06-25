/*
    创建者：shuxiaokai
    创建时间：2020-06-24 20:33
    模块名称：文档管理banner导航页面
    备注：xxxx
*/
<template>
    <div class="banner">
        <!-- 工具栏 -->
        <div class="tool">
            <h2 class="gray-700 f-lg text-center">测试文档</h2>
            <el-input v-model="query" class="doc-search" placeholder="支持文档名称，文档url搜索" clearable @input="handleSearchTree"></el-input>
            <div class="tool-icon d-flex j-between mt-1 px-1">
                <el-tooltip class="item" effect="dark" content="新增文件夹" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#iconxinzengwenjian"></use>
                    </svg>                        
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="新增文件" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#iconwenjian"></use>
                    </svg>               
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="历史记录" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#iconlishi"></use>
                    </svg>               
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="预览文档" :open-delay="300">
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#iconpreview"></use>
                    </svg>               
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="导出" :open-delay="300">
                    <s-download url="/api/project/doc_word" :params="{ projectId: $route.query._id }">
                        <svg class="svg-icon" aria-hidden="true">
                            <use xlink:href="#icondaochu"></use>
                        </svg>                    
                    </s-download>
                </el-tooltip>
            </div>
        </div>
        <!-- 树形文档导航 -->
        <div class="doc-nav">
            <el-tree 
                    ref="docTree"
                    :data="navTreeData" 
                    node-key="id" 
                    empty-text="点击按钮新增文档"
                    :expand-on-click-node="false" 
                    :highlight-current="true"
            >
            </el-tree>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            query: "", //----------导航
            navTreeData: [], //----树形导航数据
        };
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//
    
        //=====================================前后端交互====================================//
        handleSearchTree() {

        },
        //=====================================组件间交互====================================//  
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.banner {
    width: size(300);
    height: 100%;
    border-right: 1px solid $gray-400;
    display: flex;
    flex-direction: column;
    .tool {
        position: relative;
        padding: 0 size(20);
        height: size(150);
        background: $gray-200;
        // 搜索框样式
        .doc-search {
            border-radius: 20px;
            .el-input__inner {
                border-radius: 20px;
            }
        }        
        // 快捷方式样式
        .tool-icon {
            position: relative;
            .svg-icon {
                width: size(25);
                height: size(25);
                padding: size(5);
                cursor: pointer;
                &:hover {
                    background: $gray-400;
                }
            }            
        }
    }
    .doc-nav {
        height: calc(100vh - #{size(60)} - #{size(150)});
    }

}
</style>
