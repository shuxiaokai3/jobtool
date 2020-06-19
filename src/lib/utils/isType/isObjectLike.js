/**
 * 注意 dom对象,[]也是objectLike
 * @description        非null  typeof 值为 object
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2019-11-27 09:42
 * @update             2019-11-27 09:42
 * @param {any}        variable - 任意类型变量
 * @return {Boolean}}    如果是objectLike则返回true 否则返回false
 */

function isObjectLike(variable) {
    return typeof variable === "object" && variable !== null;
}

module.exports = isObjectLike;
