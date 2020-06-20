/** 
    @description        根据Object.prototype.toString 返回变量类型值(小写)
    @author             shuxiaokai
    @create             2019-11-21 13:13
    @update             2019-11-21 13:13
    @since              2019-11-21 13:13
    @updateAuthor       shuxiaokai
    @param {any}        variable - 任意类型变量       
    @return {String}    当前类型变量toString标签
    @example getTag("3") => number
    @example getTag(Symbol()) => symbol
    @example getTag(/test/) => regexp
*/

function getTag(variable) {
    return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
}

export default getTag;

