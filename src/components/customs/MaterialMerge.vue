<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <div class="handle-box">
                <!-- 物料名称：<el-input v-model="query.name" class="handle-input mr10 w150"></el-input> -->
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
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleBatchAdd"
                    v-if="permission.includes('MaterialMerge:handleBatchAdd')">{{ $t('default.Batch_Import')
                    }}</el-button><!-- 批量导入 -->
                <el-button type="primary" class="handle-del mr10" @click="handleDelete">{{ $t('default.Delete')
                    }}</el-button><!-- 删除 -->

            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>

                <el-table-column prop="material_cd" label="物料编码" align="center"></el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" width="180"></el-table-column>
                
                <el-table-column prop="calc_unit" label="计量单位"></el-table-column>
                <el-table-column prop="sn" label="备案序号"></el-table-column>
                <el-table-column prop="sn_desc" label="备案名称"></el-table-column>
                <el-table-column prop="record_number" label="备案料号"></el-table-column>
                <el-table-column prop="cunit" label="申报单位"></el-table-column>
                <el-table-column prop="cunit_rate" label="单位转换率" width="100"></el-table-column>
                <el-table-column prop="data_update_time" label="更新时间">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>
                                {{ scope.row.data_update_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">
                                    {{ scope.row.data_update_time }}</el-button>

                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>
        <el-dialog title='批量导入物料归并关系' :visible.sync="editBatchVisible" width="70%">
            <el-form ref="form" :model="form" label-width="200px">
                <!-- 物料列表 -->
                <el-form-item :label="$t('default.Material_List')">
                    <el-button type="primary" @click="downloadFile(download_file)">{{
                    $t('default.Download_Import_Template')
                }}</el-button><!-- 下载导入模板 -->
                    <el-upload :on-success="handleExcelInSuccess" :action="materialBatchAdd_url">
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload')
                            }}</el-button><!-- 点击上传 -->
                    </el-upload>
                    <template>
                        <el-table :data="orderData" style="width: 100%">
                            <el-table-column prop="material_cd" label="物料编码"></el-table-column>
                            <el-table-column prop="material_desc" label="物料名称"></el-table-column>
                            <el-table-column prop="book_num" label="帐册编号"></el-table-column>
                            <el-table-column prop="calc_unit" label="计量单位"></el-table-column>
                            <el-table-column prop="sn" label="备案序号"></el-table-column>
                            <el-table-column prop="sn_desc" label="备案名称"></el-table-column>
                            <el-table-column prop="record_number" label="备案料号"></el-table-column>
                            <el-table-column prop="cunit" label="申报单位"></el-table-column>
                            <el-table-column prop="cunit_rate" label="单位转换率" width="100"></el-table-column>
                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>
                            <!-- 异常 -->
                            <el-table-column prop="error" :label="$t('default.Abnormal')"></el-table-column>
                        </el-table>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editBatchVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="BatchsaveEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>




    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'basetable',

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
            orderData: [],
            multipleSelection: [],
            clientCodeTableData: [],
            ModelData: [],
            ReplaceData: [],
            delList: [],
            editVisible: false,
            costVisible: false,
            safeNumVisible: false,
            editBatchVisible: false,
            detailVisible: false,
            editBatchLSVisible: false,
            loading:false,
            download_file: '',
            ls_download_file: '',
            dialogName: '编辑',
            pageTotal: 0,
            form: {},

            idx: -1,
            id: -1,


            options: [],
            mat_options: [],
            size: '',
            cli_options: [],
            el_upload_url: '',
            materialBatchAdd_url: '',

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            const token = localStorage.getItem('token'); // 从本地存储获取token，这里使用localStorage作为示例
            const headers = {
                Authorization: `Bearer ${token}`, // 在请求头中添加Authorization字段，值为token
            };
            this.query.token = localStorage.getItem("token");
            this.axios.get('/cust/MaterialMerge/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;

                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

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

        // 搜索,触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },


        // 批量新增
        handleBatchAdd() {


            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};
            this.orderData = [];

            this.editBatchVisible = true;

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
                this.mat_options = [];
            }
        },



        //删除行
        handleDeleteLine(index) {
            console.log(index);
            this.orderData.splice(index, 1)
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


        // 批量新增保存
        BatchsaveEdit() {
            this.axios.post('/cust/MaterialMerge/BatchSave', {

                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,

            }).then((res) => {

                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                this.editBatchVisible = false;
                this.getData();
            }).catch(() => {
                this.loading = false;
            })
        },




        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },


        handleSuccess(file, fileList, row) {
            this.form.picture = fileList.response.data;

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




        handleDelete(index, row) {
          // 选项的选项数量
          const length = this.multipleSelection.length;

          // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
                type: 'warning'
            })
                .then(() => {
                    if (length){
                      let id_arr = [];
                      // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                      this.delList = this.delList.concat(this.multipleSelection);
                      // 对选中的选项进行循环，获取其中的name值
                      for (let i = 0; i < length; i++) {
                        id_arr.push(this.multipleSelection[i].id);
                      }

                      this.axios.post('/infor/material/delete', {
                        token: localStorage.getItem("token"),
                        params: id_arr
                      }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getData();
                        // this.tableData.splice(index, 1);
                      }).catch(() => {
                        this.loading = false;
                      })
                    }else {
                      // 未选中选项！
                      this.$message.error(this.$t('default.Unchecked_option'));
                    }

                })
                .catch(() => { })
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
        },




    },
    // 在钩子函数中调用getData方法
    created() {

        this.materialBatchAdd_url = axios.defaults.baseURL + '/com/ExcelIn/materialMergeSave';

        this.getData();
        this.permission = JSON.parse(this.permission);


    }
}
</script>
