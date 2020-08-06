import Vue from "vue";
import Vuex from "vuex";
import tabs from "./tabs/tabs"
import viewTabs from "./view-tabs/view-tabs"
import docs from "./docs/docs"
import userInfo from "./userInfo/userInfo"
import components from "./components/components"
import permission from "./permission/permission"
import config from "./config/config"
import layout from "./layout/layout"
import apidoc from "./apidoc/apidoc"
import apidocRules from "./apidoc/rules"
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {

    },
    mutations: {
        
    },
    modules: {
        tabs,
        userInfo,
        docs,
        viewTabs,
        components,
        layout,
        config,
        permission,
        apidoc,
        apidocRules,
    },
    strict: false
});



export default store;
