
/* 
    @description  返回变量类型
    @author        shuxiaokai
    @create       2019-10-29 16:32"
    @params {any}      variable
    @return       小写对象类型(null,number,string,boolean,symbol,function,object,array,regexp)
*/
export const getType = function(variable) {
    return Object.prototype.toString.call(variable).slice(8, -1).toLocaleLowerCase();
}

/** 
 * @description        递归执行某个方法(可能会改变原对象)
 * @author             shuxiaokai
 * @updateAuthor       shuxiaokai
 * @create             2020-01-08 21:32
 * @update             2020-01-08 21:32
 * @param {Array}      data - 递归数组      
 * @param {Function}   condition - 递归条件       
 * @param {Function}   before - 执行方法       
 * @param {Function}   next - 递归入口       
 */
export const recursion = function(config) {
    const { data, condition, before, next } = config;
    const loopData = JSON.parse(JSON.stringify(data))
    if (!Array.isArray(loopData)) {
        throw new Error("第一个参数必须为数组");
    }
    const foo = (loopData) => {
        for (let i = 0; i < loopData.length; i++) {
            before(loopData[i]);
            if (condition && condition(loopData[i]) && next) {
                foo(next(loopData[i]));
            }
        }                    
    }
    foo(loopData);
}

/* 
    @description  给树形结构数据添加额外key值
    @author        shuxiaokai
    @create       2019-10-29 16:33"
    @params {Array} 数组类型，并且嵌套元素key值必须为children      
    @params {Array<String>} 需要添加的key     
    @params {Object} 配置     
    @return       修改后的树形结构数据
    @remark       该操作会改变原数组       
*/
export const addObjectTreeKey = function(treeData, params, options = {}) {
    // 参数校验
    if (!Array.isArray(params)) {
        throw new Error("第二个参数必须为数组类型");
    }
    params.forEach(val => {
        if (typeof val !== "string") {
            throw new Error("第二个参数itemType必须为string类型");
        }
    })
    
    /*
        valFn 添加的key的值，如果未填写该参数，所有添加key的值均为""
        接受两个参数，一个是当前遍历的数据，第二个为当前遍历数据下标
    */
    /*
        jumpFn 是否跳过某些循环，例如：跳过id为偶数的循环
    */
    /*
        cover 是否修改原数组
    */
    const { cover = false, valFn, jumpFn } = options;
    let _treeData = [];
    if (!cover) {
        _treeData = JSON.parse(JSON.stringify(treeData));
    } else {
        _treeData = treeData;
    }

    const foo = (treeData) => {
        for (const i in treeData) {
            if (jumpFn && jumpFn(treeData[i]) === true) {
                params.forEach(val => {
                    treeData[val] = valFn ? valFn(treeData[i], i) : "";
                })
                if (getType(treeData[i]) === "object" && Object.keys(treeData[i]) > 0) {
                    foo(treeData[i])
                }
            } else {
                params.forEach(val => {
                    treeData[val] = valFn ? valFn(treeData[i], i) : "";
                })
                if (getType(treeData[i]) === "object" && Object.keys(treeData[i]) > 0) {
                    foo(treeData[i])
                }
            }
        }
    }
    console.log(_treeData, 22)
    foo(_treeData);
    return treeData;
}

/* 
    @description  给树形结构数据添加额外key值
    @author        shuxiaokai
    @create       2019-10-29 16:33"
    @params {Array} 数组类型，并且嵌套元素key值必须为children      
    @params {Array<String>} 需要添加的key     
    @params {Object} 配置     
    @return       修改后的树形结构数据
    @remark       该操作会改变原数组       
*/
export const addArrayTreeKey = function(treeData, params, options = {}) {
    // 参数校验
    if (!Array.isArray(params)) {
        throw new Error("第二个参数必须为数组类型");
    }
    params.forEach(val => {
        if (typeof val !== "string") {
            throw new Error("第二个参数itemType必须为string类型");
        }
    })
    /*
        propsChildren 当树形结构子元素key不是children的时候可以指定该值
        例如：若数据格式为
        {
            id: 1,
            childs: []
        }
        指定propsChildren为children那么代码读取子元素会自动取读取 children 字段而不是 childs 字段

    */
    /*
        valFn 添加的key的值，如果未填写该参数，所有添加key的值均为""
        接受两个参数，一个是当前遍历的数据，第二个为当前遍历数据下标
    */
    /*
        jumpFn 是否跳过某些循环，例如：跳过id为偶数的循环
    */
    /*
        cover 是否修改原数组
    */
    const { propsChildren = "children", cover = false, valFn, jumpFn } = options;
    let _treeData = [];
    if (!cover) {
        _treeData = JSON.parse(JSON.stringify(treeData));
    } else {
        _treeData = treeData;
    }
    const foo = (treeData) => {
        for (let i = 0, len = treeData.length; i < len; i++) {
            if (jumpFn && jumpFn(treeData[i]) === true) {
                params.forEach(val => {
                    treeData[i][val] = valFn ? valFn(treeData[i], i) : "";
                })
                if (treeData[i][propsChildren] && treeData[i][propsChildren].length > 0) {
                    foo(treeData[i][propsChildren])
                }
            } else {
                params.forEach(val => {
                    treeData[i][val] = valFn ? valFn(treeData[i], i) : "";
                })
                if (treeData[i][propsChildren] && treeData[i][propsChildren].length > 0) {
                    foo(treeData[i][propsChildren]);
                }
            }
        }
    }
    // console.log(_treeData, 22)
    foo(_treeData);
    return treeData;
}
/* 
    @description  判断数组是否完全包含某个数组的数据
    @author        shuxiaokai
    @create       2019-10-31 13:38"
    @params {Array}      arr 原数组
    @params {Array}      arr2 被包含数组

    @eg        [1, 2, 3, 4] => [1, 3, 4]  true 
               [1, 2, 3, 4] => [1, 4, 3]  true 
               [1, 2, 3, 4] => [3, 2, 1]  true 
               [1, 2, 3, 4] => [3, 2, 1, 1]  false 
               [1, 2, 3, 4] => []  true 
               [] => []  false 
               [1, 2, 3, 4] => [3, 2, 5]  false 

    @return       null
*/
export const fullIncludes = function(arr, arr2) {
    // let result = false;
    let indexFlag = 0;
    const arr2Len = arr2.length;
    if (!Array.isArray(arr) && !Array.isArray(arr2)) {
        throw new Error("参数必须为数组");
    }
    if (arr.length === 0) {
        return false;
    }
    if (arr2.length === 0) {
        return true;
    }
    for (let i = 0; i < arr.length; i++) {
        const arrValue = arr[i];
        for (let j = 0; j < arr2.length; j++) {
            if (arrValue.includes(arr2[j])) {
                arr2.splice(j, 1);
                indexFlag++;
                continue;
            } 
        }
    }
    return arr2.length === 0 && arr2Len === indexFlag;
}



//=====================================工具方法====================================//
/* 
    @description  查找父节点
    @author        shuxiaokai
    @create       2019-10-22 09:13"
    @params {String}       节点的id值
    @params {Array}        需要查找的树形组件
    @params {Function?}    可以传入一个函数就行条件判断，函数第一个参数为当前节点信息，存在fn那么判断结果以fn返回值为准
    @return       父节点(如果未找到返回null)
*/
export const findParentNode = function(id, treeData, fn, options) {
    const pathId = options.id || "id";
    let result = null;
    const parent = null;
    if (id == null) {
        return null;
    }
    const findPNode = (id, treeData, parent) => {
        treeData.forEach(val => {
            if ((fn && fn(val) === true) || val[pathId] === id) {
                result = parent;
                return;
            }
            if (val.children && val.children.length > 0) {
                findPNode(id, val.children, val);
            }
        })
    }
    findPNode(id, treeData, parent);
    return result;
};
/* 
    @description  查找某个节点所有子节点id(包括自身)
    @author             shuxiaokai
    @create             2019-10-23 16:35"
    @params {Array}     当前节点数组      
    @params {Object}    当前节点id和children映射      
    @return             所有子节点id
*/
export const findChildrenNodeIds = function(node, props = {}) {
    const result = [];
    const { id = "id", children = "children" } = props;
    if (node == null) {
        return result;
    }
    const findNodeId = (node, result) => {
        result.push(node[id]);
        if (node[children] && node[children].length > 0) {
            node[children].forEach(val => {
                findNodeId(val, result);
            })
        }
    }
    findNodeId(node, result);
    return result;
};
/* 
    @description  查找某个节点
    @author        shuxiaokai
    @create       2019-10-23 19:23"
    @params {String}       节点的id值
    @params {Array}        需要查找的树形组件
    @params {Function?}    可以传入一个函数就行条件判断，函数第一个参数为当前节点信息，存在fn那么判断结果以fn返回值为准
    @return       节点(如果未找到返回null)
*/
export const findoNode = function(id, treeData, fn, options) {
    const pathId = options.id || "id";
    let result = null;
    if (id == null) {
        return null;
    }
    const findNodeId = (id, treeData) => {
        for (let i = 0; i < treeData.length; i++) {
            if ((fn && fn(treeData[i]) === true) || treeData[i][pathId] === id) {
                result = treeData[i];
                break
            } 
            if (treeData[i].children && treeData[i].children.length > 0) {
                findNodeId(id, treeData[i].children);
            }
        }
    }
    findNodeId(id, treeData);
    return result;
};

/**
    @description  查找上一个兄弟元素
    @author        shuxiaokai
    @create       2019-10-23 19:23"
    @params {String}       节点的id值
    @params {Array}        需要查找的树形组件
    @params {Function?}    可以传入一个函数就行条件判断，函数第一个参数为当前节点信息，存在fn那么判断结果以fn返回值为准
    @return       节点(如果未找到返回null)
*/
export const findPreviousSibling = function(id, treeData, fn, options) {
    const pathId = options.id || "id";
    let sibling = null;
    if (id == null) {
        return null;
    }
    const findNodePreviouseNode = (id, treeData) => {
        for (let i = 0; i < treeData.length; i++) {
            if ((fn && fn(treeData[i]) === true) || treeData[i][pathId] === id) {
                sibling = treeData[i - 1] || null;
                break
            } 
            if (treeData[i].children && treeData[i].children.length > 0) {
                findNodePreviouseNode(id, treeData[i].children);
            }
        }
    }
    findNodePreviouseNode(id, treeData);
    return sibling;
};

/**
    @description  查找下一个兄弟元素
    @author        shuxiaokai
    @create       2019-10-23 19:23"
    @params {String}       节点的id值
    @params {Array}        需要查找的树形组件
    @params {Function?}    可以传入一个函数就行条件判断，函数第一个参数为当前节点信息，存在fn那么判断结果以fn返回值为准
    @return       节点(如果未找到返回null)
*/
export const findNextSibling = function(id, treeData, fn, options) {
    const pathId = options.id || "id";
    let sibling = null;
    if (id == null) {
        return null;
    }
    const findNodeNextNode = (id, treeData) => {
        for (let i = 0; i < treeData.length; i++) {
            if ((fn && fn(treeData[i]) === true) || treeData[i][pathId] === id) {
                sibling = treeData[i + 1] || null;
                break
            } 
            if (treeData[i].children && treeData[i].children.length > 0) {
                findNodeNextNode(id, treeData[i].children);
            }
        }
    }
    findNodeNextNode(id, treeData);
    return sibling;
};

/* 
    @description  数组对象去重
    @author        shuxiaokai
    @create       2019-11-14 14:57"
    @params {Array<Object>?}      arrData 需要去重数组
    @params {Array<String>?}      arrData 需要去重数组
    @params {String}             key 去重所根据字段
    @eg                          zipArr([{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 }], "x") => [{ x: 1, y: 2 }, { x: 3, y: 4 }]
    @eg                          zipArr([1,2,3,3,3,4]) => [1,2,3,4]
    @return       null
*/
export const zipArr = function(arrData, key) {
    //参数校验
    if (!Array.isArray(arrData)) {
        throw new Error("第一个参数必须为数组");
    }
    const result = [];
    for (let i = 0, len = arrData.length; i < len; i++) {
        const hasDuplicateKey = result.find(val => {
            if (typeof arrData[i] === "string" || typeof arrData[i] === "number") {
                return val === arrData[i];
            }
            if (arrData[i][key] == null) { //数组对象中某个元素对应的key不存在则忽略
                return false;
            }
            return val[key] === arrData[i][key];
        })

        if (hasDuplicateKey) {
            continue;
        }
        result.push(arrData[i])
    }
    return result;
};
/** 
 * @description        遍历森林
 * @author             shuxiaokai
 * @create             2020-03-02 10:17
 * @params {array}     arrData 需要去重数组
 * @params {function}  arrData 需要去重数组
 * @params {string}    childrenKey children对应字段
 */
export const forEachForest = function(forest, fn, options = {}) {
    const childrenKey = options.childrenKey || "children"
    const foo = (forest, fn, childrenKey) => {
        for (let i = 0; i < forest.length; i++) {
            fn(forest[i]);
            if (forest[i][childrenKey] && forest[i][childrenKey].length > 0) {
                forEachForest(forest[i][childrenKey], fn, childrenKey);
            }
        }
    }
    foo(forest || [], fn, childrenKey);
};


/** 
    @description  将森林(数组)递归转换为一维数组
    @create       2019-11-20 22:40
    @update       2019-11-20 22:42
    @param  {array}  array 需要处理的数组(森林)     
    @param  {string?} [key=children] key 指定的递归入口    
    @return {Array}  返回一个扁平一维数组
    
    @example
        flatTree([{id: 1, children: [{id: 3}]}, {id: 2}]) => [{id: 1}, {id: 2}, {id: 3}]
*/



export const flatTree = (array = [], key = "children") => {
    const result = [];
    const foo = (result, data) => {
        for (let i = 0, len = data.length; i < len; i++) {
            result.push(data[i]);
            if (data[i] && data[i][key]) {
                foo(result, data[i][key]);
            }
        }
    }
    foo(result, array);
    return result;
}




