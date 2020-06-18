/*
    创建者：shuxiaokai
    创建时间：2020-04-15 15:49
    模块名称：文件管理
    备注：xxxx
*/
<template>
    <div class="c s-container">
        <!-- 顶部搜索 -->
        <div class="mt-3 d-flex">
            <div class="f-bg mr-5">共 <span class="orange">{{ total }}</span> 个结果</div>
            <el-row class="flex1">
                <s-input v-model="formInfo.fileName" noFormItem class="mr-5" placeholder="搜索文件名称" prefix-icon="el-icon-search" @input="getData()"></s-input>
                <!-- <el-input v-model="formInfo.fileName" size="small" class="w-300px" placeholder="搜索文件名称" prefix-icon="el-icon-search" @input="getData()"></el-input> -->
                <s-select v-model="formInfo.fileType" noFormItem selectUrl="/api/share/file_enum" placeholder="文件类型" :selectProps="{id: '_id', name: 'name'}" @change="getData"></s-select>
                <el-button type="success" size="mini" @click="handleJumpToAdd">上传文件</el-button>
            </el-row>
        </div>
        <!-- 列表展示 -->
        <el-divider content-position="left">开发工具</el-divider>
        <div v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)">
            <div v-if="fileList && fileList.length > 0" class="file-wrap mt-3">
                <div v-for="(item, index) in fileList" :key="index" class="file-list">
                    <div class="header">
                        <img :src="item.mainImg" alt="" width="100%" height="100%">
                        <div class="mask" @click="downloadFile(item)">详情</div>
                    </div>
                    <div class="mt-1 px-2 base-info text-ellipsis2 f-lg">
                        {{ item.fileName }}
                    </div>
                    <div class="mt-1 px-2 d-flex j-between gray-600">
                        <span>{{ item.creator }}fido</span>
                        <span>{{ item.fileSize | formatByte }}</span>
                    </div>
                    <!-- <div class="mt-1 px-2 d-flex j-between gray-600">
                        <span></span>
                        <span>{{ new Date(item.updatedAt).toLocaleDateString() }}</span>
                    </div> -->
                    <div class="mt-3 gray-600 px-2 description text-ellipsis3" :title="item.description">{{ item.description }}</div>
                    <div class="px-2 tail d-flex j-between a-center">
                        <span class="f-sm gray-600">下载次数：{{ item.downloadTimes }}</span>
                        <el-button size="mini" type="primary" @click="handleDownload(item)">下载</el-button>
                        <!-- <el-button size="mini" type="primary" @click="handleJumpToDetail(item)">详情</el-button> -->
                    </div>
                </div>                
            </div>
        </div>
        <s-empty v-if="fileList && fileList.length === 0"></s-empty>
    </div>
</template>

<script>
import { debounce } from "@/lib"
export default {
    data() {
        return {
            //=====================================查询参数====================================//
            formInfo: {
                pageNum: 1,
                pageSize: 50,
                fileName: "",
                creator: ""
            },
            //=====================================列表相关====================================//
            img: require("@/assets/imgs/pdf.png"),
            fileList: null, //文件列表
            total: 0, //总数
            //=====================================其他参数====================================//
            debounceFn: null,
            loading: false
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //=====================================获取远程数据==================================//
        getData() {
            if (!this.debounceFn) {
                this.debounceFn = debounce(() => {
                    this.loading = true;
                    const params = this.formInfo;
                    this.axios.get("/api/share/file_info", { params }).then(res => {
                        this.fileList = res.data.rows;
                        this.total = res.data.total;
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                    });
                })
            }
            this.debounceFn()
        },
        //=====================================前后端交互====================================//
        //下载文件
        downloadFile(item) {
            console.log(item.fileUrl)
        },
        //=====================================组件间交互====================================//  
        handleJumpToDetail(item) {
            console.log(item)
            // this.$router.push({
            //     path: "/v1/c/c/add",
            //     query: {
            //         _id: item._id
            //     }
            // });
        },
        handleJumpToAdd() {
            this.$router.push("/v1/c/c/add");
        },
        //下载
        handleDownload(item) {
            const params = {
                fileUrl: item.fileUrl
            };
            this.axios.get("/api/oss/file_url", { params }).then(res => {
                window.open(res.data.url);
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.c {
    .file-wrap {
        display: flex;
        flex-wrap: wrap;
        .file-list {
            width: size(280);
            height: size(350);
            border: 1px solid $gray-200;
            box-shadow: $box-shadow-sm;
            margin-right: 30px;
            margin-bottom: 30px;
            position: relative;
            .header {
                width: 100%;
                height: size(170); 
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                cursor: pointer;
                &:hover .mask {
                    transform: scale(1);
                }
                .mask {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    transform: scale(0);
                    transition: transform .3s;
                    background: rgba(0, 0, 0, .4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: $white;
                    font-size: fz(20);
                }
                &>img {
                    width: 100%;
                    height: 100%;                    
                }
            }
            .tail {
                width: 100%;
                position: absolute;
                bottom: size(10);
            }
        }
    }
}
</style>
