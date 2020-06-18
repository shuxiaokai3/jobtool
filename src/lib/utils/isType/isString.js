/** 
 * @description        判断一个变量是否为原始字符串或者包装类型字符串
 * @autor              shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 10:40
 * @update             2019-11-27 10:40
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    如果是字符串则返回true，否则返回false
 * @example
 *
 * isString('abc')
 * // => true
 * 
 * isString(String("xxx"))
 * // => true
 * 
 * isString(1)
 * // => false
 */

const getTag = require("../getTag");

function isString(variable) {
    return typeof variable === "string" || getTag(variable) === "string";
}
module.exports = isString;