/*
    创建者：chengliang
    创建时间：2019-07-01 10:21
    模块名称：角色切换
    备注：xxxx
*/
<template>
    <div>
        <el-button :size="$root.VUE_BASE_CONFIG.styleConfig.size" @click="dialogTableVisible = true">{{ roleName }}</el-button>
        <el-dialog title="角色切换" :visible.sync="dialogTableVisible">
            <div class="role-change d-flex align-center around">
                <div v-if="isShow.includes('主检人')" :class="{'bg-selected': selectednum === 1}" @click="handleselected(1)"><i class="iconfont icon-ren-copy"></i>
                    <p>主检人</p>
                </div>
                <div v-if="isShow.includes('审核人')" :class="{'bg-selected': selectednum === 2}" @click="handleselected(2)"><i class="iconfont icon-shenhe"></i>
                    <p>审核人</p>
                </div>
                <div v-if="isShow.includes('批准人')" :class="{'bg-selected': selectednum === 3}" @click="handleselected(3)"><i class="iconfont icon-pizhun"></i>
                    <p>批准人</p>
                </div>
                <div v-if="isShow.includes('发送人')" :class="{'bg-selected': selectednum === 4}" @click="handleselected(4)"><i class="iconfont icon-send"></i>
                    <p>发送人</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogTableVisible: false, //角色弹框
            selectednum: 0, //选中角色编号
            roleName: "角色切换", //角色名称
            isShow: []
        };
    },
    watch: {
        selectednum() {
            this.roleName = this.selectednum === 1 ? "主检人" : this.selectednum === 2 ? "审核人" : this.selectednum === 3 ? "批准人" : this.selectednum === 4 ? "发送人" : "角色切换";
        }
    },
    created() {
        const arr = JSON.parse(localStorage.userInfo).role;
        this.isShow = arr.map(e => {
            return e.roleName;
        });
        this.selectednum = sessionStorage.role ? parseInt(sessionStorage.role) : 0;
        sessionStorage.role = this.selectednum;
        this.roleName = this.selectednum === 1 ? "主检人" : this.selectednum === 2 ? "审核人" : this.selectednum === 3 ? "批准人" : this.selectednum === 4 ? "发送人" : "角色切换";
    },
    methods: {
        //====================================切换事件====================================//
        handleselected(val) {
            sessionStorage.role = val;
            this.selectednum = val;
            window.location.reload();
        }
    }
};
</script>



<style lang="scss">
.role-change {
    > div {
        border-radius: 5px;
        width: 10rem;
        height: 10rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        > i {
            font-size: 5rem;
        }
    }
    .bg-selected {
        background: #eee;
        transition: 0.5s;
    }
}
</style>
