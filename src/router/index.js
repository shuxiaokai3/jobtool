import Vue from "vue"
import Router from "vue-router"
import store from "@/store/index"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { BaseConfig } from "@/config.default.js"
//=====================================注册登陆页面====================================//
import login from "@/pages/login/login"
//=====================================业务模块====================================//
//=====================================测试界面====================================//


Vue.use(Router)

const allRoutes = [
    {
        path: "/v1/apidoc/doc-list",
        name: "文档工具-文档列表",
        meta: {
            title: "项目列表"
        },
        component: () => import("@/pages/modules/apidoc/doc-list/doc-list"),
    },
    {
        path: "/v1/apidoc/doc-edit",
        name: "文档工具-文档编辑",
        meta: {
            title: "文档编辑"
        },
        component: () => import("@/pages/modules/apidoc/doc-edit/doc-edit"),
    },
    {
        path: "/v1/b/b",
        name: "项目管理-常用网站列表",
        meta: {
            title: "常用网站管理"
        },
        component: () => import("@/pages/model/b/b"),
    },
    {
        path: "/v1/c/c",
        name: "文件管理-文件管理列表",
        meta: {
            title: "文件管理列表"
        },
        component: () => import("@/pages/model/c/c"),
    },
    {
        path: "/v1/c/c/add",
        name: "文件新增文件",
        meta: {
            title: "新增文件"
        },
        component: () => import("@/pages/model/c/add/add"),
    },
    {
        path: "/v1/a/edit",
        name: "文件管理修改文件",
        meta: {
            title: "修改文件"
        },
        component: () => import("@/pages/model/a/edit/edit"),
    },
    {
        path: "/v1/test",
        name: "测试界面",
        meta: {
            title: "测试界面"
        },
        component: () => import("@/pages/test/test"),
    },
    {
        path: "/v1/e/e",
        name: "在线面试",
        meta: {
            title: "在线面试"
        },
        component: () => import("@/pages/model/e/e")
    },
    {
        path: "/v1/g/g",
        name: "权限管理",
        meta: {
            title: "权限管理"
        },
        component: () => import("@/pages/model/g/g")
    },
]


const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/login",
            name: "登录页面",
            component: login
        },
        {
            path: "/d",
            name: "文档详情",
            meta: {
                title: "文档详情"
            },
            component: () => import("@/pages/model/d/d"),
        },
    ]
})



router.beforeEach((to, from, next) => { 
    NProgress.start();
    const hasPermission = store.state.permission.routes.length > 0; //挂载了路由代表存在权限
    if (BaseConfig.httpRequest.whiteList.find(val => val === to.path)) { //白名单内的路由直接放行
        next();
        return;
    }
    if (!hasPermission) { //未获取到路由
        store.dispatch("getPermission").then(() => {
            next();
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            //=====================================页面缓存处理，编辑页面id改变触发生命周期，id未改变不触发生命周期====================================//
            if (to.meta && to.meta.couldCache) {
                store.commit("changeRouterCache", { path: to.path, fullPath: to.fullPath })
            }
            NProgress.done()
        });
    }
    store.commit("layout/addTab", { path: to.path, fullPath: to.fullPath, title: to.meta.title }); //添加tabs
    next()
})

router.afterEach(() => {
    NProgress.done() // 页面顶部的加载条
})



export default router
export const routes = allRoutes;
