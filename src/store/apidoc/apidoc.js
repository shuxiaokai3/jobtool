/**
 * @description        apidoc相关store
 * @author              shuxiaokai
 * @create             2020-06-25 11:25
 */

import { axios } from "@/api/api.js"


export default {
    namespaced: true,
    state: {
        banner: [], //------树形导航

    },
    actions: {
        async getDocBanner(context, payload) {
            const params = {
                _id: payload._id
            };
            axios.get("/api/project/doc_tree_node", { params }).then(res => {
                const result = res.data;
                
                });
                context.commit("changeDocBanner", result);
            }).catch(err => {
                console.error(err);
            });
        }
    },
};
