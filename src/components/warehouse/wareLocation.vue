<template>
  <!-- 基础表格组件 -->
  <div>

    <div class="container">
      <!-- 操作栏 -->
      <div class="handle-box">
        <span v-if="this.activeName == 'ware'">{{ $t('default.Location') }}：</span>
        <span v-else>{{ $t('default.LocationCategory') }}：</span>
        <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')"
                  class="handle-input mr10 w150"></el-input>
        <!-- 搜索 -->
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          {{ $t('default.Search') }}
        </el-button>
        <!-- 清空 -->
        <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
        <br/>
        <br/>
        <!-- 新增库位分类 -->
        <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleCategoryAdd"
                   v-if="permission.includes('material:handleadd')">{{ $t('default.Add') }}{{ $t('default.LocationCategory') }}
        </el-button>
        <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleadd"
                   v-if="permission.includes('material:handleadd')">{{ $t('default.Add') }}
        </el-button><!-- 新增 -->
        <!-- 导入 -->
        <el-button type="primary" class="handle-del mr10" @click="handleBatchAdd"
                   v-if="permission.includes('wareLocation:handleBatchAdd')">{{ $t('default.Import') }}
        </el-button>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 库位分类列表-->
        <el-tab-pane :label="$t('default.LocationCategory')" name="category">
          <el-table :data="cateTableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">
            <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- 序号 -->
            <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
            <!-- 库位名称 -->
            <el-table-column prop="category_name" :label="$t('default.LocationCategory')" align="center"></el-table-column>
            <!-- 备注 -->
            <el-table-column prop="remark" :label="$t('default.Desc')" align="center"></el-table-column>
            <!-- 创建时间 -->
            <el-table-column prop="create_time" :label="$t('default.Creation_time')">
              <template v-slot="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{ scope.row.create_user_name }}
                    {{ scope.row.create_time }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-button type="text" style="color: rgb(39, 36, 36);">
                      {{ scope.row.create_user_name }} {{ scope.row.create_time }}
                    </el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :label="$t('default.Action')">
              <template v-slot="scope">
                <el-button type="text" @click="handleLocatEdit(scope.$index, scope.row)"
                           v-if="permission.includes('wareLocation:handleEdit')">{{ $t('default.Edit') }}
                </el-button><!-- 编辑 -->
                <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                           v-if="permission.includes('wareLocation:handleDelete')"
                           @click="handleCategoryDelete(scope.$index, scope.row)">{{ $t('default.Delete') }}
                </el-button><!-- 删除 -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 库位 -->
        <el-tab-pane :label="$t('default.LocationDetail')" name="ware">
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">
            <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- 序号 -->
            <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
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
            <!-- 库位 -->
            <el-table-column prop="name" :label="$t('default.Location')" align="center"></el-table-column>
            <!-- 库位名称 -->
            <el-table-column prop="category_name" :label="$t('default.LocationCategory')" align="center"></el-table-column>
            <!-- 创建时间 -->
            <el-table-column prop="create_time" :label="$t('default.Creation_time')">
              <template v-slot="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{ scope.row.create_user_name }}
                    {{ scope.row.create_time }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-button type="text" style="color: rgb(39, 36, 36);">
                      {{ scope.row.create_user_name }} {{ scope.row.create_time }}
                    </el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :label="$t('default.Action')">
              <template v-slot="scope">
                <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                           v-if="permission.includes('wareLocation:handleEdit')">{{ $t('default.Edit') }}
                </el-button><!-- 编辑 -->
                <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                           v-if="permission.includes('wareLocation:handleDelete')"
                           @click="handleDelete(scope.$index, scope.row)">{{ $t('default.Delete') }}
                </el-button><!-- 删除 -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 分页导航 -->
        <div class="pagination">
          <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
          <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                         :page-size="query.pageSize" :total="pageTotal"
                         @current-change="handlePageChange"></el-pagination>
        </div>
      </el-tabs>
    </div>
    <!-- 批量导入库位 -->
    <el-dialog :title="$t('default.Batch_Import')" :visible.sync="importVisible" width="70%">
      <el-button type="primary" @click="downloadFile(download_file)">{{
          $t('default.Download_Import_Template')
        }}
      </el-button><!-- 下载导入模板 -->
      <el-upload :on-success="handleExcelInSuccess" style="float: left;" :action="wareLocation_url">
        <el-button size="small" type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
      </el-upload>
      <template>
        <el-table :data="orderData" style="width: 100%">
          <!-- 区 -->
          <el-table-column prop="level1" :label="$t('default.Zone')"></el-table-column>
          <!-- 架 -->
          <el-table-column prop="level2" :label="$t('default.Shelf')"></el-table-column>
          <!-- 层 -->
          <el-table-column prop="level3" :label="$t('default.Layer')"></el-table-column>
          <!-- 位 -->
          <el-table-column prop="level4" :label="$t('default.Position')"></el-table-column>
          <!-- 操作 -->
          <el-table-column prop="operate" :label="$t('default.Action')">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete"
                         @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
              </el-button><!-- 删除 -->

            </template>
          </el-table-column>

        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="BatchsaveEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
    </el-dialog>

    <!--新增库位-->
    <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">
      <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
        <el-form-item :label="$t('default.Location')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 库位分类 -->
        <el-form-item :label="$t('default.LocationCategory')" prop="category_name">
          <el-select v-model="form.ware_category_id"  transfer="true" :popper-append-to-body="false">
            <el-option v-for="item in category_options" :key="item.category_id" :label="item.wareName"
                       :value="item.category_id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('default.Desc')">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
        <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
    </el-dialog>

    <!--新增库位分类-->
    <el-dialog :title=dialogCateName :visible.sync="categoryVisible" width="70%">
      <el-form :inline="true" ref="cate_form" :rules="cate_rules" :model="cate_form" label-width="200px">
        <!-- 部门 -->
        <el-form-item :label="$t('default.Department')" prop="department_id">
          <el-select v-model="cate_form.department_id" placeholder="空值默认为用户当前部门" transfer="true" :popper-append-to-body="false">
            <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 库位分类 -->
        <el-form-item :label="$t('default.Category_Name')" prop="category_name">
          <el-input v-model="cate_form.category_name"></el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('default.Desc')">
          <el-input type="textarea" v-model="cate_form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
             <!-- 取 消 -->
            <el-button @click="categoryVisible = false">{{ $t('default.Cancel') }}</el-button>
        <!-- 确 定 -->
             <el-button type="primary" @click="categoryEdit">{{ $t('default.Confirm') }}</el-button>
              </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';

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
      cateTableData: [],
      multipleSelection: [],
      delList: [],
      importVisible: false,
      orderData: [],
      pageTotal: 0,
      form: {
        name: '',
        category_name: '',
        ware_category_id:''
      },
      cate_form: {
        category_name: '',
      },
      idx: -1,
      id: -1,
      options: [],
      locatDate: [],
      is_pid: 0,
      wareLocation_url: '',
      download_file: '',
      editVisible: false,
      categoryVisible: false,
      activeName: 'ware',
      dialogName: '编辑',
      dialogCateName: '编辑',
      department_options: [],
      category_options: [],
      rules: {
        name: [
          {required: true, message: '请输入库位', trigger: 'blur'},
          // { max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
        ],
        category_name: [
          {required: true, message: '请选择库位分类', trigger: 'blur'},
        ],

      },
      cate_rules: {
        category_name: [
          {required: true, message: '请输入库位分类名', trigger: 'blur'},
        ],
      }
    };

  },
  methods: {
    handleClick(tab, event) {
      // 根据当前激活的标签页加载相应的数据
      if (tab.name === 'ware') {
        this.getData();
      } else {
        this.categoryData();
      }
    },
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {
      this.query.token = localStorage.getItem("token");
      this.axios.get('/ware/wareLocation/list', {
        params: this.query
      }).then((res) => {
        this.tableData = res.list.data;
        this.download_file = res.download_file;
        this.activeName = 'ware';
        this.pageTotal = res.list.total || 0;
      }).catch(() => {
        this.loading = false;
      })
    },
    categoryData() {
      this.query.token = localStorage.getItem("token");
      this.axios.get('/ware/LocationCategory/list', {
        params: this.query
      }).then((res) => {
        console.log(res);
        this.cateTableData = res.list.data;
        this.activeName = 'category';
        this.pageTotal = res.list.total || 0;
      }).catch(() => {
        this.loading = false;
      })
    },

    handleBatchAdd() {
      this.importVisible = true;
    },
    downloadFile(download_file) {
      window.open(download_file);
    },

    // 搜索,触发搜索按钮
    handleSearch() {
      // 为this.query新增属性，并更新视图
      this.$set(this.query, 'pageIndex', 1);
      // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
      if (this.activeName == 'ware') {
        this.getData();
      } else {
        this.categoryData();
      }
    },
    //删除行
    handleDeleteLine(index) {
      this.applyDate.splice(index, 1)
    },
    // 多选,对表格中的复选框列表做监听，当选择项发生变化则触发handleSelectionChange方法，val为选中数据的集合，通过this.multipleSelection.
    // prop字段取得每一个选项的值，prop字段就是表格子项的prop值。this.multipleSelection.length为选择了多少项
    handleSelectionChange(val) {
      // val表示当前选中的行数据组成的数组
      //选中数据的集合赋给this.mutipleSelection
      this.multipleSelection = val;
      console.log(val);
    },
    handleSearchClear() {
      this.query = {
        token: localStorage.getItem("token"),
        name: '',
        pageIndex: 1,
        pageSize: 20,
        create_time: [],
      }
    },
    // 保存编辑
    saveEdit() {
      // pictureList:this.pictureList,

      // let picture_arr = [];
      // if (this.fileList === this.pictureList) {
      //
      // } else {
      //   const length = this.fileList.length;
      //
      //   if (length) {
      //     for (let i = 0; i < length; i++) {
      //
      //       var pictureInfo = this.fileList[i];
      //       // console.log(pictureInfo);
      //       // if(pictureInfo.includes('response')){
      //       let response = pictureInfo.response;
      //       // console.log(response);
      //       if (response) {
      //         picture_arr.push(response.data);
      //       } else {
      //         picture_arr.push(pictureInfo.name);
      //       }
      //     }
      //   }
      // }
      //
      // this.form.picture_arr = picture_arr;

      var data_form = this.form;

      if (typeof (data_form.id) == 'undefined') {

        this.axios.post('/ware/wareLocation/save', {

          token: localStorage.getItem("token"),
          params: data_form,

          clientCodeTableData: this.clientCodeTableData,
          ModelData: this.ModelData,
          ReplaceData: this.ReplaceData,

        }).then((res) => {

          // 保存成功
          this.$message.success(this.$t('default.Save_Success'));
          this.editVisible = false;
          this.getData();
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.axios.post('/ware/wareLocation/update', {
          token: localStorage.getItem("token"),
          params: data_form,

          clientCodeTableData: this.clientCodeTableData,
          ModelData: this.ModelData,
          ReplaceData: this.ReplaceData,

        }).then((res) => {
          console.log(res);
          // 弹出成功提示框
          // 修改成功
          this.$message.success(this.$t('default.Modify_Succeed'));
          this.editVisible = false;
          this.getData();
          // 为this.tableData新增属性
          this.$set(this.tableData, this.idx, this.form);
        }).catch(() => {
          this.loading = false;
        })
      }

      // this.pictureList = [];
    },

    categoryEdit() {
      var data_form = this.cate_form;
      if (typeof (data_form.id) == 'undefined') {
        this.axios.post('/ware/LocationCategory/locationCategoryAdd', {
          token: localStorage.getItem("token"),
          params: data_form,

        }).then((res) => {
          // 保存成功
          this.$message.success(this.$t('default.Save_Success'));
          this.categoryVisible = false;
          this.categoryData();
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.axios.post('/ware/LocationCategory/update', {
          token: localStorage.getItem("token"),
          params: data_form,

        }).then((res) => {
          // 弹出成功提示框
          // 修改成功
          this.$message.success(this.$t('default.Modify_Succeed'));
          this.categoryVisible = false;
          this.categoryData();
          // 为this.tableData新增属性
          this.$set(this.tableData, this.idx, this.form);
        }).catch(() => {
          this.loading = false;
        })
      }

      this.pictureList = [];
    },
    handleadd() {
      // 新增
      this.dialogName = this.$t('default.Add');
      this.form = {};
      this.editVisible = true;
    },
    handleCategoryAdd() {
      // 新增库位分类
      this.dialogCateName = this.$t('default.Add');
      this.cate_form = {};
      this.categoryVisible = true;
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

    // 获取库位分类
    getAllCategory() {
      var token = localStorage.getItem("token");
      this.axios.post('/ware/LocationCategory/getAllCategory', {
        token: token
      }).then((res) => {
        this.category_options = res;
      }).catch(() => {
        this.loading = false;
      })
    },

    // 编辑
    handleEdit(index, row) {
      // 获取父级菜单

      this.form = JSON.parse(JSON.stringify(row));

      // 编辑
      this.dialogCateName = this.$t('default.Edit');
      // 将当前选项索引赋给this.idx
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      // 设置弹出编辑框标记为true
      this.editVisible = true;
      this.getAllCategory();
    },
    // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
    handleDelete(index, row) {
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
              this.importVisible = false;
              this.getData();
            }).catch(() => {
              this.loading = false;
            })

          })
          .catch(() => {
          })
      // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
    },

    // 编辑
    handleLocatEdit(index, row) {
      // 获取父级菜单
      this.cate_form = JSON.parse(JSON.stringify(row));
      // 编辑
      this.dialogName = this.$t('default.Edit');
      // 将当前选项索引赋给this.idx
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      // 设置弹出编辑框标记为true
      this.categoryVisible = true;
      this.categoryVisible = true;
    },
    handleCategoryDelete(index, row) {
      // 二次确认删除
      this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
        // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
        type: 'warning'
      })
          .then(() => {
            this.axios.post('/ware/LocationCategory/delete', {
              token: localStorage.getItem("token"),
              params: row
            }).then((res) => {
              // 删除成功
              this.$message.success(this.$t('default.Delete_Successfully'));
              this.importVisible = false;
              this.cateTableData();
            }).catch(() => {
              this.loading = false;
            })

          })
          .catch(() => {
          })
      // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
    },

    // 页面改变,分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      if (this.activeName == 'ware'){
        this.getData();
      } else {
        this.categoryData();
      }

    },
    handleSizeChange(val) {
      this.$set(this.query, 'pageSize', val);
      if (this.activeName == 'ware') {
        this.getData();
      } else {
        this.categoryData();
      }
    },
    handleExcelInSuccess(file, fileList, row) {
      if (file.code == 201) {
        this.$message.warning(file.msg);
      } else if (file.code == 200) {
        // 上传成功
        this.$message.success(this.$t('default.Uploaded_successfully'));
        this.orderData = file.data;
      }
    },
    // 保存编辑
    BatchsaveEdit() {
      this.axios.post('/ware/wareLocation/BatchUpdate', {
        token: localStorage.getItem("token"),
        orderData: this.orderData,

      }).then((res) => {
        // 保存成功
        this.$message.success(this.$t('default.Save_Success'));
        this.importVisible = false;
        this.getData();
      }).catch(() => {
        this.loading = false;
      })
    },

    mounted() {
      // 默认加载第一个标签页的数据
      this.getData();
    }
  },

  // 在钩子函数中调用getData方法
  created() {
    this.getData();
    this.wareLocation_url = axios.defaults.baseURL + '/com/ExcelIn/wareLocation';
    this.permission = JSON.parse(this.permission);
    this.getDepartment();
    this.getAllCategory();
  }
}
</script>
