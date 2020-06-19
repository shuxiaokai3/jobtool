/**
 * @description        demo mock数据
 * @author              liqx
 * @create             2020-02-19 15:10
 */
import Mock from "./mockjs.js";
import utils from "./utils/utils";
const packMsg = utils.packMsg;

// 分页查询计划明细列表
const demoA = packMsg({
    data: Mock.mock({
        "rows|20": [
            {
                "id|+1": 1, //类型：Number  必有字段  备注：主键
                "categoryFirst": "mock", //类型：String  必有字段  备注：一级分类
                "categorySecond": "mock", //类型：String  必有字段  备注：二级分类
                "categoryThird": "mock", //类型：String  必有字段  备注：三级分类
                "enterpriseName": "mock", //类型：String  必有字段  备注：单位名称
                "address": "mock", //类型：String  必有字段  备注：地址
                "areaName": "mock", //类型：String  必有字段  备注：区域名称
                "streetName": "mock", //类型：String  必有字段  备注：街道名称
                "topicName": "mock", //类型：String  必有字段  备注：专项名称
                "planAmount": 1, //类型：Number  必有字段  备注：计划明细批次
                "solutionAmount": 0, //类型：Number  必有字段  备注：方案批次
                "balance": 1, //类型：Number  必有字段  备注：剩余批次
                "remark": ""          
            }
        ],
        total: 20
    })
});

// 分页查询方案明细列表
const demoB = packMsg({
    data: Mock.mock({
        "rows|20": [
            {
                "id|+1": 1, //类型：Number  必有字段  备注：主键
                "categoryFirst": "mock", //类型：String  必有字段  备注：一级分类
                "categorySecond": "mock", //类型：String  必有字段  备注：二级分类
                "categoryThird": "mock", //类型：String  必有字段  备注：三级分类
                "enterpriseName": "mock", //类型：String  必有字段  备注：单位名称
                "address": "mock", //类型：String  必有字段  备注：地址
                "areaName": "mock", //类型：String  必有字段  备注：区域名称
                "streetName": "mock", //类型：String  必有字段  备注：街道名称
                "topicName": "mock", //类型：String  必有字段  备注：专项名称
                "planAmount": 1, //类型：Number  必有字段  备注：计划明细批次
                "solutionAmount": 0, //类型：Number  必有字段  备注：方案批次
                "taskAmount": 1, //类型：Number  必有字段  备注：任务批次
                "balance": 1, //类型：Number  必有字段  备注：剩余批次
                "remark": "", //类型：String  必有字段  备注：备注
                "recycleAmount": 1, //回收批次
                "sampleAmount": 1, //已抽样批次
            }
        ],
        total: 20
    })
});


const demoC = packMsg({
    data: Mock.mock({
        "rows|12": [
            {
                "month": "1月", //类型：String  可有字段  备注：月份
                "areaName": "福田", //类型：String  可有字段  备注：区域名称
                "distributionAmount": 0//类型：String  必有字段  备注：规划批次
            },
        ],
        total: 2
    })
});

const demoD = packMsg({
    data: 111
})

const demoE = packMsg({
    data: Mock.mock({
        "publicKey": "mock", //类型：String  必有字段  备注：对外显示的键
        "solutionCode": "mock", //类型：String  必有字段  备注：任务号
        "solutionName": "mock", //类型：String  必有字段  备注：方案名称
        "planId": 1, //类型：Number  必有字段  备注：计划id
        "linkId": 1, //类型：Number  必有字段  备注：抽样环节id
        "totalAmount": 1, //类型：Number  必有字段  备注：方案总批次
        "ruleId": 1, //类型：Number  必有字段  备注：方案规则id
        "sampleStartDate": "mock", //类型：String  必有字段  备注：抽样开始时间
        "sampleFinishDate": "mock", //类型：String  必有字段  备注：抽样完成时间
        "detetionStartDate": "mock", //类型：String  必有字段  备注：检验开始时间
        "detetionFinishDate": "mock", //类型：String  必有字段  备注：检验完成时间
        "reportCommitDate": "mock", //类型：String  必有字段  备注：报告提交时间
        "summaryDate": "mock" //类型：String  必有字段  备注：汇报报告时间
    })
});

const demoF = packMsg({
    data: Mock.mock({
        "rows|12": [
            {
                "id|+1": 1, //类型：Number  必有字段  备注：方案检验项id
                "itemName": "检验项", //类型：String  必有字段  备注：检验项
                "standardValue": "监测依据", //类型：String  必有字段  备注：检测依据
                "methodValue": "方法名称", //类型：String  必有字段  备注：检验方法
                "projectNature": "检验性质", //类型：String  必有字段  备注：检验性质
                "recheckSample": "复检", //类型：String  必有字段  备注：复检
                "solutionDetailId": 2 //类型：Number  必有字段  备注：明细id
            }
        ]
    })
});

const demoG = packMsg({
    data: Mock.mock({
        "rows|12": [
            {
                "publicKey": "1", //类型：String  必有字段  备注：计划key
                "planName": "mock", //类型：String  必有字段  备注：计划名称
                "detectionType": "mock", //类型：String  必有字段  备注：抽检类型
                "planOrigin": "mock", //类型：String  必有字段  备注：任务来源
                "sampleFinishDate": "mock", //类型：String  必有字段  备注：抽样截止时间
                "detetionFinishDate": "mock", //类型：String  必有字段  备注：检验截止时间
                "totalAmount": 1, //类型：Number  必有字段  备注：计划批次
                "style": "2", //1.产品分类 2.受检单位 3.专项任务

            }
        ]
    })
});

const demoH = packMsg({
    data: Mock.mock({
        "rows|12": [
            {
                "publicKey": "1", //类型：String  必有字段  备注：方案key
                "solutionName": "mock", //类型：String  必有字段  备注：实施方案名称
                "solutionCode": "mock", //类型：String  必有字段  备注：任务号
                "planName": "mock", //类型：String  必有字段  备注：计划名称
                "detectionType": "mock", //类型：String  必有字段  备注：抽检类型
                "planOrigin": "mock", //类型：String  必有字段  备注：任务来源
                "sampleFinishDate": "mock", //类型：String  必有字段  备注：抽样截至时间
                "detetionFinishDate": "mock", //类型：String  必有字段  备注：检验截至时间
                "planAmount": 1, //类型：Number  必有字段  备注：计划批次
                "solutionAmount": 1, //类型：Number  必有字段  备注：实施方案批次
                "state": "0", //类型：String  必有字段  备注：状态
            }
        ]
    })
});

const demoI = packMsg({
    data: Mock.mock({
        "sheetCode": "mock1", //类型：String  必有字段  备注：抽样单编号
        "taskCode": "mock", //类型：String  必有字段  备注：任务编号
        "sampleOrg": "mock", //类型：String  必有字段  备注：抽样单位
        "detectionOrg": "mock", //类型：String  必有字段  备注：检验机构
        "originOrg": "mock", //类型：String  必有字段  备注：任务来源
        "detectionType": "mock", //类型：String  必有字段  备注：任务抽检类型
        "planName": "mock" //类型：String  必有字段  备注：计划名称
    })
});


const demoJ = packMsg({
    data: Mock.mock({
        "rows|6": [
            {
                "standardCode": "1", //类型：String  必有字段  备注：检测依据编号
                "standardName": "1", //类型：String  必有字段  备注：检测依据名称
                "standardId": 1, //类型：Number  必有字段  备注：检测依据id
                "methodId": 1, //类型：Number  必有字段  备注：检验方法id
                "method": "asda", //类型：String  必有字段  备注：检验方法
                "judgement": "机构", //类型：String  必有字段  备注：判定依据
                "sysItemId": 1, //类型：String  必有字段  备注：系统检验项目id
                "sysItemName": "mock", //类型：String  必有字段  备注：系统检验项目名称
                "itemResult": "合格", //类型：String  必有字段  备注：检测结果
                "detectionUnit": "山东", //类型：String  必有字段  备注：结果单位
                "detectionUnitId": 1, //类型：String  必有字段  备注：结果单位id
                "standardValue": "mock", //类型：String  必有字段  备注：标准值
                "itemConclusionId": 1, //类型：Number  必有字段  备注：单项结论id
                "itemConclusion": "mock" //类型：String  必有字段  备注：单项结论
            }
        ]
    })
});

const demoK = packMsg({
    data: Mock.mock([
        {
            "name": "王小虎", //类型：String  必有字段  备注：用户名+登录名
            "userId": 1 //类型：Number  必有字段  备注：账号id
        },
        {
            "name": "王二", //类型：String  必有字段  备注：用户名+登录名
            "userId": 2 //类型：Number  必有字段  备注：账号id
        },
        {
            "name": "小明", //类型：String  必有字段  备注：用户名+登录名
            "userId": 3//类型：Number  必有字段  备注：账号id
        },
    ]
    )
});

const demoL = packMsg({
    data: Mock.mock({
        "rows|6": [
            {
                "id": 1, //类型：Number  必有字段  备注：工单id
                "taskCode": "mock", //类型：String  必有字段  备注：工单号
                "taskType": 1, //类型：Number  必有字段  备注：工单类型 0-公共任务 1-个人任务
                "areaName": "mock", //类型：String  必有字段  备注：区域名称
                "month": 1, //类型：Number  必有字段  备注：月份
                "workerName": "mock", //类型：String  必有字段  备注：抽样组人员名称
                "allocateAmount": 1, //类型：Number  必有字段  备注：分派批次
                "sampleAmount": 1 //类型：Number  必有字段  备注：已抽样批次
            }
        ]
    })
});


const demoM = packMsg({
    data: Mock.mock({
        "rows|6": [
            {
                "dateDue": "mock", //类型：String  必有字段  备注：距离检验完成日期
                "id": "mock", //类型：String  必有字段  备注：报告编号
                "sampleDate": "mock", //类型：String  必有字段  备注：抽样日期
                "receiveDate": "mock", //类型：String  必有字段  备注：接样日期
                "sampleCode": "mock", //类型：String  必有字段  备注：样品编号
                "taskCode": "mock", //类型：String  必有字段  备注：任务编号
                "sheetCode": "mock", //类型：String  必有字段  备注：抽样单编号
                "area": "mock", //类型：String  必有字段  备注：区域
                "sampleOrg": "mock", //类型：String  必有字段  备注：抽样单位
                "detectionOrg": "mock", //类型：String  必有字段  备注：检验机构
                "conclusion": "mock", //类型：String  必有字段  备注：检验结论
                "updateTime": "mock" //类型：String  必有字段  备注：更新时间
            }
        ]
    })
});


export default {
    demoA,
    demoB,
    demoC,
    demoD,
    demoE,
    demoF,
    demoG,
    demoH,
    demoI,
    demoJ,
    demoK,
    demoL,
    demoM,
};
