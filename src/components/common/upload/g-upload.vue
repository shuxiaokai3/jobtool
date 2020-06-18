/*
    创建者：shuxiaokai
    创建时间：2019-05-05 17:45
    模块名称：xxxx
    备注：xxxx
*/

<template>
    <div class="s-upload">
        <el-upload 
                ref="uploadActivePic" 
                :limit="limit" 
                :action="uploadPicUrl" 
                list-type="picture-card" 
                :on-exceed="limitPic" 
                :before-upload="checkFileSizeAndType" 
                :on-success="handleSuccess" 
                :on-preview="handlePictureCardPreview" 
                :on-change="handleChange" 
                :file-list="existFiles" 
                :http-request="httpRequest"
                :multiple="true"
        >
            <i class="el-icon-plus"></i>
            <div slot="file" slot-scope="data" v-loading="data.file.__loading" class="file-show">
                <img v-if="data.file.raw.type.includes('image')" :src="data.file.url" width="100%" height="100%">
                <img v-else-if="data.file.raw.type.includes('pdf')" :src="require('@/assets/imgs/pdf.png')" width="100%" height="100%">
                <img v-else-if="data.file.raw.type.includes('word') || data.file.raw.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || data.file.raw.type.includes('application/msword')" :src="require('@/assets/imgs/word.png')" width="100%" height="100%">
                <img v-else-if="data.file.raw.type.includes('excel') || data.file.raw.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')" :src="require('@/assets/imgs/excel.png')" width="100%" height="100%">
                <img v-else-if="data.file.raw.type.includes('zip') || data.file.raw.type.includes('application/x-zip-compressed')" :src="require('@/assets/imgs/zip.png')" width="100%" height="100%">
                <img v-else :src="require('@/assets/imgs/unknown.png')" width="100%" height="100%">
                <span class="text-center cyan text-ellipsis">{{ data.file.name }}</span>
                <span class="el-upload-list__item-actions">
                    <!-- pdf 和 图片才能够预览。-->
                    <span 
                            v-if="couldPreview(data.file.raw.type)"
                            class="el-upload-list__item-preview" 
                            @click="handlePictureCardPreview(data.file)"
                    >
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleDownload(data.file)">
                        <i class="el-icon-download"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(data.file)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
            <div slot="tip">
                <slot name="tip"></slot>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :lock-scroll="false" append-to-body width="70%">
            <!-- 图片预览 -->
            <!-- <img v-if="activeFileType.includes('image')" :src="activeFileUrl" width="100%"> -->
            <s-img-viewer v-if="dialogVisible && activeFileType.includes('image')" :url="activeFileUrl" :img-list="imgResult"></s-img-viewer>
            <!-- pdf预览 -->
            <div v-if="activeFileType.includes('pdf')" class="vh-70">
                <iframe v-if="activeFileUrl.startsWith('https') && safeHost" :src="activeFileUrl" frameborder="0" width="100%" height="100%"></iframe>
                <iframe v-else-if="activeFileUrl.startsWith('http') && !safeHost" :src="activeFileUrl" frameborder="0" width="100%" height="100%"></iframe>
                <a v-else :href="activeFileUrl">点我下载</a>
                <!-- <iframe :src="activeFileUrl" frameborder="0" width="100%" height="100%"></iframe> -->
            </div>
        </el-dialog>
    </div>
</template>

<script>
/*
    描述: 										  多图上传
    属性: 
        limit 类型:Number                         图书上传数量限制         默认为10张
        size  类型:Number	                      单张文件大小限制(单位M)  默认为1M
        value 类型:[{name: String, url: String}]  当前已存在的文件		   默认为[]
        type  类型:[String]						  允许上传文件类型         默认jpg, png, gif, jpeg	
    
    事件:
        success									  成功时候的回调函数
*/
import { BaseConfig } from "@/config.default.js"
// import axios from "axios"
import OSS from "ali-oss"
export default {
    props: {
        limit: {
            //文件上传限制数量
            type: Number,
            default: 20
        },
        size: {
            //单张文件大小限制
            type: Number,
            default: 10
        },
        value: {
            //当前已存在文件
            type: [Array, String],
            default() {
                return [];
            }
        },
        disabled: {
            //是否禁止上传
            type: Boolean,
            default: false
        },
        type: {
            //上传文件类型      
            // application/vnd.openxmlformats-officedocument.wordprocessingml.document => word  .docx文件
            // application/msword => word  .doc文件
            // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet => excel
            // application/x-zip-compressed => zip
            type: Array,
            default: function() {
                return [
                    // "image/jpg",
                    // "image/png",
                    // "image/gif",
                    // "image/jpeg",
                    // "application/pdf",
                    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    // "application/x-zip-compressed"
                ];
            }
        },
        img: {
            //是否上传图片类型
            type: Boolean,
            default: false,
        },
        pdf: {
            //是否上传pdf
            type: Boolean,
            default: false,
        },
        excel: {
            //是否上传excel
            type: Boolean,
            default: false,
        },
        word: {
            //是否上传word
            type: Boolean,
            default: false,
        },
        zip: {
            //是否上传zip
            type: Boolean,
            default: false,
        },
        isView: {
            //是否开启预览模式
            type: Boolean,
            default: false,
        },
        rawResult: { //是否返回原始数据
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            uploadPicUrl: process.env.NODE_ENV === "development" ? BaseConfig.devImgUrl : BaseConfig.proImgUrl, //文件上传url, //文件上传url
            activeFileUrl: "", //文件url
            activeFileType: "", //文件类型
            dialogVisible: false, //查看照片大图时候的对话框触发变量
            fileList: [],
            result: [], //文件上传成功时候的id字符串
            imgResult: [], //图片返回值
            existFiles: [], //当前已存在的图片数组
            safeHost: window.location.protocol === "https:",
            aliOssConfig: {}, //阿里oss上传配置
            expireTime: null, //票据过期时间,其实可以存放sessionStorage防止刷新或者组件销毁导致票据失效，减少对后端请求
            enableExistFile: true, //是否允许改变已存在的fileList
            imgTypes: ["image/jpg", "image/png", "image/gif", "image/jpeg"]
        };
    },
    watch: {
        value: {
            handler(val) {
                if (this.fileList.length === 0) {
                    let data = null;
                    if (typeof val === "string") {
                        data = val.split(",");
                    } else if (Array.isArray(val)) {
                        data = val;
                    } else { //当数据为null的时候直接不处理
                        return
                    }
                    data = data.map(val => ({ url: val }))
                    const ret = data.map((val) => {
                        if (!val.url) {
                            throw new Error("预览文件格式必须为[{url:'xxx'}]")
                        }
                        if (val.url.includes(".docx") || val.url.includes(".doc")) {
                            val.type = "word";
                        }
                        if (val.url.includes(".pdf")) {
                            val.type = "pdf";
                        }
                        if (val.url.includes(".xlxs") || val.url.includes(".xls")) {
                            val.type = "excel";
                        }
                        return {
                            status: "success",
                            name: val.name || "",
                            url: val.url,
                            raw: {
                                type: val.type || "image"
                            },
                            response: {
                                data: val.url
                            },
                            __loading: false
                        };
                    });
                    this.fileList = ret;
                    this.imgResult = this.fileList.filter(val => {
                        return val.raw.type.includes("image")
                    }).map(val2 => val2.url)
                    if (this.enableExistFile) {
                        this.existFiles = ret;
                        setTimeout(() => {
                            this.enableExistFile = false;
                        }, 1);
                    }
                }
            },
            deep: true,
            immediate: true //打开会出现闪烁
        },
        disabled: {
            handler(val) {
                this.$nextTick(() => {
                    if (!this.$el) return;
                    if (val === true) {
                        this.$el.querySelector(".el-upload--picture-card").classList.add("d-none")
                    } else {
                        this.$el.querySelector(".el-upload--picture-card").classList.remove("d-none")
                    }
                })
            },
            immediate: true
        }
    },
    methods: {
        //自定义上传规则
        async httpRequest(fileObj) {
            if (!this.expireTime || this.expireTime < Date.now()) {
                await this.getFileTicket();
            }
            const client = new OSS({
                accessKeyId: this.aliOssConfig.accessKeyId,
                accessKeySecret: this.aliOssConfig.accessKeySecret,
                stsToken: this.aliOssConfig.stsToken,
                bucket: this.aliOssConfig.bucket,
                region: this.aliOssConfig.region,
            });
            const fileName = `/${this.aliOssConfig.folder}/${Date.now()}_${fileObj.file.name}`
            return new Promise((resolve) => {
                client.put(fileName, fileObj.file).then(() => {
                    resolve({ data: fileObj.action + "/" + fileName });
                }).catch(err => {
                    this.$errorThrow(err, this);
                });                
            });
        },
        //获取凭证
        getFileTicket() {
            return new Promise((resolve, reject) => {
                this.axios.get("/api/oss/sts").then(res => {
                    this.aliOssConfig = res.data;
                    this.expireTime = new Date(res.data.expire).getTime();
                    resolve();
                }).catch(err => {
                    this.$errorThrow(err, this);
                    reject(err);
                });    
            });
        },
        //判断文件是否可以预览
        couldPreview(type) {
            const isImage = type.includes("image");
            const isPdf = type.includes("pdf");
            // const isWord = type.includes("word") || type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") || type.includes("application/msword");
            // const isExcel = type.includes("excel") || type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            return isImage || isPdf;
        },
        //=====================================文件相关判断====================================//
        /* 
            @description  检查上传文件大小和类型
            @autor        shuxiaokai
            @create       2019-07-04 14:05"
            @params       
            @return       
        */
        checkFileSizeAndType(file) {
            const isLtnM = file.size > 1024 * 1024 * this.size;
            let isValidType = this.type.includes(file.type);
            //=========================================================================//
            if (this.img && this.imgTypes.includes(file.type)) {
                isValidType = true;
            }
            if (this.pdf && file.type === "application/pdf") {
                isValidType = true;
            }
            if (this.excel && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                isValidType = true;
            }
            if (this.word && (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword")) {
                isValidType = true;
            }
            if (this.zip && file.type === "application/x-zip-compressed") {
                isValidType = true;
            }  
            //当用户上传文件无法判断得时候，例如有时候上传excel由于office本身问题导致无法获取类型    https://segmentfault.com/a/1190000017281291
            if (!file.type) {
                console.log(file)
            }

            //=========================================================================//
            // console.log("文件类型", file.type)
            if (isLtnM) {
                this.$message({
                    type: "warning",
                    message: `每个文件大小限制为${this.size}M`
                });
            } else if (!isValidType) {
                this.$message({
                    type: "warning",
                    message: `文件类型不正确`
                });
            }
            return !isLtnM && isValidType;
        },
        /* 
            @description  超出允许上传个数
            @autor        shuxiaokai
            @create       2019-07-04 14:14"
        */
        limitPic() {
            this.$message({
                type: "warning",
                message: `允许上传文件个数限制为${this.limit}个`
            });
        },
        //=====================================上传成功组装数据====================================//
        /* 
            @description  成功回调，处理相关数据组装任务
            @autor        shuxiaokai
            @create       2019-07-04 14:16"
            @params       
            @return       
        */
        handleSuccess(res, file, fileList) {
            const ret = []; //清空缓存数据，防止数据重复
            const retImg = []; //清空缓存数据，防止数据重复,图片结构
            file.__loading = false;
            this.fileList = fileList;
            fileList.forEach(val => {
                if (val.response) {
                    ret.push(val.response.data);
                } 
                if (val.response && val.raw.type.includes("image")) {
                    retImg.push(val.response.data);
                }
            });
            this.result = ret;
            this.imgResult = retImg;
            if (this.rawResult) {
                this.$emit("input", this.result);
            } else {
                this.$emit("input", this.result.join(","));
            }
            this.$emit("success", this.result);
        },
        //=====================================文件下载====================================//
        /* 
            @description  文件下载
            @autor        shuxiaokai
            @create       2019-07-04 17:53"
            @params       
            @return       
        */
        handleDownload(file) {
            if (file.response && file.response.data) {
                const a = document.createElement("a");
                a.download = file.name;
                a.href = file.response.data;
                a.target = "__blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            // console.log("下载文件", file)
        },
        /* 
            @description  预览文件
            @autor        shuxiaokai
            @create       2019-07-04 17:53"
        */
        handlePictureCardPreview(file) {
            this.advertImgUrl = "";
            this.activeFileType = file.raw.type;
            // console.log(file);
            if (!file.response || !file.response.data) {
                this.$message({
                    type: "warning",
                    message: "文件正在上传中,请耐心等待"
                });
                return;
            } else {
                this.activeFileUrl = file.response.data;
            }
            if (this.activeFileUrl.startsWith("https:") && this.safeHost) {
                this.dialogVisible = true;
            } else if (this.activeFileUrl.startsWith("http:") && !this.safeHost) {
                this.dialogVisible = true;
            } else if (!this.activeFileUrl.startsWith("http:") && !this.activeFileUrl.startsWith("https:")) {
                window.open("http://" + this.activeFileUrl)
            } else {
                window.open(this.activeFileUrl)
            }
        },
        /* 
            @description  删除文件
            @autor        shuxiaokai
            @create       2019-07-04 17:53"
        */
        handleRemove(file) {
            this.$confirm("此操作将删除该文件?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                const ret = [];
                const retImg = [];
                if (file.response && file.response.data) {
                    this.fileList.forEach((val, index) => {
                        if (val.url === file.url || val.uid === file.uid || val.url === file.response.data) {
                            this.fileList.splice(index, 1)
                        }
                    });
                    this.fileList.forEach(val => {
                        if (val.raw.type.includes("image")) {
                            retImg.push(val.response.data);
                        }
                        ret.push(val.response.data);
                    });
                    this.result = ret;
                    this.imgResult = retImg;
                    if (this.fileList.length === 0) { //修复一张图片无法删除
                        this.existFiles = [];
                    }
                    if (this.rawResult) {
                        this.$emit("input", this.result);
                    } else {
                        this.$emit("input", this.result.join(","));
                    }
                    this.$emit("success", this.result);                 
                } else {
                    this.$message.warning("文件正在上传中,请耐心等待");
                }            
            }).catch(() => {
                    
            });
        },
        //文件状态改变
        handleChange(file, fileList) {
            fileList.forEach(val => {
                if (val.__loading == null) {
                    this.$set(val, "__loading", true);
                }
            })
        }
    }
};
</script>


<style lang="scss">
    .s-upload {
        display: flex;
        .d-none {
            display: none;
        }
    }
    .file-show {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>

