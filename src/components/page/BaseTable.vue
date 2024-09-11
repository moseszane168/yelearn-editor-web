<template>
    <!-- 基础表格组件 -->
        <div>
            <!-- 面包屑导航 -->
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <i class="el-icon-lx-cascades"></i> 基础表格
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                 <!-- 操作栏 -->
                <div class="handle-box">
                    <!-- 批量删除按钮 type="primary" 设置风格为主要按钮 -->
                    <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                    >批量删除</el-button>
    
                    <!-- 地址下拉栏 v-model 的值为被选中的 el-option 的 value 属性值 -->
                    <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                        <!-- 下拉选项一 -->
                        <el-option key="1" label="广东省" value="广东省"></el-option>
                        <!-- 下拉选项二 -->
                        <el-option key="2" label="湖南省" value="湖南省"></el-option>
                    </el-select>
                    
                    <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                    <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                    <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                    <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                </div>
                <!-- 表格 el-table 绑定 data 对象后，el-table-column 可以通过 prop 键入对象中的键名，从而引入对应的值 -->
                <!-- border：是否带有纵向边框 -->
                <!-- header-cell-class-name：表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。 -->
                <!-- selection-change：当选择项发生变化时，触发该事件 -->
                <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <!-- id -->
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <!-- 用户名 -->
                    <el-table-column prop="name" label="用户名"></el-table-column>
                    <!-- 余额 -->
                    <el-table-column label="账户余额">
                        <!-- 作用域插槽 -->
                        <template v-slot="scope">￥{{scope.row.money}}</template>
                    </el-table-column>
                    <!-- 头像 -->
                    <el-table-column label="头像(查看大图)" align="center">
                        <template v-slot="scope">
                            <el-image
                                class="table-td-thumb"
                                :src="scope.row.thumb"
                                :preview-src-list="[scope.row.thumb]"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <!-- 地址 -->
                    <el-table-column prop="address" :label="$t('default.Address')"></el-table-column>
                    <!-- 状态 -->
                    <el-table-column label="状态" align="center">
                        <template v-slot="scope">
                            <el-tag
                                :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                            >{{scope.row.state}}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- 注册时间 -->
                    <el-table-column prop="date" label="注册时间"></el-table-column>
                    <!-- 操作 -->
                    <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="180" align="center">
                        <template v-slot="scope">
                            <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                            >{{ $t('default.Edit') }}</el-button><!-- 编辑 -->
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                            >{{ $t('default.Delete') }}</el-button><!-- 删除 -->
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页导航 -->
                <div class="pagination">
                    <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                    ></el-pagination>
                </div>
            </div>
    
            <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
            <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('default.Address')">
                        <el-input v-model="form.address"></el-input>
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
import { fetchData } from '../../api/index.js';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            // 通过post请求数据，将返回的数据存储到对应的数组中
            fetchData(this.query).then(res => {
                // 将数据中的list数组赋给tableData数组
                this.tableData = res.data.list;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.data.pageTotal || 50;
            });
        },
        // 批量删除，对选中的选项数量进行判断，如果没有选中选项则弹出提示框，提示未选中选项，如果选中了选项之后将选中的选项全部删除
        delAllSelection() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let str = '';
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.tableData.forEach((item) =>{
                    if(this.multipleSelection.indexOf(item) !== -1)
                {
                    this.tableData.splice(this.multipleSelection.indexOf(item),1);
                }
                })
                // 目的是为了提示用户已删除哪些数据。当用户删除了多个选项时，需要在页面上展示已删除哪些数据，而不是将选中的数据静默删除。
                // 因此，需要对选中的选项进行循环，获取其中的 name 值，并将其保存在一个字符串中。之后，可以使用消息框或其他方式，将这些数据展示给用户。
                // 弹出提示框，提示已经删除的选项
                this.$message.success(`删除了${str}`);
                // 将选中的选项置为空，即不再选中任何一项
                this.multipleSelection = [];
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
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
                // promise的链式调用语法
                .then(() => {
                    // promise对象执行成功率时所执行的函数，也就是用户点击了二次确认框中的确定按钮，此时需要删除表格数据并弹出删除成功的提示框 
                    // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                    this.tableData.splice(index, 1);
                })
                .catch(() => { })
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
        },
        // 页面改变,分页导航
        handlePageChange(val) {
            // 增添属性
            this.$set(this.query,'pageIndex',val);
            // 重新获取数据
            this.getData();
         },
        // 保存编辑
        saveEdit() {
            // 设置弹出编辑框标记为true
            this.editVisible = false;
            // 弹出成功提示框
            this.$message.success(`修改第${this.idx + 1}行成功`);
            // 为this.tableData新增属性
            this.$set(this.tableData,this.idx,this.form);
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
