<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 菜单名称 -->
                {{ $t('default.Menu_Name') }}：
                <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')"  class="handle-input mr10 w150"></el-input>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <el-button type="primary" class="handle-del mr10" v-if="permission.includes('menu:add')"
                    @click="handleadd">{{ $t('default.Add') }}</el-button><!-- 新增 -->
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 菜单名称 -->
                <el-table-column prop="name" :label="$t('default.Menu_Name')" width="180"></el-table-column>
                <!-- 前端路由 -->
                <el-table-column prop="front_api" :label="$t('default.Front_End_Routing')"
                    width="180"></el-table-column>
                <!-- 后端路由 -->
                <el-table-column prop="after_api" :label="$t('default.Backend_Routing')" width="180"></el-table-column>
                <el-table-column prop="icon" label="icon"></el-table-column>
                <!-- 类型 -->
                <el-table-column prop="type_name" :label="$t('default.Type')"></el-table-column>
                <!-- 是否隐藏 -->
                <el-table-column prop="hidden_name" :label="$t('default.Hide_or_not')"></el-table-column>
                <!-- 排序 -->
                <el-table-column prop="sort" :label="$t('default.Sort_by')"></el-table-column>



                <!-- 操作 -->
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="180" align="center">
                    <template v-slot="scope">
                        <el-button type="text" v-if="scope.row.type == 1"
                            @click="handleEdit(scope.$index, scope.row)">{{ $t('default.Edit') }}</el-button><!-- 编辑 -->
                        <!-- 编辑按钮 -->
                        <el-button type="text" v-if="scope.row.type == 1"
                            @click="handleButtonEdit(scope.$index, scope.row)">{{ $t('default.Edit_button')
                            }}</el-button>
                        <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                            @click="handleDelete(scope.$index, scope.row)">{{ $t('default.Delete')
                            }}</el-button><!-- 删除 -->
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
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 菜单名称 -->
                <el-form-item :label="$t('default.Menu_Name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <!-- 父级菜单 -->
                <el-form-item :label="$t('default.Parent_Menu')" prop="p_list">

                    <el-cascader :options="options" clearable v-model="form.p_list"
                        :props="{ checkStrictly: true }"></el-cascader>

                </el-form-item>
                <!-- 前端路由 -->
                <el-form-item :label="$t('default.Front_End_Routing')" prop="front_api">
                    <el-input v-model="form.front_api"></el-input>
                </el-form-item>
                <!-- 后端路由 -->
                <el-form-item :label="$t('default.Backend_Routing')">
                    <el-input v-model="form.after_api"></el-input>
                </el-form-item>
                <el-form-item label="icon" prop="icon">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <!-- 排序 -->
                <el-form-item :label="$t('default.Sort_by')" prop="sort">
                    <el-input v-model="form.sort"></el-input>
                </el-form-item>
                <!-- 隐藏状态 -->
                <el-form-item :label="$t('default.Hidden_status')">
                    <el-input v-model="form.hidden"></el-input>
                </el-form-item>


            </el-form>





            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>

        <!-- 编辑按钮 -->
        <el-dialog :title="$t('default.Confirm')" :visible.sync="buttonVisible" width="70%">

            <template>

                <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                <el-table :data="orderData" style="width: 100%">
                    <!-- 按钮名称 -->
                    <el-table-column prop="name" :label="$t('default.Button_Name')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.name"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 前端按钮 -->
                    <el-table-column prop="front_api" :label="$t('default.Front_End_Routing')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.front_api"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 后端路由 -->
                    <el-table-column prop="after_api" :label="$t('default.Front_End_Routing')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.after_api"></el-input>
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
                        <template slot-scope="scope">

                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                            </el-button><!-- 删除 -->
                        </template>
                    </el-table-column>
                </el-table>
            </template>





            <span slot="footer" class="dialog-footer">
                <el-button @click="buttonVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveButtonEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
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
            orderData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            buttonVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            rules: {
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'blur' },
                ]
            },
            fileList: [],
            image_path: '',
            idx: -1,
            id: -1,
            options: []
        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/index/menu/index', {
                params: this.query
            }).then((res) => {
                // console.log(res.list.data);
                this.tableData = res.list.data;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

            // console.log(this.permission);

            console.log(this.permission);
        },
        // 新增
        handleadd() {
            // 获取父级菜单
            var token = localStorage.getItem("token");
            this.axios.post('/index/menu/all_menu', {
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
        //增加行
        handleAddLine() {
            if (this.orderData == undefined) {
                this.orderData = new Array();
            }
            let obj = {};
            this.orderData.push(obj);
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
            //选中数据的集合赋给this.mutipleSelection
            this.multipleSelection = val;
        },
        // 编辑
        handleEdit(index, row) {

            // 编辑
            this.dialogName = this.$t('default.Edit');
            var token = localStorage.getItem("token");
            this.axios.post('/index/menu/all_menu', {
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
        // 编辑按钮
        handleButtonEdit(index, row) {
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            var token = localStorage.getItem("token");
            this.axios.post('/index/menu/handleButtonEdit', {
                token: token,
                params: this.form
            }).then((res) => {

                this.orderData = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })



            // console.log(this.form);
            // 设置弹出编辑框标记为true
            this.buttonVisible = true;
        },
        // 按钮保存
        saveButtonEdit() {
            this.axios.post('/index/menu/buttonUpdate', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form
            }).then((res) => {
                // console.log(res);
                // 弹出成功提示框
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.buttonVisible = false;
                this.getData();
                // 为this.tableData新增属性
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })
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

                    this.axios.post('/index/menu/delete', {
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
        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                name: '',
                pageIndex: 1,
                pageSize: 20,
                create_time: [],
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
        // 保存编辑
        saveEdit() {

            var data_form = this.form;

            if (typeof (data_form.id) == 'undefined') {

                this.axios.post('/index/menu/save', {

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
                this.axios.post('/index/menu/update', {
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
        // 
    }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
