/** 
 * @description        判断一个变量是否为原始Symbol或者包装类型Symbol
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 10:40
 * @update             2019-11-27 10:40
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    如果是Symbol则返回true，否则返回false
 * @example
 *
 * isSymbol('abc')
 * // => true
 * 
 * isSymbol(String("xxx"))
 * // => true
 * 
 * isSymbol(1)
 * // => false
 */

const getTag = require("../getTag");

function isSymbol(variable) {
    return typeof variable === "symbol" || getTag(variable) === "symbol";
}
module.exports = isSymbol;