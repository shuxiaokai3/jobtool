/**
 * @description        apidoc相关store
 * @author              shuxiaokai
 * @create             2020-06-25 11:25
 */
import Vue from "Vue"
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
        //更新所有tab
        updateAllTabs(state, payload) {
            const { projectId, tabs } = payload;
            if (!state.tabs[projectId]) {
                Vue.set(state.tabs, projectId, []);
            }
            state.tabs[projectId] = tabs;
            localStorage.setItem("apidoc/editTabs", JSON.stringify(state.tabs))
        },

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
        //根据位置删除
        deleteTabByPosition(state, payload) {
            const { projectId, start, num } = payload;
            if (state.tabs[projectId]) {
                state.tabs[projectId].splice(start, num);
            }
            localStorage.setItem("apidoc/editTabs", JSON.stringify(state.tabs))
        },



        //改变当前file信息
        changeCurrentFileTab(state, payload) {
            const { projectId, id, title, method, nodeType } = payload;
            if (!id) { //清空fileTab
                Vue.set(state.currentFileTab, payload.projectId, null);
                localStorage.setItem("currentFileTab", JSON.stringify(state.currentTab));
                return;
            }
            const docInfo = { id, title, method, projectId, nodeType };
            Vue.set(state.currentFileTab, projectId, docInfo);
            localStorage.setItem("currentFileTab", JSON.stringify(state.currentFileTab))
        },
        //改变tabs文档信息
        changeTabInfo(state, payload) {
            const { tabId, projectId, method } = payload;
            if (state.tabs && state.tabs[projectId]) {
                state.tabs[projectId].forEach(tab => {
                    if (tab.id === tabId) {
                        tab.method = method;
                    }
                })
            }
            localStorage.setItem("currentFileTab", JSON.stringify(state.currentFileTab))
        },
        //删除一个tab
        deleteTab(state, payload) {
            const { projectId, id } = payload;
            let deleteIndex = 0;
            const allTabs = state.tabs[projectId]
            if (allTabs) {
                deleteIndex = allTabs.findIndex(val => val.id === id)
                if (state.currentTab[projectId] && id === state.currentTab[projectId].id) {
                    if (allTabs[deleteIndex + 1] != null) { //右侧还有标签
                        this.commit("changeCurrentTab", {
                            projectId,
                            ...allTabs[deleteIndex + 1]
                        })
                    } else if (allTabs[deleteIndex + 1] == null && allTabs[deleteIndex - 1] != null) { //右侧没有标签并且左侧有标签
                        this.commit("changeCurrentTab", {
                            projectId,
                            ...allTabs[deleteIndex - 1]
                        })
                    } else if (allTabs[deleteIndex + 1] == null && allTabs[deleteIndex - 1] == null) { //左右都不存在id
                        this.commit("changeCurrentTab", { projectId });
                        this.commit("changeCurrentFileTab", { projectId });
                    }
                    localStorage.setItem("currentTab", JSON.stringify(state.currentTab));
                }
                allTabs.splice(deleteIndex, 1);
                localStorage.setItem("editDocTabs", JSON.stringify(state.tabs))
                // localStorage.setItem("tabs", JSON.stringify(state.tabs[projectId]));   
            }
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
