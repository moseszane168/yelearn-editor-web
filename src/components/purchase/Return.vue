<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 退款单号： -->
                {{ $t('default.Refund_Order') }}：
                <el-input v-model="query.ret_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 部门 -->
                {{ $t('default.Department') }}：
                <el-select v-model="query.department_id" multiple filterable remote
                    :placeholder="$t('default.Please_enter_a_keyword')" class="w200">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <br />
                <br />
                <el-button type="primary" class="handle-del mr10" 
                         @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>

                <el-button type="primary" class="handle-del mr10" @click="Cancel"
                    v-if="permission.includes('Return:cancel')">{{ $t('default.Delete') }}</el-button><!-- 删除 -->
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="55" align="center">
                    <template v-slot="scope">
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                            v-if="permission.includes('Return:handleEdit')">{{ $t('default.Edit')
                            }}</el-button><!-- 编辑 -->
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center">

                </el-table-column>

                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>

                <el-table-column prop="ret_code" :label="$t('default.Refund_Order')">
                    <template v-slot="scope">

                        <el-button type="text" @click="handleReturn(scope.row.ret_code)"> {{ scope.row.ret_code }}
                        </el-button>

                    </template>
                </el-table-column>
                <!-- 采购单号 -->
                <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')">
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handlePurDetail(scope.row.pur_code)"> {{
                    scope.row.pur_code }}</el-button>
                    </template>
                </el-table-column>
                <!-- 退款总金额 -->
                <el-table-column v-if=cost_show prop="total_price"
                    :label="$t('default.Total_Refund_Amount')"></el-table-column>
                <!-- 货款 -->
                <el-table-column v-if=cost_show prop="good_price"
                    :label="$t('default.Payment_for_goods')"></el-table-column>
                <!-- 其他退款 -->
                <el-table-column v-if=cost_show prop="other_price"
                    :label="$t('default.Other_Refunds')"></el-table-column>
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

                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.create_user_name }}
                                {{ scope.row.create_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.create_user_name
                                    }}{{
                    scope.row.create_time }}</el-button>
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

        <!-- 退款退货 -->
        <el-dialog :title="$t('default.Refund_Returns')" :visible.sync="returnVisible" width="75%">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 退款总金额 -->
                <el-form-item v-if=cost_show :label="$t('default.Total_Refund_Amount')" prop="total_price">
                    <el-input v-model="form.total_price" :disabled="true"></el-input>
                </el-form-item>
                <!-- 货款 -->
                <el-form-item v-if=cost_show :label="$t('default.Payment_for_goods')" prop="good_price">
                    <el-input v-model="form.good_price" @blur="handleReturnGood"></el-input>
                </el-form-item>
                <!-- 其他退款 -->
                <el-form-item v-if=cost_show :label="$t('default.Other_Refunds')" prop="other_price">
                    <el-input v-model="form.other_price" @blur="handleReturnGood"></el-input>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <template>
                <el-table :data="orderData" style="width: 100%">
                    <!-- 序号 -->
                    <el-table-column prop="no" :label="$t('default.No')"></el-table-column>
                    <!-- 物料编码 -->
                    <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.model
                                        }}</el-button>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <!-- 退货数 -->
                    <el-table-column prop="return_num" :label="$t('default.Number_of_Returns')">
                        <template v-slot="scope">

                            <el-input v-model.number="scope.row.return_num" @blur="handleReturnGood"></el-input>

                        </template>
                    </el-table-column>
                    <!-- 成本价 -->
                    <el-table-column v-if=cost_show prop="cost" :label="$t('default.Purchase_Cost')"></el-table-column>

                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">
                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.desc"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </template>





            <span slot="footer" class="dialog-footer">
                <el-button @click="returnVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveReturn">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <!-- 采购单 -->
        <purchase-detail ref="purchaseDetail" :visible.sync="purchaseVisible" :data="current" @done="reload"
            @refreshParent="refreshPage">
        </purchase-detail>
        <!-- 退款单 -->
        <el-dialog :visible.sync="ReturnDetailVisible" append-to-body width="90%" :title="$t('default.Refund_Order')">
            <return-detail ref="returneDetail"></return-detail>
        </el-dialog>

        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">
            <seledetail ref="seledetail"></seledetail>
        </el-dialog>

    </div>
</template>

<script>


import ReturnDetail from '../purchase/ReturnDetail.vue';
import PurchaseDetail from '../purchase/PurchaseDetail.vue';
import Seledetail from '../base/SelectOne.vue';

export default {
    name: 'basetable',
    components: {
        ReturnDetail,
        PurchaseDetail,
        Seledetail,
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

            ReturnDetailVisible: false,
            returnVisible: false,
            current: {},
            pageTotal: 0,
            form: {
                username: ''
            },
            rules: {

            },
            detailData: [],
            orderData: [],
            loading: false,
            idx: -1,
            id: -1,
            cost_show: false,
            purchaseVisible: false,
            tax_deduction_options: [],
            cbiztype_options: [],
            options: [],
            department_options: [],
            SelectOneVisible: false,
        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            // console.log(localStorage.getItem("token"));
            this.query.token = localStorage.getItem("token");
            // return;
            this.axios.get('/pur/PurchaseReturn/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.cost_show = res.cost_show;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;

            }).catch(() => {
                this.loading = false;
            })
        },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        refreshPage() {
            // 这里实现页面的更新逻辑
            // console.log('父页面刷新');
            this.getData();
        },
        handleReturn(ret_code) {
            this.ReturnDetailVisible = true;

            this.$nextTick(() => {
                this.$refs.returneDetail.dataInitialization(ret_code);
            })
        },
        handlePurDetail(pur_code) {
            this.purchaseVisible = true;
            this.$nextTick(() => {
                this.$refs.purchaseDetail.dataInitialization(pur_code);
            })
        },
        handleReturnGood() {
            this.axios.post('/pur/PurchaseReturn/handleReturn', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,
            }).then((res) => {
                this.form = res.info;
                this.orderData = res.orderData;
            }).catch(() => {
                this.loading = false;
            })
        },
        remoteSupply(query) {
            if (query !== '') {
                this.axios.post('/infor/supply/getSupply', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },
        // 修改发票
        saveReturn() {
            this.axios.post('/pur/PurchaseReturn/update', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,
            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.returnVisible = false;
                // this.orderData = res.orderData;
                // this.form.department_id = this.multipleSelection[0].department_id;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 联查
        handleSelectOne() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length == 1) {
                let pur_code = '';
                for (let i = 0; i < length; i++) {
                    pur_code = this.multipleSelection[i].pur_code;
                }
                this.SelectOneVisible = true;
                let nextdata = {
                    pur_code: pur_code
                };
                this.$nextTick(() => {
                    this.$refs.seledetail.dataInitialization(nextdata);
                })
            } else if (length > 1) {
                // 只能选中一项
                this.$message.error(this.$t('default.Only_one_item_can_be_selected'));
            } else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
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

        ShowCost() {
            this.axios.post('/index/user/ShowCost', {
                token: localStorage.getItem("token"),
                // params: data_form
            }).then((res) => {
                console.log(res);
                // 弹出成功提示框

                this.show_cost = res;

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
        // 编辑
        handleEdit(index, row) {
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // this.orderData = this.form.children;
            // 设置弹出编辑框标记为true
            this.axios.post('/pur/PurchaseReturn/Detail', {
                token: localStorage.getItem("token"),
                ret_code: this.form.ret_code,
                params: this.form,

                // Selection: this.multipleSelection

            }).then((res) => {
                // // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                // this.editVisible = false;
                // this.getData();
                // this.multipleSelection = [];
                this.orderData = res.list;
                console.log(this.orderData);
                console.log(res);
                this.returnVisible = true;

            }).catch(() => {
                this.loading = false;
            })

        },
        // 删除
        Cancel() {
            const length = this.multipleSelection.length;
            if (length) {
                let ret_code_arr = [];
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    ret_code_arr.push(this.multipleSelection[i].ret_code);
                }
                this.axios.post('/pur/PurchaseReturn/Delete', {
                    token: localStorage.getItem("token"),
                    ret_code_arr: ret_code_arr,

                    Selection: this.multipleSelection

                }).then((res) => {
                    // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                    this.editVisible = false;
                    this.getData();
                    this.multipleSelection = [];

                }).catch(() => {
                    this.loading = false;
                })

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
        // 获取币种
        getCurrtype() {
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Currtype/getCurrtype', {
                token: token
            }).then((res) => {
                this.currtype_option = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 保存编辑
        saveEdit() {
            if (typeof (this.form.id) == 'undefined') {

                this.axios.post('/pur/Project/save', {

                    token: localStorage.getItem("token"),
                    params: this.form
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
                this.axios.post('/pur/Project/update', {
                    token: localStorage.getItem("token"),
                    params: this.form
                }).then((res) => {

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
        this.ShowCost();

        this.getDepartment();

    }
}
</script>
