/*
    创建者：shuxiaokai
    创建时间：2020-04-07 13:53
    模块名称：新增文件
    备注：xxxx
*/
<template>
    <div class="c-upload mt-2">
        <div class="upload-wrap" @dragover="handleDragOver" @dragenter="handleDragEnter" @dragleave="handleDragLeave" @drop="handleDrop">
            <label for="file2" class="upload-field" :class="{active: activeDrag}">
                <i class="el-icon-upload gray-500"></i>
                <div class="gray-600 cursor-pointer">
                    <span>将文件拖到此处，或</span>
                    <span class="theme-color">点击上传</span>
                </div>
                <input id="file2" type="file" hidden @change="handleSelectFile">
            </label>
            <div v-if="fileObj.file" class="file-info d-flex a-center">
                <div class="logo">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="fileIcon"></use>
                    </svg>
                </div>
                <div class="info ml-3">
                    <div class="text-ellipsis" :title="fileObj.name">{{ fileObj.name }}</div>
                    <div class="f-sm gray-500">
                        <span>{{ uploadSize | formatByte }}</span>
                        <span>/</span>
                        <span>{{ fileObj.size | formatByte }}</span>
                    </div>
                </div>
                <div class="process ml-3">
                    <el-progress :text-inside="true" :stroke-width="15" :percentage="fileObj.percentage" stroke-linecap="butt"></el-progress>
                    <div class="mt-1 d-flex f-sm gray-500 a-center">
                        <div class="speed">{{ speed | formatByte }}/s</div>
                        <div class="ml-3 rest-time">
                            <span>剩余&nbsp;</span>
                            <span>{{ restTime }}</span>
                        </div>
                    </div>
                </div>
                <div class="operation ml-3"> 
                    <i v-if="uploadState === 'waiting'" class="f-lg cursor-pointer hover-bg-gray-400 radius-round el-icon-video-play mr-2" @click="startUpload"></i>
                    <i v-else-if="uploadState === 'uploading'" class="f-lg cursor-pointer hover-bg-gray-400 radius-round el-icon-video-pause" @click="stopUpload"></i>
                    <i v-else-if="uploadState === 'error'" class="f-lg red cursor-pointer radius-round el-icon-error"></i>
                    <i v-else-if="uploadState === 'success'" class="f-lg green cursor-pointer radius-round el-icon-success"></i>
                    <!-- <i v-if="uploadState !== 'success'" title="取消上传" class="f-lg cursor-pointer hover-bg-gray-400 radius-round el-icon-close"></i> -->
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import OSS from "ali-oss"
import moment from "moment"
export default {
    data() {
        return {
            //=====================================阿里云配置====================================//
            aliOssConfig: {
                accessKeyId: "",
                accessKeySecret: "",
                stsToken: "",
                expire: "",
                signature: "",
                policy: "",
                region: "",
                bucket: "",
            },
            //===================================文件相关配置======================================//
            fileObj: { 
                file: null, //文件数据
                fileType: "", //文件类型
                name: "", //文件名称
                fileUrl: "", //文件完整路径
                size: 0, //文件大小
                fileFlag: "", //文件标识，计算方式： 文件大小_文件名称  不太容易出现重复
                percentage: 0, //上传百分比
            }, 
            speed: 0, //上传速度
            //=====================================其他参数====================================//
            activeDrag: false, //是否处于拖拽状态
            uploadState: "waiting", //上传状态  waiting: 等待上传，uploading：正在上传，success：上传完成   
            ossClient: null, //oss对象
            tempCheckpoint: null, //临时保存断点值
        };
    },
    computed: {
        uploadSize() {
            const fileSize = this.fileObj.size;
            return this.fileObj.percentage / 100 * fileSize;
        },
        fileIcon() {
            const type = this.fileObj.fileType;
            if (type === "application/pdf") {
                return "#iconpdfwenjian";
            } else if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                return "#iconexcel";
            } else if (type === "text/plain") {
                return "#icontxt";
            } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type === "application/msword") {
                return "#iconWORD";
            } else if (type === "application/x-zip-compressed") {
                return "#iconyasuobao"
            } else if (type.includes("image")) {
                return "#icontupian"
            } else if (type.includes("audio")) {
                return "#icon-"
            } else if (type.includes("video")) {
                return "#icontubiaozhizuomoban-";
            } else {
                return "#iconicon_weizhiwenjian";
            }
        },
        restTime() { //剩余下载时间
            const size = this.fileObj.size;
            const speed = this.speed;
            const time = parseInt(size / speed, 10) * 1000;
            // console.log(speed, time)
            if (isNaN(time)) {
                return `未知`
            }
            const temp = moment.duration(time)
            const hours = temp.hours() < 10 ? ("0" + temp.hours()) : temp.hours();
            const minutes = temp.minutes() < 10 ? ("0" + temp.minutes()) : temp.minutes();
            const seconds = temp.seconds() < 10 ? ("0" + temp.seconds()) : temp.seconds();
            if (temp.hours() > 24) {
                return `大于1天`
            } else {
                return `${hours}:${minutes}:${seconds}`;
            }
        },
       
    },
    created() {
        this.getSTSToken();
    },
    methods: {
        //=====================================获取远程数据==================================//
        //获取文件上传临时凭证
        getSTSToken() {
            this.axios.get("/api/oss/sts").then(res => {
                this.aliOssConfig.accessKeyId = res.data.accessKeyId;
                this.aliOssConfig.accessKeySecret = res.data.accessKeySecret;
                this.aliOssConfig.stsToken = res.data.stsToken;
                this.aliOssConfig.signature = res.data.signature;
                this.aliOssConfig.policy = res.data.policy;
                this.aliOssConfig.bucket = res.data.bucket;
                this.aliOssConfig.expire = res.data.expire;
                this.aliOssConfig.region = res.data.region;
                this.aliOssConfig.folder = res.data.folder;
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================前后端交互====================================//
        //开始上传
        async startUpload() {
            try {
                this.uploadState = "uploading";
                this.ossClient = new OSS({
                    accessKeyId: this.aliOssConfig.accessKeyId,
                    accessKeySecret: this.aliOssConfig.accessKeySecret,
                    stsToken: this.aliOssConfig.stsToken,
                    bucket: this.aliOssConfig.bucket,
                    region: this.aliOssConfig.region,
                })
                const fileUrl = `/${this.aliOssConfig.folder}/${Date.now()}_${this.fileObj.name}`;
                this.fileObj.fileUrl = fileUrl;
                await this.ossClient.multipartUpload(fileUrl, this.fileObj.file, {
                    progress: (p, checkpoint, res) => {
                        if (!res) {
                            this.fileObj.percentage = 100;
                            this.$emit("finish", {
                                size: this.fileObj.size,
                                fileUrl: this.fileObj.fileUrl
                            });
                            this.clearLocalFileInfo();
                            return;
                        } else {
                            const chunkSize = 1024 * 1024 * 1000; //每片数据大小(字节)
                            this.speed = parseInt(chunkSize / res.rt); // kb/s
                            this.tempCheckpoint = checkpoint; //保存断点信息
                            this.fileObj.percentage = parseFloat((p * 100).toFixed(2)); //保存上传百分比
                            checkpoint.percentage = parseFloat((p * 100).toFixed(2));
                            this.saveLocalTempPoint(checkpoint); //临时保存文件断点信息                            
                        }

                        if (p === 1) {
                            this.$emit("finish", {
                                size: this.fileObj.size,
                                fileUrl: this.fileObj.fileUrl
                            });
                            this.clearLocalFileInfo();
                        }
                    },
                    meta: {
                        test: "11111111111111"
                    },
                    checkpoint: this.tempCheckpoint
                })
            } catch (e) {
                if (e.name === "cancel") {
                    this.uploadState = "waiting"
                } else {
                    this.uploadState = "error";
                }
                console.error(e);
            }
        },
        //停止上传
        async stopUpload() {
            this.uploadState = "waiting";
            this.ossClient.cancel();
        },
        //获取本地断点信息
        getLocalTempPoint() {
            const localCheckPoint = localStorage.getItem("tempFile") ? JSON.parse(localStorage.getItem("tempFile")) : {};
            const temp = localCheckPoint[this.fileObj.fileFlag] || null;
            if (!temp) {
                return;
            }
            this.tempCheckpoint = temp;
            this.tempCheckpoint.file = this.fileObj.file;
            this.fileObj.percentage = temp.percentage;
        },
        //保存本地断点信息
        saveLocalTempPoint(checkpoint) {
            let tempFile = localStorage.getItem("tempFile") || "{}";
            tempFile = JSON.parse(tempFile);
            tempFile[this.fileObj.fileFlag] = checkpoint
            localStorage.setItem("tempFile", JSON.stringify(tempFile))
        },
        clearLocalFileInfo() {
            const localCheckPoint = localStorage.getItem("tempFile") ? JSON.parse(localStorage.getItem("tempFile")) : {};
            delete localCheckPoint[this.fileObj.fileFlag];
            localStorage.setItem("tempFile", JSON.stringify(localCheckPoint))
            this.tempCheckpoint = {};
            this.uploadState = "success";
        },
        //=====================================组件间交互====================================//  
        //选择文件
        handleSelectFile(e) {
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            this.fileObj.file = file;
            this.fileObj.fileType = file.type;
            this.fileObj.name = file.name;
            this.fileObj.size = file.size;
            this.fileObj.fileFlag = file.size + "_" + file.name;
            this.fileObj.percentage = 0;
            this.speed = 0;
            this.uploadState = "waiting";
            this.getLocalTempPoint();
        },
        //清除拖拽默认事件
        handleDragOver(e) {
            e.preventDefault()
        },
        //拖拽进入的时候
        handleDragEnter() {
            this.activeDrag = true;
        },
        //拖拽离开的时候
        handleDragLeave() {
            this.activeDrag = false;
        },
        handleDrop(e) {
            this.drop = false;
            this.$emit("change", e.dataTransfer.files[0]);
            const file = e.dataTransfer.files[0];
            if (!file) {
                return;
            }
            this.fileObj.file = file;
            this.fileObj.fileType = file.type;
            this.fileObj.name = file.name;
            this.fileObj.size = file.size;
        },

        //=====================================其他操作=====================================//
    }
};
</script>



<style lang="scss">
.c-upload {
    line-height: normal;
    .upload-wrap {
        width: size(600);
        .upload-field {
            width: 100%;
            height: size(300);
            border: 1px dashed $gray-400;
            border-radius: size(10);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: $gray-100;
            &.active {
                border: 1px dashed $theme-color;
                background: $gray-300;
            }
            .el-icon-upload {
                font-size: fz(80);
            }
        }    
        .file-info {
            height: size(55);
            border-bottom: 1px solid $gray-400;
            // border-top: 1px solid $gray-400;
            .icon {
                width: size(35);
                height: size(35);
                vertical-align: -0.15em;
                fill: currentColor;
                overflow: hidden;
            }
            .info {
                width: size(230);
            }
            .time {
                color: $gray-500;
            }
            .process {
                // height: size(20);
                flex: 0 0 size(200);
                .speed {
                    flex: 0 0 size(70);
                }
                .rest-time {
                    flex: 1;
                }
            }   
            .operation {
                display: flex;
                justify-content: space-around;
                flex: 0 0 size(70);
            }     
        }        
    }
}

</style>
