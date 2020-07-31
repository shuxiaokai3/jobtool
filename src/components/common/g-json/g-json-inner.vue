/*
    创建者：shuxiaokai
    创建时间：2020-07-28 15:21
    模块名称：json类型数据展示，支持备注信息
    备注：xxxx
*/
<template>
    <div class="s-json">
        <span v-if="level === 0" class="symbol">{</span>
        <!-- 数组 -->
        <template v-if="Array.isArray(data)">
            <div v-for="(value, key) in data" :key="key" class="indent">
                <span>
                    <!-- 数组 -->
                    <template v-if="Array.isArray(value)">
                        <span class="symbol">[</span>
                        <span v-if="!fullArray && typeof value[0] === 'object' && value !== null" class="symbol">{</span>
                        <s-json :full-array="fullArray" :data="fullArray ? value : value[0]" :level="level + 1"></s-json>
                        <span v-if="!fullArray && typeof value[0] === 'object' && value !== null" class="symbol">}</span>
                        <span class="symbol">]</span>
                    </template>
                    <!-- 对象 -->
                    <template v-else-if="typeof value === 'object'">
                        <span class="symbol">{</span>
                        <s-json :full-array="fullArray" :data="value" :level="level + 1"></s-json>
                        <span class="symbol">}</span>
                    </template>
                    <!-- 常规数据 -->
                    <template v-else>
                        <s-ellipsis-content v-if="typeof value === 'string'" class="string-value" :value='`"${value}"`'></s-ellipsis-content>
                        <s-ellipsis-content v-if="typeof value === 'number'" class="number-value" :value="value"></s-ellipsis-content>
                        <s-ellipsis-content v-if="typeof value === 'boolean'" class="boolean-value" :value="value"></s-ellipsis-content>
                    </template>
                    <span class="symbol">,</span>
                </span>                
            </div>
        </template>
        <!-- 对象 -->
        <template v-else-if="typeof data === 'object' && data !== null">
            <div v-for="(value, key) in data" :key="key" class="indent">
                <span>
                    <span class="key">{{ key }}</span>
                    <span class="symbol">:&nbsp;</span>
                    <!-- 数组 -->
                    <template v-if="Array.isArray(value)">
                        <span class="symbol">[</span>
                        <span v-if="!fullArray && typeof value[0] === 'object' && value !== null" class="symbol">{</span>
                        <s-json :full-array="fullArray" :data="fullArray ? value : value[0]" :level="level + 1"></s-json>
                        <span v-if="!fullArray && typeof value[0] === 'object' && value !== null" class="symbol">}</span>
                        <span class="symbol">]</span>
                    </template>
                    <!-- 对象 -->
                    <template v-else-if="typeof value === 'object'">
                        <span class="symbol">{</span>
                        <s-json :full-array="fullArray" :data="value" :level="level + 1"></s-json>
                        <span class="symbol">}</span>
                    </template>
                    <!-- 常规数据 -->
                    <template v-else>
                        <s-ellipsis-content v-if="typeof value === 'string'" class="string-value" :value='`"${value}"`'></s-ellipsis-content>
                        <s-ellipsis-content v-if="typeof value === 'number'" class="number-value" :value="value"></s-ellipsis-content>
                        <s-ellipsis-content v-if="typeof value === 'boolean'" class="boolean-value" :value="value"></s-ellipsis-content>
                    </template>
                    <span class="symbol">,</span>
                </span>                
            </div>
        </template>
        <!-- 常规数据 -->
        <template v-else>
            {{ data }}
        </template>
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
        fullArray: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return { 
        };
    },
    mounted() {
    },
    methods: {
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.s-json {
    // background: #F0F0F0;
    .indent {
        padding-left: 2em;
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

</style>
