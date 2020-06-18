
/** 
 * tip  lodash中将Object.create(null)归纳到plainObject，实际中使用较少，不予考虑
 * @description        判断一个变量是否由Object构造函数创建
 * @autor              shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 13:29
 * @update             2019-11-27 13:29
 * @param {any}        variable - 任意类型变量       
 * @return {Boolean}    如果 Object构造函数创建或者变量的prototype属性为null
 * 
 * 
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo)
 * // => false
 *
 * isPlainObject([1, 2, 3])
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 })
 * // => true
 *
 * isPlainObject(Object.create(null))
 * // => false
 */
const isObjectLike = require("./isObjectLike")

function isPlainObject(variable) {
    if (!isObjectLike(variable)) {
        return false;
    }
    let proto = variable;
    while(Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(variable) === proto;
}

module.exports = isPlainObject;
