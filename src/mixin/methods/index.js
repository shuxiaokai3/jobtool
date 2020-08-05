import tips from "./tips"
export default {
    /**
        @description  随机生成提示信息
        @autor        shuxiaokai
        @create       2019-06-25 13:33"
        @params       
        @return       
    */
    randomTip() {
        try {
            const len = tips.length;
            const randomIndex = Math.ceil(Math.random() * len) - 1;
            return tips[randomIndex];
        } catch (error) {
            console.error(error);
            return;
        }
    },

    /** 
     * @description        获取祖先组件
     * @autor              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-02-13 15:22
     * @update             2020-02-13 15:22
     * @param {String}     componentName - 组件名称       
     * @return {any}       若查询到组件则返回组件，否则返回null
     */
    getAncestorComponent(componentName = "") {
        let parent = this.$parent || null;
        while (parent && parent.$options.name !== componentName) {
            parent = parent.$parent || null;
        }
        return parent;
    },

    /** 
     * @description        向父元素触发事件
     * @autor              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @param {String}     componentName - 组件名称       
     * @param {String}     eventName - 事件名称       
     * @param {String}     params - 参数      
     * @create             2020-02-10 11:21
     * @update             2020-02-10 11:21
     */

    dispatch(componentName, eventName, params) {
        let parent = this.$parent;
        if (parent.$options.name === componentName) {
            // console.log(parent)
            parent.$emit(eventName, params);
            return;
        }
        while (parent) {
            if (parent.$options.name !== componentName) {
                parent = parent.$parent;
            } else {
                // console.log(parent)
                parent.$emit(eventName, params);
                return;
            }
        }
    },

    /** 
     * @description        向子元素广播事件
     * @autor              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @param {String}     componentName - 组件名称       
     * @param {String}     eventName - 事件名称       
     * @param {String}     params - 参数      
     * @create             2020-02-10 11:21
     * @update             2020-02-10 11:21
     */
    broadcast(componentName, eventName, params) {
        const foo = (data, componentName, eventName, params) => {
            for(let i = 0; i < data.length; i++) {
                if (data[i].$options.name === componentName) {
                    data[i].$emit(eventName, params);
                }
                if (data[i].$children && data[i].$children.length > 0) {
                    foo(data[i].$children, componentName, eventName, params);
                }
            }
        }
        foo(this.$children, componentName, eventName, params);
    }
};

