/*
    创建者：shuxiaokai
    创建时间：2019-11-08 13:53
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="tool-icon d-flex between mt-1 px-1">
        <el-tooltip class="item" effect="dark" content="新增文件夹" :open-delay="500">
            <svg class="svg-icon" aria-hidden="true" @click="addFolder">
                <use xlink:href="#iconxinzengwenjian"></use>
            </svg>                        
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="新增文件" :open-delay="500">
            <svg class="svg-icon" aria-hidden="true" @click="addFile">
                <use xlink:href="#iconwenjian"></use>
            </svg>               
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="历史记录" :open-delay="500">
            <svg class="svg-icon" aria-hidden="true">
                <use xlink:href="#iconlishi"></use>
            </svg>               
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="预览文档" :open-delay="500">
            <svg class="svg-icon" aria-hidden="true" @click="handlePreview">
                <use xlink:href="#iconpreview"></use>
            </svg>               
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出" :open-delay="500">
            <s-download url="/api/project/doc_word" :params="{ projectId: $route.query._id }">
                <svg class="svg-icon" aria-hidden="true">
                    <use xlink:href="#icondaochu"></use>
                </svg>                    
            </s-download>
     
        </el-tooltip>
        <div class="tool-shadow" :class="{active: isEditing}"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    computed: {
        isEditing() {
            return this.$store.state.docs.isEditing;
        },
        currentTab() {
            return this.$store.state.tabs.currentTab;
        }
    },
    created() {

    },
    methods: {
        //新增文件夹
        addFolder() {
            this.$emit("addFolder");
        },
        //新增文件
        addFile() {
            this.$emit("addFile");
        },
        //预览文档
        handlePreview() {
            // console.log(this.currentTab[this.$route.query._id].id)
            const docId = this.currentTab[this.$route.query._id] ? this.currentTab[this.$route.query._id].id : ""
            window.open(`/jobtool/#/d?_id=${this.$route.query._id}&docId=${docId}&name=${this.$route.query.name}`);
        },  
        handleShare() {
            const params = { projectId: "5dd62f20bd24921325ab5d6b" };
            this.axios.get("/api/project/doc_word", { params, responseType: "blob" }).then(() => {
                
            }).catch(err => {
                this.$errorThrow(err, this);
            });
        },
    }
};
</script>



<style lang="scss">
    .tool-icon {
        position: relative;
        .svg-icon {
            width: 25px;
            height: 25px;
            padding: 5px;
            cursor: pointer;
            &:hover {
                background: $gray-400;
            }
        }
    }
    .tool-shadow {
            &.active {
                display: block;
            }
            background: rgba(0, 0, 0, .1);
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
</style>
