<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
         



                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
              
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button> -->
           



            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center"></el-table-column>

                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{scope.row.mat_name }}</el-button>                            </div>
                        </el-popover>
                    </template>
                </el-table-column>


                <el-table-column prop="safe_num" label="安全库存"></el-table-column>
               <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>



                <!-- 更新时间 -->  
                <el-table-column prop="update_time" :label="$t('default.Update_Time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.update_user_name }}
                                {{ scope.row.update_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{scope.row.update_user_name }}
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





    </div>
</template>

<script>

export default {
    name: 'basetable',
    components: {
        
    },
    data() {
        return {
            query: {
                audit_status: 2,
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
            dialogName: '审核',
            pageTotal: 0,
            form: {
                name: ''
            },
            rules: {
                // quality_num: [
                //     { required: true, message: '请输入安全库存', trigger: 'blur' },
                //     { max: 11, message: '长度不能超过11个字符', trigger: 'blur' },
                //     { type: 'number', message: '安全库存必须为数字值' }
                // ],
            },

            idx: -1,
            id: -1,
            activeName: 'wait',

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
       
        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                name: '',
                pageIndex: 1,
                pageSize: 20,
                create_time:[],
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

        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
        },

        dataInitialization(mat_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.mat_code = mat_code;
            that.axios
                .get(
                    "/infor/materialSafeNumAudit/index?audit_status=2&mat_code=" + mat_code + '&token=' + token
                )
                .then(res => {


                    this.tableData = res.list.data;

                    this.pageTotal = res.list.total || 0;
                    this.cost_show = res.cost_show;


                })
                .catch(err => {
                    that.$notify.error({
                        title: "错误",
                        message: err
                    });
                    console.log(err);
                });
        },




    },
    // 在钩子函数中调用getData方法
    // created() {
    //     this.getData();
    // }
}
</script>



