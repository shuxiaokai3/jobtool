/*
    创建者：shuxiaokai
    创建时间：2019-11-05 15:21"
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <el-dialog title="参数组维护" :visible.sync="isShow" :before-close="closeModel" :close-on-press-escape="false" :close-on-click-modal="false" width="80%">
        <div class="preset-params-wrap d-flex between">
            <div class="preset-params-list">
                <div class="search d-flex a-center">
                    <el-input v-model="presetParamsKeywords" name="name" size="mini" placeholder="关键字过滤" class="w-90" maxlength="100" clearable @input="handleFilterPresetParams"></el-input>
                </div>
                <ul v-if="presetParamsList && presetParamsList.length > 0" class="content">
                    <li v-for="(item, index) in presetParamsList" :key="index" :class="{active: activeIndex === index}" @click="getPresetParamsInfo(item._id);activeIndex = index">
                        <div class="text">
                            <s-emphasize :value="item.name" :keyword="presetParamsKeywords"></s-emphasize>
                        </div>
                        <el-button type="text" @click.stop="deletePresetParams(item._id)">删除</el-button>
                    </li>
                </ul>
                <span v-else class="text-center gray-500 mt-3">暂无数据</span>
            </div>
            <div v-if="presetParamsList && presetParamsList.length > 0" v-loading="loading2" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="flex1">
                <div v-if="!loading2 && presetParamsInfo.items">
                    <el-form ref="form" :model="presetParamsInfo" :rules="rules" label-width="150px">
                        <el-form-item label="测试：" prop="name">
                            <el-input v-model="presetParamsInfo.name" name="name" size="mini" placeholder="名称" class="w-100" maxlength="100" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="备注：" prop="remark">
                            <el-input v-model="presetParamsInfo.remark" name="name" size="mini" placeholder="备注" class="w-100" maxlength="100" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="参数模板：" class="template">
                            <s-tree :data="presetParamsInfo.items" :plain="plain"></s-tree>
                        </el-form-item>
                    </el-form>
                    <div class="d-flex j-end">
                        <el-button :loading="loading3" size="mini" type="success" @click="savePresetParamsInfo">保存</el-button>
                    </div>
                </div>
            </div>
            <div v-else class="flex1 d-flex center">暂无数据</div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean
        },
        type: {
            type: String,
            default: ""
        },
        plain: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            //=====================================列表参数====================================//
            presetParamsInfo: {
                items: null, //参数组详情
                name: "", //参数组名称
                remark: "", //参数组备注
            }, 
            presetParamsList: [], //参数组列表
            presetParamsListCopy: [], //参数组列表拷贝
            presetParamsId: "", //参数组id
            presetParamsKeywords: "", //参数组搜索条件
            //=====================================校验规则====================================//
            rules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
                remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            activeIndex: 0, //当前选中节点
            loading: false, //获取参数组列表
            loading2: false, //获取参数组详情
            loading3: false, //修改参数组
        };
    },
    created() {
        this.getPresetParamsList();
    },
    methods: {
        //=====================================数据获取====================================//
        /* 
            @description  获取参数列表
            @autor        shuxiaokai
            @create       2019-11-05 15:21"
        */
        getPresetParamsList() {
            const params = {
                projectId: this.$route.query._id,
                presetParamsType: this.type
            };
            this.loading = true;
            this.axios.get("/api/project/doc_preset_params_list", { params }).then(res => {
                this.presetParamsList = res.data.rows;
                this.presetParamsListCopy = res.data.rows;
                if (this.presetParamsList && this.presetParamsList.length > 0) {
                    this.getPresetParamsInfo(this.presetParamsList[0]._id);
                }
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading = false;
            });
        },
        /* 
            @description  获取预设参数组详情信息
            @autor        shuxiaokai
            @create       2019-11-05 16:42"
        */
        getPresetParamsInfo(_id) {
            this.presetParamsId = _id;
            const params = {
                _id,
                projectId: this.$route.query._id
            };
            this.loading2 = true;
            this.axios.get("/api/project/doc_preset_params", { params }).then(res => {
                this.presetParamsInfo.name = res.data.name;
                this.presetParamsInfo.remark = res.data.remark;
                this.presetParamsInfo.items = res.data.items;
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading2 = false;
            });
        },

        //=====================================前后台交互相关操作====================================//
        deletePresetParams(_id) {
            this.$confirm("此操作将永久删除此条记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                const params = {
                    ids: [_id]
                };
                this.axios.delete("/api/project/doc_preset_params", { data: params }).then(() => {
                    this.$message.success("删除成功");
                    this.getPresetParamsList();
                }).catch(err => {
                    this.$errorThrow(err, this);
                });
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        /* 
            @description  保存参数组信息
            @autor        shuxiaokai
            @create       2019-11-06 22:09"
        */
        savePresetParamsInfo() {
            const params = {
                _id: this.presetParamsId,
                ...this.presetParamsInfo
            };
            // console.log(params)
            //删除无效数据
            params.items = params.items.filter(val => {
                return val.key !== "" && val.type !== ""
            })
            this.loading3 = true;
            this.axios.put("/api/project/doc_preset_params", params).then(() => {
                this.getPresetParamsList();
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading3 = false;
            });
        },
        //=====================================其他操作====================================//
        /* 
            @description  关键字过滤参数组
            @autor        shuxiaokai
            @create       2019-11-05 15:44"
            @params       
            @return       null
        */
        handleFilterPresetParams(name) {
            if (name.trim() === "") {
                this.presetParamsList = this.presetParamsListCopy;
                return;
            }
            this.presetParamsList = this.presetParamsListCopy.filter(val => val.name.includes(name))
            // this.presetParamsListCopy = val;
            //console.log(val)
        },
        /* 
            @description  关闭弹窗
            @autor        shuxiaokai
            @create       2019-10-19 22:39"
            @params       null
            @return       null
        */
        closeModel() {
            this.$emit("close");
        },
    }
};
</script>



<style lang="scss">
    .preset-params-wrap {
        height: 60vh;
        overflow: hidden;
        .template .el-form-item__content {
            align-items: baseline;
            height: calc(60vh - 200px)!important;
            overflow: auto;
        }
    }
    .preset-params-list {
        display: flex;
        flex-direction: column;
        flex: 0 0 200px;
        .search {
            flex: 0 0 50px;
            // background: $gray-100;
            .el-input {
                border-radius: 20px;
                .el-input__inner {
                    border-radius: 20px;
                }
            }
        }
        .content {
            flex: 1;
            overflow-y: auto;
            li {
                height: 40px;
                display: flex;
                align-items: center;
                cursor: pointer;
                .text {
                    width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                &.active {
                    background: $gray-300;
                }
                &:hover {
                    background: $gray-300;
                    // color: $white;
                }
            }
        }
    }
</style>
