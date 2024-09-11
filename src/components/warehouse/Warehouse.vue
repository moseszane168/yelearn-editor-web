<template>
  <!-- 基础表格组件 -->
  <div>

    <div class="container">
      <!-- 操作栏 -->
      <div class="handle-box">


        {{ $t('default.Warehouse_Type') }}：<el-select v-model="query.type" clearable  class="handle-select mr10">
        <el-option v-for="item in type_arr_option" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
        {{ $t('default.Bonded_Type') }}：<el-select v-model="query.bonded" clearable  class="handle-select mr10">
        <el-option v-for="item in bonded_arr_option" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
        <!-- 部门 -->
        {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')">
        <el-option v-for="item in department_options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

        <!-- 仓库名称 -->
        {{$t('default.Warehouse_Name')}}：
        <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
        <!-- 搜索 -->
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
        <!-- 清空 -->
        <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
        <br />
        <br />
        <el-button type="primary" class="handle-del mr10" @click="handleGetU8Stordoc"
                   v-if="permission.includes('Warehouse:handleGetU8Stordoc')">{{ $t('default.Pull_U8_Warehouse') }}</el-button>
        <el-button type="primary" class="handle-del mr10" @click="handleadd"
                   v-if="permission.includes('Warehouse:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->

        <el-button type="primary" class="handle-del mr10" @click="handleDelete"
                   v-if="permission.includes('Warehouse:handleDelete')">{{ $t('default.Delete') }}</el-button><!-- 删除 -->

      </div>

      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <!-- 操作 -->
        <el-table-column :label="$t('default.Action')" width="55" align="center">
          <template v-slot="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                       v-if="permission.includes('Warehouse:handleEdit')">{{ $t('default.Edit') }}</el-button><!-- 编辑 -->

          </template>
        </el-table-column><el-table-column type="selection" width="55" align="center"></el-table-column>
        <!-- 序号 -->
        <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>
        
        <!-- 部门 -->
        <el-table-column prop="department_name" :label="$t('default.Department')">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.department_name }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.department_name
                  }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('default.Warehouse_Name')" align="center">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.name }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.name }}</el-button>

              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="storcode" :label="$t('default.Warehouse_Code')" align="center"></el-table-column>
        <!-- 类型 -->
        <el-table-column prop="type_name" :label="$t('default.Type')" align="center"></el-table-column>
        <el-table-column prop="good_type_name" :label="$t('default.Goods_Type')" align="center"></el-table-column>
        <!-- 排序 -->
        <el-table-column prop="sort" :label="$t('default.Sort_by')" align="center"></el-table-column>
        <el-table-column prop="bonded_name" :label="$t('default.Bonded_Type')" align="center"></el-table-column>
        <el-table-column prop="custtype_name" :label="$t('default.Customer')" align="center"></el-table-column>
        <el-table-column prop="address" :label="$t('default.Addresses')" align="center"></el-table-column>

        <!-- 操作 -->

      </el-table>
      <!-- 分页导航 -->
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
    <!-- title="编辑"  -->
    <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

      <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">



        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="仓库编码" prop="storcode">
          <el-input v-model="form.storcode" placeholder="空值则由系统自动生成"></el-input>
        </el-form-item>

        <!-- 部门 -->
        <el-form-item :label="$t('default.Department')" prop="department">
          <el-cascader :options="options" v-model="form.department_list"></el-cascader>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" transfer="true" :popper-append-to-body="false" clearable>
            <el-option v-for="item in type_arr_option" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="保税类型" prop="bonded_type">
          <el-select v-model="form.bonded" transfer="true" :popper-append-to-body="false" clearable>
            <el-option v-for="item in bonded_arr_option" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="良品状态" prop="good_type">
          <el-select v-model="form.good_type" transfer="true" :popper-append-to-body="false" clearable>
            <el-option v-for="item in good_type_arr_option" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="是否客户仓" prop="custtype">
          <el-select v-model="form.custtype"  transfer="true" :popper-append-to-body="false" clearable>
            <el-option v-for="item in custtype_arr_option" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
        <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
    </el-dialog>

    <el-dialog title="库位" :visible.sync="Location">
      <el-dialog width="30%" :title=LocationVisibleName :visible.sync="LocationVisible" append-to-body>
        <el-form :inline="true" ref="locatform" :rules="rules" :model="locatform" label-width="200px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="locatform.name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
              <el-button @click="LocationVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
              <el-button type="primary" @click="handleLocatSave()">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
        </span>
      </el-dialog>
      <el-button type="text" icon="el-icon-circle-plus-outline" class="red" title="新增"
                 @click="handleLocatAdd(0, '', '')">{{ $t('default.Add') }}</el-button><!-- 新增 -->
      <el-table :data="locatDate" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                @selection-change="handleSelectionChange" row-key="id">
        <el-table-column property="name" label="区/架/层" width="150"></el-table-column>
        <!-- 操作 -->
        <!-- 操作 -->
        <el-table-column :label="$t('default.Action')" width="180" align="center">
          <template v-slot="localscope">
            <el-button type="text" icon="el-icon-circle-plus-outline"
                       @click="handleLocatAdd(1, localscope.$index, localscope.row)"></el-button>
            <el-button type="text" icon="el-icon-edit"
                       @click="handleLocatEdit(localscope.$index, localscope.row)"></el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleLocatDelete(localscope.$index, localscope.row)"></el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'basetable',
  components: {

  },
  data() {
    return {
      permission: sessionStorage.getItem('permission_button'),
      query: {
        token: '',
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 20
      },
      tableData: [],

      multipleSelection: [],
      delList: [],
      editVisible: false,
      Location: false,
      LocationVisible: false,
      LocationVisibleName: '编辑',
      dialogName: '编辑',
      pageTotal: 0,
      form: {
        name: ''
      },
      locatform: {
        name: ''
      },
      rules: {
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
        ],
      },
      fileList: [],
      image_path: '',
      idx: -1,
      id: -1,
      options: [
      ],
      locatDate: [],
      is_pid: 0,
      type_arr_option: [],
      department_options: [],
      bonded_arr_option: [],
      custtype_arr_option: [],
      good_type_arr_option:[],

    };
  },
  methods: {
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {
      this.query.token = localStorage.getItem("token");
      this.axios.get('/ware/warehouse/index', {
        params: this.query
      }).then((res) => {
        this.tableData = res.list.data;
        this.type_arr_option = res.type_arr_option;
        this.bonded_arr_option = res.bonded_arr_option;
        this.custtype_arr_option = res.custtype_arr_option;
        this.good_type_arr_option=res.good_type_arr_option;
        // 将数据中的总条目数经过判断后赋给data中的pageTotal
        this.pageTotal = res.list.total || 0;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 获取库位信息
    getLocatData() {
      this.form.token = localStorage.getItem("token");
      this.axios.get('/ware/wareLocation/index', {
        // token: localStorage.getItem("token"),
        params: this.form
      }).then((res) => {
        // console.log(res);
        // return;
        this.locatDate = res;
        // 将数据中的总条目数经过判断后赋给data中的pageTotal
        // this.pageTotal = res.list.total || 0;
      }).catch(() => {
        this.loading = false;
      })
    },
    handleGetU8Stordoc(){
      this.axios.post('/ware/warehouse/getU8Stordoc', {
        token: localStorage.getItem("token")
      }).then((res) => {
        // this.department_options = res;
        this.$message.success('拉取成功！');
      }).catch(() => {
        this.loading = false;
      })
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
    // 库位新增区
    handleLocatAdd(is_pid, index, row) {
      this.is_pid = is_pid;

      this.locatform = {};

      if (is_pid == 1) {
        this.locatform = JSON.parse(JSON.stringify(row));
        this.locatform.p_id = this.locatform.id;
        this.locatform.id = '';
        this.locatform.name = '';
      }



      // // 将当前选项索引赋给this.idx
      this.idx = 0;
      // // 将当前选项这一行的数据赋给this.form


      this.LocationVisibleName = '新增区';
      // 设置弹出编辑框标记为true

      this.LocationVisible = true;



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
    handleSearchClear() {
      this.query = {
        token: localStorage.getItem("token"),
        name: '',
        pageIndex: 1,
        pageSize: 20,
        create_time:[],
      }
    },

    handleShow(index, row) {


      // this.dialogName = '详情';
      // 将当前选项索引赋给this.idx
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      this.form = JSON.parse(JSON.stringify(row));
      // 设置弹出编辑框标记为true


      this.getLocatData();

      this.Location = true;
    },
    handleadd() {
      // 获取父级菜单
      var token = localStorage.getItem("token");
      this.axios.post('/index/Department/all_department', {
        token: token
      }).then((res) => {
        console.log(res);

        this.options = res;

      }).catch(() => {
        this.loading = false;
      })

      // 新增
            this.dialogName = this.$t('default.Add');
      // 将当前选项索引赋给this.idx
      // this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      this.form = {};
      // 设置弹出编辑框标记为true
      this.editVisible = true;
    },
    // 编辑
    handleEdit(index, row) {
      // 获取父级菜单
      var token = localStorage.getItem("token");
      this.axios.post('/index/Department/all_department', {
        token: token
      }).then((res) => {


        this.options = res;

      }).catch(() => {
        this.loading = false;
      })
      this.form = JSON.parse(JSON.stringify(row));

      // 编辑
            this.dialogName = this.$t('default.Edit');
      // 将当前选项索引赋给this.idx
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form

      // 设置弹出编辑框标记为true
      this.editVisible = true;
    },
    handleDelete() {
      // 选项的选项数量
      const length = this.multipleSelection.length;
      // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框


      if (length) {
        let id_arr = [];
        for (let i = 0; i < length; i++) {
          id_arr.push(this.multipleSelection[i].ware_id);
        }
        this.axios.post('/ware/warehouse/delete', {
          token: localStorage.getItem("token"),
          id_arr: id_arr,
          // params: this.multipleSelection

        }).then((res) => {
          console.log(res);
          // 弹出成功提示框
          this.$message.success('删除成功！');
          this.editVisible = false;
          this.getData();
          // 为this.tableData新增属性
          this.$set(this.tableData, this.idx, this.form);
        }).catch(() => {
          this.loading = false;
        })

        // 将选中的选项置为空，即不再选中任何一项
        this.multipleSelection = [];
      }
      else {
        // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
      }
    },

    handleLocatEdit(index, row) {
      this.LocationVisibleName = '编辑';
      this.locatform = JSON.parse(JSON.stringify(row));
      this.LocationVisible = true;
    },
    // 删除
    // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
    handleLocatDelete(index, row) {
      // 二次确认删除
      this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
        // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
        type: 'warning'
      })

          .then(() => {
            this.axios.post('/ware/wareLocation/delete', {
              token: localStorage.getItem("token"),
              params: row
            }).then((res) => {
              // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
              this.editVisible = false;
              this.getLocatData();
            }).catch(() => {
              this.loading = false;
            })

          })
          .catch(() => { })
      // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
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
    // 保存编辑
    saveEdit() {
      if (typeof (this.form.ware_id) == 'undefined') {
        this.axios.post('/ware/warehouse/save', {
          token: localStorage.getItem("token"),
          params: this.form,

        }).then((res) => {

          // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
          this.editVisible = false;
          this.getData();
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.axios.post('/ware/warehouse/update', {
          token: localStorage.getItem("token"),
          params: this.form,

        }).then((res) => {

          // 弹出成功提示框
          // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
          this.editVisible = false;
          this.getData();

        }).catch(() => {
          this.loading = false;
        })
      }

    },

  },

  // 在钩子函数中调用getData方法
  created() {
    this.getData();
    this.getDepartment();
    this.permission = JSON.parse(this.permission);
  }
}
</script>
