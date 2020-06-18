/**
    创建者：shuxiaokai
    创建时间：2020-03-23 11:32"
    模块名称：复制为表格参数
    备注：xxxx
*/
<template>
    <el-dialog title="复制为表格参数" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="60%">
        <div>
            <el-divider content-position="left">表格操作</el-divider>
            <div class="no-select">
                <!-- 新增 -->
                <div class="mb-2 d-flex">
                    <div>
                        <span class="mr-2">新增：</span>
                        <el-switch v-model="formInfo.isAdd"></el-switch>                        
                    </div>
                    <div v-if="formInfo.isAdd">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">方式：</span>
                        <el-radio-group v-model="formInfo.addType" size="mini">
                            <el-radio label="jump">跳转路由</el-radio>
                            <el-radio label="model">弹窗</el-radio>
                        </el-radio-group>                        
                    </div>
                    <div v-if="formInfo.isAdd && formInfo.addType === 'jump'">
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isAdd" class="mr-2">路由：</span>   
                        <input v-model="formInfo.routeOfAdd" type="text" placeholder="eg: /v1/demo/a" class="w-150px"> 
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isAdd" class="mr-2">路由挂载参数：</span>   
                        <input v-model="formInfo.routeQueryOfAdd" type="text" placeholder="eg: id" class="w-50px"> 
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isAdd" class="mr-2">本地赋值参数：</span>   
                        <input v-model="formInfo.localRouteQueryOfAdd" type="text" placeholder="eg: pId" class="w-50px">                    
                    </div>
                </div>
                <!-- 编辑 -->
                <div class="mb-2 d-flex">
                    <div>
                        <span class="mr-2">编辑：</span>
                        <el-switch v-model="formInfo.isEdit"></el-switch>
                    </div>
                    <div v-if="formInfo.isEdit">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">方式：</span>
                        <el-radio-group v-model="formInfo.editType" size="mini">
                            <el-radio label="jump">跳转路由</el-radio>
                            <el-radio label="model">弹窗</el-radio>
                        </el-radio-group>                        
                    </div>
                    <div v-if="formInfo.isEdit && formInfo.editType === 'jump'">
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isEdit" class="mr-2">路由：</span>   
                        <input v-model="formInfo.routeOfEdit" type="text" placeholder="eg: /v1/demo/a" class="w-150px"> 
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isEdit" class="mr-2">路由挂载参数：</span>   
                        <input v-model="formInfo.routeQueryOfEdit" type="text" placeholder="eg: id" class="w-50px"> 
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isEdit" class="mr-2">本地赋值参数：</span>   
                        <input v-model="formInfo.localRouteQueryOfEdit" type="text" placeholder="eg: pId" class="w-50px">                    
                    </div>
                </div>
                <!-- 删除 -->
                <div class="mb-2 d-flex">
                    <div>
                        <span class="mr-2">删除：</span>
                        <el-switch v-model="formInfo.isDel"></el-switch>
                    </div>
                    <div v-if="formInfo.isDel">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">批量删除：</span>
                        <el-switch v-model="formInfo.multi"></el-switch>
                    </div>
                    <div v-if="formInfo.isDel">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">接口地址：</span>
                        <input v-model="formInfo.deleteUrl" type="text" placeholder="eg: /demo/user">
                    </div>
                    <div v-if="formInfo.isDel">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">接口key值：</span>   
                        <input v-model="formInfo.remoteRouteQueryOfDel" type="text" placeholder="eg: id" class="w-50px">       
                    </div>
                    <div v-if="formInfo.isDel">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">本地赋值参数：</span>   
                        <input v-model="formInfo.localRouteQueryOfDel" type="text" placeholder="eg: pId" class="w-50px">       
                    </div>
                </div>
                <!-- 查看 -->
                <div class="mb-2 d-flex">
                    <div>
                        <span class="mr-2">查看：</span>
                        <el-switch v-model="formInfo.isView"></el-switch>
                    </div>
                    <div v-if="formInfo.isView">
                        <span class="mx-3 gray-300">|</span>
                        <span class="mr-2">方式：</span>
                        <el-radio-group v-model="formInfo.viewType" size="mini">
                            <el-radio label="jump">跳转路由</el-radio>
                            <el-radio label="model">弹窗</el-radio>
                        </el-radio-group>                        
                    </div>
                    <div v-if="formInfo.isView && formInfo.viewType === 'jump'">
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isView" class="mr-2">路由：</span>   
                        <input v-model="formInfo.routeOfView" type="text" placeholder="eg: /v1/demo/a" class="w-150px"> 
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isView" class="mr-2">路由挂载参数：</span>   
                        <input v-model="formInfo.routeQueryOfView" type="text" placeholder="eg: id" class="w-50px"> 
                        <span class="mx-3 gray-300">|</span>
                        <span v-if="formInfo.isView" class="mr-2">本地赋值参数：</span>   
                        <input v-model="formInfo.localRouteQueryOfView" type="text" placeholder="eg: pId" class="w-50px">                    
                    </div>
                </div>
            </div>
            <el-table ref="table" :data="tableData" stripe border size="mini" height="400px" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="key" label="参数名称" align="center"></el-table-column>
                <el-table-column prop="description" label="备注" align="center"></el-table-column>
            </el-table>
        </div>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleCopy">复制表格html</el-button>
            <el-button :loading="loading" type="primary" size="mini" @click="handleCopyMethods">复制操作方法</el-button>
            <el-button type="danger" size="mini" @click="closeModel">取消</el-button>
        </span>
        
    </el-dialog>
</template>

<script>
import copy from "@/lib/utils/copy"
export default {
    props: {
        isShow: {
            type: Boolean
        },
        tableData: { //表格数据
            type: Array,
            default() {
                return []
            }
        },
        url: { //表格请求url
            type: String,
            default() {},
        },
    },
    data() {
        return {
            formInfo: {
                //=====================================新增====================================//
                isAdd: false,
                addType: "jump", //新增方式
                routeOfAdd: "", //新增，路由地址
                routeQueryOfAdd: "id", //路由传参
                localRouteQueryOfAdd: "id", //本地参数id
                //=====================================编辑====================================//
                isEdit: false,
                editType: "jump", //修改方式
                routeOfEdit: "", //修改，路由地址
                routeQueryOfEdit: "id", //路由传参
                localRouteQueryOfEdit: "id", //本地参数id
                //=====================================删除====================================//
                isDel: false,
                multi: true, //是否批量删除
                deleteUrl: "", //删除接口
                localRouteQueryOfDel: "id", //本地参数id
                remoteRouteQueryOfDel: "id", //远程请求参数id
                //=====================================查看====================================//
                isView: false,
                viewType: "jump", //新增方式
                routeOfView: "", //新增，路由地址
                routeQueryOfView: "id", //路由传参
                localRouteQueryOfView: "id", //本地参数id

            },
            spaceNum: 4, //格式化空格标准
            selectData: [], //已经选择数据
            blockKeywords: ["code", "msg", "message", "data", "rows", "total", "id", "_id"], //自动过滤参数
            //=====================================其他参数====================================//
            loading: false
        };
    },
    watch: {
        tableData: {
            handler(data) {
                setTimeout(() => {
                    data.forEach(val => {
                        if (!this.blockKeywords.includes(val.key)) {
                            this.$refs.table.toggleRowSelection(val);
                        }
                    })                    
                });
            },
            deep: true,
            immediate: true
        },
    },
    created() {

    },
    methods: {
        //改变选择
        handleSelectionChange(val) {
            this.selectData = val;
        },
        //拷贝为封装表格
        handleCopy() {
            // const space = " ".repeat(this.spaceNum);
            const space3 = " ".repeat(this.spaceNum * 3);
            const columnTemplate = this.generateColumnTemplate();
            const curdTemplate = this.generateCurdTemplate();
            const resultStr = `<s-table ref="table" url="${this.url}">\n${space3}${columnTemplate}${curdTemplate}</s-table>`;
            copy(resultStr);
            this.$message.success("复制成功");
        },
        //=====================================代码片段生成====================================//
        //生成table-column模板
        generateColumnTemplate() {
            let resultStr = "";
            for (let i = 0, len = this.selectData.length; i < len; i++) {
                if (i !== len - 1) {
                    resultStr = `${resultStr}<el-table-column prop="${this.selectData[i].key}" label="${this.selectData[i].description}" align="center"></el-table-column>\n${" ".repeat(this.spaceNum * 3)}` 
                } else {
                    resultStr = `${resultStr}<el-table-column prop="${this.selectData[i].key}" label="${this.selectData[i].description}" align="center"></el-table-column>\n${" ".repeat(this.spaceNum * 2)}` 
                }
            }
            return resultStr;
        },
        //生成curd模板
        generateCurdTemplate() {
            let resultStr = "";
            const space = " ".repeat(this.spaceNum); //一个缩进
            const space4 = " ".repeat(this.spaceNum * 4); //四个缩进
            const hasAdd = this.formInfo.isAdd; //是否存在新增操作
            const hasEdit = this.formInfo.isEdit; //是否存在编辑操作
            const hasDel = this.formInfo.isDel; //是否存在删除操作
            const hasView = this.formInfo.isView; //是否存在查看操作

            const addStr = hasAdd ? `\n${space4}${space}<el-button type="text" size="mini" @click="handleAdd(scope.row.${this.formInfo.localRouteQueryOfAdd})">新增</el-button>` : "";
            const editStr = hasEdit ? `\n${space4}${space}<el-button type="text" size="mini" @click="handleEdit(scope.row.${this.formInfo.localRouteQueryOfEdit})">编辑</el-button>` : "";
            const delStr = hasDel ? `\n${space4}${space}<el-button type="text" size="mini" @click="handleDelete(scope.row.${this.formInfo.localRouteQueryOfDel})">删除</el-button>` : "";
            const viewStr = hasView ? `\n${space4}${space}<el-button type="text" size="mini" @click="handleView(scope.row.${this.formInfo.localRouteQueryOfView})">查看</el-button>` : "";


            const startStr = `${space}<el-table-column label="操作" align="center">\n${space4}<template slot-scope="scope">`;
            const endStr = `\n${space4}</template>\n${space}${space}${space}</el-table-column>\n${space}${space}`;

            if (hasAdd || hasEdit || hasDel || hasView) {
                resultStr = `${startStr}${addStr}${editStr}${delStr}${viewStr}${space}${endStr}`; 
            }
            return resultStr;
        },
        //复制方法
        handleCopyMethods() {
            let resultStr = ""; //结果字符串
            let addStr = "";
            let editStr = "";
            let viewStr = "";
            let delStr = "";
            const space = " ".repeat(this.spaceNum); //一个缩进
            const space2 = " ".repeat(this.spaceNum * 2); //四个缩进
            const hasAdd = this.formInfo.isAdd; //是否存在新增操作
            const hasEdit = this.formInfo.isEdit; //是否存在编辑操作
            const hasDel = this.formInfo.isDel; //是否存在删除操作
            const hasView = this.formInfo.isView; //是否存在查看操作
            if (hasAdd) { //新增
                if (this.formInfo.addType === "jump") {
                    addStr = `//新增操作\n${space2}handleAdd(id) {\n${space2}${space}this.$router.push({ path: "${this.formInfo.routeOfAdd}", query: { ${this.formInfo.routeQueryOfAdd}: id }});\n${space}${space}},`
                } else if (this.formInfo.addType === "model") {
                    addStr = `//新增操作\n${space2}handleAdd(id) {\n\n${space}${space}},`
                }
                resultStr = `${resultStr}${addStr}\n${space2}`
            }
            if (hasEdit) { //修改
                if (this.formInfo.editType === "jump") {
                    editStr = `//修改操作\n${space2}handleEdit(id) {\n${space2}${space}this.$router.push({ path: "${this.formInfo.routeOfEdit}", query: { ${this.formInfo.routeQueryOfEdit}: id }});\n${space}${space}},`
                } else if (this.formInfo.editType === "model") {
                    editStr = `//修改操作\n${space2}handleEdit(id) {\n\n${space}${space}},`
                }
                resultStr = `${resultStr}${editStr}\n${space2}`
            }
            if (hasView) { //查看
                if (this.formInfo.viewType === "jump") {
                    viewStr = `//查看操作\n${space2}handleView(id) {\n${space2}${space}this.$router.push({ path: "${this.formInfo.routeOfView}", query: { ${this.formInfo.routeQueryOfView}: id }});\n${space}${space}},`
                } else if (this.formInfo.viewType === "model") {
                    viewStr = `//查看操作\n${space2}handleView(id) {\n\n${space}${space}},`
                }
                resultStr = `${resultStr}${viewStr}\n${space2}`
            }
            if (hasDel) { //删除
                const confirmStr = `this.$confirm("此操作将永久删除此条记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                const params = {
                    ${this.formInfo.remoteRouteQueryOfDel}: id
                };
                this.axios.delete("${this.formInfo.deleteUrl}", { params }).then(res => {
                    
                }).catch(err => {
                    this.$errorThrow(err, this);
                });
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });`;
                delStr = `//删除操作\n${space2}handleDelete(id) {\n${space2}${space}${confirmStr}\n${space}${space}},`
                resultStr = `${resultStr}${delStr}\n${space2}`
            }
            
            copy(resultStr)
            this.$message.success("复制成功");
        },

        //关闭弹窗
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>



<style lang="scss">

</style>
