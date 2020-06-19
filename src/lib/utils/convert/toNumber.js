/**
 * tip 空字符串会转换为0
 * @description        将一个变量转换为数字(只转换数字和字符串，其他类型全部返回NaN，，这与lodash很大区别，目的是为了降低复杂度)
 *                     1.当一个变量为数字类型的时候直接返回
 *                     2.当一个变量为null或者undefined时候返回NaN
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 15:43
 * @update             2019-11-27 15:43
 * @param {any}        variable - 任意类型变量
 * @return {String}    返回字符串
 *
 * @example
 *
 * toNumber(3.2)
 * // => 3.2
 *
 * toNumber(Number.MIN_VALUE)
 * // => 5e-324
 *
 * toNumber(Infinity)
 * // => Infinity
 *
 * toNumber('3.2')
 * // => 3.2
 * 
 * toNumber('')
 * // => 0
 */

function toNumber(variable) {
    if (typeof variable === "number") {
        return variable;
    }
    if (typeof variable === "string") {
        return +variable;
    }
    return NaN;
}
