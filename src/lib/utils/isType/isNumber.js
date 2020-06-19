/** 
 * @description        判断变量是否为数字(Infinity,-Infinity,NaN,Number.MAX_VALUE,new Number(222))
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 09:56
 * @update             2019-11-27 09:56
 * @param {any}        variable - 任意类型变量       
 * @return {String}    若变量为(Infinity,-Infinity,NaN,Number.MAX_VALUE,new Number(222),数字)类型中的一种，则返回true，否则返回false
 * @example    
 * isNumber(3)
 * // => true
 *
 * isNumber(Number.MIN_VALUE)
 * // => true
 *
 * isNumber(Infinity)
 * // => true
 * 
 * isNumber(NaN)
 * // => true
 * 
 * isNumber('3')
 * // => false
 */
const getTag = require("../getTag");

function isNumber(variable) {
    return typeof variable === "number" || getTag(variable) === "number"; //lodash在getTag前面判断了一次 isObjectLike，目的是为了提升性能，减少不必要的判断
}

module.exports = isNumber;