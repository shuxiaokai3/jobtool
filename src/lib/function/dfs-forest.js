

/** 
 * @description        深度优先?遍历森林
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-01-31 17:14
 * @update             2020-01-31 17:14
 * @param {Array}      forestData - 数据(森林结构)       
 * @param {function}   rCondition(recursionCondition) - 递归条件,第一个参数为递归数据，返回truly或者falsely
 * @param {string}     rKey(recursionKey) - 满足条件时候的递归字段
 * @param {function}   hooks - 每次数据遍历处理函数,第一个参数为递归数据,第二个参数为当前层级循环的下标值       
 * @return {null}     无返回值
 */


function dfsForest(forestData, config) {
    const { rCondition, rKey, hooks } = config;
    if (!Array.isArray(forestData)) {
        throw new Error("第一个参数必须为数组结构森林");
    }
    if (!rKey) {
        throw new Error("必须指定满足递归条件后需要继续递归的字段");
    }
    //开始递归
    const foo = (forestData, rCondition, hooks, rKey) => {
        for (let i = 0, len = forestData.length; i < len; i++) {
            hooks && hooks(forestData[i], i);
            if (rCondition && rCondition(forestData[i])) {
                if (!forestData[i][rKey] || !Array.isArray(forestData[i][rKey])) {
                    console.warn("当前指定字段值不为数组，将会忽略本次循环");
                    continue;
                }
                foo(forestData[i][rKey], rCondition, hooks, rKey);
            }
        }
    }
    foo(forestData, rCondition, hooks, rKey);
}
export default dfsForest;

