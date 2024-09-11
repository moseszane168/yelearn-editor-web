<template>
    <!-- 基础表格组件 -->
    <div>
        
        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 批量删除按钮 type="primary" 设置风格为主要按钮 -->
                <el-button type="primary" class="handle-del mr10" @click="handleadd" v-if="permission.includes('MaterialLocation:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->
                <el-button type="primary" class="handle-del mr10" @click="handleBatchAdd" v-if="permission.includes('MaterialLocation:handleBatchAdd')">导入</el-button>


                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <el-input v-model="query.mat_code" clearable placeholder="物料编码" class="handle-input mr10"></el-input>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" align="center"></el-table-column>
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center"></el-table-column>
                <el-table-column prop="model" label="型号" align="center"></el-table-column>
                 <!-- 规格 -->
                <el-table-column prop="specifications" :label="$t('default.Specification')" >
                    <template v-slot="scope">
                       <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.specifications }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications }}</el-button>
                            </div>
                        </el-popover>
                    </template> 
                </el-table-column>
                <!-- 仓库 -->
                            <el-table-column prop="ware_name" :label="$t('default.Warehouse')"> align="center"></el-table-column>
                <!-- 库位 -->
                <el-table-column prop="location_name" :label="$t('default.Location')" align="center"></el-table-column>

                <!-- 操作 -->
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="180" align="center">
                    <template v-slot="scope">

                       <el-button type="text" 
                            @click="handleEdit(scope.$index, scope.row)" v-if="permission.includes('MaterialLocation:handleEdit')">{{ $t('default.Edit') }}</el-button><!-- 编辑 -->
                        <el-button type="text" icon="el-icon-delete" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                            @click="handleDelete(scope.$index, scope.row)" v-if="permission.includes('MaterialLocation:handleDelete')">{{ $t('default.Delete') }}</el-button><!-- 删除 -->
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

        <el-dialog title='批量导入物料库位' :visible.sync="batchVisible" width="70%">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="导入物料库位">
                    <el-button type="primary" style="float: right;" @click="downloadFile(download_file)">{{ $t('default.Download_Import_Template') }}</el-button><!-- 下载导入模板 -->
                    <el-upload :on-success="handleExcelInSuccess" :action="MaterialLocation_url">
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                    </el-upload>
                    <template>
                        <el-table :data="orderData" style="width: 100%">
                            <!-- 仓库 -->
                            <el-table-column prop="ware_name" :label="$t('default.Warehouse')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.ware_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ware_name }}</el-button>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code }}</el-button>                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                            <el-table-column prop="location" :label="$t('default.Location')"></el-table-column>

                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteLine(scope.$index, scope.row)">{{$t('default.Delete')}}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="batchVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="batchSaveEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <el-form-item label="物料编码" prop="mat_code">
                    <el-input v-model="form.mat_code" :readonly="readOnly"></el-input>
                </el-form-item>

                <!-- 仓库 -->
                <el-form-item :label="$t('default.Warehouse')" v-show="ware_show">
                    <el-cascader :options="options" v-model="form.ware_path" @change="handleLocationOptions"></el-cascader>

                </el-form-item>
                <el-form-item :label="$t('default.Location')">
                    <el-cascader :options="location_options" v-model="form.location_path"></el-cascader>

                </el-form-item>



            </el-form>





            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>

import axios from 'axios'
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
            dialogName: '编辑',
            pageTotal: 0,
            options: [],
            location_options: [],
            form: {},
            rules: {
                mat_code: [
                    { required: true, message: '请输入名称', trigger: 'blur' },

                ],
            },
            readOnly: false,
            ware_show: true,

            idx: -1,
            id: -1,
            download_file: '',
            MaterialLocation_url: '',
            orderData: [],
            batchVisible: false,

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/ware/materialLocation/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })
        },
        downloadFile(download_file) {
            window.open(download_file);
        },
        //删除行
        handleDeleteLine(index) {
            console.log(index);
            this.applyDate.splice(index, 1)
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
        // 新增
        handleadd() {
            this.readOnly = false;
            this.ware_show = true;
            // 获取仓库
            var token = localStorage.getItem("token");
            this.axios.post('/ware/warehouse/warelist', {
                token: token
            }).then((res) => {
                this.options = res;
            }).catch(() => {
                this.loading = false;
            })

            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};
            // 设置弹出编辑框标记为true
            this.editVisible = true;
        },

        handleLocationOptions(value) {
            var token = localStorage.getItem("token");
            this.axios.post('/ware/wareLocation/locationList', {
                token: token,
                ware_path: value
            }).then((res) => {
                this.location_options = res;
            }).catch(() => {
                this.loading = false;
            })
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
        handleBatchAdd() {
            this.batchVisible = true;
        },
        handleEdit(index, row) {
            this.form = JSON.parse(JSON.stringify(row));
            // 获取库位
            var token = localStorage.getItem("token");
            this.axios.post('/ware/wareLocation/locationList', {
                token: token,
                ware_path: this.form.ware_path
            }).then((res) => {
                this.location_options = res;
            }).catch(() => {
                this.loading = false;
            })

            this.readOnly = true;
            this.ware_show = false;
            // 编辑
            this.dialogName = this.$t('default.Edit');
            this.idx = index;
            this.editVisible = true;
        },
        // 删除
        // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/ware/materialLocation/delete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getData();
                        // this.tableData.splice(index, 1);
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
            var data_form = this.form;
            if (typeof (data_form.id) == 'undefined') {
                // console.log('新增');
                this.axios.post('/ware/materialLocation/save', {

                    token: localStorage.getItem("token"),
                    params: this.form,

                }).then((res) => {
                    console.log(res);
                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    this.editVisible = false;
                    this.getData();
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.axios.post('/ware/materialLocation/update', {
                    token: localStorage.getItem("token"),
                    params: this.form,


                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.editVisible = false;

                    this.getData();
                    // this.$set(this.tableData, this.idx, this.form);
                    this.$set(this.tableData, this.idx, this.form);
                }).catch(() => {
                    this.loading = false;
                })
            }
        },
        // 保存编辑
        batchSaveEdit() {
            this.axios.post('/ware/materialLocation/batchSave', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
            }).then((res) => {

                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                this.batchVisible = false;
                this.getData();
            }).catch(() => {
                this.loading = false;
            })
        },
    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        this.MaterialLocation_url = axios.defaults.baseURL + '/com/ExcelIn/materialLocation';
        this.permission = JSON.parse(this.permission);
    }
}
</script>


