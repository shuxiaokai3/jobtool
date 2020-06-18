

/* 
    @description  错误捕获并且上传
    @autor        shuxiaokai
    @create       2019-07-07 13:20"
    
    一. 错误类型为uncatchError,一般出现于promise中的异常抛出，常规情况无法捕获，需要在window上面监听unhandledrejection事件进行处理，这类异常只上报相关堆栈信息
    二. 错误类型为http错误，一般出现于后台500，404，请求超时这种情况，在axios中走response拦截器，这时可以返回Promise.reject(err)将错误信息暴露到业务代码的then方法中
        这样做的目的是为了获取更多报错信息(路由信息，vm信息)，在err上面多挂上两个私有变量__time(请求时间),__isHttpError(是否为请求错误)，
    三. 错误类型为aaa

*/
import { BaseConfig } from "@/config.default"
/*eslint-disable*/ 



class Logs {
    constructor() {
        this.errorCatch = this.errorCatch.bind(this);
        this.httpCatch = this.httpCatch.bind(this);
        this.httpFailCatch = this.httpFailCatch.bind(this);
        this.langTimeCatch = this.langTimeCatch.bind(this);
        
        this.initUnHandledRejection();
    }


    /* 
        @description  封装http错误上报信息
        @autor        shuxiaokai
        @create       2019-07-29 15:45"
    */
    async addHttpErrorPayload(err, time, route) {
        return new Promise(async(resolve, reject) => {
            let resText = "";
            //pdf类型请求可能返回为blob需要异步将blob翻译为text
            if (err.request.responseType === "blob") {
                if (err.request.response.type === "application/json") {
                    resText = await err.request.response.text();
                } else {
                    resText = "blob"
                }
            } else {
                resText = err.request.responseText;
            }
            if (resText.length > BaseConfig.errorRequest.maxErrorMsg) {
                resText = `请求内容超出限制(大于约${BaseConfig.errorRequest.maxErrorMsg}个字符)`
            }
            const result = {
                route: {
                    path: route.path,
                    fullPath: route.fullPath,
                    meta: route.meta
                },
                developer: route.meta ? route.meta.developer : {},
                userInfo: {
                    token: sessionStorage.getItem("token"),
                    userName: sessionStorage.getItem("userName"),
                    companyName: sessionStorage.getItem("companyName"),
                },
                request: {
                    url: err.request.responseURL,
                    status: err.request.status,
                    resText: resText,
                    time: time,
                    headers: err.config ? err.config.headers : {},
                    method: err.config ? err.config.method : "",
                    params: err.config ? err.config.params : {}
                }
            }    
            resolve(result);        
        });
    }

    /* 
        @description  添加代码错误上报信息
        @autor        shuxiaokai
        @create       2019-07-29 16:28"
    */
    addCodeErrorPayload(err, vm) {
        const result = {
            errorInfo: {
                msg: err.message,
                stack: err.stack,
                stackArr: err.stack.split("./"),
                componentName: vm.$options.name,                
            },
            developer: vm.$route.meta ? vm.$route.meta.developer : {},
            route: {
                path: vm.$route.path,
                fullPath: vm.$route.fullPath,
                meta: vm.$route.meta
            },
            userInfo: {
                token: sessionStorage.getItem("token"),
                userName: sessionStorage.getItem("userName"),
                companyName: sessionStorage.getItem("companyName"),
            }
        }
        return result;
    }


    /* 
        @description  未捕获异常拦截(通常出现在promise中的抛错)
        @autor        shuxiaokai
        @create       2019-07-09 14:10"
    */
    initUnHandledRejection() {
        window.addEventListener("unhandledrejection", (e, a) => {
            console.log(e)
            e.reason = e.reason ? e.reason : {}
            const result = {
                msg: e.reason.message,
                stack: e.reason.stack,
                stackArr: e.reason.stack ? e.reason.stack.split("./") : "无堆栈信息",
            }
            
            fetch(BaseConfig.errorRequest.uploadUrl + "/api/uncatch_error", {
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(result)
            }).catch(() => {
                return;
            });
            if (process.env.NODE_ENV === "development" && BaseConfig.errorRequest.enableErrorAlert) {
                alert("uncatchError")
            }
        });
    }

    /* 
        @description  http错误拦截,拦截http状态码不为200的错误
        @autor        shuxiaokai
        @create       2019-07-08 16:42"
    */
    httpCatch(err, time, vm) {
        console.dir(err);
        const result = this.addHttpErrorPayload(err, time, vm.$route);
        fetch(BaseConfig.errorRequest.uploadUrl + "/api/http_error", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(result)
        }).catch(() => {
            return;
        });
        if (process.env.NODE_ENV === "development" && BaseConfig.errorRequest.enableErrorAlert) {
            alert("httpError")
        }
    }


    /* 
        @description  拦截http状态未ok，但是自定义状态码异常的请求
        @autor        shuxiaokai
        @create       2019-07-29 11:36"
    */
    async httpFailCatch(err, time, route) {
        const result = await this.addHttpErrorPayload(err, time, route);
        fetch(BaseConfig.errorRequest.uploadUrl + "/api/http_fail_error", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(result)
        }).catch(() => {
            return;
        });
        if (process.env.NODE_ENV === "development" && BaseConfig.errorRequest.enableErrorAlert) {
            alert("用户操作出错")
        }
    }

    /* 
        @description  时间过长请求拦截
        @autor        shuxiaokai
        @create       2019-07-08 16:42"
        @params       
        @return       
    */
    langTimeCatch(err, time, route) {
        console.warn(time)
        const result = this.addHttpErrorPayload(err, time, route);
        fetch(BaseConfig.errorRequest.uploadUrl + "/api/http_long_time_error", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(result)
        }).catch(() => {
            return;
        });
        if (process.env.NODE_ENV === "development" && BaseConfig.errorRequest.enableErrorAlert) {
            alert("超时警告")
        }
    }
    /* 
        @description  代码错误捕获
        @autor        shuxiaokai
        @create       2019-07-29 11:21"
        @params       
        @return       
    */
    errorCatch(err, vm, info) {
        console.error(err)
        if (err.__isHttpError) {
            this.httpCatch(err, err.__time, vm);
            return;
        }
        const result = this.addCodeErrorPayload(err, vm);
        fetch(BaseConfig.errorRequest.uploadUrl + "/api/code_error", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(result)
        }).catch(() => {
            return;
        });
        if (process.env.NODE_ENV === "development" && BaseConfig.errorRequest.enableErrorAlert) {
            alert("codeError")
        }
    }
    /* 
        @description  vue自带warn捕获
        @autor        shuxiaokai
        @create       2019-07-07 13:22"
        @params       msg<String> 错误提示信息
        @params       vm<Object> 虚拟dom
        @params       trace<Object> 堆栈
        @return       
    */
    // warningCatch(msg, vm, trace) {
    //     console.error("xxx", msg)
    //     if (process.env.NODE_ENV === "development" && BaseConfig.errorRequest.enableErrorAlert) {
    //         alert("vueWarning")
    //     }
    // }
}



export default Logs;

