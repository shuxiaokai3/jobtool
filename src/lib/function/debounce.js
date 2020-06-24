
/** 
 * @description        debounce(调用动作n秒后才会执行，在这n秒内又调用此动作则重新计算时间)
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-01-31 17:14
 * @update             2020-01-31 17:14
 * @param {Function}   fn - 被调用函数       
 * @param {Number}     [delay=300] - 默认延时       
 * @param {Boolean}    immediate - 是否立即执行       
 * @return {null}     无返回值
 */


function debounce(fn, delay = 300, immediate = false) {
    let timer = null;
    return function() {
        clearInterval(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay, immediate);
    }
}

export default debounce;
