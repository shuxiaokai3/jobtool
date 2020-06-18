import routeList from "./layout.json";
import { BaseConfig } from "@/config.default"
export default {
    namespaced: true,
    state: {
        tabs: [], //标签
        banner: [], //左侧菜单banner
        routerCacheList: [], //缓存列表，针对编辑页面进行缓存，对于查询参数改变的更新列表数据
        freshCachePageFlag: true, //是否更新缓存页面标识符
    },
    mutations: {
        //=====================================tabs切换====================================//
        /** 
         * @description        新增一个tab
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2020-01-14 14:27
         * @update             2020-01-14 14:27
         * @param {String}     path - 路径       
         * @param {String}     fullPath - 完整路径       
         * @param {String}     title- 标题       
         */
        addTab(state, payload) {
            const { path, fullPath, title } = payload;
            if (!title || !path || !fullPath) {
                console.warn("缺少title,path,fullpath中任意一项")
                return
            }
            const tabInfo = { path, title, fullPath };
            if (state.tabs.some(tab => tab.path === payload.path)) {
                return
            }
            state.tabs.push(tabInfo);
            
            sessionStorage.setItem("layoutTabs", JSON.stringify(state.tabs))
        },
        //清楚所有tabs
        clearTabs(state) {
            state.tabs = [];
            sessionStorage.removeItem("layoutTabs")
        },
        //更新所有tab
        changeAllTabs(state, payload) {
            state.tabs = payload;
            sessionStorage.setItem("layoutTabs", JSON.stringify(state.tabs))
        },
        /** 
         * @description        删除一个tab
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2020-01-14 14:24
         * @update             2020-01-14 14:24
         * @param {String}     path - 当前tab的path       
         */
        deleteTab(state, payload) {
            const { path } = payload;
            const deleteIndex = state.tabs.findIndex(val => val.path === path)
            state.tabs.splice(deleteIndex, 1);
            sessionStorage.setItem("layoutTabs", JSON.stringify(state.tabs))
        },
        /** 
         * @description        根据起始位置删除
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2020-01-14 17:37
         * @update             2020-01-14 17:37
         * @param {String}     projectId - 项目id     
         * @param {Number}     start - 删除起始位置       
         * @param {Number}     num - 删除数量       
         */
        deleteTabByPosition(state, payload) {
            const { start, num } = payload;
            if (state.tabs) {
                state.tabs.splice(start, num);
            }
            sessionStorage.setItem("layoutTabs", JSON.stringify(state.tabs))
        },
        //=====================================更新用户菜单====================================//
        changePermission(state,) {
            if (process.env.NODE_ENV === "development" && BaseConfig.couldShowAllBanners) {
                state.banner = routeList;
            } else {
                state.banner = routeList;
                // const resources = payload.children;
                // const banners = [];
                // const formatBanner = (value, result) => {
                //     for (let i = 0; i < value.length; i++) {
                //         // if (!value[i].state2) {
                //         //     continue
                //         // }
                //         result.push({
                //             name: "",
                //             path: "",
                //             children: []
                //         });
                //         if (value[i].children && value[i].children.length > 0) {
                //             formatBanner(value[i].children, result[i].children);
                //         } 
                //         result[i].path = value[i].url ? value[i].url : Math.random().toString();//后端配置url
                //         result[i].name = value[i].text;
                //         result[i].icon = value[i].resourceIcon;
                //     }
                // }
                // formatBanner(resources, banners);
                // // console.log(resources, "luyou")
                // state.banner = banners                
            }
        },
        //缓存相关
        /** 
            @description  改变一个页面缓存
            @autor        shuxiaokai
            @create       2019-10-19 13:25"
            @params       { path: "/v1/d", fullPath: "/v1/d/d-edit?id=2168" }     当前路由完整路径
        */
        changeRouterCache(state, payload) {
            const { path = "", fullPath = "" } = payload;
            for (let i = 0, len = state.routerCacheList.length; i < len; i++) {
                if (state.routerCacheList[i].path === path && state.routerCacheList[i].fullPath !== fullPath) { //找到页面缓存
                    this.commit("freshCachePage");
                    state.routerCacheList[i].fullPath = fullPath;
                    break;
                }
            }
            if (state.routerCacheList.every(val => val.path !== path)) { //页面中没有缓存
                state.routerCacheList.push({
                    path,
                    fullPath
                });
            }
        },
        /**
            @description  刷新缓存页面，通过v-if重新加载路由
            @autor        shuxiaokai
            @create       2019-10-19 13:29"
        */
        freshCachePage(state) {
            console.log("fresh")
            state.freshCachePageFlag = false;
            setTimeout(() => {
                state.freshCachePageFlag = true;
            }, 10)
        },
    },
    actions: {}
}
