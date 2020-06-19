/** 
 * @description        判断一个变量是否为布尔值(原始布尔值或者包装类型布尔值)
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 11:01
 * @update             2019-11-27 11:01
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    如果为true则返回true否则返回false
 * @example
 *
 * isBoolean(false)
 * // => true
 *
 * isBoolean(new Boolean(1))
 * // => true
 * 
 * isBoolean(null)
 * // => false
 */

const getTag = require("../getTag");
function isBoolean(variable) {
    return typeof variable === "boolean" || getTag(variable) === "boolean"; //lodash在这类类型判断中预先处理了一些步骤提高了部分效率
}
module.exports = isBoolean;