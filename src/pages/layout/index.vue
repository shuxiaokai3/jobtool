/*
    创建者：shuxiaokai
    创建时间：2020-06-15 18:55
    模块名称：
    备注：xxxx
*/
<template>
    <components :is="layout"></components>  
</template>

<script>
import layout from "@/pages/layout/layout/index"
import layout2 from "@/pages/layout/layout2/index"
export default {
    components: {
        "layout": layout,
        "layout2": layout2,

    },
    data() {
        return {
            
        };
    },
    computed: {
        layout() {
            return this.$store.state.config.pageConfig.layout
        }
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">

</style>
