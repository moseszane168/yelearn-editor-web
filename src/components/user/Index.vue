<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 用户名称 -->
                {{ $t('default.User_Name') }}：
                <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 部门 -->
                {{ $t('default.Department') }}：
                <el-select v-model="query.department_id" multiple filterable remote
                    :placeholder="$t('default.Please_enter_a_keyword')" class="w200">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                {{ $t('default.Role') }}：
                <el-select filterable v-model="query.role_code" clearable class="w150">
                    <el-option v-for="item in role_arr" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />


                <el-button type="primary" class="handle-del mr10" @click="handleadd"
                    v-if="permission.includes('user:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->

            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" max-height="550px">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center">
                    <template v-slot="scope">
                        <!-- 初始化密码 -->
                        <el-button type="text" :title="$t('default.Are_you_sure_you_want_to_initialize_the_password')"
                            @click="handleDefaultPassword(scope.$index, scope.row)"
                            v-if="permission.includes('user:handleDefaultPassword')">{{
                    $t('default.Initialize_Password') }}</el-button>
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                            v-if="permission.includes('user:handleEdit')">{{ $t('default.Edit')
                            }}</el-button><!-- 编辑 -->
                        <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if="permission.includes('user:handleDelete')">{{ $t('default.Delete')
                            }}</el-button><!-- 删除 -->
                    </template>
                </el-table-column>
                <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- id -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <!-- 账号 -->
                <el-table-column prop="username" :label="$t('default.Account_number')"></el-table-column>
                <!-- 姓名 -->
                <el-table-column prop="name" :label="$t('default.Name')"></el-table-column>
                <!-- 编码 -->
                <el-table-column prop="user_code" :label="$t('default.Code')"></el-table-column>
                <!-- 角色 -->
                <el-table-column prop="role_name" :label="$t('default.Role')"></el-table-column>
                <!-- U8账号 -->
                <el-table-column prop="coperatorid" :label="$t('default.U8_Account_number')"></el-table-column>
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
                <!-- 操作 -->

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
            <!-- 分页导航 -->
            <div class="pagination">
                <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%" :before-close="handleClose">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 账号 -->
                <el-form-item :label="$t('default.Account_number')" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <!-- 编码 -->
                <el-form-item :label="$t('default.Code')" prop="user_code">
                    <el-input v-model="form.user_code" placeholder="空值则由系统自动生成"></el-input>
                </el-form-item>
                <!-- 姓名 -->
                <el-form-item :label="$t('default.Name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')" prop="department_id" popper-class="messageIndex">
                    <el-select v-model="form.department_id" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 角色 -->
                <el-form-item :label="$t('default.Role')" prop="role_code">
                    <el-select v-model="form.role_code" :placeholder="$t('default.Please_select')" popper-class="messageIndex"
                               transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in role_arr" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- U8账号 -->
                <el-form-item :label="$t('default.U8_Account_number')">
                    <el-input v-model="form.coperatorid"></el-input>
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
                username: '',
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
            role_arr: [],
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },

                ],
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                ],
                department_id: [
                    { required: true, message: '请输入部门', trigger: 'blur' },

                ],
                role_code: [
                    { required: true, message: '请输入角色', trigger: 'blur' },

                ],
            },
            fileList: [],
            department_options: [],
            image_path: '',
            idx: -1,
            id: -1,
            options: []

        };
    },
    methods: {
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/index/user/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 获取搜索条件
        getSearchCriteria() {
            var token = localStorage.getItem("token");
            this.axios.post('/index/user/SearchCriteria', {
                token: token
            }).then((res) => {
                // 部门
                // this.options = res.department_arr;
                // 角色
                this.role_arr = res.role_arr;
            }).catch(() => {
                this.loading = false;
            })
        },
        handleClose(done) {
            // 确认关闭？
            const that = this
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                  that.editVisible = false
                })
                .catch(_ => { });
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
            // 获取部门
            var token = localStorage.getItem("token");
            this.axios.post('/index/user/show', {
                token: token
            }).then((res) => {


                // 部门
                this.options = res.department_list;
                // 角色
                this.role_arr = res.role_list;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })

            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};

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
        // 多选,对表格中的复选框列表做监听，当选择项发生变化则触发handleSelectionChange方法，val为选中数据的集合，通过this.multipleSelection.
        // prop字段取得每一个选项的值，prop字段就是表格子项的prop值。this.multipleSelection.length为选择了多少项
        handleSelectionChange(val) {
            // val表示当前选中的行数据组成的数组
            //选中数据的集合赋给this.mutipleSelection
            this.multipleSelection = val;
        },
        // 编辑
        handleEdit(index, row) {
            // 获取部门
            var token = localStorage.getItem("token");
            this.axios.post('/index/user/show', {
                token: token
            }).then((res) => {


                // 部门
                this.options = res.department_list;
                // 角色
                this.role_arr = res.role_list;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })


            this.dialogName =this.$t('default.Edit');
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
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
                    this.axios.post('/index/user/delete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getData();
                    }).catch(() => {
                        this.loading = false;
                    })

                })
                .catch(() => { })
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
        },

        handleDefaultPassword(index, row) {

            // console.log(111);
            //     // 二次确认删除
            this.$confirm('确定要初始化密码吗？初始化后密码默认值为12345678', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/index/user/updateDefaultPassword', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        this.$message.success('初始化成功');
                        this.editVisible = false;
                        this.getData();
                    }).catch(() => {
                        this.loading = false;
                    })
                })
                .catch(() => { })
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

            // console.log(this.fileList);
            var data_form = this.form;

            console.log(data_form);

            if (typeof (data_form.id) == 'undefined') {
                // console.log('新增');
                this.axios.post('/index/user/save', {

                    token: localStorage.getItem("token"),
                    params: data_form
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
                this.axios.post('/index/user/update', {
                    token: localStorage.getItem("token"),
                    params: data_form
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

            this.fileList = [];
        },

        // 图片上传
        handleRemove(file, fileList) {
            // console.log(file, fileList);
        },
        handlePreview(file) {
            // console.log(file);
            // this.image_path=file.data.fullPath;
            // console.log(file.data.fullPath);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },

        handleSuccess(file, fileList, row) {
            this.form.license = fileList.response;
            // this.image_path.replace(/<[^>]+>/g, '')
            // console.log(this.image_path);
        },



    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        this.getSearchCriteria();
        this.permission = JSON.parse(this.permission);
        this.getDepartment();
    }
}
</script>
