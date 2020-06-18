/*
    创建者：shuxiaokai
    创建时间：2019-10-29 19:04
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="s-collaps mb-1">
        <div class="header mb-1" @click="isActive = !isActive">
            <span :class="{'el-icon-caret-bottom': isActive, 'el-icon-caret-right': !isActive}"></span>
            <span>{{ title }}</span>
        </div>
        <div class="pl-2" :class="{'h-0': !isActive}">
            <slot />            
        </div>

    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "请输入标题"
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isActive: false
        };
    },
    watch: {
        active: {
            handler() {
                this.isActive = this.active;
            },
            immediate: true
        },
    },
    created() {

    },
    methods: {

    }
};
</script>



<style lang="scss">
.s-collaps {
    .header {
        cursor: pointer;
    }
    .h-0 {
        height: 0;
        overflow: hidden;
    }
}
</style>
