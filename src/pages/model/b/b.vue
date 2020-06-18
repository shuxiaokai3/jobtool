/*
    创建者：shuxiaokai
    创建时间：2019-09-09 21:56
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="address-content">
        <div class="side-bar">
            <el-menu default-active="2" class="el-menu-vertical-demo">
                <template v-for="(item, index) in menuList">
                    <el-submenu v-if="item.children && item.children.length > 0" :key="index" :index="item.path">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(obj, key) in item.children" :key="key" :index="obj.path">
                            <template slot="title">
                                <i :class="obj.icon"></i>
                                <span>{{ obj.name }} {{ obj.children }}</span>
                            </template>
                            <!-- <template v-if="obj.children && obj.children.length > 0">
                                <el-menu-item v-for="(oob, idx) in obj.children" :key="idx" :index="obj.path">{{ oob.name }}</el-menu-item>
                            </template> -->
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :key="index" :index="item.path" @click="returnIdAddress('#' + item.path, index)">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.name }}</span>  
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
        <div class="project-content">
            <el-row>
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="4">
                    <el-input v-model="projectName" size="small" placeholder="搜索项目名称" prefix-icon="el-icon-search" clearable @input="filterProject"></el-input>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="4">
                    <div class="d-flex center">
                        <el-button size="small" type="success" icon="el-icon-plus" @click="dialogVisible = true">新建项目</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row v-for="(obj, idx) in proLists" :key="idx" :gutter="24">
                <el-col v-if="obj.list.length" :id="obj.path" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <p class="pro-title">{{ obj.category }}</p>
                </el-col>
                <el-col v-for="(item, index) in obj.list" :key="index" :xs="12" :sm="8" :md="6" :lg="6" :xl="4">
                    <div class="card-box">
                        <div class="card-item">
                            <div class="img-box">
                                <img src="../../../assets/imgs/itembg1.jpg" alt="图片">
                            </div>
                            <p class="card-item-title" @click="go(item)">{{ item.title }}</p>
                            <p class="card-item-desc" @click="go(item)">{{ item.desc }}</p>
                            <div class="card-item-favorite">
                                <i :class="[item.star ? 'el-icon-star-on' : 'el-icon-star-off']" @click="handleStar(item)"></i>
                            </div>
                            <div class="card-item-category">{{ item.category }}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <s-addpro-model v-if="dialogVisible" :is-show="dialogVisible" @close="dialogVisible = false;"></s-addpro-model>
    </div>
</template>

<script>
import addPro from "./model/add-project"
export default {
    components: {
        "s-addpro-model": addPro
    },
    data() {
        return {
            projectName: "", //搜索的项目名称
            dialogVisible: false,
            menuList: [
                {
                    name: "收藏",
                    path: "item1",
                    icon: "el-icon-star-on",
                },
                {
                    name: "业务系统",
                    path: "item2",
                    icon: "el-icon-location",
                    // children: [
                    //     {
                    //         name: "测试2-1",
                    //         path: "3-1",
                    //         icon: "el-icon-document",
                    //     },
                    //     {
                    //         name: "测试2-2",
                    //         path: "3-2",
                    //         icon: "el-icon-document",
                    //     },
                    //     {
                    //         name: "测试2-3",
                    //         path: "3-3",
                    //         icon: "el-icon-document",
                    //     }
                    // ]
                },
                {
                    name: "APP",
                    path: "item3",
                    icon: "el-icon-location",
                    // children: [
                    //     {
                    //         name: "测试2-1",
                    //         path: "4-1",
                    //         icon: "el-icon-document",
                    //     },
                    //     {
                    //         name: "测试2-2",
                    //         path: "4-2",
                    //         icon: "el-icon-document",
                    //     },
                    //     {
                    //         name: "测试2-3",
                    //         path: "4-3",
                    //         icon: "el-icon-document",
                    //     }
                    // ]
                },
                {
                    name: "可视化",
                    path: "item4",
                    icon: "el-icon-location",
                },
            ],
            proList: [
                {
                    category: "收藏",
                    path: "item1",
                    list: [
                        {
                            id: 8,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "业务系统"
                        },
                        {
                            id: 9,
                            title: "bbb",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "业务系统"
                        },
                        {
                            id: 6,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 10,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 11,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 12,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 22,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                        {
                            id: 23,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                    ]
                },
                {
                    category: "业务系统",
                    path: "item2",
                    list: [
                        {
                            id: 1,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "业务系统"
                        },
                        {
                            id: 3,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "业务系统"
                        },
                        {
                            id: 8,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "业务系统"
                        },
                        {
                            id: 9,
                            title: "bbb",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "业务系统"
                        },
                        {
                            id: 17,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "业务系统"
                        },
                        {
                            id: 18,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "业务系统"
                        },
                        {
                            id: 19,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "业务系统"
                        },
                        {
                            id: 20,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "业务系统"
                        },
                    ]
                },
                {
                    category: "App",
                    path: "item3",
                    list: [
                        {
                            id: 2,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "App"
                        },
                        {
                            id: 6,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 10,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 11,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 12,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 13,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 14,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 15,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                        {
                            id: 16,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "App"
                        },
                    ]
                },
                {
                    category: "可视化系统",
                    path: "item4",
                    list: [
                        {
                            id: 4,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "可视化系统"
                        },
                        {
                            id: 5,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                        {
                            id: 7,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                        {
                            id: 21,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "可视化系统"
                        },
                        {
                            id: 22,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                        {
                            id: 23,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                        {
                            id: 24,
                            title: "aaa",
                            desc: "一个绍一个介绍一个介绍一个介绍",
                            star: false,
                            category: "可视化系统"
                        },
                        {
                            id: 25,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                        {
                            id: 26,
                            title: "一个项目一个项目一个项目一个项目",
                            desc: "一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍一个介绍",
                            star: true,
                            category: "可视化系统"
                        },
                    ]
                },
            ],
            proLists: [],
        };
    },
    created() {
        this.proLists = this.proList
    },
    methods: {
        go(item) {
            console.log(item, "测试")
        },
        handleStar(item) {
            console.log(item, "sss")
            this.proLists.forEach(every => {
                every.list.find(obj => {
                    if (item.id === obj.id) {
                        obj.star = !obj.star
                    }
                })
            })
            // this.proLists.forEach((obj) => {
            //     if (item.id === obj.id) {
            //         obj.star = !obj.star
            //     }
            // })
        },
        filterProject() {
            this.proLists = []
            let data = []
            this.proList.forEach(obj => {
                data = obj.list.filter(item => item.title.includes(this.projectName)) 
                this.proLists.push({
                    category: obj.category,
                    path: obj.path,
                    list: data
                })
            })
        },
        returnIdAddress(id) {
            document.querySelector(id).scrollIntoView({
                behavior: "smooth"
            });
        }
    }
};
</script>



<style lang="scss">
    .address-content {
        width: 100%;
        height: calc(100% - 60px); 
        background-color: #f8f9fa;
        display: flex;
        .side-bar {
            position: fixed;
            left: 0;
            top: 60px;
            flex: 0 0 200px;
            width: 200px;
            min-height: 100vh;
            background-color: #fff; 
            box-shadow: 0 0 size(20) hsla(0,0%,76%,.5);
            .el-menu {
                height: 100%;
                border: none;
            }
        }
        .project-content {
            height: 100%;
            position: relative;
            margin-left: 200px;
            flex: 1;
            overflow: auto;
            padding: size(30);
            .pro-title {
                font-size: fz(26);
            }
            .card-box {
                position: relative;
                height: size(150);
                margin-bottom: size(10); 
                .card-item {
                    width: 100%;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    overflow: hidden;
                    border-radius: size(8);
                    p {
                        margin: 0;
                    }
                    .img-box {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        background-color: #333;
                        border-radius: size(6);
                        overflow: hidden;
                        img {
                            transition: all 1s;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                    &:hover {
                        img {
                            transform: scale(1.2);
                        }
                        // height: size(134);
                        // transition: all 0.3s;
                        // box-shadow: 6px 6px 8px #888888;
                        // box-shadow: 0px 0px size(10) 0px rgba(15, 15, 15, 0.13);
                    }
                    .card-item-title {
                        position: relative;
                        width: size(218);
                        font-size: fz(22);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .card-item-desc {
                        position: relative;
                        width: size(180);
                        height: size(42);
                        margin-bottom: size(20);
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .card-item-favorite {
                        position: absolute;
                        right: size(10);
                        bottom: size(10);
                        height: size(30);
                        display: flex;
                        flex-direction: row-reverse;
                        & > i {
                            width: size(30);
                            height: 100%;
                            font-size: fz(24); 
                            text-align: center;
                            line-height: size(30);
                            color: #fff;
                        }
                    }
                    .card-item-category {
                        width: size(150);
                        height: size(30);
                        line-height: size(30);
                        background-image: linear-gradient(to right, #1fc8db , #2cb5e8);
                        position: absolute;
                        right: 0;
                        top: 0;
                        transform: translate(size(20), size(0)) rotate(30deg);
                        padding-left: size(64);
                    }
                }
            }
        }
    }
    .card-item {
        position: relative;
        height: size(120);
        padding: size(10);
        color: #fff;
        cursor: pointer;
        transition: box-shadow .25s,height .25s;
    }
</style>
