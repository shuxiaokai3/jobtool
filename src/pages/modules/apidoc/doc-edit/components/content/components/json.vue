/*
    创建者：shuxiaokai
    创建时间：2020-07-28 15:21
    模块名称：json类型数据展示，支持备注信息
    备注：xxxx
*/
<template>
    <div ref="sJson" class="s-json" :class="{'json-wrap': level === 0}">
        <span v-if="level === 0" class="symbol">{</span>
        <div v-for="(item, index) in data" :key="index" class="indent">
            <!-- 常规数据类型 -->
            <template v-if="item.type !== 'array' && item.type !== 'object' && item.value">
                <span>
                    <span class="key">{{ item.key }}</span>
                    <span class="symbol">:&nbsp;</span>
                    <template v-if="item.type === 'object'">
                        <span class="symbol">{</span>
                        <s-json :data="item.children" :level="level + 1"></s-json>
                        <span class="symbol">}</span>
                    </template>
                    <template v-if="item.type === 'array'">
                        <span class="symbol">[</span>
                        <s-json :data="item.children[0]" :level="level + 1"></s-json>
                        <span class="symbol">]</span>
                    </template>
                    <template v-else>
                        <s-ellipsis-content v-if="item.type === 'string'" class="string-value" :value='`"${item.value}"`'></s-ellipsis-content>
                        <s-ellipsis-content v-if="item.type === 'number'" class="number-value" :value="item.value"></s-ellipsis-content>
                        <s-ellipsis-content v-if="item.type === 'boolean'" class="boolean-value" :value="item.value"></s-ellipsis-content>
                    </template>
                    <span class="symbol">,</span>
                    &nbsp;
                    <s-ellipsis-content class="comment" :value="`//${item.description}`"></s-ellipsis-content>
                </span>                
            </template>
            <!-- 对象和数组类型 -->
            <template v-else-if="item.type === 'array'|| item.type === 'object'">
                <span>
                    <span class="key">{{ item.key }}</span>
                    <span class="symbol">:&nbsp;</span>
                    <template v-if="item.type === 'object'">
                        <span class="symbol">{</span>
                        <s-json :data="item.children" :level="level + 1"></s-json>
                        <span class="symbol">}</span>
                    </template>
                    <template v-if="item.type === 'array'">
                        <span class="symbol">[</span>
                        <s-json :data="item.children[0]" :level="level + 1"></s-json>
                        <span class="symbol">]</span>
                    </template>
                    <template v-else>
                        <s-ellipsis-content v-if="item.type === 'string'" class="string-value" :value='`"${item.value}"`'></s-ellipsis-content>
                        <s-ellipsis-content v-if="item.type === 'number'" class="number-value" :value="item.value"></s-ellipsis-content>
                        <s-ellipsis-content v-if="item.type === 'boolean'" class="boolean-value" :value="item.value"></s-ellipsis-content>
                    </template>
                    <span class="symbol">,</span>
                    &nbsp;
                    <s-ellipsis-content class="comment" :value="`//${item.description}`"></s-ellipsis-content>
                </span> 
            </template>
        </div>
        <span v-if="level === 0" class="symbol">}</span>
    </div>
</template>

<script>
export default {
    name: "SJson",
    props: {
        data: {
            type: [Object, Array],
            default() {
                return {};
            }
        },
        level: {
            type: Number,
            default: 0
        },
        indent: {
            type: Number,
            default: 20
        },
        path: {
            type: String,
            default: ""
        },
        options: {
            type: Object,
            default() {
                return {
                    key: "key",
                    value: "value",
                    type: "type",
                    description: "description"
                }
            }
        },
    },
    data() {
        return { 

        };
    },
    mounted() {
        this.init();
    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//
        init() {
            // this.$refs["sJson"].style.paddingLeft = this.indent + "px";
        },
        //=====================================组件间交互====================================//  
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.s-json {
    background: #1E1E1E;
    // background: #F0F0F0;
    font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    font-size: size(13);
    .indent {
        padding-left: size(25);
    }
    .key {
        color: $blue,
    }
    .symbol {
        color: $gray-300;
    }
    .string-value {
        color: $orange;
    }
    .boolean-value {
        color: #499CB3;
    }
    .number-value {
        color: #80C0A8;
    }
    .comment {
        color: #6A9955;
    }

}
.json-wrap {
    padding: size(10) size(10);
    border-radius: $border-radius-sm;
}
</style>
