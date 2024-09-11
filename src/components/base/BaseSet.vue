<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 批量删除按钮 type="primary" 设置风格为主要按钮 -->
                <el-button type="primary" class="handle-del mr10" @click="handleadd"
                    v-if="permission.includes('BaseSet:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->
                <el-button type="primary" class="handle-del mr10" @click="handleDelete"
                    v-if="permission.includes('BaseSet:handleDelete')">{{ $t('default.Delete') }}</el-button><!-- 删除 -->



                <!-- 名称 -->
                {{ $t('default.Name') }}：
                <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center" width="55">
                    <template v-slot="scope">


                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                            v-if="permission.includes('BaseSet:handleEdit')">{{ $t('default.Edit')
                            }}</el-button><!-- 编辑 -->

                    </template>
                </el-table-column><el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- id -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <!-- 姓名 -->
                <el-table-column prop="name" :label="$t('default.Name')"></el-table-column>
                <!-- 编码 -->
                <el-table-column prop="code" :label="$t('default.Code')"></el-table-column>
                <!-- 内容 -->
                <el-table-column prop="content" :label="$t('default.Content')"></el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>

                <!-- 操作 -->

                <!-- 创建时间 -->
                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')"></el-table-column>
                <!-- 更新时间 -->
                <!-- 更新时间 -->
                <el-table-column prop="update_time" :label="$t('default.Update_Time')"></el-table-column>

            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">
            <el-form ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 名称 -->
                <el-form-item :label="$t('default.Name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <!-- 编码 -->
                <el-form-item :label="$t('default.Code')" prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <!-- 物料列表 -->
                <el-form-item :label="$t('default.Material_List')">
                    <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="applyDate" style="width: 100%">
                            <!-- 名称 -->
                            <el-table-column prop="name" :label="$t('default.Name')">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 内容 -->
                            <el-table-column prop="content" :label="$t('default.Content')">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.content"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 备注 -->
                            <el-table-column prop="desc" :label="$t('default.Desc')">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.desc"></el-input>
                                </template>
                            </el-table-column>

                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">
                                    <!-- 删除 -->
                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button>
                                </template>
                            </el-table-column>

                        </el-table>
                    </template>
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

                username: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            applyDate: [],
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
                code: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                ],

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

            this.axios.get('/index/BaseSet/index', {

                params: this.query
            }).then((res) => {


                this.tableData = res.list.data;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;

            }).catch(() => {
                this.loading = false;
            })

        },
        // 新增
        handleadd() {
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
        //增加行
        handleAddLine() {
            if (this.applyDate == undefined) {
                this.applyDate = new Array();
            }
            let obj = {};

            this.applyDate.push(obj);
        },
        //删除行
        handleDeleteLine(index) {
            console.log(index);
            this.applyDate.splice(index, 1)
        },
        // 编辑
        handleEdit(index, row) {
            this.applyDate = row.children;
            // 编辑
            this.dialogName = this.$t('default.Edit');
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // 设置弹出编辑框标记为true
            this.editVisible = true;
        },
        handleDelete() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/index/BaseSet/delete', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    // 删除成功
                    this.$message.success(this.$t('default.Delete_Successfully'));
                    this.editVisible = false;
                    this.getData();

                    this.$set(this.tableData, this.idx, this.form);
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

            console.log(data_form);

            if (typeof (data_form.id) == 'undefined') {
                // console.log('新增');
                this.axios.post('/index/BaseSet/save', {

                    token: localStorage.getItem("token"),
                    params: data_form,
                    applyDate: this.applyDate
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
                this.axios.post('/index/BaseSet/update', {
                    token: localStorage.getItem("token"),
                    params: data_form,
                    applyDate: this.applyDate
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


        },

    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        this.permission = JSON.parse(this.permission);
    }
}
</script>
