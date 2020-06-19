/** 
    @description        复制文本
    @author             shuxiaokai
    @create             2019-11-21 13:13
    @param {string}}    text - 需要复制的文本       
*/

function copy(text) {
    const dom = document.createElement("textarea");
    dom.value = text;
    dom.style.position = "fixed";
    dom.style.top = "-9999px";
    dom.style.left = "-9999px";
    document.body.appendChild(dom);
    dom.select()
    document.execCommand("Copy", false, null);
    document.body.removeChild(dom);
}

module.exports = copy;

