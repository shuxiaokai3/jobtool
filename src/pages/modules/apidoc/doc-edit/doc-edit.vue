/*
    创建者：shuxiaokai
    创建时间：2020-06-24 20:24
    模块名称：文档编辑界面
    备注：xxxx
*/
<template>
    <div class="doc-edit">
        <s-banner></s-banner>
    </div>
</template>

<script>
import banner from "./components/banner/banner"
export default {
    components: {
        "s-banner": banner
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
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.doc-edit {
    height: calc(100vh - 60px);
}
</style>
