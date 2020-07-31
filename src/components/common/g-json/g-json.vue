/*
    创建者：shuxiaokai
    创建时间：2020-07-30 17:31
    模块名称：
    备注：xxxx
*/
<template>
    <div class="json-wrap">
        <div class="operation">
            <div class="item" title="默认情况数组数据只展示一个，展示全部将显示完整数据" :class="{active: activeFullArray}" @click="activeFullArray = !activeFullArray">完整数据</div>
            <div class="item" title="将当前返回值应用为响应参数" @click="handleExport">应用为响应值</div>
        </div>
        <s-json-inner :data="data" :fullArray="activeFullArray"></s-json-inner>
    </div>
</template>

<script>
import uuid from "uuid/v4"
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
            activeFullArray: false
        };
    },
    created() {

    },
    methods: {
        handleExport() {
            const copyData = JSON.parse(JSON.stringify(this.data));
            const hasOwn = Object.hasOwnProperty;
            const result = [];
            const foo = (obj, result) => {
                for(let i in obj) {
                    if (!hasOwn.call(obj, i)) continue;
                    const valueType = this.getType(obj[i]);
                    if (valueType === "string" || valueType === "number" || valueType === "boolean") {
                        result.push({
                            key: i,
                            type: valueType,
                            value: obj[i].toString(),
                        })
                    } else if (valueType === "object") {
                        const current = {
                            key: i,
                            type: valueType,
                            value: "",
                            children: []
                        }
                        result.push(current)
                        foo(obj[i], current.children);
                    } else if (valueType === "array") {
                        const current = {
                            key: i,
                            type: valueType,
                            value: "",
                            children: []
                        }
                        result.push(current)
                        foo(obj[i][0], current.children);
                    }
                }
            }
            foo(copyData, result);
            this.$emit("export", result);
        },
        //生成请求数据
        generateParams() {
            return {
                id: uuid(),
                key: "",
                description: "",
                type: 1,
                value: "",
                required: true,
            }
        },
        //获取参数类型
        getType(value) {
            if (typeof value === "string") {
                return "string"
            } else if (typeof value === "number") { //NaN
                return "number"
            } else if (typeof value === "boolean") {
                return "boolean"
            } else if (Array.isArray(value)) {
                return "array"
            } else if (typeof value === "object" && value !== null) {
                return "object"
            } else { // null undefined ...
                return "string"
            }

        }
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
    max-height: size(400);
    overflow-y: auto;
    .operation {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: size(20);
        color: $gray-500;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        .item {
            cursor: pointer;
            user-select: none;
            margin-right: size(10);
            &.active {
                color: $green;
            }
        }
    }
}
</style>
