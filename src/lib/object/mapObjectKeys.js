/** 
 * @description        将一个对象的key映射为另一个key(这个操作会改变当前对象,这个操作不会深拷贝数据)
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-01-08 21:08
 * @update             2020-01-08 21:08
 * @param {Object}     source - 原始对象       
 * @param {Object}     maps{ x: "x2", y: "y2" } - 映射方式
 * @return {Object}    映射后的对象
 * @example
 *   const foo = { x: 1, y: 2 }
 *   mapObjectKeys(foo, { x: "x2", y: "y2" }) => { x2: 1, y2: 2 } 
 *   
 *   const foo = { x: {}, y: { z: 1 } }
 *   const result = mapObjectKeys(foo, { x: "x2", y: "y2" }) // result => { x2: {}, y2: { z: 1 } }   
 *   foo.y.z = 3;
 *   result.y.z === 3; //true
 */

export const mapObjectKeys = function(source, maps) {
    
}
