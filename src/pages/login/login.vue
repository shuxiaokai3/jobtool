/*
    创建者：shuxiaokai
    创建时间：2019-09-06 11:31
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="login-container d-flex a-center j-center">
        <div class="login-box d-flex">
            <div class="left">
                
            </div>
            <div class="right">
                <h2 class="text-center">欢迎登录</h2>
                <el-tabs v-model="activeName" class="w-100" @tab-click="handleClickTabs">
                    <!-- 账号登录 -->
                    <el-tab-pane label="账号登录" name="first">
                        <el-form ref="form" :model="userInfo" :rules="rules" @submit.native.stop.prevent="handleLogin">
                            <el-form-item prop="loginName">
                                <el-input v-model="userInfo.loginName" prefix-icon="el-icon-user" name="loginName" type="text" autocomplete="off" placeholder="请输入用户名..."></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="userInfo.password" prefix-icon="el-icon-lock" name="password" type="password" autocomplete="off" placeholder="请输入密码..."></el-input>
                            </el-form-item>
                            <el-form-item v-if="isShowCapture" prop="captcha">
                                <div class="captcha">
                                    <el-input v-model="userInfo.captcha" name="captcha" type="text" autocomplete="off" placeholder="验证码"></el-input>
                                    <img :src="captchaUrl" @click="freshCapchaUrl">
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button :loading="loading" type="primary" native-type="submit" size="small" class="w-100">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <!-- 手机号登录 -->
                    <el-tab-pane label="手机登录" name="second">
                        <el-form ref="form2" :model="userInfo2" :rules="rules2" @submit.native.stop.prevent="handleLogin2">
                            <el-form-item prop="phone">
                                <el-input v-model="userInfo2.phone" prefix-icon="el-icon-user" name="phone" type="text" autocomplete="off" placeholder="请输入手机号..."></el-input>
                            </el-form-item>
                            <el-form-item prop="smsCode">
                                <div class="d-flex">
                                    <el-input v-model="userInfo2.smsCode" name="smsCode" type="text" autocomplete="off" placeholder="验证码"></el-input>
                                    <s-sms-button :hook="smsCodeHook" @click="getSmsCode"></s-sms-button>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button :loading="loading" type="primary" native-type="submit" size="small" class="w-100">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //=====================================登录参数====================================//
            userInfo: { //账号密码登录
                loginName: "shu", //-----------登录名称
                password: "111111", //---------密码
                captcha: "", //----------------验证码
            },
            userInfo2: { //手机号密码登录
                phone: "", //------------------手机号码
                smsCode: "", //----------------短信验证码
            },
            random: Math.random(), //----------验证码随机参数
            //=====================================校验规则====================================//
            rules: {
                loginName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
                captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
            },
            rules2: {
                phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
            },
            //=====================================其他参数====================================//
            activeName: "first", //----------tabs切换
            isShowCapture: false, //---------是否展示验证码
            loading: false, //---------------登录按钮loading
        };
    },
    computed: {
        captchaUrl() {
            const isProcess = this.$root.VUE_BASE_CONFIG.isProcess
            const requestUrl = isProcess ? this.$root.VUE_BASE_CONFIG.devUrl : this.$root.VUE_BASE_CONFIG.proUrl;
            return requestUrl + `/api/security/captcha?width=120&height=40&random=${this.random}`;
        }
    },
    created() {},
    mounted() {
        
    },
    methods: {
        //=====================================获取数据====================================//
        //获取短信验证码
        getSmsCode() {
            const params = {
                phone: this.userInfo2.phone
            };
            this.axios.get("/api/security/sms", { params }).then(() => {
                
            }).catch(err => {
                this.$errorThrow(err, this);
            });                
        },
        smsCodeHook() {
            if (this.userInfo2.phone.length !== 11) {
                this.$message.warning("请填写正确手机号");
                return false;
            } else {
                return true;
            }
        },
        //=====================================前后端交互====================================//
        //用户名密码登录
        handleLogin() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.axios.post("/api/security/login_password", this.userInfo).then(res => {
                        if (res.code === 2006 || res.code === 2003) {
                            this.$message.warning(res.msg);
                            this.isShowCapture = true;
                        } else {
                            this.$router.push("/v1/a/a");
                            sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                        }
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                    });
                } else {
                    this.$nextTick(() => {
                        document.querySelector(".el-form-item.is-error input") ? document.querySelector(".el-form-item.is-error input").focus() : null;
                    });
                }
            });
        },        
        //手机号登录
        handleLogin2() {
            this.$refs["form2"].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.axios.post("/api/security/login_phone", this.userInfo2).then(() => {
                        // if (res.code === 2006 || res.code === 2003) {
                        //     this.$message.warning(res.msg);
                        //     this.isShowCapture = true;
                        // }
                    }).catch(err => {
                        this.$errorThrow(err, this);
                    }).finally(() => {
                        this.loading = false;
                    });
                } else {
                    this.$nextTick(() => {
                        document.querySelector(".el-form-item.is-error input") ? document.querySelector(".el-form-item.is-error input").focus() : null;
                    });
                }
            });
        },
        //=====================================组件操作====================================//
        handleClickTabs() {

        },
        //刷新验证码
        freshCapchaUrl() {
            this.random = Math.random();
        },

    }
};
</script>



<style lang="scss">
.login-container {
    width: 100vw;
    height: 100vh;
    .login-box {
        height: size(450);
        width: size(750);
        background: $white;
        box-shadow: $box-shadow-sm;
        border-radius: $border-radius-base;
        .left {
            flex: 0 0 40%;
            background: rgba(68, 99, 178, 1);
        }
        .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 size(40);
            height: 100%;
            &>h2 {
                margin-top: size(50);
            }
            .captcha {
                display: flex;
                &>img {
                    width: size(200);
                    height: size(40);
                }
            }
        }
    }
}
</style>
