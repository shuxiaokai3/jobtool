/** 
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 * @description        判断变量是否为非基本类型
 * @autor              shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 11:16
 * @update             2019-11-27 11:16
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    如果是非基本类型则返回true，否则返回false
 */

function isObject(variable) {
    return variable != null && (typeof variable === "object" || typeof variable === "function"); // variable != null 过滤掉null和undefined
}

module.exports = isObject;




