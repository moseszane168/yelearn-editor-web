<template>
    <!-- 登录组件 -->
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">畅思得ERP系统</div>
            <!-- model：表单数据对象，rules：表单验证规则，ref：给元素或子组件注册引用信息 -->
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <!-- 用户名表单 -->
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="账号">
                        <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
                    </el-input>
                </el-form-item>
                <!-- 密码表单 -->
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password"
                        @keyup.enter.native="submitForm()"><!--  .native - 主要是给自定义的组件添加原生事件 -->
                        <el-button slot="append" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
              
            </el-form>
        </div>
    </div>
</template>

<script>
// import { mapActions } from 'vuex';
export default {
    name: 'login',
    data: function () {
        return {
            param: {
                username: '',
                password: '',
                // username: '',
                // password: '',
                // userId: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        // login() {
        // }
        submitForm() {
            // 获取ref注册的引用信息
            this.$refs.login.validate(valid => {
                if (valid) {

                    let { username, password } = this.param;


                    this.axios.post('/Index/Login/login', {

                        username,
                        password
                    }).then((res) => {

                        this.$message.success('登录成功');
                        localStorage.setItem('ms_username', res.name);

                        localStorage.setItem("token", res.token);
                        localStorage.setItem("uid", res.id)
                        localStorage.setItem("department_id", res.department_id)
                        localStorage.setItem("local", 'zh')

                        this.$router.push('/');



                    }).catch(() => {
                        this.loading = false;
                    })

                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }

            });


        },
        unsetInfor() {
            localStorage.removeItem('ms_username');
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            localStorage.removeItem('department_id');

            this.axios.post('/Index/Login/out', {

                // token: '-',

            }).then((res) => {



            }).catch(() => {
                this.loading = false;
            })

            // var token = localStorage.getItem("token");
            // window.location.href = 'http://127.0.0.1:1011/lYmQViuDMo.php/index/index?token='+token; 


        }
    },
    created() {
        this.unsetInfor();
    }
};
</script>


<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
    background-repeat: no-repeat;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>