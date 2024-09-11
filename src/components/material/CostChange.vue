<template>
  <!-- 基础表格组件 -->
  <div>

    <div class="container">
      <!-- 创建时间 -->
      <!--                {{ $t('default.Creation_time') }}：-->
      <!--                <el-date-picker v-model="query.create_time" type="daterange"-->
      <!--                      align="right" unlink-panels range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期"-->
      <!--                      size="mini">-->
      <!--                </el-date-picker>-->
      {{ $t('default.Supplier') }}：
      <el-select v-model="query.sup_code" filterable remote reserve-keyword
                 :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteSupply"
                 :loading="loading" @change="sup_change()">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="query.mat_code" class="handle-input mr10 w150" style="display: none;"></el-input>
      <!-- 搜索 -->
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
      <!-- 清空 -->
      <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>




      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
        <!--                <el-table-column type="selection" width="55" align="center"></el-table-column>-->

        <!-- 物料编码 -->
        <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center"></el-table-column>

        <!-- 物料名称 -->
        <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.mat_name }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{scope.row.mat_name }}</el-button>                            </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 型号 -->
        <el-table-column prop="model" :label="$t('default.Model')" >
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.model }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.model }}</el-button>

              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 规格 -->
        <el-table-column prop="specifications" :label="$t('default.Specification')" >
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.specifications }}</p>
              <div slot="reference" class="name-wrapper">

                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications
                  }}</el-button>

              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="cost" label="采购单价"></el-table-column>
        <el-table-column prop="real_num" label="购买数量"></el-table-column>
        <!-- 供应商 -->
        <el-table-column prop="sup_code_name" :label="$t('default.Supplier')" ></el-table-column>



        <!-- 更新时间 -->
        <el-table-column prop="update_time" :label="$t('default.Update_Time')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.update_user_name }}
                {{ scope.row.update_time }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{scope.row.update_user_name }}
                  {{ scope.row.update_time }}</el-button>

              </div>
            </el-popover>

          </template>
        </el-table-column>

      </el-table>
      <!-- 分页导航 -->
      <div class="pagination">
        <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>





  </div>
</template>

<script>

export default {
  name: 'basetable',
  components: {

  },
  data() {
    return {
      query: {
        audit_status: 1,
        sup_code:'',
        mat_code:'',
        token: '',
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 20
      },
      loading: false,
      options: [],
      tableData: [],
      multipleSelection: [],
      delList: [],
      supply_arr: [],
      editVisible: false,
      dialogName: '审核',
      pageTotal: 0,
      form: {
        name: ''
      },
      rules: {
        // quality_num: [
        //     { required: true, message: '请输入安全库存', trigger: 'blur' },
        //     { max: 11, message: '长度不能超过11个字符', trigger: 'blur' },
        //     { type: 'number', message: '安全库存必须为数字值' }
        // ],
      },

      idx: -1,
      id: -1,
      activeName: 'wait',

    };
  },
  methods: {
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {

      // console.log(localStorage.getItem("token"));
      this.query.token = localStorage.getItem("token");


      // return;
      this.axios.get('/infor/materialCostHistory/costChange', {
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        // },
        // headers:localStorage.getItem("token"),

        params: this.query
      }).then((res) => {


        this.tableData = res.list.data;


        // 将数据中的总条目数经过判断后赋给data中的pageTotal
        this.pageTotal = res.list.total || 0;

      }).catch(() => {
        this.loading = false;
      })

    },

    handleSearchClear() {
      this.query = {
        token: localStorage.getItem("token"),
        mat_code: this.query.mat_code,
        sup_code:'',
        pageIndex: 1,
        pageSize: 20,
        create_time:[],
      }
    },

    // 搜索,触发搜索按钮
    handleSearch() {
      // 为this.query新增属性，并更新视图
      this.$set(this.query, 'pageIndex', 1);
      // console.log(this.query)
      // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
      this.getData();
    },
    // 多选,对表格中的复选框列表做监听，当选择项发生变化则触发handleSelectionChange方法，val为选中数据的集合，通过this.multipleSelection.
    // prop字段取得每一个选项的值，prop字段就是表格子项的prop值。this.multipleSelection.length为选择了多少项
    handleSelectionChange(val) {
      // val表示当前选中的行数据组成的数组
      //选中数据的集合赋给this.mutipleSelection
      this.multipleSelection = val;
    },

    // 页面改变,分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      this.getData();
    },
    handleSizeChange(val) {
      this.$set(this.query, 'pageSize', val);
      this.getData();
    },
    sup_change() {
      // 获取采购员,部门，
      this.axios.post('/infor/supply/getSupplyInfo', {
        token: localStorage.getItem("token"),
        params: this.form,
      }).then((res) => {
        this.form.currtypecode = res.currtypecode;
        this.$forceUpdate();
      }).catch(() => {
        this.loading = false;
      })

    },
    remoteSupply(query) {
      if (query !== '') {
        this.axios.post('/infor/supply/getSupply', {
          token: localStorage.getItem("token"),
          name: query
        }).then((res) => {
          this.options = res;
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.options = [];
      }
    },
    dataInitialization(mat_code) {
      var token = localStorage.getItem("token");
      let that = this;
      that.mat_code = mat_code;
      that.axios
          .get(
              "/infor/materialCostHistory/costChange?mat_code=" + mat_code + '&token=' + token
          )
          .then(res => {


            this.tableData = res.list.data;

            this.pageTotal = res.list.total || 0;
            this.cost_show = res.cost_show;
            this.supply_arr = res.list.supply_arr;
            this.query.mat_code = res.list.mat_code;
            // console.log(this.supply_arr)

          })
          .catch(err => {
            that.$notify.error({
              title: "错误",
              message: err
            });
            console.log(err);
          });
    },




  },
  // 在钩子函数中调用getData方法
  // created() {
  //     this.getData();
  // }
}
</script>



