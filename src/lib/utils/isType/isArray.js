/** 
 * @description        判断一个变量是否为数组(类数组不属于该范围)
 * @autor              shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 11:07
 * @update             2019-11-27 11:07
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    当变量为数组的时候返回true，否则返回false
 * @example
 * 
 * isArray(new Array(3))
 * // true
 * 
 * isArray([1,2,3])
 * // true
 * 
 * isArray(document.querySelectorAll("div"))
 * // false
 * 
 */

function isArray(variable) {
    return Array.isArray(variable);
}

module.exports = isArray;