


export const BaseConfig = {
    //=====================================开发环境====================================//
    /* 
        @description  本地环境process.env.NODE_ENV自动转换为prodection，会使用下面的服务器地址
        @autor        shuxiaokai
        @create       2019-05-12 11:47"
    */
    // devUrl: "http://192.168.0.172:7004", //----------------------------------------------------------------开发服务器
    devUrl: "http://127.0.0.1:7004", //----------------------------------------------------------------开发服务器
    devImgUrl: "/inspection/upload/single/oss", //---------------------------------开发图片服务器
    //=====================================测试环境====================================//
    /* 
        @description  测试环境
        @autor        shuxiaokai
        @create       2019-07-26 18:07"
    */
    testUrl: "/", //----------------------------------------------------------------测试服务器
    testImgUrl: "/inspection/upload/single/oss", //---------------------------------测试图片服务器

    //=====================================线上环境====================================//
    /* 
        @description  打包后process.env.NODE_ENV自动转换为development，会使用下面的服务器地址
        @autor        shuxiaokai
        @create       2019-05-12 11:46"
    */
    proUrl: "http://47.107.70.26:7004", //--------------------------------------------------线上服务器
    proImgUrl: "/inspection/upload/single/oss", //------------------------------------线上图片服务器

    //=====================================http请求相关配置====================================//
    httpRequest: {
        timeout: 22000, //超时时间25s
        longRequestLimit: 3000, //超过3s以上请求上报错误
        withCredentials: false, //是否允许携带cookie
    },
    //=====================================错误信息上报参数====================================//
    errorRequest: {
        uploadUrl: process.env.NODE_ENV === "development" ? "http://192.168.0.122:7001" : "",
        enableErrorAlert: false, //是否允许出错时弹出对应错误类型
        maxErrorMsg: 1024 * 20, //最大允许上传错误信息长度，大约2w个英文字符
    },
    pagesConfig: {
        headerTitle: "内部管理系统"
    },
    //=====================================表格和分页====================================//
    tableConfig: {
        pageSizes: [10, 20, 30, 50, 70, 100], //每页条数
        pageSize: 20, //每页默认显示数量
    },
    styleConfig: { //全局样式配置
        size: "mini", //全局element组件大小配置, medium,small,mini
    },

    //=====================================其他配置====================================//
    
    enableMock: true, //是否允许开启mock
    enableHttpTest: true, //是否开启http请求工具
    isProcess: process.env.NODE_ENV === "development", //是否为开发环境
}





