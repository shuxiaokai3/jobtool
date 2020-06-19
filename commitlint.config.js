//git commit 格式
module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "init", //初始化项目
                "upd", //更新某个功能
                "feat", //新功能
                "fix", //修复bug
                "style", //样式修改
                "refactor", //重构
                "remove", //文件删除
            ]
        ]
    }
};
