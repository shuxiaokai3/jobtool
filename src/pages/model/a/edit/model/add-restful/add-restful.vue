/*
    创建者：shuxiaokai
    创建时间：2020-01-13 09:49
    模块名称：新增restful弹窗
    备注：get请求不完全遵守restful风格
*/
<template>
    <div>
        <el-dialog title="新增restful" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="50%">
            <el-form ref="form" :model="formInfo" :rules="rules" label-width="150px">
                <el-form-item label="接口名称：" label-width="150px" prop="name">
                    <el-input v-model="formInfo.name" size="mini" placeholder="例如：基础restful" class="w-100" maxlength="100" clearable></el-input>
                </el-form-item>
                <el-form-item label="接口host：">
                    <div v-loading="loading3" element-loading-spinner="el-icon-loading" class="d-flex">
                        <div v-for="(item, index) in hostEnum" :key="index" class="template-box" :class="{active: index === activeIndex2}" @click="handleSelectHost(item, index)">
                            <span class="mr-2">{{ item.name }}</span>
                            <el-button size="mini" type="text" @click.stop="editHostId = item._id;isShow4 = true;">编辑</el-button>
                            <el-button size="mini" type="text" @click.stop="deleteHost(item)">删除</el-button>
                        </div>                        
                        <el-button type="text" size="mini" class="ml-2" @click="isShow3 = true">维护</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="接口url：" label-width="150px" prop="url">
                    <el-input v-model="formInfo.url" size="mini" placeholder="例如：goods, /会在保存时候自动处理" class="w-100" maxlength="100" clearable @blur="checkUrlRule"></el-input>
                </el-form-item>
                <el-form-item label="完整地址：" label-width="150px">
                    <div v-if="formInfo.host || formInfo.url">{{ formInfo.host }}{{ formInfo.url }}</div>
                </el-form-item>
                <el-form-item label="模板：" label-width="150px">
                    <div v-loading="loading2" element-loading-spinner="el-icon-loading" class="d-flex">
                        <div v-for="(item, index) in templateEnum" :key="index" class="template-box" :class="{active: index === activeIndex}" @click="handleSelectTemplate(item, index)">
                            <span class="mr-2">{{ item.name }}</span>
                            <el-button size="mini" type="text">编辑</el-button>
                            <el-button size="mini" type="text" @click="deleteTemplate(item)">删除</el-button>
                        </div>                        
                        <el-button size="mini" type="text" class="ml-2" @click="isShow2 = true">维护</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button :loading="loading" type="primary" size="mini" @click="handleAddRestFul">确认添加</el-button>
                <el-button type="danger" size="mini" @click="closeModel">取消</el-button>
            </span>
        </el-dialog>        
        <s-host-model v-if="isShow3" :is-show="isShow3" @close="isShow3 = false;getHostEnum()"></s-host-model>
        <s-host-model2 v-if="isShow4" :id="editHostId" :is-show="isShow4" @close="isShow4 = false;getHostEnum()"></s-host-model2>
        <s-restful-template-model v-if="isShow2" :is-show="isShow2" @close="isShow2 = false;getTemplateEnum()"></s-restful-template-model>
    </div>

</template>

<script>
import restfulTemplate from "@/pages/model/a/edit/model/restful-template/restful-template"
import host from "@/pages/model/a/edit/model/host/host"
import host2 from "@/pages/model/a/edit/model/host/edit-host"
export default {
    components: {
        "s-restful-template-model": restfulTemplate,
        "s-host-model": host,
        "s-host-model2": host2,
    },
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
                projectId: this.$route.query._id, //项目id
                name: "", //------------------接口名称
                host: "", //------------------接口host
                url: "", //-------------------接口url
                pid: this.pid, //-------------父元素id
                templateId: "", //模板id
            },
            hostEnum: [], //host枚举
            templateEnum: [], //模板枚举
            activeIndex: -1, //模板选中下标
            activeIndex2: -1, //接口host选中下标
            //=====================================验证参数====================================//
            rules: {
                name: [{ required: true, message: "请填写接口名称", trigger: "blur" }],
                url: [{ required: true, message: "请填写接口url", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            isShow2: false, //新增restful模板
            isShow3: false, //新增host
            isShow4: false, //修改host
            editHostId: "", //编辑host的id
            loading: false, //添加模板loading
            loading2: false, //获取模板loading
            loading3: false, //获取host loading
        };
    },
    created() {
        this.getHostEnum();
        this.getTemplateEnum();
    },
    methods: {
        //=====================================获取数据====================================//
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
        //获取模板枚举
        getTemplateEnum() {
            this.loading2 = true;
            const params = {
                projectId: this.$route.query._id
            };
            this.axios.get("/api/doc/restful_template", { params }).then(res => {
                this.templateEnum = res.data.rows;
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading2 = false;
            });
        },   
        //=====================================前后端交互====================================//
        //新增restful
        handleAddRestFul() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // this.loading = true;
                    // const docs = [];
                    // for (let i = 0; i < 4; i++) {
                    //     let label = "";
                    //     let methods = "";
                    //     if (i === 0) {
                    //         label = `获取${this.formInfo.name}`;
                    //         methods = "get";
                    //     } else if (i === 1) {
                    //         label = `修改${this.formInfo.name}`;
                    //         methods = "put";
                    //     } else if (i === 2) {
                    //         label = `新增${this.formInfo.name}`;
                    //         methods = "post";
                    //     } else if (i === 3) {
                    //         label = `删除${this.formInfo.name}`;
                    //         methods = "delete";
                    //     }
                    //     const doc = {
                    //         docName: label, //文档名称
                    //         isFolder: false, //文档类型
                    //         pid: this.pid, //父文档信息
                    //         projectId: this.$route.query._id, //项目id
                    //         sort: Date.now(), //排序
                    //         item: { 
                    //             methods,
                    //             description: label,
                    //             url: this.formInfo.url,
                    //         }
                    //     }
                    //     docs.push(doc);
                    // }
                    // console.log(docs)
                    this.axios.post("/api/project/new_doc_multi", this.formInfo).then(() => {
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
        //删除host
        deleteHost(item) {
            this.$confirm("此操作将永久删除此条记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading2 = true;
                const params = {
                    ids: [item._id]
                };
                const deleteIndex = this.hostEnum.findIndex(val => val._id === item.id)
                this.axios.delete("/api/project/doc_service", { data: params }).then(() => {
                    this.hostEnum.splice(deleteIndex, 1);
                }).catch(err => {
                    this.$errorThrow(err, this);
                }).finally(() => {
                    this.loading2 = false;
                });
                // console.log(item._id)
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        //删除模板
        deleteTemplate(item) {
            this.$confirm("此操作将永久删除此条记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading2 = true;
                const params = {
                    ids: [item._id]
                };
                const deleteIndex = this.templateEnum.findIndex(val => val._id === item.id)
                this.axios.delete("/api/doc/restful_template", { data: params }).then(() => {
                    this.templateEnum.splice(deleteIndex, 1)
                }).catch(err => {
                    this.$errorThrow(err, this);
                }).finally(() => {
                    this.loading2 = false;
                });
                console.log(item._id)
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        //=====================================逻辑操作====================================//
        //验证请求url格式是否正确
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
        //选择host
        handleSelectHost(item, index) {
            if (this.activeIndex2 !== index) {
                this.activeIndex2 = index;
                this.formInfo.host = item.url;
            } else {
                this.activeIndex2 = -1;
                this.formInfo.host = "";
            }
        },
        //选择模板
        handleSelectTemplate(item, index) {
            if (this.activeIndex !== index) {
                this.activeIndex = index;
                this.formInfo.templateId = item._id;
            } else {
                this.activeIndex = -1;
                this.formInfo.templateId = "";
            }
        },
        //=========================================================================//
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
.template-box {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 0 size(8);
    border: 1px solid $gray-300;
    margin-right: size(10);
    position: relative;
    overflow: hidden;
    user-select: none;
    &.active {
        border: 1px solid $theme-color;
        &::after {
            content: "";
            transform: rotate(135deg);
            position: absolute;
            width: size(20);
            height: size(20);
            background: $green;
            right: size(-10);
            top: size(-12);
        }
    }
    &:hover {
        border: 1px solid $theme-color;
    }
}
</style>
