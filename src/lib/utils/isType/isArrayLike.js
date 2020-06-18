
/** 
 * @description        判断是否为类数组(存在length，并且lengh为非负整数，并且不为 null，undefined,function)
 * @autor              shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 14:57
 * @update             2019-11-27 14:57
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    如果为类数组则返回true，否则返回false
 * @example
 *
 * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike(document.body.children)
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike(Function)
 * // => false
 */

function isLength(value) {
    return typeof value === "number" && value > -1 && Number.isSafeInteger(value); //非负整数
}


function isArrayLike(variable) {
    return typeof variable != null && typeof variable !== "function" && isLength(variable);
}

module.exports = isArrayLike;








