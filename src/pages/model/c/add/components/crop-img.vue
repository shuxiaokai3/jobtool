/*
    创建者：shuxiaokai
    创建时间：2020-04-07 13:53
    模块名称：新增文件
    备注：xxxx
*/
<template>
    <div class="s-crop-img">
        <label for="file" class="upload-field">
            上传本地照片
            <input id="file" type="file" accept="image/*" hidden @change="handleSelectFile">
        </label>
        <div v-if="imgSrc" class="ml-3 crop-button" @click="handleCrop">确认裁剪</div>
        <div ref="field" class="crop-field">
            <img v-show="showImg" ref="img" :src="imgSrc">
            <s-resize 
                    v-if="showImg" 
                    class="select" 
                    :config="cropConfig"
                    @change="handleCropChange">
            </s-resize>
        </div>
    </div>
</template>

<script>
// import OSS from "ali-oss"
// import moment from "moment"
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
                size: 0, //文件大小
            }, 
            fieldMaxWidth: 600, //裁剪区域最大宽度
            fieldMinWidth: 200, //裁剪区域最小宽度
            fieldMaxHeight: 400, //裁剪区域最大高度
            fieldMinHeight: 100, //裁剪区域最小高度
            imgSrc: "", //图片src
            cropConfig: { //初始值
                left: 0, 
                top: 0,
                width: 200,
                height: 100,
                cropMinWidth: 200,
                cropMaxWidth: 200,
                cropMaxHeight: 200,
                aspectRatio: 2, //长宽比例
                
            },
            qulity: 0.9,
            cropChangeData: {},
            //=====================================裁剪相关====================================//
            canvas: null,
            ctx: null,
            ratio: 0, //图片缩放比例
            //=====================================其他参数====================================//
            loading: false, //图片加载
            showImg: false, //是否展示上传的主图
        };
    },
    computed: {
       
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
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        //=====================================前后端交互====================================//
      
        //=====================================组件间交互====================================//  
        drawCanvas() {
            const { left, top, width, height } = this.cropChangeData;
            if (!this.ctx) {
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.cropConfig.width;
                this.canvas.height = this.cropConfig.width / this.cropConfig.aspectRatio;
                this.ctx = this.canvas.getContext("2d");
            }
            this.ctx.clearRect(0, 0, this.cropConfig.width, this.cropConfig.width / this.cropConfig.aspectRatio);
            this.ctx.drawImage(this.$refs["img"], left * this.ratio, top * this.ratio, width * this.ratio, height * this.ratio, 0, 0, this.cropConfig.width, this.cropConfig.width / this.cropConfig.aspectRatio);
            this.$emit("crop", this.canvas.toDataURL("image/webp", this.qulity));
        },
        //根据图片宽高计算包裹框大小
        calcFieldSize(width, height) {
            this.ratio = 1;
            if (width > height) { //图片宽度大于高度的情况下
                if (width > this.fieldMaxWidth) { //大于包裹框最大宽度
                    this.ratio = width / this.fieldMaxWidth;
                    this.$refs["field"].style.width = this.fieldMaxWidth + "px";
                    this.$refs["field"].style.height = height / this.ratio + "px";
                    this.$refs["img"].style.width = this.fieldMaxWidth + "px";
                    this.$refs["img"].style.height = height / this.ratio + "px";
                } else if (height < this.fieldMinHeight) { //小于包裹框最小宽度
                    this.ratio = height / this.fieldMinHeight;
                    this.$refs["field"].style.width = width / this.ratio + "px";
                    this.$refs["field"].style.height = this.fieldMinHeight + "px";
                    this.$refs["img"].style.width = width / this.ratio + "px";
                    this.$refs["img"].style.height = this.fieldMinHeight + "px";
                } else {
                    this.$refs["field"].style.width = width + "px";
                    this.$refs["field"].style.height = height + "px";
                    this.$refs["img"].style.width = width + "px";
                    this.$refs["img"].style.height = height + "px";
                }
            } else if (width <= height) { //图片宽度小于高度的情况下
                if (height > this.fieldMaxHeight) { //大于包裹框最大高度
                    this.ratio = height / this.fieldMaxHeight;
                    this.$refs["field"].style.width = width / this.ratio + "px";
                    this.$refs["field"].style.height = this.fieldMaxHeight + "px";
                    this.$refs["img"].style.width = width / this.ratio + "px";
                    this.$refs["img"].style.height = this.fieldMaxHeight + "px";
                } else if (width < this.fieldMinWidth) { //小于包裹框最小宽度
                    this.ratio = width / this.fieldMinWidth;
                    this.$refs["field"].style.width = this.fieldMinWidth + "px";
                    this.$refs["field"].style.height = height / this.ratio + "px";
                    this.$refs["img"].style.width = this.fieldMinWidth + "px";
                    this.$refs["img"].style.height = height + "px";
                } else {
                    this.$refs["field"].style.width = width + "px";
                    this.$refs["field"].style.height = height + "px";
                    this.$refs["img"].style.width = width + "px";
                    this.$refs["img"].style.height = height + "px";
                }
            }
            this.cropConfig.cropMaxWidth = parseFloat(this.$refs["img"].style.width);
            this.cropConfig.cropMaxHeight = parseFloat(this.$refs["img"].style.height);
        },
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
            const fileReader = new FileReader();
            fileReader.readAsDataURL(this.fileObj.file);
            fileReader.addEventListener("load", () => {
                let img = new Image();
                img.src = fileReader.result;
                img.onload = () => {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;
                    if (width < this.fieldMinWidth || height < this.fieldMinHeight) {
                        this.$message.warning("分辨率至少280 * 170");
                        img = null;
                        return;
                    } else {
                        this.imgSrc = fileReader.result;
                        this.$refs["img"].onload = () => { //图片加载
                            const imgWidth = this.$refs["img"].naturalWidth;
                            const imgHeight = this.$refs["img"].naturalHeight;
                            this.calcFieldSize(imgWidth, imgHeight); //根据图片宽高计算包裹框大小
                            this.drawCanvas()
                        };   
                        img = null;
                        this.showImg = true;
                    }     
                }
            }, false);
        },
        //=====================================拖拽相关====================================//
        handleCropChange(val) {
            this.cropChangeData = val;     
            this.drawCanvas()          
        },
        handleCrop() {
            this.showImg = false;
            this.$refs["field"].style.width = 0;
            this.$refs["field"].style.height = 0;
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.s-crop-img {
    // 文件上传
    .upload-field {
        display: inline-block;
        padding: size(0) size(20);
        background: $white;
        border: 1px solid $gray-300;
        cursor: pointer;
        &:hover {
            background: $gray-100;
        }
    }    
    .crop-button {
        display: inline-block;
        padding: size(0) size(20);
        background: $white;
        // border: 1px solid $gray-300;
        cursor: pointer;
        color: $white;
        background: $green;
        &:hover {
            background: mix($green, $white, 90%);
        }
    }
    //文件裁剪
    .crop-field {
        margin-top: size(20);
        position: relative;
        img {
            width: 0;
            height: 0;
        }
    }
}

</style>
