<template>
    <div class="layout-container">
        <s-header></s-header>
        <div class="s-page-wrap">
            <s-banner></s-banner>
            <div class="main-pages">
                <s-tabs></s-tabs>
                <s-bread></s-bread>
                <s-content></s-content>
            </div>
        </div>
    </div>
</template>
<script>
import content from "./content/content.vue";
import banner from "./banner/banner.vue";
import tabs from "./tabs/tabs.vue";
import bread from "./bread/bread.vue";
import header from "./header/header.vue";
export default {
    components: {
        "s-content": content,
        "s-banner": banner,
        "s-tabs": tabs,
        "s-bread": bread,
        "s-header": header,
    },
    data() {
        return {
           
        };
    },
    created() {
       
    },
    mounted() {
    },
    
};
</script>

<style lang='scss'>
.layout-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .s-page-wrap {
        width: 100%;
        display: flex;
        flex: 0 0 auto;
        height: calc(100vh - #{size(40)});
        .main-pages {
            flex-grow: 0;
            flex-shrink: 0;
            width: calc(100vw - #{size(200)}); //修复表格加载导致宽度溢出bug
        }
    }
}
</style>
