/*
    创建者：shuxiaokai
    创建时间：2020-07-30 17:31
    模块名称：
    备注：xxxx
*/
<template>
    <div class="json-wrap">
        <s-json-inner :data="data" fullArray></s-json-inner>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: [Object, Array],
            default() {
                return {};
            }
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
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.json-wrap {
    padding: size(10) size(10);
    position: relative; //递归组件只在外层添加relative，否则offsetleft取值会出现问题
    border-radius: $border-radius-sm;
    background: #1E1E1E;
    font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    font-size: size(13);
}
</style>
