/** 
 * @description        全局卡片
 * @autor              shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-02-17 15:28
 * @update             2020-02-17 15:28
 */
<template>
    <div 
            class="widget-card" 
            :style="{ width: width }"
    >
        <header v-if="$slots.operation || title">
            <div class="title" :title="title" :style="{ color: titleColor }">{{ title }}</div>
            <div class="operation">
                <slot name="operation"></slot>
            </div>
        </header>
        <!-- 搜索 -->
        <section ref="content" class="content">
            <slot></slot>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        title: { // card头部标题
            type: String,
            default: ""
        },
        width: { //宽度
            type: String,
            default: "100%"
        },
        inline: {
            type: Boolean,
            default: false
        },
        titleColor: {
            type: String,
            default: "#444"
        },
    },
    data() {
        return {
        
        };
    },
    mounted() {
  
    },
    methods: {
        
    }
};
</script>



<style lang="scss">
.widget-card {
    width: 100%;
    height: 100%;
    border: 1px solid $gray-200;
    background: $white;
    border-radius: $border-radius-base;
    display: flex;
    flex-direction: column;
    // 头部
    header {
        display: flex;
        border-bottom: 1px solid $gray-200;
        justify-content: space-between;
        align-items: center;
        flex: 0 0 size(40);
        padding: 0 size(20);
        .title {
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .operation {
            display: flex;
            &>div {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: size(25);
                height: size(25);
                cursor: pointer;
                color: $gray-600;
                &:hover {
                    background: $gray-300;
                }
            }
        }
    }
    // 内容区域
    .content {
        flex: 1;
        overflow: hidden;
    }
}
</style>
