<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
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
                    v-if="permission.includes('ProductMerge:handleBatchAdd')">{{ $t('default.Batch_Import')
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

                <el-table-column prop="product_cd" label="物料编码" align="center"></el-table-column>
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
            <!-- 分页导航 -->
            <div class="pagination">
                <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>




        <el-dialog title='批量导入成品归并关系' :visible.sync="editBatchVisible" width="70%">
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

                            <el-table-column prop="product_cd" label="物料编码"></el-table-column>

                            <el-table-column prop="product_desc" label="物料名称"></el-table-column>
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
            mat_options: [],
            loading: false,
            download_file: '',
            ls_download_file: '',
            dialogName: '编辑',
            pageTotal: 0,
            form: {},

            idx: -1,
            id: -1,



            options: [],
            size: '',
            cli_options: [],
            el_upload_url: '',
            materialBatchAdd_url: '',
            materialBatchUpdate_url: '',

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
            this.axios.get('/cust/ProductMerge/index', {
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
            this.axios.post('/cust/ProductMerge/BatchSave', {

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

        handleDelete(index, row) {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/cust/ProductMerge/delete', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                }).then((res) => {

                    // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));

                    this.getData();

                }).catch(() => {
                    this.loading = false;
                })
                this.multipleSelection = [];
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },




    },
    // 在钩子函数中调用getData方法
    created() {

        this.materialBatchAdd_url = axios.defaults.baseURL + '/com/ExcelIn/productMergeSave';

        this.getData();
        this.permission = JSON.parse(this.permission);


    }
}
</script>
