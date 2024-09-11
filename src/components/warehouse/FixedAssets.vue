<template>

  <div>

    <div class="container">

      <div class="handle-box">
        {{ $t('default.Purchase_Order_Number') }}：
        <el-input v-model="query.pur_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>

        <!-- 物料编码 -->
        {{ $t('default.Material_Code') }}：
        <el-select v-model="query.mat_code" multiple filterable class="w150" remote reserve-keyword
          :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMaterial" :loading="loading">
          <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code" :value="item.mat_code">
            <span style="float: left">{{ item.mat_code }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
          item.label }}</span>
          </el-option>
        </el-select>
        {{ $t('default.Fixed_assets_code') }}：
        <el-input v-model="query.fa_code" :placeholder="$t('default.Please_enter_a_keyword')"
                  class="handle-input mr10 w150"></el-input>

        <!-- 部门 -->
        {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
          reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')" class="w200">
          <el-option v-for="item in department_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 创建时间 -->
        {{ $t('default.Creation_Date') }}：
        <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
          :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
          :end-placeholder="$t('default.Application_End_Date')">
        </el-date-picker>

        <!-- 搜索 -->
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
        <!-- 清空 -->
        <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
        <br />
        <br />
        <!-- 编码填写 -->
        <el-button type="primary" class="handle-del mr10" @click="handleMatIn"
          v-if="permission.includes('FixedAssets:handleMatIn')">{{ $t('default.Fill_in_the_code') }}</el-button>

      </div>

      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 全部 -->
          <el-tab-pane :label="$t('default.All')" name="all"></el-tab-pane>
          <el-tab-pane :label="$t('default.Code_to_be_filled')" name="wait"></el-tab-pane>
          <el-tab-pane :label="$t('default.Code_filled')" name="pass"></el-tab-pane>

        </el-tabs>
      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!-- 序号 -->
        <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

        <!-- 采购单号 -->
        <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')">
          <template v-slot="scope">
            {{ scope.row.pur_code }}

          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="status_name" :label="$t('default.Status')"></el-table-column>
        <!-- 备注 -->
        <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>

        <!-- 部门 -->
        <el-table-column prop="department_name" :label="$t('default.Department')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.department_name }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.department_name
                  }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 物料编码 -->
        <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.mat_code }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code
                  }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 物料名称 -->
        <el-table-column prop="mat_name" :label="$t('default.Material_Name')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.mat_name }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_name
                  }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 型号 -->
        <el-table-column prop="model" :label="$t('default.Model')">
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
        <el-table-column prop="specifications" :label="$t('default.Specification')">
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
        <el-table-column prop="material_picture" :label="$t('default.Material_Picture')">
          <template v-slot="scope">

            <div v-if=scope.row.material_picture>
              <el-image class="table-td-thumb" :src="scope.row.material_picture"
                :preview-src-list="scope.row.material_picture"></el-image>
            </div>
            <div v-else>
              <!-- 无图 -->
              {{ $t('default.No_Picture') }}
            </div>

          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column prop="status_name" :label="$t('default.Status')"></el-table-column>


        <el-table-column prop="fa_code" :label="$t('default.Status')"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column prop="create_time" :label="$t('default.Creation_time')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.create_user_name }}
                {{ scope.row.create_time }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.create_user_name
                  }}{{ scope.row.create_time }}</el-button>
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
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.update_user_name }}
                  {{ scope.row.update_time }}</el-button>

              </div>
            </el-popover>
          </template>
        </el-table-column>

      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
          :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]" :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑固资编码 -->
    <el-dialog :title="$t('default.Edit_Fixed_Asset_Code')" :visible.sync="orderVisible" width="70%" :before-close="handleClose">
      <template>
        <el-table :data="orderData" style="width: 100%">
          <!-- 部门 -->
          <el-table-column prop="department_name" :label="$t('default.Department')">
            <template v-slot="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.department_name }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.department_name
                    }}</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <!-- 采购单号 -->
          <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')"></el-table-column>
          <el-table-column prop="mat_code" label="物料">
            <template v-slot="scope">
              {{ scope.row.mat_code }}
              <br />
              {{ scope.row.mat_name }}
              <br />
              {{ scope.row.specifications }}
              <br />
              型号：{{ scope.row.model }}
            </template>
          </el-table-column>
         <!-- 固资编码 -->
          <el-table-column prop="fa_code" :label="$t('default.Fixed_assets_code')">
            <template v-slot="scope">
              <el-input v-model="scope.row.fa_code"></el-input>
            </template>
          </el-table-column>

          <!-- 备注 -->
          <el-table-column prop="desc" :label="$t('default.Desc')">
            <template v-slot="scope">
              <el-input v-model.number="scope.row.desc"></el-input>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="operate" :label="$t('default.Action')">
            <!-- 删除 -->
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete"
                @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <!-- 取 消 -->
        <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
        <el-button type="primary" @click="saveOrder">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 
export default {
  name: 'basetable',
  // components: {
  //     'el-pagination': Pagination,
  //     'el-table': Table,
  // },
  data() {
    return {
      permission: sessionStorage.getItem('permission_button'),
      query: {
        status: 1,
        token: '',
        create_time: [],
        pageIndex: 1,
        pageSize: 20
      },
      tableData: [],
      orderData: [],
      multipleSelection: [],
      delList: [],
      orderVisible: false,
      pageTotal: 0,
      form: {},
      rules: {
        real_num: [
          { required: true, message: '请输入实购数', trigger: 'blur' },
          // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
          { type: 'number', message: '实购数必须为数字值' }
        ],
      },
      value: [],
      list: [],
      loading: false,
      idx: -1,
      id: -1,
      states: [],
      activeName: 'picked',
      department_options: [],
      mat_options: [],
    };
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: `${item}`, label: `${item}` };
    });
  },
  methods: {
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {
      this.query.token = localStorage.getItem("token");
      this.axios.get('/ware/FixedAssets/index', {
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
        pageIndex: 1,
        pageSize: 20
      }
    },
    handleClose(done) {
      // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    // 获取部门
    getDepartment() {
      var token = localStorage.getItem("token");
      this.axios.post('/index/Department/all_department', {
        token: token
      }).then((res) => {
        this.department_options = res;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 物料查找
    remoteMaterial(query) {
      if (query !== '') {
        this.axios.post('/ware/FixedAssets/getMaterialByCodeName', {
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

    // 固资填写
    handleMatIn() {
      // 选项的选项数量
      const length = this.multipleSelection.length;
      this.orderData = [];
      this.orderVisible = true;
      this.dialogName = '物料入库';
      // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
      if (length) {
        this.orderData = this.multipleSelection;
      }
      else {
        // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
      }
    },
    remoteMethod(query) {
            if (query !== '') {
                this.axios.post('/infor/material/getMaterialByCodeName', {
                    token: localStorage.getItem("token"),
                    mat_code: query,
                    status: 1,
                }).then((res) => {
                    this.options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },
    //删除行
    handleDeleteLine(index) {
      this.orderData.splice(index, 1)
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
      //选中数据的集合赋给 this.mutipleSelection
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
    saveOrder() {
      this.axios.post('/ware/FixedAssets/update', {
        token: localStorage.getItem("token"),
        params: this.form,
        orderData: this.orderData
      }).then((res) => {
        this.$message.success('入库成功');
        this.orderVisible = false;
        this.getData();
        this.$set(this.tableData, this.idx, this.form);
      }).catch(() => {
        this.loading = false;
      })
    },
    handleClick(tab, event) {
      if (this.activeName == 'wait') {
        this.query.status = 1
      } else if (this.activeName == 'pass') {
        this.query.status = 2
      } else if (this.activeName == 'all') {
        this.query.status = ''
      }

      // 重新获取数据
      this.getData();

    }
  },
  // 在钩子函数中调用getData方法
  created() {




    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

    this.query.create_time = [start, end];
    this.permission = JSON.parse(this.permission);
    this.getData();
    this.getDepartment();
  }
}
</script>
