/**
    创建者：shuxiaokai
    创建时间：2020-03-23 11:32"
    模块名称：复制为搜索参数
    备注：xxxx
*/
<template>
    <el-dialog title="复制为搜索参数" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="80%">
        <div>
            <el-table ref="table" :data="tableData" stripe border size="mini" height="400px" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="key" label="参数名称" align="center"></el-table-column>
                <el-table-column prop="description" label="备注" align="center"></el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.__type" size="mini" class="w-100">
                            <el-option v-for="(item, index) in typeEnum" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="选项" width="700px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.__type === 'select'">
                            <span>多选：</span>
                            <el-switch v-model="scope.row.__multi" size="mini"></el-switch>
                            <span class="mx-2 gray-500">|</span>
                            <span>请求地址：</span>
                            <input v-model="scope.row.__url" type="text" placeholder="eg: /plan/enum" class="w-100px">
                            <span class="mx-2 gray-500">|</span>
                            <span>参数映射：</span>
                            id：<input v-model="scope.row.__id" type="text" placeholder="eg: id" class="w-100px">
                            name：<input v-model="scope.row.__name" type="text" placeholder="eg: name" class="w-100px">
                        </div>
                        <div v-if="scope.row.__type === 'date'">
                            <el-radio-group v-model="scope.row.__dateLimit">
                                <el-radio label="none">无条件</el-radio>
                                <el-radio label="gt">大于今天</el-radio>
                                <el-radio label="gte">大于等于今天</el-radio>
                                <el-radio label="lt">小于今天</el-radio>
                                <el-radio label="lte">小于等于今天</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.__type === 'daterange'">
                            <div>
                                <el-radio-group v-model="scope.row.__time" size="mini">
                                    <el-radio-button label="startTime">开始日期</el-radio-button>
                                    <el-radio-button label="endTime">结束日期</el-radio-button>
                                </el-radio-group>
                                <span class="mx-2 gray-500">|</span>
                                <span>标记：</span>
                                <input v-model="scope.row.__daterangeFlag" type="text" placeholder="确定哪两个参数为一组">                                
                            </div>
                            <el-radio-group v-model="scope.row.__dateLimit" size="mini">
                                <el-radio label="none">无条件</el-radio>
                                <el-radio label="gt">大于今天</el-radio>
                                <el-radio label="gte">大于等于今天</el-radio>
                                <el-radio label="lt">小于今天</el-radio>
                                <el-radio label="lte">小于等于今天</el-radio>
                            </el-radio-group>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleCopy">复制表格html</el-button>
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
    },
    data() {
        return {
            spaceNum: 4, //格式化空格标准
            selectData: [], //已经选择数据
            blockKeywords: ["code", "msg", "message", "data", "rows", "total", "id", "_id"], //自动过滤参数
            typeEnum: [{
                label: "普通输入框",
                value: "input"
            }, {
                label: "下拉框",
                value: "select"
            }, {
                label: "单日期",
                value: "date"
            }, {
                label: "多日期",
                value: "daterange"
            }], //输入框类型枚举
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
                            this.$refs.table.toggleRowSelection(val, true);
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
            // const space3 = " ".repeat(this.spaceNum * 3);
            const searchItemTemplate = this.generateSearchItemTemplate();
            // const curdTemplate = this.generateCurdTemplate();
            // const resultStr = `<s-table ref="table" url="${this.url}">\n${space3}${searchItemTemplate}${curdTemplate}</s-table>`;
            copy(searchItemTemplate);
            // this.$message.success("复制成功");
            console.log(searchItemTemplate)
        },
        //=====================================代码片段生成====================================//
        //生成table-column模板
        generateSearchItemTemplate() {
            let resultStr = "";
            const space3 = " ".repeat(this.spaceNum * 3);
            const daterangeCache = [];
            for (let i = 0, len = this.selectData.length; i < len; i++) {
                const itemType = this.selectData[i].__type;
                const vModel = this.selectData[i].key;
                const label = this.selectData[i].description;
                const multi = this.selectData[i].__multi;
                const selectUrl = this.selectData[i].__url;
                const propsId = this.selectData[i].__id;
                const propsName = this.selectData[i].__name;
                const datarangeFlag = this.selectData[i].__daterangeFlag; //日期时间flag
                const endModel = this.selectData.find((val, index) => val.__daterangeFlag === datarangeFlag && index !== i);
                const vModel2 = endModel ? endModel.key : ""; 
                const propsStr = (propsId === "id" && propsName === "name") ? "" : ` props="{id: '${propsId}', name: '${propsName}'}"`;
                const dateLimitStr = this.selectData[i].__dateLimit === "none" ? "" : ` dateLimit="${this.selectData[i].__dateLimit}"`;
                /*eslint-disable indent*/ 
                switch (itemType) {
                    case "input":
                        resultStr = `${resultStr}\n${space3}<s-search-item vModel="${vModel}" label="${label}"></s-search-item>`
                        break;
                    case "select":
                        resultStr = `${resultStr}\n${space3}<s-search-item vModel="${vModel}" label="${label}" type="select" selectUrl="${selectUrl}"${propsStr}${multi ? "multi" : ""}></s-search-item>`
                        break;
                    case "date":
                        resultStr = `${resultStr}\n${space3}<s-search-item vModel="${vModel}" label="${label}" type="date"${dateLimitStr}></s-search-item>`
                        break;
                    case "daterange":
                        if (!daterangeCache.includes(datarangeFlag)) {
                            const startTime = (this.selectData[i].__time === "startTime") ? vModel : vModel2;
                            const endTime = (this.selectData[i].__time === "startTime") ? vModel2 : vModel;
                            resultStr = `${resultStr}\n${space3}<s-search-item vModel="${startTime}" vModel2="${endTime}" label="${label}" type="daterange"${dateLimitStr}></s-search-item>`
                        }
                        break;
                    default:
                        break;
                }
                if (endModel) { //将daterange添加至缓存避免重复添加
                    daterangeCache.push(endModel.__daterangeFlag);
                }
            }
            resultStr = `<!-- 搜索条件 -->
        <s-search autoRequest @change="handleChange">${resultStr}
        </s-search>
            `
            return resultStr;
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
