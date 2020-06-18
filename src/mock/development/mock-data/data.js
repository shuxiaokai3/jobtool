/**
 * @description        demo mock数据
 * @autor              shuxiaokai
 * @create             2020-02-19 15:10
 */
import Mock from "./mockjs.js";
import utils from "./utils/utils";
const packMsg = utils.packMsg;


const time = packMsg({
    data: Mock.mock({
        "list|12": [
            {
                "value|200-1000": 1
            }
        ],
    }).list
});
const link = packMsg({
    data: Mock.mock({
        "list|3": [
            {
                "value|200-1000": 1
            }
        ],
    }).list
});
const category = packMsg({
    data: Mock.mock({
        "list|6": [
            {
                name: "@aClass",
                "value|200-1000": 1
            }
        ],
    }).list
});


export default {
    time,
    link,
    category,
};



