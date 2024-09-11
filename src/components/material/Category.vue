<template>
    <!-- 基础表格组件 -->
    <div>
        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 批量删除按钮 type="primary" 设置风格为主要按钮 -->
                <el-button type="primary" class="handle-del mr10" @click="handleadd"
                    v-if="permission.includes('Category:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->
                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 分类名称 -->
                {{ $t('default.Category_Name') }}：
                <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    :placeholder="$t('default.Please_enter_a_keyword')"  @change="getWare()">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
            </div>

            <!-- row-key="id" 
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="110" align="center">
                    <template v-slot="scope">
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                            v-if="permission.includes('Category:handleEdit')">{{ $t('default.Edit') }}
                        </el-button><!-- 编辑 -->
                        <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if="permission.includes('Category:handleDelete')">{{ $t('default.Delete') }}
                        </el-button><!-- 删除 -->
                    </template>
                </el-table-column><el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                
                <el-table-column prop="name" :label="$t('default.Category_Name')"></el-table-column>
                <el-table-column prop="cate_code" label="编码"></el-table-column>
                <!-- 排序 -->
                <el-table-column prop="sort" :label="$t('default.Sort_by')"></el-table-column>
                <!-- 部门 -->
                <el-table-column prop="department_name" :label="$t('default.Department')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.department_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">
                                  {{ scope.row.department_name }}
                                </el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.create_user_name }}
                                {{ scope.row.create_time }}
                            </p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">
                                  {{ scope.row.create_user_name }} {{ scope.row.create_time }}
                                </el-button>
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
            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">

                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')" prop="department_id">
                    <el-select v-model="form.department_id" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 分类 -->
                <el-form-item :label="$t('default.Category_Name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" prop="p_list">
                    <el-cascader :options="options" v-model="form.p_list"
                        :props="{ checkStrictly: true }"></el-cascader>
                </el-form-item>
                <el-form-item label="编码" prop="cate_code">
                    <el-input v-model="form.cate_code"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort"></el-input>
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
            form: {},
            rules: {
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                ],
                cate_code: [
                    { required: true, message: '请输入编码', trigger: 'blur' },
              ],
            },
            fileList: [],
            image_path: '',
            idx: -1,
            id: -1,
            options: [],
            department_options: [],
        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/infor/Category/index', {
                params: this.query
            }).then((res) => {
                // console.log(res.list.data);
                this.tableData = res.list.data;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
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
        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                name: '',
                pageIndex: 1,
                pageSize: 20,
                create_time: [],
            }
        },
        // 新增
        handleadd() {
            // 获取父级菜单
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Category/all_category', {
                token: token
            }).then((res) => {


                this.options = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })


            this.fileList = [];
            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};

            // 新增
            this.dialogName = this.$t('default.Add');
            // 设置弹出编辑框标记为true

            this.editVisible = true;

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
        // 编辑
        handleEdit(index, row) {

            // 编辑
            this.dialogName = this.$t('default.Edit');
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Category/all_category', {
                token: token
            }).then((res) => {

                this.options = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));

            // console.log(this.form);
            // 设置弹出编辑框标记为true
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

                    this.axios.post('/infor/Category/delete', {
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

                this.axios.post('/infor/Category/save', {

                    token: localStorage.getItem("token"),
                    params: data_form
                }).then((res) => {
                    // console.log(res);
                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    this.editVisible = false;
                    this.getData();
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.axios.post('/infor/Category/update', {
                    token: localStorage.getItem("token"),
                    params: data_form
                }).then((res) => {
                    // console.log(res);
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
        },
    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        this.permission = JSON.parse(this.permission);
        this.getDepartment();
    }
}
</script>
