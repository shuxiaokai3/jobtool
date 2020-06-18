/*
    创建者：shuxiaokai
    创建时间：2020-03-08 20:43
    模块名称：首页
    备注：xxxx
*/
<template>
    <div>
        <s-header></s-header>
        <div class="home">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-card class="mb-4" style="opacity: 0.5;">
                        <div class="h-100px title-home">
                            <div class="el-icon-s-custom-home">
                                <i class="el-icon-s-custom"></i>
                            </div>
                            <div>
                                <p class="loginName-home">{{ userInfo.username }} 您好</p>
                                <p class="loginName-time">登陆时间： {{ userInfo.loginTime }}</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-card v-loading="loading1" class="mb-4 box-card h-350px">
                        <div slot="header" class="clearfix card-title-home">
                            <span><i class="el-icon-bell"></i> 通知公告</span>
                        </div>
                        <div>
                            <div v-for="(item, index) in announcementData" :key="index">
                                <div class="d-flex align-center cursor-pointer" @click="handleInon(item.id)">
                                    <div class="top line-limit-length-home">
                                        <el-tooltip class="item" effect="light" :content="item.name" placement="top-start">
                                            <p class="line-limit-length">{{ item.name }}</p>
                                        </el-tooltip>
                                    </div>
                                    <p class="line-limit-length-p">{{ item.createTime }}</p>
                                    <i class="el-icon-warning"></i>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-card class="mb-4 box-card h-350px">
                        <div slot="header" class="clearfix card-title-home">
                            <span><i class="el-icon-postcard"></i> 待办工作</span>
                        </div>
                        <div>
                            <p>暂无数据！</p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-card class="mb-4 box-card h-350px">
                        <div slot="header" class="clearfix card-title-home">
                            <span><i class="el-icon-menu"></i> 常用功能</span>
                        </div>
                        <div>
                            <p>暂无数据！</p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-card class="mb-4 box-card h-350px">
                        <div slot="header" class="clearfix card-title-home">
                            <span><i class="el-icon-document"></i> 我的文件</span>
                        </div>
                        <div>
                            <p>暂无数据！</p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="公告详情" :visible.sync="dialogVisible" width="40%">
            <el-form :model="viewInfo">
                <el-form-item label="公告名称:">
                    <span>{{ viewInfo.name }}</span>
                </el-form-item>
                <el-form-item label="公告内容:">
                    <span>{{ viewInfo.content }}</span>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import header from "@/pages/layout/header/header.vue";
export default {
    components: {
        "s-header": header
    },
    data() {
        return {
            userInfo: {},
            announcementData: [],
            dialogVisible: false,
            viewInfo: {},
            loading1: false
        };
    },
    created() {
        this.getUser();
        this.getAnnouncement();
    },
    methods: {
        getUser() {
            this.axios
                .get(`/system/user/dept/info`)
                .then(res => {
                    this.userInfo = res.data;
                })
                .catch(err => {
                    console.error(err);
                    this.loading = false;
                });
        },
        getAnnouncement() {
            this.loading1 = true;
            this.axios
                .get(`/system/notice/top`)
                .then(res => {
                    this.loading1 = false;
                    this.announcementData = res.data;
                })
                .catch(err => {
                    console.error(err);
                    this.loading1 = false;
                });
        },
        handleInon(id) {
            this.dialogVisible = true;
            this.axios
                .get(`/system/notice?id=${id}`)
                .then(res => {
                    this.viewInfo = res.data;
                })
                .catch(err => {
                    console.error(err);
                    this.loading = false;
                });
        }
    }
};
</script>



<style lang="scss">
.home {
    background-image: url("../../../assets/imgs/sun.jpg");
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
    padding: size(15) size(150);
}
.title-home {
    display: flex;
    padding: 0 size(80);
    align-items: center;
    font-size: size(60);
    .el-icon-s-custom {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.card-title-home {
    font-weight: bold;
    color: #606266;
}
.el-icon-s-custom-home {
    width: size(100);
    height: size(100);
    border: 1px solid #606266;
    border-radius: 50%;
    margin-right: size(40);
}
.el-icon-warning {
    color: #e6a23c;
    margin-left: size(10);
}
.loginName-home {
    font-size: size(20);
    margin-right: size(50);
    font-weight: bold;
}
.loginName-time {
    color: #909399;
    font-size: size(14);
}
.line-limit-length-home {
    max-width: 75%;
}
.line-limit-length {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
    margin-right: size(15);
    font-size: size(15);
}
.line-limit-length-p {
    color: #909399;
    font-size: size(14);
}
</style>
