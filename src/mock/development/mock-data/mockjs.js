/* 
    @description  mock二次封装
    @author        shuxiaokai
    @create       2019-04-16 19:26"
*/
import Mock from "mockjs";
// import Chance from "chance";
const Random = Mock.Random;
// const chance = new Chance();

/* 
    @description  扩展数据模板
    @author        shuxiaokai
    @create       2019-04-16 19:29"
    @params       
    @return       
*/
Random.extend({
    /** 
    * @description        食品大类
    * @author             shuxiaokai
    * @create             2020-02-19 15:22
    */
    aClass() {
        const subs = [
            "粮食及粮食制品",
            "食用油油脂及其制品",
            "调味品",
            "肉制品",
            "乳制品",
            "饮料",
            "方便制品",
            "肉及肉制品",
            "水产品及其制品",
            "蛋及蛋制品",
            "甜味料",
            "特殊营养食品",
            "饮料类",
            "酒类",
        ];
        return this.pick(subs);
    },
    /** 
     * @description        食品亚类
     * @author             shuxiaokai
     * @create             2020-02-19 15:22
     */
    bClass() {
        const subs = [
            "茶叶",
            "蒸馏酒",
            "糖果制品",
            "肉制品",
            "发酵酒",
            "食塘",
            "蛋制品"
        ];
        return this.pick(subs);
    },
    /** 
     * @description        食品细类
     * @author             shuxiaokai
     * @create             2020-02-19 15:23
     */
    cClass() {
        const subs = [
            "大米",
            "普通挂面",
            "其他谷物粉类制成",
            "食用动物油脂",
            "大料",
            "花椒粉",
            "鸡精"
        ];
        return this.pick(subs);
    },
    /** 
    * @description        公司名称
    * @author             shuxiaokai
    * @create             2020-02-19 15:23
    */
    ccompany() {
        const subs = [
            "中国农业银行",
            "国家电网公司",
            "中国石油天然气集团公司",
            "东风汽车集团",
            "中国电信集团公司",
            "中国银行",
            "中国铁道建筑总公司"
        ];
        return this.pick(subs);
    },
    /** 
    * @description        随机地址
    * @author             shuxiaokai
    * @create             2020-02-19 15:23
    */
    address() {
        const subs = [
            "北京王府井大街",
            "四川省成都市新希望国际b座",
            "深圳市龙岗区乡村基街道办",
            "四川省成都市锦江区红星路33号",
            "绵阳市涪城区西南科技大学",
            "四川省成都市大邑县西岭雪山",
        ];
        return this.pick(subs);
    },

    /**
    * @description        随机区域
    * @author             shuxiaokai
    * @create             2020-02-19 15:23
    */
    area() {
        const subs = [
            "福田区",
            "罗湖区",
            "南山区",
            "盐田区",
            "龙岗区",
            "宝安区",
            "龙华区",
            "坪山区",
            "光明区",
            "大鹏新区"
        ];
        return this.pick(subs);
    },


    /**
    * @description        随机区域
    * @author             shuxiaokai
    * @create             2020-02-19 15:23
    */
    month() {
        const subs = [
            "201910",
            "201911",
            "201912",
            "202001",
            "202002",
            "202003",
            "202004",
            "202005",
            "202006",
            "202007"
        ];
        return this.pick(subs);
    },


    /**
    * @description        随机区域
    * @author             shuxiaokai
    * @create             2020-02-19 15:23
    */
    inspectionType() {
        const subs = [
            "电梯使用安全",
            "电梯制造安装",
            "电梯维护保养",
            "电梯载荷试验",
        ];
        return this.pick(subs);
    },

    /** 
     * @description        随机图片
     * @author             shuxiaokai
     * @create             2020-02-19 15:24
     */
    image() {
        const subs = [
            "http://sample-test.xrdev.cn/shgz/images/20190513060905634_1557727745634.png",
            "http://sample-test.xrdev.cn/shgz/images/20190513061031570_1557727831570.jpg",
        ];
        return this.pick(subs);
    },
    /** 
     * @description        随机文件
     * @author             shuxiaokai
     * @create             2020-02-19 15:24
     */
    file() {
        const subs = [
            "http://sample-test.xrdev.cn/shgz/images/20190513060905634_1557727745634.png",
            "http://sample-test.xrdev.cn/shgz/images/20190513061031570_1557727831570.jpg",
        ];
        return this.pick(subs);
    },
    /** 
     * @description        计划名称
     * @author             shuxiaokai
     * @create             2020-02-19 15:25
     */
    planName() {
        const subs = [
            "深圳市市场监督管理局2019监督抽检",
            "深圳市市场监督管理局2019风险监测",
            "深圳市市场监督管理局2019抽检监测",
            "深圳市市场监督管理局2018监督抽检",
            "深圳市市场监督管理局2018风险监测",
            "龙岗区市场监督管理局2018抽检监测",
            "龙岗区市场监督管理局2018监督抽检",
            "龙岗区市场监督管理局2018风险监测",
            "龙岗区市场监督管理局2018抽检监测",
        ];
        return this.pick(subs);
    },
    /** 
     * @description        计划类型
     * @author             shuxiaokai
     * @create             2020-02-19 15:25
     */
    planType() {
        const subs = [
            "日常监督",
            "风险监测",
            "计划抽检",
            "季度抽检",
            "年度抽检",
        ];
        return this.pick(subs);
    },

    /** 
     * @description        随机抽样单编号
     * @author             shuxiaokai
     * @create             2020-02-19 15:24
     */
    sampleCode() {
        return /\W{2}\d{17}/;
    },
    /** 
     * @description        测试数据  随机生成   时间   数字   字符串  对象   null  undefined  ""  0  -1  NaN  Infinity 长字符串  长数字   空对象 最大值  最小值 MAX_VALUE  MIN_VALUE
     * @author             shuxiaokai
     * @create             2020-02-19 15:24
     */
    testData(strict) {
        const subs = [
            null,
            undefined,
            0,
            -1,
            -0,
            Infinity,
            -Infinity,
            Number.MAX_VALUE,
            Number.MIN_VALUE,
            "",
            NaN,
            [],
            "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
            Random.boolean(),
            Random.natural(),
            Random.integer(),
            Random.float(),
            Random.character(),
            Random.string(),
            Random.color(),
            Random.hex(),
            Random.rgb(),
            Random.url(),
            Random.protocol(),
            Random.domain(),
            Random.tld(),
            Random.ip(),
        ];
        const subs2 = [
            Random.natural(),
            Random.integer(),
            Random.float(),
            Random.character(),
            Random.string(),
            Random.color(),
        ];
        if (strict) {
            return this.pick(subs);
        } else {
            return this.pick(subs2);
        }
    }

});

export default Mock;
