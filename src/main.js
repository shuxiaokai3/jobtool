import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import router from "./router";
import store from "./store";
import { BaseConfig } from "@/config.default.js";
import utils from "@/lib"
import "./registerServiceWorker";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import "./components/index";
import "./mixin"
import "./directive"
import "@/assets/css/index.css"


import axios from "./api/api"

// console.log(utils)

Vue.use(ElementUI);
Vue.use(axios)

import Logs from "@/logs/index.js"
const logs = new Logs()


Vue.config.productionTip = true;


//挂载全局错误处理，处理请求报错
Vue.prototype.$httpThrow = logs.httpCatch;
Vue.prototype.$errorThrow = logs.errorCatch;
Vue.prototype.$langRequestWarning = logs.langTimeCatch;
Vue.prototype.$httpFailCatch = logs.httpFailCatch;
Vue.prototype.$utils = utils;
Vue.config.errorHandler = logs.errorCatch;
Vue.config.warnHandler = logs.warningCatch;


new Vue({
    data: {
        VUE_BASE_CONFIG: BaseConfig,
        ENVIROMENT: process.env.NODE_ENV
    },
    router,
    store,
    render: h => h(App)
}).$mount("#app");



