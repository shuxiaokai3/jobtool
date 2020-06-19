import tips from "./tips"
import api from "@/api/api.js"
const axios = api.axios;

export default {

    //=====================================节流====================================//
    sDebounce(fn, delay = 1000) {
        return function() {
            setTimeout(() => {
                fn.apply(this, arguments);
            }, delay);
        };
    },
    //=====================================深拷贝====================================//
    deepCopy(obj) {
        let clone = {};
        if (
            obj == null ||
            Array.prototype.toString.call(obj).slice(8, -1) === "Date" ||
            typeof obj !== "object"
        ) {
            return obj;
        }
        if (Array.isArray(obj)) {
            clone = [];
            obj.forEach((val, index) => {
                clone[index] = this.deepCopy(val);
            });
            return clone;
        }
        for (const i in obj) {
            if (obj[i] === null) {
                clone[i] = obj[i];
            } else if (Array.isArray(obj[i])) {
                clone[i] = [];
                obj[i].forEach((val, index) => {
                    clone[i][index] = this.deepCopy(val);
                });
            } else if (typeof obj[i] === "object") {
                clone[i] = this.deepCopy(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
    },
    globalDownload(url) {
        axios.get(url, {
            responseType: "blob",
        }).then(res => {
            let blobUrl = "";
            blobUrl = URL.createObjectURL(res.blob);
            const downloadElement = document.createElement("a");
            downloadElement.href = blobUrl;
            downloadElement.download = decodeURIComponent(res.fileName) || "未命名"; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(blobUrl); //释放掉blob对象
        }).catch(err => {
            this.$errorThrow(err, this);
        }).finally(() => {
            this.loading = false;
        });   
    },
    /* 
        @description  随机生成提示信息
        @author        shuxiaokai
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
    /* 
        @description  删除字段值为 "", null, undefined的字段 
        @author        shuxiaokai
        @create       2019-07-02 17:03"
        @params       data(原始值)
        @params       deep(是否遍历子对象); 只针对
        @return       data(最新值)
    */
    deleteEmptyPath(data, deep = false) {
        if (data == null || Object.prototype.toString.call(data) !== "[object Object]") {
            throw new Error("传入参数只能为对象类型");
        }
        if (!deep) {
            for (const i in data) {
                const hasOwn = Object.hasOwnProperty;
                if (hasOwn.call(data, i) && (data[i] == null || data[i] === "")) {
                    delete data[i];
                }
            }
        } else {
            // const _foo = function foo(val) {
            //     for (const i in val) {
            //         if (val.hasOwnProperty(i) && Object.prototype.toString.call(val) !== "[object Object]") {
            //             a(val[i]);
            //         }
            //         if (val.hasOwnProperty(i) && (val[i] == null || val[i] === "")) {
            //             delete val[i];
            //         }
            //     }
            // }
        }
    }
};

