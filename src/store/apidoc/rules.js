/**
 * @description        apidoc规则相关store
 * @author             shuxiaokai
 * @create             2020-06-25 11:25
 */
// import http from "@/api/api.js"
// const axios = http.axios;

export default {
    namespaced: true,
    state: {
        keyWhiteList: ["_id"], //请求参数key白名单
        allCondition: {

        },
        currentCondition: { //当前规则条件
            connected: -1, //0代表未连通，1代表连通，-1未请求
            status: -1, //-1代表未连通，200-299代表ok
            size: 0, //返回值大小(kb)
            resValid: -1, //0代表未校验，1代表校验通过，0代表校验未通过
        },
    },
    mutations: {
        //=====================================全局变量====================================//
       
    },
    actions: {
        
    },
};
