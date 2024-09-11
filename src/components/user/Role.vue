<template>
    <!-- 基础表格组件 -->
    <div>
       
        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 批量删除按钮 type="primary" 设置风格为主要按钮 -->
                <el-button type="primary"  class="handle-del mr10" @click="handleadd" v-if="permission_button.includes('Role:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->



                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 角色名称 -->
                {{ $t('default.Role_Name') }}：
                <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')"  class="handle-input mr10 w150"></el-input>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
            </div>
            <!-- 表格 el-table 绑定 data 对象后，el-table-column 可以通过 prop 键入对象中的键名，从而引入对应的值 -->
            <!-- border：是否带有纵向边框 -->
            <!-- header-cell-class-name：表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。 -->
            <!-- selection-change：当选择项发生变化时，触发该事件 -->
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="100" align="center">
                    <template v-slot="scope">
                        <!-- 设置权限 -->
                        <el-button type="text" 
                            @click="handleEdit(scope.$index, scope.row)"  v-if="permission_button.includes('Role:handleEdit')">{{ $t('default.Set_Privileges') }}</el-button>

                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- id -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <!-- 角色名称 -->
                <el-table-column prop="name" :label="$t('default.Role_Name')"></el-table-column>
                <!-- 角色编码 -->
                <el-table-column prop="code" :label="$t('default.Role_Code')"></el-table-column>


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

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%" :before-close="handleClose">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- <el-form-item label="角色名称" prop="name"> -->
                    <el-tree :data="permission" show-checkbox node-key="id" 
               
                        :props="defaultProps"
                        ref="tree" 
                        >
                    </el-tree>
                




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
            permission_button: sessionStorage.getItem('permission_button'),
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
            permission: [],
            editVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {
                username: ''
            },
            rules: {
               
            },
            fileList: [],
            image_path: '',
            idx: -1,
            id: -1,
            defaultProps: {
                children: 'children',
                label: 'label'
            }

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {

            // console.log(localStorage.getItem("token"));
            this.query.token = localStorage.getItem("token");
            // return;
            this.axios.get('/index/role/index', {
               
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
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
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

             // 获取所有权限
             this.axios.post('/index/menu/permission', {
                token: localStorage.getItem("token"),
                params: row
            }).then((res) => {
                this.permission = res.list;
                this.$refs.tree.setCheckedKeys(res.permission_arr);

            }).catch(() => {
                this.loading = false;
            })
           
            // 编辑
            this.dialogName = this.$t('default.Edit');
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
            // return;
            var data_form = this.form;

            // console.log(data_form);
            var tree_key= this.$refs.tree.getCheckedKeys()

            this.axios.post('/index/menu/permissionSet', {
                token: localStorage.getItem("token"),
                params: data_form,
                permission: tree_key
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


           
        },

      
    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        // console.log(this.permission);
        this.permission_button = JSON.parse(this.permission_button);
    }
}
</script>



