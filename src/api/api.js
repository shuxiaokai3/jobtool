
import axios from "axios"
import router from "../router"
import { BaseConfig } from "@/config.default"
import jsCookie from "js-cookie"


import mock from "@/mock/development"

mock(axios)


const axiosInstance = axios.create({
    baseURL: BaseConfig.devUrl
}) //修复mock触发两次的问题

axiosInstance.defaults.withCredentials = true //允许携带cookie
axiosInstance.defaults.timeout = BaseConfig.httpRequest.timeout //超时时间
if (process.env.NODE_ENV === "development") {
    axiosInstance.defaults.baseURL = BaseConfig.devUrl //
} else {
    axiosInstance.defaults.baseURL = BaseConfig.proUrl
}






/*eslint-disable*/

export default {
    install: function(Vue) {
        let timer = Date.now(); //统计接口用时
        let timer2 = Date.now(); //统计接口用时
        //const allRequestList = []; //所有请求存放数组，用于取消某些特定请求
        let isExpireRequest = false;
        //===============================axiosInstance请求钩子==========================================//
        axiosInstance.interceptors.request.use(
            config => {
                timer = Date.now();
                // config.cancelToken = new axios.CancelToken((c) => {
                //     allRequestList.push(
                //         {
                //             url: config.url,
                //             cancelFn: c
                //         }
                //     );
                // });
                config.headers["x-csrf-token"] = jsCookie.get("csrfToken");
                return config
            },
            err => {
                timer = Date.now();
                return Promise.reject(err)
            }
        )
        
        //===============================axiosInstance响应钩子=======================================//
        axiosInstance.interceptors.response.use(
            res => {
                let result = res.data;
                timer2 = Date.now() - timer;
                if (timer2 > BaseConfig.httpRequest.longRequestLimit) {
                    Vue.prototype.$langRequestWarning(res, timer2, router.currentRoute)
                }
                const headers = res.headers || {};
                const contentType = headers["content-type"] ? headers["content-type"].split(";")[0] : "application/json";
                if (!contentType.includes("application/json")) { //非常规数据
                    const contentDisposition = headers["content-disposition"] || "";
                    const disposition = contentDisposition.split(";")[0] || "";
                    const fileInfo = contentDisposition.split(";")[1] || "";
                    const fileName = fileInfo.split("=")[1];
                    return {
                        disposition,
                        fileName,
                        blob: res.data
                    };
                } else if (res.data.code != null) { //常规格式数据
                    const code = res.data.code;
                    switch (code) {
                        case 0: //正确请求
                            isExpireRequest = false; //重置过期登陆是否显示提示
                            break;
                        case 2003: //验证码错误
                            break;
                        case 2006: //需要填写验证码
                            break;
                        case 4101: //登录有错
                            router.replace("/login");
                            if (!isExpireRequest) {
                                Vue.prototype.$message.warning("暂无权限");
                                Vue.prototype.$httpFailCatch(res, timer2, router.currentRoute);
                                isExpireRequest = true;
                            }
                            return Promise.reject(new Error("暂无权限"))
                        case 4100: //登录过期
                            if (!isExpireRequest) {
                                Vue.prototype.$confirm("登录已过期", "提示", {
                                    confirmButtonText: "跳转登录",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }).then(() => {
                                    sessionStorage.clear();
                                    router.replace("/login");
                                }).catch(() => {});
                                Vue.prototype.$message.warning("登陆已过期");
                                Vue.prototype.$httpFailCatch(res, timer2, router.currentRoute);
                                isExpireRequest = true;
                            }
                            return Promise.reject(new Error("登陆已过期"));
                        case 4002: //暂无权限
                            if (!isExpireRequest) {
                                Vue.prototype.$message.warning("暂无权限");
                                Vue.prototype.$httpFailCatch(res, timer2, router.currentRoute);
                                isExpireRequest = true;
                            }
                            return Promise.reject(new Error("暂无权限"));
                        case 4010: //编译错误
                            break;
                        case 6001: //代理服务器 http状态码非200
                            break;
                        case 6002: //代理服务器 http状态码200
                            break;
                        case 6003: //代理服务器错误
                            break;
                        default:
                            Vue.prototype.$httpFailCatch(res, timer2, router.currentRoute)
                            Vue.prototype.$confirm(res.data.msg ? res.data.msg : "操作失败", "提示", {
                                confirmButtonText: "确定",
                                showCancelButton: false,
                                type: "warning"
                            });
                            return Promise.reject(new Error(res.data.msg))
                    }
                    return  result
                } else { //后台不规范的数据
                    Vue.prototype.$httpFailCatch(res, timer2, router.currentRoute);
                    Vue.prototype.$confirm(res.data.msg ? res.data.msg : "操作失败", "提示", {
                        confirmButtonText: "确定",
                        showCancelButton: false,
                        type: "warning"
                    });
                    const error = new Error("操作失败");
                    error.response = res;
                    return Promise.reject(error)
                }
            },
            err => {
                //=====================================取消错误不进行拦截====================================//
                if (err.constructor && err.constructor.name === "Cancel") {
                    return;
                }
                timer2 = Date.now() - timer;;
                Vue.prototype.$message.error("系统开小差了!")
                err.__time = timer2;
                err.__isHttpError = true;
                return Promise.reject(err)
            }
        )
        Vue.prototype.axios = axiosInstance
    },
    axios: axiosInstance
}
