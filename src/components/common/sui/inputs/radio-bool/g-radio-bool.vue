/*
    创建者：shuxiaokai
    创建时间：2020-03-30 15:19
    模块名称：布尔类型radio二次封装
    备注：xxxx
*/
<template>
    <s-col v-bind="$attrs">
        <!-- 存在el-form-item包裹 -->
        <el-form-item v-if="!noFormItem" :label="realLabel" :prop="prop" :label-width="labelWidth">
            <el-radio
                    :value="value" 
                    v-bind="$attrs"
                    :size="$root.VUE_BASE_CONFIG.styleConfig.size" 
                    :label="trueValue"
                    @change="handleInput"
                    v-on="$listeners"
            >
                {{ trueText }}
            </el-radio>
            <el-radio
                    :value="value" 
                    v-bind="$attrs"
                    :size="$root.VUE_BASE_CONFIG.styleConfig.size" 
                    :label="falseValue"
                    @change="handleInput"
                    v-on="$listeners"
            >
                {{ falseText }}
            </el-radio>
        </el-form-item>   
        <!-- 不存在el-form-item包裹 -->
        <div v-else>
            <el-radio
                    :value="value" 
                    v-bind="$attrs"
                    :size="$root.VUE_BASE_CONFIG.styleConfig.size" 
                    :label="trueValue"
                    @change="handleInput"
                    v-on="$listeners"
            >
                {{ trueText }}
            </el-radio>
            <el-radio
                    :value="value" 
                    v-bind="$attrs"
                    :size="$root.VUE_BASE_CONFIG.styleConfig.size" 
                    :label="falseValue"
                    @change="handleInput"
                    v-on="$listeners"
            >
                {{ falseText }}
            </el-radio>
        </div>
    </s-col>
</template>

<script>
export default {
    props: {
        label: { //文案
            type: String,
            default: ""
        },
        value: { //v-model绑定的值
            type: String,
            default: ""
        },
        noFormItem: { //是否存在el-form-item包裹
            type: Boolean,
            default: false
        },
        prop: { //表单验证prop值
            type: String,
            default: ""
        },
        trueText: {
            type: String,
            default: "是"
        },
        falseText: {
            type: String,
            default: "否"
        },
        trueValue: {
            type: [String, Boolean],
            default: "1"
        },
        falseValue: {
            type: [String, Boolean],
            default: "0"
        },
        labelWidth: {
            type: String,
            default: null
        },
    },
    data() {
        return {};
    },
    computed: {
        realLabel() { //实际label值，自动拼接
            if (this.label.endsWith("：")) {
                return this.label;
            } else if (this.label.endsWith(":")) {
                return this.label.replace(":", "：")
            } else {
                return this.label + "："
            }
        },
        placeholder() {
            return "请输入" + this.label;
        },
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        handleInput() {
            this.$emit("input", this.value);
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">

</style>
