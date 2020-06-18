/*
    创建者：shuxiaokai
    创建时间：2020-01-13 09:49
    模块名称：新增restful弹窗
    备注：get请求不完全遵守restful风格
*/
<template>
    <el-dialog title="新增restful" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="40%">
        <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
            <el-form-item label="接口名称：" label-width="150px" prop="name">
                <el-input v-model="formInfo.name" size="mini" placeholder="例如：商品" class="w-100" maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="接口host：">
                <el-radio-group v-model="formInfo.host">
                    <el-radio v-for="(item, index) in hostEnum" :key="index" :label="item.url">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="接口url：" label-width="150px" prop="url">
                <el-input v-model="formInfo.url" size="mini" placeholder="例如：goods, /会在保存时候自动处理" class="w-100" maxlength="100" clearable @blur="checkUrlRule"></el-input>
            </el-form-item>
            <el-form-item label="完整地址：" label-width="150px">
                <div v-if="formInfo.host || formInfo.url">{{ formInfo.host }}{{ formInfo.url }}</div>
            </el-form-item>
            <el-form-item label="模板：" label-width="150px"></el-form-item>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading" type="primary" size="mini" @click="handleAddRestFul">确认添加</el-button>
            <el-button type="danger" size="mini" @click="closeModel">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean
        },
        pid: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            //=====================================请求参数====================================//
            formInfo: {
                name: "", //------------------接口名称
                host: "", //------------------接口host
                url: "", //-------------------接口url
            },
            hostEnum: [], //host枚举
            //=====================================验证参数====================================//
            rules: {
                name: [{ required: true, message: "请填写接口名称", trigger: "blur" }],
                url: [{ required: true, message: "请填写接口url", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            loading: false
        };
    },
    created() {
        this.getHostEnum();
    },
    methods: {
        /** 
        * @description        新增restful
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2020-01-13 13:26
        * @update             2020-01-13 13:26
        */
        handleAddRestFul() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const docs = [];
                    for (let i = 0; i < 4; i++) {
                        let label = "";
                        let methods = "";
                        if (i === 0) {
                            label = `获取${this.formInfo.name}`;
                            methods = "get";
                        } else if (i === 1) {
                            label = `修改${this.formInfo.name}`;
                            methods = "put";
                        } else if (i === 2) {
                            label = `新增${this.formInfo.name}`;
                            methods = "post";
                        } else if (i === 3) {
                            label = `删除${this.formInfo.name}`;
                            methods = "delete";
                        }
                        const doc = {
                            docName: label, //文档名称
                            isFolder: false, //文档类型
                            pid: this.pid, //父文档信息
                            projectId: this.$route.query._id, //项目id
                            sort: Date.now(), //排序
                            item: { 
                                methods,
                                description: label,
                                url: this.formInfo.url,
                            }
                        }
                        docs.push(doc);
                    }
                    this.axios.post("/api/project/new_doc_multi", { docs }).then(res => {
                        this.$message.success("添加成功");
                        this.$emit("close");
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                    });                    
                } 
            });
        },
        //获取host枚举
        getHostEnum() {
            const params = {
                projectId: this.$route.query._id
            };
            this.axios.get("/api/project/doc_service", { params }).then(res => {
                this.hostEnum = res.data;
                if (!this.formInfo.host) {
                    this.formInfo.host = this.hostEnum[0] ? this.hostEnum[0].url : "";
                }
                if (this.hostEnum.length === 0) {
                    this.hostEnum = [{ url: "http://127.0.0.1:7001", name: "http://127.0.0.1:7001" }];
                }
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
        /** 
         * @description        验证请求url格式是否正确
         * @autor              shuxiaokai
         * @updateAuthor       shuxiaokai
         * @create             2019-12-02 16:29
         * @update             2019-12-02 16:29
         */
        checkUrlRule() {
            const hostHasSlash = this.formInfo.host.endsWith("/");
            const pathHasSlash = this.formInfo.url.startsWith("/");
            console.log(hostHasSlash, pathHasSlash)
            if (hostHasSlash && !pathHasSlash) {
                return
            } else if (!hostHasSlash && pathHasSlash) {
                return
            } else if (!hostHasSlash && !pathHasSlash) {
                this.formInfo.url = "/" + this.formInfo.url;
            } else if (hostHasSlash && pathHasSlash) {
                this.formInfo.url = this.formInfo.url.slice(1);
            }
            console.log(this.formInfo)
        },
        /** 
        * @description        关闭弹窗
        * @autor              shuxiaokai
        * @updateAuthor       shuxiaokai
        * @create             2020-01-13 13:26
        * @update             2020-01-13 13:26
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>



<style lang="scss">

</style>
