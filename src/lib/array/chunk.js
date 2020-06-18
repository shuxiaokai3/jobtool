
/** 
    @description  将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。
    @create       2019-11-20 22:40
    @update       2019-11-20 22:42
    @param  {Array}  array 需要处理的数组     
    @param  {Number} size 每个数组区块的长度     
    @return {Array}  返回一个包含拆分区块的新数组，不会改变原数组   
    
    @example
        chunk(["a", "b", "c", "d"], 2) => [["a", "b"], ["c", "d"]]
        chunk(["a", "b", "c", "d"], 3) => [["a", "b", "c"], ["d"]]
*/



function chunk(array = [], size = 1) {
    
    
    const result = []; 
    let startIndex = 0;
    let endIndex = size;
    while (array.slice(startIndex, endIndex).length > 0) {
        result.push(array.slice(startIndex, endIndex))
        startIndex = endIndex;
        endIndex += size;
    }
    if (endIndex < array.length) {
        result.push(array.slice(startIndex));
    }
    return result;
}


module.exports = chunk;

// console.log(chunk(["a", "b", "c", "d"]))
// console.log(chunk(["a", "b", "c", "d"], -1))
// console.log(chunk(["a", "b", "c", "d"], 0))
// console.log(chunk(["a", "b", "c", "d"], 2))
// console.log(chunk(["a", "b", "c", "d"], 3))
// console.log(chunk(["a", "b", "c", "d"], 4))
// console.log(chunk(["a", "b", "c", "d"], 5))
// console.log(chunk(["a", "b", "c", "d"], 99))
