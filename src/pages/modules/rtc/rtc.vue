/*
    创建者：shuxiaokai
    创建时间：2020-09-09 10:39
    模块名称：rtc
    备注：xxxx
*/
<template>
    <div>
        <el-button size="mini" @click="startPush">开始</el-button>
        <el-button size="mini" @click="cancelPush">取消</el-button>
        <video ref="localView"></video>
    </div>
</template>

<script>
import "aliyun-webrtc-sdk"
export default {
    data() {
        return {
            channelId: 10000,
            joinChanelConfig: {
                appid: "",
                userid: "",
                channel: "",
                nonce: "",
                timestamp: "",
                token: "",
                gslb: ""
            },
            rtcInstance: null, //rtc实例
            localView: null,
        };
    },
    mounted() {
        this.initRtc();
    },
    methods: {
        //=====================================初始化====================================//
        async initRtc() {
            this.localView = this.$refs["localView"];
            this.rtcInstance = new window.AliRtcEngine();
            //=====================================检测设备====================================//
            this.rtcInstance.isSupport().then(()=>{
                
            }).catch((error)=>{
                console.error(error);
                this.$message.error("当前环境不支持webrtc");
            })
            //=====================================开始====================================//
            try {
                await this.getToken(); //首先获取token
                await this.joinChannel(); //然后加入某个频道 
                console.log(this.joinChanelConfig.userid)
                // this.rtcInstance.subscribe(this.joinChanelConfig.userid).then((userId)=>{
                //     this.rtcInstance.setDisplayRemoteVideo(
                //         userId,       // 用户ID
                //         this.localView,        // html中用于显示stream对象的video元素
                //         1             // 1表示摄像头流（大流和小流），2表示屏幕分享流
                //     )
                // },(error)=>{
                //     console.log(error.message);
                // });
            } catch (error) {
                console.error(error);
            }
        },
        //获取调用凭证
        getToken() {
            return new Promise((resolve, reject) => {
                const params = {
                    channelId: this.channelId
                };
                this.axios.get("/api/webrtc/rtc_info", { params }).then(res => {
                    Object.assign(this.joinChanelConfig, res.data);
                    resolve();
                }).catch(err => {
                    reject(err)
                });                
            });

        },
        //加入频道(聊天必须在同一频道上面)
        joinChannel() {
            return new Promise((resolve, reject) => {
                this.rtcInstance.joinChannel(this.joinChanelConfig, "displayName????").then(()=>{
                    resolve();
                } ,(err)=>{
                    reject(err)
                });
            });
        },
        //开始推流
        startPush() {
            this.rtcInstance.publish().then(()=>{

            } ,(error)=>{
                console.log(error.message);
            });
            this.rtcInstance.on("onPublisher",(publisher) =>{
                console.log(publisher);
            });
        },
        //取消推送
        cancelPush() {
            this.rtcInstance.unPublish().then(()=>{

            } ,(error)=>{
                console.log(error.message);
            });
        },
    }
};
</script>



<style lang="scss">

</style>
