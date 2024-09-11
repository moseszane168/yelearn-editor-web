<template>
  <!-- 基础表格组件 -->
  <div>
    <el-form ref="form" :model="form" label-width="80px">
<!--    <el-form ref="form"  label-width="80px">-->
      <el-form-item :label="$t('default.exchange_rate')">
        <el-input v-model="form.exchange_rate" class="handle-input mr8">
          <template slot="suffix">USD  :  RMB</template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('default.Submit')}}</el-button>
        <el-button>{{$t('default.Cancel')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  data() {
    return {
      permission: sessionStorage.getItem('permission_button'),
      form: {},
      query: {
        token: '',
        exchange_rate:''
      },
    }
  },
  mounted() {
    // console.log(66666)
  },
  methods: {
    onSubmit() {
      this.axios.post('/index/Setting/save', {
        token: localStorage.getItem("token"),
        params: this.form,

      }).then((res) => {
        console.log(res);
        // 弹出成功提示框
        this.$message.success('提交成功');
        this.auditVisible = false;
        this.getData();

        // this.$set(this.tableData, this.idx, this.form);
      }).catch(() => {
        this.loading = false;
      })
    },
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {


      this.query.token = localStorage.getItem("token");

      this.axios.get('/index/Setting/index', {

        params: this.query
      }).then((res) => {
        this.form = res;


      }).catch(() => {
        this.loading = false;
      })

    },
  },

  // 在钩子函数中调用getData方法
  created() {

    this.getData();
    this.permission = JSON.parse(this.permission);
  }
}
</script>


