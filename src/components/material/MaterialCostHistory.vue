<template>
  <!-- 基础表格组件 -->
  <div>
    <div class="container">
      <!-- 操作栏 -->
      <div class="handle-box">
        <!-- 搜索输入框 双向绑定数据，实时搜索 -->
        <!-- 物料编码 -->
        {{ $t('default.Material_Code') }}：
        <el-select v-model="query.mat_code" multiple filterable class="w150" remote reserve-keyword
                   :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMaterial"
                   :loading="loading">
          <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                     :value="item.mat_code">
            <span style="float: left">{{ item.mat_code }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.label }}</span>
          </el-option>
        </el-select>
        <!-- 创建时间 -->
        {{ $t('default.Creation_Date') }}：
        <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                        :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
                        :end-placeholder="$t('default.Application_End_Date')">
        </el-date-picker>
        <!-- <br/><br/> -->
        <!-- 搜索 -->
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
        <!-- 清空 -->
        <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
        <el-button type="primary" class="handle-del mr10"
                   @click="handleExport">{{ $t('default.Export_Details') }}</el-button>
        <!-- 导出明细 -->
      </div>



      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
        <el-table-column type="selection" width="55" align="center"></el-table-column>

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
        <!-- <el-table-column prop="new_cost" label="当前采购单价" align="center"></el-table-column> -->
        <!-- 单价 -->
        <el-table-column prop="cost"  :label="$t('default.Cost')">
          <template v-slot="scope">
            <el-button type="text" class="handle-del mr10" @click="handleLog(scope.row.mat_code)"> {{
                scope.row.cost }}</el-button>
          </template>
        </el-table-column>


        <!-- 备注 -->
        <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>

        <!-- <el-table-column prop="audit_status_name" label="审核状态"></el-table-column> -->
        <!-- 审核备注 -->
        <el-table-column prop="audit_desc" :label="$t('default.Audit_Remarks')"></el-table-column>
        <!-- 审核人 -->
        <el-table-column prop="audit_desc" :label="$t('default.Auditor')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.audit_user_name }}{{ scope.row.audit_time }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_name }}{{ scope.row.audit_time }}</el-button>
              </div>
            </el-popover>
          </template>

        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column prop="create_time" :label="$t('default.Creation_time')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.create_user_name }}
                {{ scope.row.create_time }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.create_user_name }}{{ scope.row.create_time }}</el-button>
              </div>
            </el-popover>

          </template>
        </el-table-column>
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

    <!-- 变更记录 -->
    <el-dialog :visible.sync="DetailVisible" append-to-body width="80%" :title="$t('default.Change_Record')">
      <cost-change ref="costChange"></cost-change>
    </el-dialog>


  </div>
</template>

<script>
import CostChange from '../material/CostChange.vue';

export default {
  name: 'basetable',
  components: {
    CostChange,

  },
  data() {
    return {
      permission: sessionStorage.getItem('permission_button'),
      query: {
        audit_status: 1,
        token: '',
        create_time:'',
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 20
      },
      loading: false,
      mat_options:[],
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      dialogName: '审核',
      pageTotal: 0,
      form: {
        name: ''
      },
      rules: {

      },

      idx: -1,
      id: -1,
      activeName: 'wait',
      DetailVisible: false,
    };
  },
  methods: {
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {

      // console.log(localStorage.getItem("token"));
      this.query.token = localStorage.getItem("token");
      // return;
      this.axios.get('/infor/materialCostHistory/index', {
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
    // 获取物料
    remoteMaterial(query) {
      if (query !== '') {
        this.axios.post('/infor/material/getMaterialByCodeName', {
          token: localStorage.getItem("token"),
          mat_code: query
        }).then((res) => {
          this.mat_options = res;
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.options = [];
      }
    },

    handleLog(mat_code) {
      this.DetailVisible = true;

      this.$nextTick(() => {
        this.$refs.costChange.dataInitialization(mat_code);
      })
    },
    handleSearchClear() {
      this.query = {
        token: localStorage.getItem("token"),
        name: '',
        pageIndex: 1,
        pageSize: 20,
        create_time:[],
      }
    },

    // 搜索,触发搜索按钮
    handleSearch() {
      // 为this.query新增属性，并更新视图
      this.$set(this.query, 'pageIndex', 1);
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
    // 审核
    handleAudit() {
      this.dialogName = '审核';
      this.editVisible = true;
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

    // 列表导出
    handleExport() {
      this.query.token = localStorage.getItem("token");
      this.axios.post('/infor/materialCostHistory/handleExport', {
        token: localStorage.getItem("token"),
        params: this.query
      }).then((res) => {
        window.open(res);
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


