
/* 
    @description  所有路由必须遵循路由接口规范
    @autor        shuxiaokai
    @create       2019-07-31 17:23"
    @interface
        Route {
            path: "a-d-create",   //路由地址
            name: "新增计划",      //路由名称
            meta: {
                title: "新增计划", //用于显示在tabs上面的标题
                bread: [
                    { to: "", title: "计划管理" }, //面包屑导航， to字符串不为空则可以跳转到相应位置
                    { to: "", title: "计划草稿" },
                    { to: "/v1/a/a-d-create", title: "新增计划" }
                ],
                developer: {
                    name: "cc" //开发者信息(推荐使用自己姓名的拼音)
                },
                keyword: [], //用于搜索时显示相关路由信息
                couldBeMenu: true, //这个路由是否能成为左侧菜单
                couldShowGoBackTip: true, //是否展示返回上级按钮
                couldCache: false, //页面是否允许被缓存,注意：页面可以被缓存，则无法存在多个tab
                couldBeMulti: false, //页面是否允许存在多个tab
                permission: {}, //权限保留字段，未来页面权限将在这里面存取
            },            
        }
*/
import Vue from "vue"
import Router from "vue-router"
import store from "@/store/index"
// import { dfsForest } from "@/lib"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
//=====================================注册登陆页面====================================//
import login from "@/pages/login/login"
// import layout from "@/pages/layout/index"
//=====================================业务模块====================================//
//=====================================测试界面====================================//


Vue.use(Router)

const allRoutes = [
    {
        path: "/v1/a/a",
        name: "文档工具-文档列表",
        meta: {
            title: "项目列表"
        },
        component: () => import("@/pages/model/a/a"),
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
            redirect: "/v1/a/a"
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
    NProgress.start()
    if (store.state.permission.routes.length === 0) { //未获取到路由
        store.dispatch("getPermission").then(() => {
            next();
        }).catch(err => {
            next("/")
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
