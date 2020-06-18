
/** 
    @description  将数组对象[{id: 1}]根据指定的key值进行去重,key值对应的数组元素不存在则直接过滤掉，若不传入id则默认按照set形式进行去重。
    @create       2019-11-20 22:40
    @update       2019-11-20 22:42
    @param  {array}  array 需要处理的数组     
    @param  {string?} key 指定对象数组的去重依据     
    @return {Array}  返回一个去重后的新数组，不会改变原数组   
    
    @example
        unique([{id: 1}, {id: 2}, {id: 1}], "id") => [{id: 1}, {id: 2}]
        unique([{id: 1}, {id: 2}, {id: 1}]) => [{id: 1}, {id: 2}, {id: 1}]
        unique([{id: 1}, {}, {id: 1}]) => [{id: 1}, {id: 2}, {id: 1}]
        unique([1, 2, 3, 4, 3, 3]) => [1, 2, 3, 4]
*/



function unique(array = [], key) {
    const result = [];
    if (key == null) { //不传key值直接进行简单去重处理
        return Array.from(new Set(array))
    } else {
        for (let i = 0, len = array.length; i < len; i++) {
            const isInResult = result.find(val => val[key] === array[i][key]);
            if (array[i][key] && !isInResult) {
                result.push(array[i]);
            }
        }
    }
    return result;
}


export default unique;


