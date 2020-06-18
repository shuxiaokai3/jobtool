/*
    创建者：shuxiaokai
    创建时间：2020-04-16 10:16
    模块名称：上传文件
    备注：xxxx
*/
<template>
    <div class="c-add w-100 h-100" @dragover="handleDragOver" @drop="forbidDrop">
        <div class="s-container">
            <s-left-right :leftWidth="800" :minLeftWidth="800">
                <div slot="left">
                    <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
                        <el-form-item label="文件名称：" prop="fileName">
                            <el-input v-model="formInfo.fileName" size="mini" placeholder="请输入文件名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="文件描述：" prop="description">
                            <el-input v-model="formInfo.description" size="mini" placeholder="请输入文件描述" clearable></el-input>
                        </el-form-item>
                        <s-select v-model="formInfo.fileType" label="文件类型：" prop="fileType" multi noCol rawResult selectUrl="/api/share/file_enum" :selectProps="{id: '_id', name: 'name'}"></s-select>
                        <el-form-item label="主图：" prop="mainImg">
                            <s-crop-img @crop="handleCrop"></s-crop-img>
                        </el-form-item>
                        <el-form-item label="文件：" prop="fileUrl">
                            <s-upload @finish="handleUploadFinish"></s-upload>
                        </el-form-item>
                    </el-form>
                    <div class="d-flex a-center j-center">
                        <el-button :loading="loading" type="success" size="small" @click="handleSubmit">保存并提交</el-button>
                        <el-button type="plain" size="small" @click="handleJumpToPrev">返回上级</el-button>
                    </div>
                </div>
                <div slot="right">
                    <div class="f-lg gray-600">实时预览</div>
                    <div class="file-wrap mt-3">
                        <div class="file-list">
                            <div class="header">
                                <img ref="img" :src="formInfo.mainImg" alt="" width="100%" height="100%">
                                <div class="mask">下载</div>
                            </div>
                            <div class="mt-1 px-2 base-info text-ellipsis2 f-lg">
                                {{ formInfo.fileName }}
                            </div>
                            <div class="px-2 d-flex j-between gray-600">
                                <span>shuxiaokai</span>
                                <span>{{ formInfo.fileSize | formatByte }}</span>
                            </div>
                            <div class="mt-3 gray-600 px-2 description text-ellipsis3" :title="formInfo.description">{{ formInfo.description }}</div>
                            <div class="px-2 tail d-flex j-between a-center">
                                <span class="f-sm gray-600">下载次数：0</span>
                                <el-button size="mini" type="primary">详情</el-button>
                            </div>
                        </div>                
                    </div>
                </div>
            </s-left-right>
        </div>

    </div>
</template>

<script>
import cropImg from "./components/crop-img"
import upload from "./components/upload"
export default {
    components: {
        "s-crop-img": cropImg,
        "s-upload": upload,
    },
    data() {
        return {
            //=====================================表单数据====================================//
            formInfo: { //表单参数
                fileUrl: "", //文件下载地址
                fileName: "", //文件名称
                fileType: null, //文件类型
                description: "", //文件描述
                size: 0, //文件大小
                mainImg: "", //图片base64地址
            },
            rules: { //规则
                fileName: [{ required: true, message: "请输入文件名称", trigger: "blur" }],
                fileType: [{ required: true, message: "请选择文件分类", trigger: "change" }],
                description: [{ required: true, message: "请输入文件描述", trigger: "blur" }],
                mainImg: [{ required: true, message: "请选择主图信息", trigger: "blur" }],
                fileUrl: [{ required: true, message: "请上传供用户下载的文件", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            loading: false, //提交加载按钮
        };
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//
        handleSubmit() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.axios.post("/api/share/file_info", this.formInfo).then(() => {
                        
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.handleJumpToPrev();
                        this.loading = false;
                    });
                } else {
                    this.$nextTick(() => {
                        document.querySelector(".el-form-item.is-error input") ? document.querySelector(".el-form-item.is-error input").focus() : null;
                    });
                }
            });
        },
        //=====================================组件间交互====================================//  
        handleUploadFinish(payload) {
            const { size, fileUrl } = payload;
            // console.log(val)
            this.formInfo.fileSize = size;
            this.formInfo.fileUrl = fileUrl;
        },
        //禁止浏览器默认加载行为
        forbidDrop(e) {
            e.preventDefault();
        },
        //清除拖拽默认事件
        handleDragOver(e) {
            e.preventDefault()
        },
        handleCrop(url) {
            console.log(parseInt(url.length))
            this.formInfo.mainImg = url;
        },
        //返回上级
        handleJumpToPrev() {
            this.$router.push({
                path: "/v1/c/c"
            });
        },
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.c-add {
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
