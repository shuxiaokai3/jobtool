/*
    创建者：shuxiaokai
    创建时间：2020-07-10 20:13
    模块名称：请求返回信息
    备注：xxxx
*/
<template>
    <div class="response">
        <s-collapse title="基本信息">
            <div>
                <div class="my-2">
                    <span>请求地址：</span>
                    <span class="f-xs">{{ requestData.url.host ? requestData.url.host : host }}</span>
                    <span class="f-xs">{{ requestData.url.path }}</span>
                </div>
                <div class="my-2">
                    <span>请求方式：</span>
                    <span class="f-xs green">{{ requestData.methods.toUpperCase() }}</span>
                </div>
            </div>
        </s-collapse>
        <s-collapse title="请求头">
            <template v-if="requestData.header.length > 1">
                <div v-for="(item, index) in requestData.header" :key="index" class="d-flex a-center my-2">
                    <span v-if="item.key" class="flex0">{{ item.key }}：</span>
                    <span class="f-xs text-ellipsis" :title="item.value">{{ item.value }}</span>
                </div>
            </template>
            <div v-else class="f-xs gray-500">暂无数据</div>
        </s-collapse>
        <s-collapse title="请求参数">
            <pre class="request-params">{{ requestParams }}</pre>
        </s-collapse>
    </div>
</template>

<script>
import { getType, dfsForest } from "@/lib/utils"
// import { BaseConfig } from "@/config.default"
export default {
    props: {
        requestData: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    computed: {
        // 请求参数
        requestParams() {
            const plainData = JSON.parse(JSON.stringify(this.requestData.responseParams)); //扁平数据
            const result = this.convertPlainParamsToTreeData(plainData);
            return result;
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
        convertPlainParamsToTreeData(plainData) {
            // console.log(plainData)
            const result = {};
            const foo = (plainData, result) => {
                for(let i = 0,len = plainData.length; i < len; i++) {
                    console.log(plainData[i])
                    const key = plainData[i].key.trim();
                    const value = plainData[i].value;
                    const type = plainData[i].type;
                    const desc = plainData[i].description;
                    const isComplex = (type === "object" || type === "array");
                    if (isComplex && key === "") { //复杂数据必须填写参数名称
                        continue;
                    }
                    if (!isComplex && (key === "" || value === "")) { //非复杂数据需要填写参数名称
                        continue
                    }
                    // console.log(type)    
                    /*eslint-disable indent*/ 
                    switch (type) {
                        case "number": //数字类型需要转换为数字，转换前所有值都为字符串
                            result[key] = Number(value);
                            break;
                        case "boolean": //字符串类型不做处理
                            result[key] = (value === "true" ? true : false);
                            break;
                        case "object":
                            console.log(plainData[i].children, 999)
                            result[key] = {};
                            if (plainData[i].children && plainData[i].children.lengh > 0) {
                                foo(plainData[i].children, result[key]);
                            }
                            break;
                        case "array":
                            result[key] = {};
                            if (plainData[i].children && plainData[i].children.lengh > 0) {
                                foo(plainData[i].children, result[key]);
                            }
                            break;
                        default: //字符串或其他类型类型不做处理
                            result[key] = value;
                            break;
                    }


                }
            }
            foo(plainData, result);
            return result;
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">

</style>
