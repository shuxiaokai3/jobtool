const path = require("path");
module.exports = {
    //=====================================css相关配置====================================//
    css: {
        loaderOptions: {
            css: {
                // 这里的选项会传递给 css-loader
            },
            sass: {
                prependData: `@import "@/scss/index.scss";`,
            },
        },
    },
    //=====================================扩展webpack配置====================================//
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src/"),
                "~": path.resolve(__dirname, ""),
            },
        },
    },
    chainWebpack: (config) => {
        config.plugins.delete("prefetch");
    },
    //=====================================代理服务器配置====================================//
    devServer: {
        // proxy: {
        //     "/": {
        //         // target: "http://192.168.0.153:8062",
        //         //target: "http://192.168.0.122:7001",
        //         // target: "",
        //         ws: false,
        //         changeOrigin: true
        //     },
        // },
    },
    //=====================================eslint配置====================================//
    lintOnSave: "warning", //未通过eslint 禁止代码提交
    //=====================================打包上线配置====================================//
    publicPath: "/",
    outputDir: "./dist", //输出文件类型
    productionSourceMap: false, //打包时候js是否添加sourceMap
};
