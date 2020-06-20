

/** 
 * @description        深度优先?遍历树,注意不会遍历原型上面属性和方法
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-01-31 17:14
 * @update             2020-01-31 17:14
 * @param {Array}      treeData - 数据(树形结构)       
 * @param {function}   rCondition(recursionCondition) - 递归条件,第一个参数为递归数据，返回truly或者falsely
 * @param {function}   hooks - 每次数据遍历处理函数,第一个参数为数据key值,第二个参数为value值
 * @return {null}     无返回值
 */

import getTag from "./get-tag"

function dfsTree(treeData, config) {
    const { rCondition, hooks } = config;
    if (getTag(treeData) !== "object") {
        throw new Error("第一个参数必须为plainObject");
    }
    //开始递归
    const foo = (treeData, rCondition, hooks) => {
        for (const i in treeData) {
            const hasOwn = Object.hasOwnProperty;
            if (!hasOwn.call(treeData, i)) {
                continue;
            }
            hooks && hooks(i, treeData[i]);
            if (rCondition && rCondition(treeData[i])) {
                foo(treeData[i], rCondition, hooks);
            }
        }
    }
    foo(treeData, rCondition, hooks);
}
export default dfsTree;

