/**
 * @description        apidoc相关store
 * @author              shuxiaokai
 * @create             2020-06-25 11:25
 */
import Vue from "vue"
import http from "@/api/api.js"
const axios = http.axios;

export default {
    namespaced: true,
    state: {
        defaultExpandKeys: [], //-----默认展开的节点
        banner: [], //----------------树形导航
        tabs: {}, //------------------api文档tabs
        activeDoc: {}, //-----------当前被选中的tab页
    },
    mutations: {
        //改变文档banner信息
        changeDocBanner(state, payload) {
            state.banner = payload;
        },
        //=====================================tabs====================================//
        //新增一个tab
        addTab(state, payload) {
            const { _id, projectId } = payload;
            const docInfo = payload;
            const isInProject = state.tabs[projectId]; //当前项目是否存在tabs
            if (!isInProject) {
                Vue.set(state.tabs, projectId, []);
            }
            const hasTab = state.tabs[projectId].find(val => val._id === _id);
            if (!hasTab) {
                state.tabs[projectId].push(docInfo);
                localStorage.setItem("apidoc/editTabs", JSON.stringify(state.tabs))
            }
        },
        //改变某个tab信息
        changeTabInfoById(state, payload) {
            const { _id, projectId, docName } = payload;
            const matchedData = state.tabs[projectId]?.find(val => val._id === _id);
            if (matchedData && docName) {
                matchedData.docName = docName;
            }
            localStorage.setItem("apidoc/editTabs", JSON.stringify(state.tabs))
        },
        //更新所有tab
        updateAllTabs(state, payload) {
            const { projectId, tabs } = payload;
            if (!state.tabs[projectId]) {
                Vue.set(state.tabs, projectId, []);
            }
            state.tabs[projectId] = tabs;
            localStorage.setItem("apidoc/editTabs", JSON.stringify(state.tabs))
        },
        //根据位置删除tab
        deleteTabByPosition(state, payload) {
            const { projectId, start, num } = payload;
            if (state.tabs[projectId]) {
                state.tabs[projectId].splice(start, num);
            }
            localStorage.setItem("apidoc/editTabs", JSON.stringify(state.tabs))
        },
        //根据id删除tab
        deleteTabById(state, payload) {
            const { projectId, deleteIds } = payload;
            if (state.tabs[projectId]) {
                const deleteIndexArr = [];
                state.tabs[projectId].forEach((val, index) => {
                    if (deleteIds.includes(val._id)) {
                        deleteIndexArr.push(index);
                    }
                })
                deleteIndexArr.forEach(index => {
                    state.tabs[projectId].splice(index, 1);
                })
                
            }
        },
        //=====================================当前选中的tab====================================//
        //更新当前被选中的文档(不能未folder)
        changeCurrentTab(state, payload) {
            const { projectId, activeNode } = payload;
            const isInProject = state.activeDoc[projectId]; //当前项目是否存在tabs
            if (!isInProject) {
                Vue.set(state.activeDoc, projectId, {});
            }
            state.activeDoc[projectId] = activeNode;
            localStorage.setItem("apidoc/activeTab", JSON.stringify(state.activeDoc))
        },
        //改变当前选中tab的基本信息
        changeCurrentTabById(state, payload) {
            const { projectId, docName } = payload;
            const matchedData = state.activeDoc[projectId];
            if (matchedData && docName) {
                matchedData.docName = docName;
            }
            localStorage.setItem("apidoc/activeTab", JSON.stringify(state.activeDoc))
        },
    },
    actions: {
        async getDocBanner(context, payload) {
            return new Promise((resolve, reject) => {
                const params = {
                    _id: payload._id
                };
                axios.get("/api/project/doc_tree_node", { params }).then(res => {
                    const result = res.data;
                    context.commit("changeDocBanner", result);
                    resolve();
                }).catch(err => {
                    console.error(err);
                    reject(err);
                });                
            })

        }
    },
};
