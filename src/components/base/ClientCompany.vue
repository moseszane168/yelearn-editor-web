<template>
    <!-- 基础表格组件 -->
    <div>
        
        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 供应商名称 -->
                {{ $t('default.Supplier_Name') }}：
                <el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <el-button type="primary" class="handle-del mr10" @click="handleadd">{{ $t('default.Add') }}</el-button><!-- 新增 -->
                <el-button type="primary" class="handle-del mr10" @click="handleDelete">{{ $t('default.Delete') }}</el-button><!-- 删除 -->


            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">

                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="55" align="center">
                    <template v-slot="scope">
                        <el-button type="text" 
                            @click="handleEdit(scope.$index, scope.row)">{{ $t('default.Edit') }}</el-button><!-- 编辑 -->
                    </template>
                </el-table-column>

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 客户公司 -->
                <el-table-column prop="name" :label="$t('default.Customer_Company')"></el-table-column>

                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>
                <!-- 更新时间 -->  
                <el-table-column prop="update_time" :label="$t('default.Update_Time')"></el-table-column>
                <!-- 操作 -->

            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20,50,100, 200, 300, 400]" :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 客户公司 -->
                <el-form-item :label="$t('default.Customer_Company')" prop="name">
                    <el-input v-model="form.name"></el-input>
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





    </div>
</template>

<script>

export default {
    name: 'basetable',

    data() {
        return {
            query: {

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
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                ],
            },

            idx: -1,
            id: -1,

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/infor/ClientCompany/index', {
                params: this.query
            }).then((res) => {


                this.tableData = res.list.data;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal
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
                create_time:[],
            }
        },
        // 新增
        handleadd() {
            this.pictureList = [];
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
        downloadFile(fileUrl) {
            window.open(fileUrl);
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
            //选中数据的集合赋给 this.mutipleSelection
            this.multipleSelection = val;
        },


        // 编辑
        handleEdit(index, row) {



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

                this.axios.post('/infor/ClientCompany/delete', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,


                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success(res.msg);
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
                this.axios.post('/infor/ClientCompany/save', {

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
                this.axios.post('/infor/ClientCompany/update', {
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

            this.pictureList = [];
        },


        handleExceed(files, pictureList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + pictureList.length} 个文件`);
        },
        handleRemove(file, fileList) {
            // return this.$confirm(`确定移除 ${file.name}？`);
            console.log(file);
            console.log(fileList);
        },

        handleSuccess(file, pictureList, row) {
            this.form.license = pictureList.response.data;

        },

        handleFileSuccess(file, fileList, row) {

            this.form.invoicing_information = fileList.response.data;

            // console.log(fileList.response);

            // console.log(file);

            // this.form.license = pictureList.response;

        }


    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
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



<style>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
