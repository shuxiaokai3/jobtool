/**
 * @tip                class typeof的值也为function
 * @description        判断是否为函数(typeof运算符能比较准确给出变量类型为函数)
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 10:36
 * @update             2019-11-27 10:36
 * @param {any}        variable - 任意类型变量
 * @return {Boolean}    如果为函数则返回true，否则返回false
 * @example
 *
 * isFunction(class Any{})
 * // => true
 *
 * isFunction(() => {})
 * // => true
 *
 * isFunction(async () => {})
 * // => true
 *
 * isFunction(function * Any() {})
 * // => true
 *
 * isFunction(Math.round)
 * // => true
 *
 * isFunction(/abc/)
 * // => false
 */

function isFunction(variable) {
    return typeof variable === "function";
}

module.exports = isFunction;
