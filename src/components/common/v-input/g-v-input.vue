/*
    创建者：shuxiaokai
    创建时间：2020-07-08 13:14
    模块名称：带验证规则的input输入框
    备注：xxxx
*/
<template>
    <div class="v-input" :class="{'valid-error': error}">
        <el-input :value="value" v-bind="$attrs"  v-on="$listeners" @input="handleInput">
            <template slot="prepend">
                <slot name="prepend"/>
            </template>
        </el-input>
        <span v-show="error" class="error-tip">
            <span>{{ tip.message ? tip.message : tip }}</span>
            <span v-show="this.tip.reference" class="theme-color ml-2" @click="handleJumpToStander">查看规范</span>
            <slot name="tip" />
        </span>
    </div>
</template>

<script>
export default {
    props: {
        value: { //-----------v-model的值
            type: String,
            default: ""
        },
        tip: { //-------------错误提示信息
            type: [Object, String],
            default() {
                return {};
            }
        },
        error: { //-----------是否错误
            type: Boolean,
            default: false
        },
    },
    data() {
        return {

        };
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        handleInput(val) {
            this.$emit("input", val);
        },
        //查看规范
        handleJumpToStander() {
            window.open(this.tip?.reference)
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.v-input {
    width: 100%;
    position: relative;
    &.valid-error {
        .el-input__inner {
            animation: flash 2s infinite alternate;
            border-bottom: 1px solid $red!important;
        }
    }
    .error-tip {
        text-indent: size(12);
        font-size: size(12);
        position: absolute;
        top: size(30);
        line-height: size(12);
        left: 0;
        color: $orange;
    }
    @keyframes flash {
        0% {
            opacity: 1;
            background: mix($orange, $white, 30%);
        }
        100% {
            background: $white;
        }
    }
}
</style>
