<template>
    <!-- 基础表格组件 -->
    <div>
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
               <!-- 旧密码 -->
                <el-form-item :label="$t('default.Old_Password')" prop="old_password">
                    <el-input v-model="ruleForm.old_password"></el-input>
                </el-form-item>
                <!-- 新密码 -->
                <el-form-item :label="$t('default.New_Password')" prop="new_password">
                    <el-input v-model="ruleForm.new_password"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- 确定 -->
                    <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('default.Confirm') }}</el-button>
                    <!-- 重置 -->
                    <el-button @click="resetForm('ruleForm')">{{ $t('default.Reset') }}</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            ruleForm: {
                // name: '',
                old_password: '',
                new_password: '',

            },
            rules: {
                old_password: [
                    { required: true, message: '新密码', trigger: 'blur' },
                    { min: 6, message: '长度在大于6个字符 ', trigger: 'blur' }
                ],
                new_password: [
                    { required: true, message: '旧密码', trigger: 'blur' },
                    { min: 6, message: '长度在大于6个字符 ', trigger: 'blur' }
                ],

            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    var token = localStorage.getItem("token");

                    this.axios.post('/index/user/updatePassword', {
                        token: token,
                        params: this.ruleForm
                    }).then((res) => {
                        // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                        // console.log(res)


                        // this.tableData = res.list.data;

                        // // 将数据中的总条目数经过判断后赋给data中的pageTotal
                        // this.pageTotal = res.list.total || 0;

                    }).catch(() => {
                        this.loading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>