/** 
 * @description        权限相关
 * @author             shuxiaokai
 * @create             2020-02-25 16:38
 */
import api from "@/api/api"
import router from "@/router"
import { routes } from "@/router"
import unique from "@/lib/array/unique"
import layout from "@/pages/layout/layout/index"
import notFound from "@/pages/layout/layout/404/404.vue"
const axios = api.axios;
export default {
    state: {
        userInfo: {}, //-----------用户信息
        routes: [], //-------------路由
        menus: [], //--------------用户菜单
        loadingBanner: false, //---是否加载banner中
    },
    mutations: {
        //改变当前访问菜单
        changeMenus(state, payload) {
            state.menus = payload;
        },
        //改变用户可访问路由
        changeRoutes(state, payload) {
            const routes = payload;
            let localRoutes = sessionStorage.getItem("routes") || "[]";
            localRoutes = JSON.parse(localRoutes);
            const storeRoutes = unique(localRoutes.concat(routes), "path");
            sessionStorage.setItem("routes", JSON.stringify(storeRoutes));
            state.routes = storeRoutes;
        },  
        // 动态生成路由
        generateRoutes(state) {
            const matchedRoutes = [];
            routes.forEach((route) => { //遍历本地所有路由
                state.routes.forEach(val => {
                    if (val.path === route.path) {
                        if (!matchedRoutes.find(m => m.path === val.path)) { //如果已经存在匹配的数据则不再push
                            matchedRoutes.push(route);
                        }
                    }
                });
            });
            router.addRoutes([
                {
                    path: "/v1",
                    component: layout,
                    children: [
                        ...matchedRoutes
                    ],
                },
                {
                    path: "*",
                    redirect: "/404"
                },
                {
                    path: "/404",
                    component: notFound
                }
            ])
        },
        // 清空全部权限
        clearAllPermission(state) {
            state.userInfo = {};
            state.routes = [];
            state.menus = [];
        },
        //=====================================用户基本信息====================================//
        changeUserInfo(state, payload) {
            state.userInfo = {
                loginName: payload.loginName,
                realName: payload.realName,
                phone: payload.phone,
            };
        },
    },
    actions: {
        async getPermission(context) {
            return new Promise((resolve, reject) => {
                axios.get("/api/security/user_base_info").then(res => { 
                    context.commit("changeUserInfo", res.data);
                    context.commit("changeMenus", res.data.clientBanner);
                    context.commit("changeRoutes", res.data.clientRoutes);
                    context.commit("generateRoutes");
                    resolve(res.data);
                }).catch(err => {
                    // console.error(err);
                    reject(err);
                })                   
            });
        }
    }
}
