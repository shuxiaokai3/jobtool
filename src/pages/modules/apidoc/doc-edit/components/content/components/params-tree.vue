/*
    创建者：shuxiaokai
    创建时间：2020-07-07 15:56
    模块名称：
    备注：xxxx
*/
<template>
    <el-collapse v-model="activeCollapse" class="collapse-wrap">
        <el-collapse-item name="1">
            <template slot="title">
                请求头
            </template>
            <div class="params-edit">
                <el-tree 
                        :data="paramsTreeData" 
                        :indent="30"
                        :highlight-current="true"
                        node-key="_id" 
                        :expand-on-click-node="false" 
                        default-expand-all
                >
                    <template slot-scope="scope">
                        <div class="custom-tree-node">
                            <el-button type="text" title="添加嵌套数据" icon="el-icon-plus" @click="addNestTreeData"></el-button>
                            <el-button class="mr-2" title="删除当前项" type="text" icon="el-icon-close" @click="deleteTreeData(scope)"></el-button>
                            <el-input v-model="scope.data.key" size="mini" placeholder="参数名称，例如：age name job" class="w-20 mr-2" @input="addNewLine"></el-input>
                            <el-select v-model="scope.data.type" placeholder="类型" size="mini" class="w-10 mr-2">
                                <el-option label="String" value="string"></el-option>
                                <el-option label="Number" value="number"></el-option>
                                <el-option label="Boolean" value="boolean"></el-option>
                                <el-option label="Object" value="object"></el-option>
                                <el-option label="List | Array" value="array"></el-option>
                            </el-select>
                            <el-select v-if="scope.data.type === 'boolean'" v-model="scope.data.value" placeholder="请选择" size="mini" class="w-25 mr-2">
                                <el-option label="true" value="true"></el-option>
                                <el-option label="false" value="false"></el-option>
                            </el-select>
                            <el-input v-else v-model="scope.data.value" size="mini" placeholder="参数值,例如 20 张三" maxlength="255" class="w-25 mr-2"></el-input>
                            <!-- <el-checkbox v-model="scope.data.required" label={this.treeType === "request" ? "必填" : "必有"}></el-checkbox> -->
                            <el-input v-model="scope.data.description" size="mini" placeholder="描述" maxlength="100" class="w-40"></el-input>
                        </div>
                    </template>
                </el-tree>
            </div>             
        </el-collapse-item>
    </el-collapse>
</template>

<script>
export default {
    data() {
        return {
            activeCollapse: "1",
            paramsTreeData: [{
                x: 1
            }],
        };
    },
    created() {

    },
    methods: {
        //添加嵌套数据
        addNestTreeData() {

        },
        //删除数据
        deleteTreeData() {

        },
        //新增一行
        addNewLine() {

        },
        //=====================================组件间交互====================================//  
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.collapse-wrap {
    .el-collapse-item__header {
        background: $gray-200;
    }
    .params-edit {
        .el-tree-node__content {
            height: 50px;
        }
        .el-input__inner {
            border-radius: 0;
            border: none;
            border-bottom: 1px solid $gray-300;
        }
        .custom-tree-node {
            width: 100%;
            display: flex;
            align-items: center;
        }
    }
}
</style>
