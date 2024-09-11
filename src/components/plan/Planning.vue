<template>
    <!-- 基础表格组件 -->
    <div>
        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 物料编码 -->
                {{ $t('default.Material_Code') }}：
                <el-select v-model="query.mat_code" multiple filterable class="w150" remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMaterial"
                    :loading="loading">
                    <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                        :value="item.mat_code">
                        <span style="float: left">{{ item.mat_code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                    </el-option>
                </el-select>
                <!-- 需求单号： -->
                {{ $t('default.Demand_Order_Number') }}：
                <el-input v-model="query.apm_code" :placeholder="$t('default.Please_enter_a_keyword')"  class="handle-input mr10 w150"></el-input>

                <!-- 分类 -->
                {{ $t('default.Category') }}：<el-select multiple v-model="query.c_id" class="w150" clearable filterable
                    remote reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')">
                    <el-option v-for="item in category_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')" class="w200">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
            </div>

            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 待采购需求 -->
                    <el-tab-pane :label="$t('default.Pending_Purchase_Requirement')" name="wait_apply">
                        <!-- 下单 -->
                        <el-button type="primary" class="handle-del mr10" @click="handleApplyCreateOrder"
                            v-if="permission.includes('Planning:handleadd')">{{ $t('default.Order_placed')
                            }}</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="downloadFile(download_file)">
                          含税单价模板
                        </el-button><!-- 下载导入模板 -->
                        <el-button type="primary" class="handle-del mr10" @click="downloadFilePrice(download_file_price)">
                          单价模版
                        </el-button><!-- 下载导入模板 -->
                        <el-button type="primary" class="handle-del mr10"
                            v-if="permission.includes('Apply:handleExport')" @click="handleExport">
                          {{ $t('default.Export_Details') }}
                        </el-button>
                        <!-- 导出明细 -->
                        <el-table :data="tableData" border class="table" ref="multipleTable"
                            header-cell-class-name="table-header" @selection-change="handleSelectionChange"
                            max-height="550px">

                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <!-- 序号 -->
                            <el-table-column prop="no" :label="$t('default.No')" width="55"
                                align="center"></el-table-column>

                            <!-- 需求单号 -->
                            <el-table-column prop="apm_code" :label="$t('default.Demand_Order_Number')">
                                <template v-slot="scope">
                                    <el-button type="text" class="handle-del mr10"
                                        @click="handleApply(scope.row.apm_code)"> {{ scope.row.apm_code }}</el-button>
                                </template>
                            </el-table-column>

                            <!-- 状态 -->
                            <el-table-column prop="status_name" :label="$t('default.Status')">
                                <template v-slot="scope">
                                    {{ scope.row.status_name }}
                                    <br />
                                    {{ scope.row.order_status_name }}

                                </template>
                            </el-table-column>
                            <!-- 分类 -->
                            <el-table-column prop="all_category_name" :label="$t('default.Category')">
                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.all_category_name }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.all_category_name }}</el-button>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                            <!-- 部门 -->
                            <el-table-column prop="department_name" :label="$t('default.Department')">
                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.department_name }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.department_name }}</el-button>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                            <!-- 预警 -->
                            <el-table-column prop="warning" :label="$t('default.Warning')">
                                <template v-slot="scope">
                                    <div v-if="scope.row.warning == 'success'">
                                        <!-- 正常 -->
                                        <el-tag type="success">{{ $t('default.Normal') }}</el-tag>

                                    </div>
                                    <div v-if="scope.row.warning == 'warning'">
                                        <!-- 警告 -->
                                        <el-tag type="warning">{{ $t('default.Warning') }}</el-tag>
                                    </div>
                                    <div v-if="scope.row.warning == 'danger'">
                                        <!-- 危险 -->
                                        <el-tag type="danger">{{ $t('default.Dangerous') }}</el-tag>
                                    </div>

                                </template>
                            </el-table-column>
                            <!-- 备注 -->
                            <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
                            <!-- 创建时间 -->
                            <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.create_user_name }}
                                            {{ scope.row.create_time }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.create_user_name }}{{
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
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.update_user_name }}
                                                {{ scope.row.update_time }}</el-button>

                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                        </el-table>
                    </el-tab-pane>

                </el-tabs>
            </div>

            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>

        <!-- 下单 -->
        <el-dialog :title="$t('default.Order_placed')" :visible.sync="orderVisible" width="100%" :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="order_rules" :model="form" size="mini" label-width="80px">
                <!-- 供应商 -->
                <el-form-item :label="$t('default.Supplier')" prop="sup_code">
                    <el-select v-model="form.sup_code" filterable remote reserve-keyword
                        :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteSupply"
                        :loading="loading" @change="sup_change()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 币种 -->
                <el-form-item :label="$t('default.Currency')">
                    <el-select v-model="form.currtypecode" filterable :placeholder="$t('default.Please_select')"
                        @change="$forceUpdate()" class="w150" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in currtype_option" :key="item.currtypecode" :label="item.currtypename"
                            :value="item.currtypecode">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- 业务流程 -->
                <el-form-item :label="$t('default.Business_Process')" prop="cbiztype">
                    <el-select v-model="form.cbiztype" class="w150" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in cbiztype_options" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')" prop="department_id" >
                    <el-select v-model="form.department_id" @change="department_change()" class="w150" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 需求交期 -->
                <el-form-item :label="$t('default.Requirement_Lead_Time')" prop="delivery_time">

                    <el-date-picker v-model="form.delivery_time" type="date" :placeholder="$t('default.Select_Date')"
                        style="width: 150px;" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <!-- 整单项目 -->
                <el-form-item :label="$t('default.Whole_Order_Item')"  prop="pro_code">
                    <el-select filterable v-model="form.pro_code" :placeholder="$t('default.Please_select')"
                        @change="project_change()" class="w150" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- 扣税类别 -->
                <el-form-item :label="$t('default.Tax_Deduction_Category')" prop="tax_deduction">
                    <el-select v-model="form.tax_deduction" :placeholder="$t('default.Please_select')" class="w150"
                        @change="handleTaxDeduction()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in tax_deduction_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 整单税率 -->
                <el-form-item :label="$t('default.Tax_Rate')" prop="tax_rate">
                    <el-input v-model="form.tax_rate" @blur="handleTaxRate()" class="w150"></el-input>
                </el-form-item>

                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>

            </el-form>

            <el-upload style="float: left;margin-right: 5px;" :on-success="handleSuccess" class="upload-demo"
                :action="Planning_url">
                <el-button type="primary">上传含税单价模板</el-button><!-- 点击上传 -->
            </el-upload>
            <el-upload style="float: left;margin-right: 5px;padding-left:25px; " :on-success="handleSuccess" class="upload-demo"
                       :action="Planning_price_url">
              <el-button type="primary">上传单价模板</el-button><!-- 点击上传 -->
            </el-upload>
            <template>
                <el-table :data="orderData" style="width: 100%" @selection-change="handleOrderSelectionChange" border
                    class="table" ref="multipleTable" header-cell-class-name="table-header" show-summary
                    :summary-method="getSummaries" max-height="550px">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <!-- 序号 -->
                    <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>
                    <!-- 部门 -->
                    <el-table-column :label="$t('default.Department')">
                        <template v-slot="scope">
                            <el-select v-model="scope.row.department_id" transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <!-- 需求号 -->
                    <el-table-column prop="ap_code" :label="$t('default.Demand_Number')">
                        <template v-slot="scope">
                            <el-button v-if="scope.row.moap_code == 1" type="text" style="color: rgb(39, 36, 36);">
                              {{ scope.row.ap_code }}
                            </el-button>
                            <el-input v-if="scope.row.moap_code == 2" v-model.number="scope.row.ap_code"
                                @blur="handleOrderChageRowRealNum(scope.$index, scope.row)">
                            </el-input>
                        </template>
                    </el-table-column>
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications }}</el-button>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column prop="plan_num" label="建议数"></el-table-column>
                    <!-- 实购数 -->
                    <el-table-column prop="real_num" :label="$t('default.Purchase_Number')">
                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.real_num"
                                @blur="handleOrderChageRowRealNum(scope.$index, scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 项目 -->
                    <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">
                        <template v-slot="scope">
                            <el-select filterable v-model="scope.row.pro_code"
                                :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <!--当前单价  -->
                    <el-table-column prop="old_cost" :label="$t('default.Current_unit_price')">
                        <template v-slot="scope">
                            <el-button type="text" style="color: rgb(39, 36, 36);">
                              {{ scope.row.old_cost }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- 税率 -->
                    <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.tax_rate"
                                @blur="handleOrderChageRowTaxRate(scope.$index, scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 含税单价 -->
                    <el-table-column prop="tax_cost" :label="$t('default.Including_tax_unit_price')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.tax_cost"
                                @blur="handleOrderChageRowTaxCost(scope.$index, scope.row)"></el-input>
                        </template>
                    </el-table-column>

                    <!-- 单价 -->
                    <el-table-column prop="cost" :label="$t('default.Unit_Price')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.cost"
                                @blur="handleOrderChageRowCost(scope.$index, scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 金额 -->
                    <el-table-column prop="money" :label="$t('default.Amount')">
                        <template v-slot="scope">
                            <el-button type="text" style="color: rgb(39, 36, 36);">
                              {{ scope.row.money }}
                            </el-button>
                        </template>
                    </el-table-column>

                    <!-- 税额 -->
                    <el-table-column prop="tax_money" :label="$t('default.Tax_amount')">
                        <template v-slot="scope">
                            <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.tax_money }}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 价税合计 -->
                    <el-table-column prop="total_money" :label="$t('default.Total_price_and_tax')">
                        <template v-slot="scope">
                            <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.total_money }}</el-button>
                        </template>
                    </el-table-column>

                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.desc"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <span slot="footer" class="dialog-footer">
                <el-button @click="orderVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveOrder">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>

            <span v-if="error" style="color: red;font-size: 16px;">{{ error }}</span>
        </el-dialog>

        <el-drawer :visible.sync="applyVisible" append-to-body size="40%" title="需求单" :direction="direction">
            <apply ref="apply"></apply>
        </el-drawer>

    </div>
</template>
<style>
.el-upload-list__item-name{
  display: none;
}
</style>
<script>
import axios from 'axios';
import Apply from '../plan/PlannningDetail.vue';

export default {
    name: 'basetable',
    components: {
        Apply,


    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
              }
            },
            query: {
                token: '',
                order_status: 1,
                // name: '',
                pageIndex: 1,
                pageSize: 20
            },
            direction: 'rtl',
            tableData: [],
            orderData: [],
            multipleSelection: [],
            multipleOrderSelection: [],
            delList: [],
            editVisible: false,
            applyVisible: false,
            orderVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            tax_deduction_type:1,
            form: {
                cbiztype: 'MCCG',
                tax_deduction: '1',
            },

            rules: {

                real_num: [
                    { required: true, message: '请输入实购数', trigger: 'blur' },
                    // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                    { type: 'number', message: '实购数必须为数字值' }
                ],



            },
            order_rules: {
                sup_code: [
                    { required: true, message: '请输入供应商', trigger: 'blur' },

                ],
                tax_deduction: [
                    { required: true, message: '请输入整单扣税类别', trigger: 'blur' },
                ],
                department_id: [
                    { required: true, message: '请输入部门', trigger: 'blur' },
                ],

                tax_rate: [
                    { required: true, message: '请输入整单税率', trigger: 'blur' },
                ],
                cbiztype: [
                    { required: true, message: '请输入业务流程', trigger: 'blur' },
                ],
                delivery_time: [
                    { required: true, message: '请输入需求交期', trigger: 'blur' },
                ],
                pro_code: [
                  { required: true, message: '请输入整单项目', trigger: 'blur' },
                ],

            },
            cost_show: false,
            options: [],
            pur_user_options: [],
            department_options: [],
            category_options: [],
            project_options: [],
            tax_deduction_options: [{
                value: 0,
                label: '应税内含'
            }, {
                value: 1,
                label: '应税外加'
            }, {
                value: 2,
                label: '不计税'
            }],
            value: [],
            list: [],
            loading: false,

            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            available_num: '',
            transit_num: '',
            mat_name: '',
            show_type: true,
            audit_type: 1,
            dialogAudit: '',
            auditVisible: false,
            activeName: 'wait_apply',
            currtype_option: [],
            error: '',
            cbiztype_options: [],
            Planning_url: '',
            Planning_price_url: '',
            download_file: '',
            download_file_price: '',
            number1: 0,
            number2: 0,
            mat_options: [],


        };
    },
    mounted() {
        this.list = this.states.map(item => {
            return { value: `${item}`, label: `${item}` };
        });
    },

    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {


            this.query.token = localStorage.getItem("token");
            this.query.status = '';

            this.axios.get('/plan/Planning/index', {

                params: this.query
            }).then((res) => {


                this.tableData = res.list.data;
                // this.cbiztype_options = res.cbiztype_options;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
                this.cost_show = res.cost_show;
                // this.download_file = res.download_file;

            }).catch(() => {
                this.loading = false;
            })

        },
        // 列表导出
        handleExport() {
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let apm_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    apm_code_arr.push(this.multipleSelection[i].apm_code);
                }
                this.query.apm_code = apm_code_arr;

            }


            this.axios.post('/plan/Planning/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },
        getListData() {
            this.query.token = localStorage.getItem("token");
            this.query.status = 9;
            this.axios.get('/plan/PlanApply/planning', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.download_file_price = res.download_file_price;
                this.cost_show = res.cost_show
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })
        },
        //设置菜单权限
        handleApply(apm_code) {
            this.applyVisible = true;
            this.$nextTick(() => {
                this.$refs.apply.dataInitialization(apm_code);

            })
        },
        getCbiztypeArr() {
            this.axios.get('/pur/Cbiztype/getCbiztypeArr', {
                params: this.query
            }).then((res) => {
                this.cbiztype_options = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })
        },
        handleOrderSelectionChange(val) {
            this.multipleOrderSelection = val;
        },
        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                pageIndex: 1,
                pageSize: 20
            }
        },
        change() {
            this.$forceUpdate();
        },
        department_change() {
            // 获取采购员,部门，

            this.orderData.forEach((e, i) => {

                if (this.orderData[i].department_id) {

                } else {
                    this.$set(this.orderData[i], 'department_id', this.form.department_id);
                }



            });
        },
        project_change() {
            // 获取采购员,部门，

            // this.orderData = res;
            this.orderData.forEach((e, i) => {

                this.$set(this.orderData[i], 'pro_code', this.form.pro_code);

            });

        },
        handleSuccess(file, fileList, row) {
            // console.log(file);

            if (file.code == 201) {
                this.$message.error(file.msg);
            } else {
                this.orderData = file.data.data;
                this.$message.success(file.msg);
                this.error = file.data.error;
            }


        },
        // 获取物料
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
                this.mat_options = [];
            }
        },

        sup_change() {
            // 获取采购员,部门，
            this.axios.post('/infor/supply/getSupplyInfo', {
                token: localStorage.getItem("token"),
                params: this.form,
            }).then((res) => {
                this.form.currtypecode = res.currtypecode;
                this.$forceUpdate();
            }).catch(() => {
                this.loading = false;
            })

        },
        handleTaxRate() {
            console.log(this.form.tax_deduction);


            this.orderData.forEach((row_d, i) => {


                this.$set(this.orderData[i], 'tax_rate', this.form.tax_rate);

                // console.log(this.form.tax_deduction);

                // var row_d = e;
                console.log(row_d.cost);

                switch (this.form.tax_deduction) {
                    case 0:
                        row_d.cost = row_d.tax_cost * (100 - row_d.tax_rate) / 100;
                        row_d.money = row_d.cost * row_d.real_num;
                        row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                        row_d.total_money = row_d.tax_cost * row_d.real_num;
                        break;
                    case 1:
                        row_d.cost = row_d.tax_cost / (100 + row_d.tax_rate * 1) * 100;
                        row_d.money = row_d.cost * row_d.real_num;
                        row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                        row_d.total_money = row_d.tax_cost * row_d.real_num;
                        break;
                    case 2:
                        row_d.cost = row_d.tax_cost;
                        row_d.money = row_d.cost * row_d.real_num;
                        row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                        row_d.total_money = row_d.tax_cost * row_d.real_num;
                        break;


                }

                row_d.cost = Math.floor((row_d.cost).toFixed(6) * 1000000) / 1000000;
                row_d.money = Math.floor((row_d.money).toFixed(6) * 1000000) / 1000000;
                row_d.tax_money = Math.floor((row_d.tax_money).toFixed(6) * 1000000) / 1000000;
                row_d.total_money = Math.floor((row_d.total_money).toFixed(6) * 1000000) / 1000000;


                console.log(row_d.cost);

                this.$set(this.orderData[i], 'cost', row_d.cost);
                this.$set(this.orderData[i], 'money', row_d.money);
                this.$set(this.orderData[i], 'tax_money', row_d.tax_money);
                this.$set(this.orderData[i], 'total_money', row_d.total_money);

            });

        },

        handleTaxDeduction() {
            this.Planning_price_url = axios.defaults.baseURL + '/com/ExcelIn/PlanningPrice?type='+this.form.tax_deduction;
            console.log(this.Planning_price_url)
            this.tax_deduction_type = this.form.tax_deduction;
            this.orderData.forEach((row_d, i) => {

                switch (this.form.tax_deduction) {
                    case 0:
                      console.log('应税内含');
                        row_d.cost = row_d.tax_cost * (100 - row_d.tax_rate) / 100;
                        row_d.money = row_d.cost * row_d.real_num
                        row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                        row_d.total_money = row_d.tax_cost * row_d.real_num;
                        break;
                    case 1:
                      console.log('应税外加');
                        row_d.cost = row_d.tax_cost / (100 + row_d.tax_rate * 1) * 100;
                        row_d.money = row_d.cost * row_d.real_num;
                        row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                        row_d.total_money = row_d.tax_cost * row_d.real_num;
                        break;
                    case 2:
                        row_d.cost = row_d.tax_cost;
                        row_d.money = row_d.cost * row_d.real_num;
                        row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                        row_d.total_money = row_d.tax_cost * row_d.real_num;
                        break;
                }
                if (this.form.tax_deduction == 2){
                  row_d.cost = Math.floor((row_d.cost) * 1000000) / 1000000;
                  row_d.money = Math.floor((row_d.money) * 1000000) / 1000000;
                  row_d.tax_money = Math.floor((row_d.tax_money) * 1000000) / 1000000;
                  row_d.total_money = Math.floor((row_d.total_money) * 1000000) / 1000000;
                }else{
                  row_d.cost = Math.floor((row_d.cost).toFixed(6) * 1000000) / 1000000;
                  row_d.money = Math.floor((row_d.money).toFixed(6) * 1000000) / 1000000;
                  row_d.tax_money = Math.floor((row_d.tax_money).toFixed(6) * 1000000) / 1000000;
                  row_d.total_money = Math.floor((row_d.total_money).toFixed(6) * 1000000) / 1000000;
                }

                this.$set(this.orderData[i], 'cost', row_d.cost);
                this.$set(this.orderData[i], 'money', row_d.money);
                this.$set(this.orderData[i], 'tax_money', row_d.tax_money);
                this.$set(this.orderData[i], 'total_money', row_d.total_money);

            });

        },



        handleOrderChageRowRealNum(index, row) {

            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            var row_d = JSON.parse(JSON.stringify(row));


            row_d.money = row_d.cost * row_d.real_num;

            row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;

            row_d.total_money = row_d.tax_cost * row_d.real_num;


            row_d.money = Math.floor(row_d.money * 1000000) / 1000000;
            row_d.tax_money = Math.floor(row_d.tax_money * 1000000) / 1000000;
            row_d.total_money = Math.floor(row_d.total_money * 1000000) / 1000000;

            this.$set(this.orderData[index], 'money', row_d.money);
            this.$set(this.orderData[index], 'tax_money', row_d.total_money);
            this.$set(this.orderData[index], 'total_money', row_d.total_money);



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

                    switch (index) {
                        case 8:
                        case 9:

                        case 15:
                        case 16:
                        case 17:
                            let total = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = Math.floor(total * 1000000) / 1000000;


                            break;


                        default: '';
                    }

                } else {

                }
            });

            return sums;
        },

        handleOrderChageRowTaxCost(index, row) {
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form

            var row_d = JSON.parse(JSON.stringify(row));

            switch (this.form.tax_deduction) {
                case 0:
                    row_d.cost = row_d.tax_cost * (100 - row_d.tax_rate) / 100;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;
                case 1:
                    row_d.cost = row_d.tax_cost / (100 + row_d.tax_rate * 1) * 100;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;
                case 2:
                    row_d.cost = row_d.tax_cost;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;


            }
            row_d.cost = Math.floor((row_d.cost).toFixed(6) * 1000000) / 1000000;
            row_d.money = Math.floor((row_d.money).toFixed(6) * 1000000) / 1000000;
            row_d.tax_money = Math.floor((row_d.tax_money).toFixed(6) * 1000000) / 1000000;
            row_d.total_money = Math.floor((row_d.total_money).toFixed(6) * 1000000) / 1000000;

            this.$set(this.orderData[index], 'cost', row_d.cost);
            this.$set(this.orderData[index], 'money', row_d.money);
            this.$set(this.orderData[index], 'tax_money', row_d.tax_money);
            this.$set(this.orderData[index], 'total_money', row_d.total_money);


        },

        handleOrderChageRowCost(index, row) {
            var row_d = JSON.parse(JSON.stringify(row));

            switch (this.form.tax_deduction) {
                case 0:

                    // 98
                    row_d.tax_cost = row_d.cost / (100 - row_d.tax_rate) * 100;

                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;


                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;
                case 1:
                    row_d.tax_cost = row_d.cost * (100 + row_d.tax_rate * 1) / 100;
                    // row_d.cost = row_d.tax_cost / (100 + row_d.tax_rate * 1) * 100;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;
                case 2:
                    row_d.tax_cost = row_d.cost;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;


            }
            row_d.tax_cost = Math.floor(row_d.tax_cost * 1000000) / 1000000;
            row_d.money = Math.floor(row_d.money * 1000000) / 1000000;
            row_d.tax_money = Math.floor(row_d.tax_money * 1000000) / 1000000;
            row_d.total_money = Math.floor(row_d.total_money * 1000000) / 1000000;


            this.$set(this.orderData[index], 'tax_cost', row_d.tax_cost);
            this.$set(this.orderData[index], 'money', row_d.money);
            this.$set(this.orderData[index], 'tax_money', row_d.tax_money);
            this.$set(this.orderData[index], 'total_money', row_d.total_money);


        },

        // 税率
        handleOrderChageRowTaxRate(index, row) {
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form

            var row_d = JSON.parse(JSON.stringify(row));

            switch (this.form.tax_deduction) {
                case 0:
                    row_d.cost = row_d.tax_cost * (100 - row_d.tax_rate) / 100;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;
                case 1:
                    row_d.cost = row_d.tax_cost / (100 + row_d.tax_rate * 1) * 100;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;
                case 2:
                    row_d.cost = row_d.tax_cost;
                    row_d.money = row_d.cost * row_d.real_num;
                    row_d.tax_money = (row_d.tax_cost - row_d.cost) * row_d.real_num;
                    row_d.total_money = row_d.tax_cost * row_d.real_num;
                    break;


            }
            row_d.cost = Math.floor((row_d.cost).toFixed(6) * 1000000) / 1000000;
            row_d.money = Math.floor((row_d.money).toFixed(6) * 1000000) / 1000000;
            row_d.tax_money = Math.floor((row_d.tax_money).toFixed(6) * 1000000) / 1000000;
            row_d.total_money = Math.floor((row_d.total_money).toFixed(6) * 1000000) / 1000000;


            this.$set(this.orderData[index], 'cost', row_d.cost);
            this.$set(this.orderData[index], 'money', row_d.money);
            this.$set(this.orderData[index], 'tax_money', row_d.tax_money);
            this.$set(this.orderData[index], 'total_money', row_d.total_money);


        },
        // 获取项目
        getProject() {
            // 获取采购员,部门，
            this.axios.post('/pur/Project/getProject', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.project_options = res;
            }).catch(() => {
                this.loading = false;
            })
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
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        // 获取分类
        getCategory() {
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Category/all_category', {
                token: token
            }).then((res) => {
                this.category_options = res;
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

        // 新增
        handleadd() {
            this.orderData = [];
            this.multipleOrderSelection = [];
            this.form = {};

            const length = this.multipleSelection.length;
            this.error = '';

            let id_arr = [];

            for (let i = 0; i < length; i++) {
                id_arr.push(this.multipleSelection[i].id);
            }

            this.axios.post('/plan/Planning/create', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
                id_arr: id_arr,
                selection: this.multipleSelection
            }).then((res) => {
                this.form = res.info;
                this.error = res.error;
                this.orderData = res.orderData;

            }).catch(() => {
                this.loading = false;
            })





            this.orderVisible = true;




        },
        handleApplyCreateOrder() {
            this.orderData = [];
            this.form = {};

            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            // if (length) {
            let apm_code_arr = [];
            // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
            // this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                apm_code_arr.push(this.multipleSelection[i].apm_code);
            }

            this.axios.post('/plan/Planning/applyCreateOrder', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
                apm_code_arr: apm_code_arr,
                // selection: this.multipleSelection
            }).then((res) => {
                this.orderData = res.orderData;
                this.form = res.info;
                this.error = res.error;
            }).catch(() => {
                this.loading = false;
            })

            this.orderVisible = true;

        },
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
        downloadFilePrice(fileUrl) {
          window.open(fileUrl);
        },
        // 搜索,触发搜索按钮
        handleSearch() {
            // 为this.query新增属性，并更新视图
            this.$set(this.query, 'pageIndex', 1);
            // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值

            this.getListData();

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
            this.show_type = false;
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
        handleCanner(index, row) {
            // 二次确认删除
            // this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
            //     // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
            //     type: 'warning'
            // })
            //     .then(() => {
            this.axios.post('/infor/supply/delete', {
                token: localStorage.getItem("token"),
                params: row
            }).then((res) => {
                this.$message.success('设置不采购');
                this.editVisible = false;
                this.getListData();
            }).catch(() => {
                this.loading = false;
            })
            // })
            // .catch(() => { })
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
        },
        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            // if (tab._props.label == '待采购需求') {

            this.getListData();

        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            // if (tab._props.label == '待采购需求') {

            this.getListData();

        },
        //删除行
        handleDeleteLine(index) {
            this.orderData.splice(index, 1)
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


        saveOrder() {

            // 创建一个新的Date对象
            const dateObj = new Date(this.form.delivery_time);

            // 获取年、月、日等信息
            const year = dateObj.getFullYear(); // 年份
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份（注意月份从0开始计算）
            const day = dateObj.getDate().toString().padStart(2, '0'); // 天数

            this.form.estimated_delivery_time = `${year}-${month}-${day}`;


            // if (this.activeName == 'wait_apply') {
            this.getListData();
            // } else if (this.activeName == 'wait') {
            //     this.getData();
            // }

            this.axios.post('/pur/Purchase/create', {
                token: localStorage.getItem("token"),
                // id_arr: id_arr,
                params: this.form,
                orderData: this.multipleOrderSelection

            }).then((res) => {
                this.multipleSelection = [];
                this.multipleOrderSelection = [];

                this.$message.success(res);
                this.orderVisible = false;
                this.getListData();


            }).catch(() => {
                this.loading = false;
            })

        },


        handleClick(tab, event) {


            this.getListData();


        }
    },
    // 在钩子函数中调用getData方法
    created() {
        this.getListData();
        this.getProject();
        this.getDepartment();
        this.getCategory();
        this.getCurrtype();
        this.permission = JSON.parse(this.permission);
        this.getCbiztypeArr();
        this.Planning_url = axios.defaults.baseURL + '/com/ExcelIn/Planning';
        this.Planning_price_url = axios.defaults.baseURL + '/com/ExcelIn/PlanningPrice?type='+this.form.tax_deduction;
    }
}
</script>
