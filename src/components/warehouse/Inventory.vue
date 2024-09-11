<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 物料编码 -->
                {{ $t('default.Material_Code') }}:
                <el-select v-model="query.mat_code" multiple filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMaterial"
                    :loading="loading">
                    <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                        :value="item.mat_code">
                        <span style="float: left">{{ item.mat_code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.label }}</span>
                    </el-option>
                </el-select>
                <!--部门-->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    :placeholder="$t('default.Please_enter_a_keyword')" @change="getWare()">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 仓库 -->
                {{ $t('default.Warehouse') }}
                ：<el-select filterable v-model="query.ware_id" multiple :placeholder="$t('default.Please_select')">
                    <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name"
                        :value="item.ware_id">
                    </el-option>
                </el-select>
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>

                <br />
                <br />

                <el-button type="primary" class="handle-del mr10" @click="handleExport">{{ $t('default.Export')
                    }}</el-button><!-- 导出 -->
                <el-button type="primary" class="handle-del mr10" @click="handleBigExport">导出大数据</el-button>

            </div>


            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" show-summary max-height="600px"
                :summary-method="getSummaries">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>
                <!-- 仓库 -->
                <el-table-column prop="ware_name" :label="$t('default.Warehouse')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.ware_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ware_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="105" sortable>
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 型号 -->
                <el-table-column prop="model" :label="$t('default.Model')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.model }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.model }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 规格 -->
                <el-table-column prop="specifications" :label="$t('default.Specification')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.specifications }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>





                <el-table-column prop="real_num" label="实际库存" width="105" sortable></el-table-column>
                <!-- 可用 -->
<!--                <el-table-column prop="available_num" :label="$t('default.Available')" width="75" sortable>-->
<!--                    <template v-slot="scope">-->
<!--                        <div v-if="scope.row.safe_show == 'success'">-->
<!--                            <el-button type="success" size="mini" disabled>{{ scope.row.available_num }}</el-button>-->
<!--                        </div>-->
<!--                        <div v-if="scope.row.safe_show == 'warning'">-->
<!--                            <el-button type="warning" size="mini" disabled>{{ scope.row.available_num }}</el-button>-->
<!--                        </div>-->
<!--                        <div v-if="scope.row.safe_show == 'danger'">-->
<!--                            <el-button type="danger" size="mini" disabled>{{ scope.row.available_num }}</el-button>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
               <!-- 在途 -->
                <el-table-column prop="transit_num" :label="$t('default.In_Transit')" width="75"
                    sortable></el-table-column>
                <el-table-column prop="freeze_num" label="冻结" width="75" sortable></el-table-column>
                <el-table-column prop="quality_day" label="保质期"></el-table-column>
                <!-- 库位 -->
                <el-table-column prop="location_name" :label="$t('default.Location')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.location_name_str }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.location_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="manufacture_time" label="生产日期">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.manufacture_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.manufacture_time
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="manufacture_day" label="入库天数" width="105" sortable></el-table-column>
                <el-table-column prop="Expiration_warning_show" label="过期预警" width="105" sortable>
                    <template v-slot="scope">

                        <div v-if="scope.row.Expiration_warning_show == 'success'">
                            <el-button type="success" size="mini" disabled>正常</el-button>
                        </div>
                        <div v-if="scope.row.Expiration_warning_show == 'warning'">
                            <el-button type="warning" size="mini" disabled>警告</el-button>
                        </div>
                        <div v-if="scope.row.Expiration_warning_show == 'danger'">
                            <el-button type="danger" size="mini" disabled>过期</el-button>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column prop="Detention_show" label="滞留预警" width="105" sortable>
                    <template v-slot="scope">

                        <div v-if="scope.row.Detention_show == 'success'">
                            <el-button type="success" size="mini" disabled>正常</el-button>
                        </div>
                        <div v-if="scope.row.Detention_show == 'warning'">
                            <el-button type="warning" size="mini" disabled>警告</el-button>
                        </div>
                        <div v-if="scope.row.Detention_show == 'danger'">
                            <el-button type="danger" size="mini" disabled>危险</el-button>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column prop="department_name" label="部门" width="100">
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


            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
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

                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            orderVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},

            rules: {

                real_num: [
                    { required: true, message: '请输入实购数', trigger: 'blur' },

                    { type: 'number', message: '实购数必须为数字值' }
                ],

            },

            value: [],
            list: [],
            loading: false,

            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            department_options: [],
            query_ware_options: [],
            mat_options: [],



        };
    },
    // computed: {
    //     sum() {
    //         return this.number1 + this.number2;
    //     }
    // },
    mounted() {
        this.list = this.states.map(item => {
            return { value: `${item}`, label: `${item}` };
        });
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/ware/Inventory/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

        },
        // 获取仓库
        getWare() {
            this.axios.post('/ware/warehouse/warelist_data', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                this.query_ware_options = res;
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

        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    // 合计
                    sums[index] = this.$t('default.total');
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    if (index == 7) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    }

                    // sums[index] += ' 元';
                } else {
                    // sums[index] = 'N/A';
                }
            });

            return sums;
        },
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
                this.options = [];
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
            //选中数据的集合赋给 this.mutipleSelection
            this.multipleSelection = val;
        },
        // 获取部门
        getDepartment() {
            var token = localStorage.getItem("token");
            this.axios.post('/index/Department/department_data', {
                token: token
            }).then((res) => {
                this.department_options = res;
            }).catch(() => {
                this.loading = false;
            })
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
        // 列表导出
        handleExport() {
            this.query.token = localStorage.getItem("token");
            this.axios.post('/ware/Inventory/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },
        handleBigExport() {
            this.query.token = localStorage.getItem("token");
            this.axios.post('/ware/Inventory/handleBigExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },



    },
    // 在钩子函数中调用getData方法
    created() {

        this.getData();
        this.getDepartment();
        this.getWare();


    }
}
</script>
