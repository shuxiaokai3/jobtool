/** 
 * @description        公共组件相关内容
 * @autor              shuxiaokai
 * @create             2020-05-31 15:15
 */

export default {
    state: {
        searchLoading: false, //table组件搜索加载效果
    },
    mutations: {
        changeSearchLoading(state, payload) {
            state.searchLoading = payload;
        }
    },
}

