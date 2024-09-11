<template>
    <!-- 修改出库单 -->
    <el-dialog :title="$t('default.Modify_Purchase_Order')" :visible="visible" width="85%" :destroy-on-close="true"
        :lock-scroll="false" @update:visible="updateVisible" :before-close="handleClose">
        <el-form :inline="true" ref="form" :rules="rules" :model="{ form }" size="mini" label-width="80px">
            <!-- 采购单号 -->
            <el-form-item :label="$t('default.Purchase_Order_Number')">
                {{ form.pur_code }}
            </el-form-item>
            <!-- 采购员 -->
            <el-form-item :label="$t('default.Purchaser')">
                {{ form.pur_name }}
            </el-form-item>
            <!-- 部门 -->
            <el-form-item :label="$t('default.Department')">
                {{ form.department_name }}
            </el-form-item>
            <!-- 供应商 -->
            <el-form-item :label="$t('default.Supplier')" prop="sup_code">
                <el-select v-model="form.sup_code" filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteSupply" :loading="loading"
                    @change="sup_change()">
                    <el-option v-for="item in sup_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 币种 -->
            <el-form-item :label="$t('default.Currency')">
                <el-select v-model="form.currtypecode" filterable :placeholder="$t('default.Please_select')">
                    <el-option v-for="item in currtype_option" :key="item.currtypecode" :label="item.currtypename"
                        :value="item.currtypecode">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 业务流程 -->
            <el-form-item :label="$t('default.Business_Process')" prop="cbiztype">
                <el-select v-model="form.cbiztype">
                    <el-option v-for="item in cbiztype_options" :key="item.value" :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 需求交期 -->
            <el-form-item :label="$t('default.Requirement_Lead_Time')" prop="estimated_delivery_time">

                <el-date-picker v-model="form.estimated_delivery_time" type="date"
                    :placeholder="$t('default.Select_Date')">
                </el-date-picker>
            </el-form-item>
            <!-- 扣税类别 -->
            <el-form-item :label="$t('default.Tax_Deduction_Category')" prop="tax_deduction">
                <el-select v-model="form.tax_deduction" :placeholder="$t('default.Please_select')"
                    @change="handleTaxDeduction()">
                    <el-option v-for="item in tax_deduction_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 整单税率 -->
            <el-form-item :label="$t('default.Tax_Rate')" prop="tax_rate">
                <el-input v-model="form.tax_rate" @blur="handleTaxRate"></el-input>
            </el-form-item>


            <!-- 备注 -->
            <el-form-item :label="$t('default.Desc')">
                <el-input v-model="form.desc"></el-input>
            </el-form-item>
        </el-form>


        <template>
            <el-button type="primary" @click="handleAddOrderLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
            <el-table :data="orderData" border style="width: 100%" show-summary :summary-method="getSummaries">
                <!-- 部门 -->
                <el-table-column :label="$t('default.Department')">
                    <template v-slot="scope">
                        <el-select v-model="scope.row.department_id" filterable remote reserve-keyword
                            :placeholder="$t('default.Please_enter_a_keyword')">
                            <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="160px">
                    <template v-slot="scope">
                        <div v-if="scope.row.id">
                            <el-popover trigger="hover" placement="top">
                                <p>{{ scope.row.mat_code }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code
                                        }}</el-button>
                                </div>
                            </el-popover>
                        </div>
                        <div v-else>
                            <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword
                                :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="getPlanning"
                                :loading="loading"
                                @change="getPlanningOne(scope.$index, scope.row, scope.row.mat_code)">

                                <el-option v-for="item in plan_options" :key="item.mat_code" :label="item.mat_code"
                                    :value="item.mat_code">
                                    <span style="float: left">{{ item.mat_code }}</span>

                                </el-option>
                            </el-select>

                        </div>

                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')">

                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
        scope.row.mat_name }}</el-button>
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
                <!-- 规格 -->
                <el-table-column prop="specifications" :label="$t('default.Specification')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.specifications }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
        scope.row.specifications }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 实购数 -->
                <el-table-column prop="real_num" :label="$t('default.Purchase_Number')">

                    <template v-slot="scope">

                        <div v-if="form.status == 1 || form.status == 2 || form.status == 3">
                            <el-input v-model.number="scope.row.real_num"
                                @blur="handleOrderChageRowRealNum(scope.$index, scope.row)"></el-input>
                        </div>

                        <div v-else>
                            {{ scope.row.real_num }}
                        </div>
                    </template>
                </el-table-column>
                <!-- 退货数 -->
                <el-table-column prop="return_num" :label="$t('default.Number_of_Returns')">

                    <template v-slot="scope">

                        <div v-if="form.status < 8 && form.status > 3">
                            <el-input v-model.number="scope.row.return_num"></el-input>
                        </div>

                        <div v-else>
                            {{ scope.row.return_num }}
                        </div>
                    </template>
                </el-table-column>
                <!-- 项目 -->
                <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">

                    <template v-slot="scope">
                        <el-select v-model="scope.row.pro_code" :placeholder="$t('default.Please_select')">
                            <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')">

                    <template v-slot="scope">

                        <el-input v-model="scope.row.desc"></el-input>

                    </template>
                </el-table-column>
                <!-- 原单价 -->
                <el-table-column prop="old_cost" :label="$t('default.Original_Order_Price')"></el-table-column>
                <!-- 含税单价 -->
                <el-table-column prop="norgtaxprice" :label="$t('default.Including_tax_unit_price')">
                    <template v-slot="scope">
                        <el-input v-model="scope.row.norgtaxprice"
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
                <!-- 税率 -->
                <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')">
                    <template v-slot="scope">
                        <el-input v-model="scope.row.tax_rate"
                            @blur="handleOrderChageRowTaxRate(scope.$index, scope.row)"></el-input>
                    </template>
                </el-table-column>
                <!-- 金额 -->
                <el-table-column prop="total_price" :label="$t('default.Amount')"></el-table-column>
                <!-- 税额 -->
                <el-table-column prop="noriginaltaxmny" :label="$t('default.Tax_amount')"></el-table-column>
                <!-- 价税合计 -->
                <el-table-column prop="ntaxpricemny" :label="$t('default.Total_price_and_tax')"></el-table-column>
                <!-- 操作 -->
                <el-table-column prop="operate" :label="$t('default.Action')">
                    <template v-slot="scope">
                        <div v-if="scope.row.id">

                            <el-radio v-model="scope.row.delete_time" label="2">{{ $t('default.Delete')
                                }}</el-radio>
                        </div>
                        <div v-else>
                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                @click="handleDeleteOrderLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                            </el-button><!-- 删除 -->
                        </div>


                    </template>

                </el-table-column>

            </el-table>
        </template>




        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveOrder">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            <el-button @click="updateVisible(false)">{{ $t('default.Cancel') }}</el-button>
            <!-- 取消 -->
        </span>
    </el-dialog>
</template>


<script>

import Vue from 'vue';
export default {

    props: {
        // 弹窗是否打开
        visible: Boolean,
        // 修改回显的数据
        // data: Object,
        // configList: Object,
        // // // 栏目数据
        // cateList: Array
    },
    data() {
        return {

            form: {},

            deliveryData: [],

            cost_show: false,
            // visible: false,
            form: [],
            detailData: [],
            purchaseVisible: false,
            rules: {
                // department_id: [
                //     { required: true, message: '请选择部门', trigger: 'blur' },

                // ],
                // ware_id: [
                //     { required: true, message: '请选择仓库', trigger: 'blur' },

                // ],
                // cdispatcherid: [
                //     { required: true, message: '请选择收发类别', trigger: 'blur' },

                // ],
            },
            department_options: [],
            ware_options: [],
            sup_options: [],

            BondedWarehousingType_options: [],
            bonded_show: false,
            orderData: [],
            location_options: [],
            mat_options: [],
            loading: false,
            available_num: '',
            transit_num: '',
            mat_name: '',
            show_type: true,
            audit_type: 1,

            pur_user_options: [],
            department_options: [],
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
            deliveryData: [],
            buyVisible: false,
            detailData: [],
            LogData: [],
            cost_show: false,
            PriceAuditVisible: false,
            cbiztype_options: [],
            currtype_option: [],
            SelectOneVisible: false,
            plan_options: [],
            mat_options: [],

        };
    },
    mounted() {

    },
    methods: {
        remoteLocation(query) {
            if (query !== '') {
                this.axios.post('/ware/wareLocation/getBuyNameForWareLocation', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.location_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.mat_options = [
                    { id: query, p_name: query }
                ];
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

        handleOrderChageRowTaxCost(index, row) {
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form

            var row_d = JSON.parse(JSON.stringify(row));

            switch (this.form.tax_deduction) {
                case 0:
                    row_d.cost = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;
                case 1:
                    row_d.cost = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;
                case 2:
                    row_d.cost = row_d.norgtaxprice;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;


            }
            row_d.cost = Math.floor(row_d.cost * 1000000) / 1000000;
            row_d.total_price = Math.floor(row_d.total_price * 1000000) / 1000000;
            row_d.noriginaltaxmny = Math.floor(row_d.noriginaltaxmny * 1000000) / 1000000;
            row_d.ntaxpricemny = Math.floor(row_d.ntaxpricemny * 1000000) / 1000000;


            this.$set(this.orderData[index], 'cost', row_d.cost);
            this.$set(this.orderData[index], 'total_price', row_d.total_price);
            this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
            this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);


        },
        handleOrderChageRowCost(index, row) {
            var row_d = JSON.parse(JSON.stringify(row));

            switch (this.form.tax_deduction) {
                case 0:

                    // 98
                    row_d.norgtaxprice = row_d.cost / (100 - row_d.tax_rate) * 100;

                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;


                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;
                case 1:
                    row_d.norgtaxprice = row_d.cost * (100 + row_d.tax_rate * 1) / 100;
                    // row_d.cost = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;
                case 2:
                    row_d.norgtaxprice = row_d.cost;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;


            }
            row_d.norgtaxprice = Math.floor(row_d.norgtaxprice * 1000000) / 1000000;
            row_d.total_price = Math.floor(row_d.total_price * 1000000) / 1000000;
            row_d.noriginaltaxmny = Math.floor(row_d.noriginaltaxmny * 1000000) / 1000000;
            row_d.ntaxpricemny = Math.floor(row_d.ntaxpricemny * 1000000) / 1000000;

            this.$set(this.orderData[index], 'norgtaxprice', row_d.norgtaxprice);
            this.$set(this.orderData[index], 'total_price', row_d.total_price);
            this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
            this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);


        },
        handleOrderChageRowRealNum(index, row) {

            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            var row_d = JSON.parse(JSON.stringify(row));


            row_d.total_price = row_d.cost * row_d.real_num;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;

            row_d.total_price = Math.floor(row_d.total_price * 1000000) / 1000000;
            row_d.noriginaltaxmny = Math.floor(row_d.noriginaltaxmny * 1000000) / 1000000;
            row_d.ntaxpricemny = Math.floor(row_d.ntaxpricemny * 1000000) / 1000000;



            this.$set(this.orderData[index], 'total_price', row_d.total_price);
            this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
            this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);



        },
        // 税率
        handleOrderChageRowTaxRate(index, row) {
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form

            var row_d = JSON.parse(JSON.stringify(row));

            switch (this.form.tax_deduction) {
                case 0:
                    row_d.cost = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;
                case 1:
                    row_d.cost = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;
                case 2:
                    row_d.cost = row_d.norgtaxprice;
                    row_d.total_price = row_d.cost * row_d.real_num;
                    row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                    row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                    break;


            }
            row_d.cost = Math.floor(row_d.cost * 1000000) / 1000000;
            row_d.total_price = Math.floor(row_d.total_price * 1000000) / 1000000;
            row_d.noriginaltaxmny = Math.floor(row_d.noriginaltaxmny * 1000000) / 1000000;
            row_d.ntaxpricemny = Math.floor(row_d.ntaxpricemny * 1000000) / 1000000;

            this.$set(this.orderData[index], 'cost', row_d.cost);
            this.$set(this.orderData[index], 'total_price', row_d.total_price);
            this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
            this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);


        },
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
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
                        case 5:
                        case 6:
                        case 13:
                        case 14:
                        case 15:
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

        handleDeleteOrderLine(index) {
            this.orderData.splice(index, 1)
        },
        change() {
            this.$forceUpdate();
        },
        /* 更新visible */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        handleTaxDeduction() {


            this.orderData.forEach((row_d, i) => {



                switch (this.form.tax_deduction) {
                    case 0:
                        row_d.cost = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
                        row_d.total_price = row_d.cost * row_d.real_num;
                        row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                        row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                        break;
                    case 1:
                        row_d.cost = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
                        row_d.total_price = row_d.cost * row_d.real_num;
                        row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                        row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                        break;
                    case 2:
                        row_d.cost = row_d.norgtaxprice;
                        row_d.total_price = row_d.cost * row_d.real_num;
                        row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                        row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                        break;


                }
                row_d.cost = Math.floor(row_d.cost * 1000000) / 1000000;
                row_d.total_price = Math.floor(row_d.total_price * 1000000) / 1000000;
                row_d.noriginaltaxmny = Math.floor(row_d.noriginaltaxmny * 1000000) / 1000000;
                row_d.ntaxpricemny = Math.floor(row_d.ntaxpricemny * 1000000) / 1000000;

                this.$set(this.orderData[i], 'cost', row_d.cost);
                this.$set(this.orderData[i], 'total_price', row_d.total_price);
                this.$set(this.orderData[i], 'noriginaltaxmny', row_d.noriginaltaxmny);
                this.$set(this.orderData[i], 'ntaxpricemny', row_d.ntaxpricemny);

            });

        },

        handleTaxRate() {

            this.orderData.forEach((e, i) => {


                this.$set(this.orderData[i], 'tax_rate', this.form.tax_rate);



                var row_d = e;


                switch (this.form.tax_deduction) {
                    case 0:
                        row_d.cost = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
                        row_d.total_price = row_d.cost * row_d.real_num;
                        row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                        row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                        break;
                    case 1:
                        row_d.cost = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
                        row_d.total_price = row_d.cost * row_d.real_num;
                        row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                        row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                        break;
                    case 2:
                        row_d.cost = row_d.norgtaxprice;
                        row_d.total_price = row_d.cost * row_d.real_num;
                        row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.cost) * row_d.real_num;
                        row_d.ntaxpricemny = row_d.norgtaxprice * row_d.real_num;
                        break;


                }
                row_d.cost = Math.floor(row_d.cost * 1000000) / 1000000;
                row_d.total_price = Math.floor(row_d.total_price * 1000000) / 1000000;
                row_d.noriginaltaxmny = Math.floor(row_d.noriginaltaxmny * 1000000) / 1000000;
                row_d.ntaxpricemny = Math.floor(row_d.ntaxpricemny * 1000000) / 1000000;

                this.$set(this.orderData[i], 'cost', row_d.cost);
                this.$set(this.orderData[i], 'total_price', row_d.total_price);
                this.$set(this.orderData[i], 'noriginaltaxmny', row_d.noriginaltaxmny);
                this.$set(this.orderData[i], 'ntaxpricemny', row_d.ntaxpricemny);

            });

        },
        handleAddOrderLine() {
            if (this.orderData == undefined) {
                this.orderData = new Array();
            }
            let obj = {};

            this.orderData.push(obj);
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
        // 获取项目
        getProject() {
            this.axios.post('/pur/Project/getProject', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.project_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 业务流程
        getCbiztype() {
            this.axios.post('/pur/Cbiztype/getCbiztypeArr', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.cbiztype_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },


        // 获取采购员
        getPurUser() {
            // 获取采购员,部门，
            this.axios.post('/index/user/getPurUser', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.pur_user_options = res;
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


        getPlanning(query) {
            if (query !== '') {
                this.axios.post('/plan/Planning/UpdateAdd', {
                    token: localStorage.getItem("token"),
                    mat_code: query,
                    status: 1,
                }).then((res) => {
                    this.plan_options = res;
                }).catch(() => {
                    this.plan_options = false;
                })
            } else {
                this.plan_options = [];
            }
        },
        getPlanningOne(index, row, mat_code) {

            this.axios.post('/plan/Planning/UpdateAdd', {
                token: localStorage.getItem("token"),
                mat_code: mat_code,
                status: 1,
            }).then((res) => {

                var re_data = res[0];
                this.$set(this.orderData[index], 'mat_name', re_data.name);
                this.$set(this.orderData[index], 'model', re_data.model);
                this.$set(this.orderData[index], 'real_num', re_data.real_num);
                this.$set(this.orderData[index], 'old_cost', re_data.cost);
                this.$set(this.orderData[index], 'norgtaxprice', re_data.cost);
                this.$set(this.orderData[index], 'ap_code', re_data.ap_code);
                this.$set(this.orderData[index], 'tax_rate', 0);
                this.$set(this.orderData[index], 'delete_time', 0);

            }).catch(() => {

            })
        },


        // 获取供应商
        remoteSupply(query) {
            if (query !== '') {
                this.axios.post('/infor/supply/getSupply', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.sup_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },

        // 获取供应商
        remoteOneSupply(query) {
            if (query !== '') {
                this.axios.post('/infor/supply/getSupply', {
                    token: localStorage.getItem("token"),
                    code: query
                }).then((res) => {
                    this.sup_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },

        saveOrder() {
            const dateObj = new Date(this.form.estimated_delivery_time);

            // 获取年、月、日等信息
            const year = dateObj.getFullYear(); // 年份
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份（注意月份从0开始计算）
            const day = dateObj.getDate().toString().padStart(2, '0'); // 天数

            this.form.estimated_delivery_time = `${year}-${month}-${day}`;
            this.axios.post('/pur/Purchase/update', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData
            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));


                this.updateVisible(false);
                this.notifyParent();

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
        remoteMethod(query) {
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
        handleOrderSelectionChange(val) {
            this.multipleOrderSelection = val;
        },
        // 其他入库保存
        handleSave() {
            this.form.dbilldate = Vue.prototype.FormatTime(this.form.dbilldate_w);
            this.axios.post('/ware/Outbound/update', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData
            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.updateVisible(false);
                // this.$emit('done');

            }).catch(() => {
                this.loading = false;
            })
        },
        closeDialog() {
            this.$emit("closeDialog"); //触发 closeDialog 事件
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

        // 获取仓库
        getWare() {
            this.axios.post('/ware/warehouse/warelist', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                this.query_ware_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },

        // 获取库位
        wareChange() {
            this.axios.post('/ware/Warehousing/handleIn', {
                token: localStorage.getItem("token"),
                // selection: this.multipleSelection,
                params: this.form,
                orderData: this.orderData,
            }).then((res) => {
                this.orderData = res.orderData;
                this.location_options = res.location_options;
                this.bonded_show = res.bonded_show;
            }).catch(() => {
                this.loading = false;
            })

        },


        //初始化数据
        dataInitialization(pur_code, sup_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.pur_code = pur_code;

            this.updateVisible(true);
            that.axios
                .get(
                    "/pur/Purchase/Detail?pur_code=" + pur_code + '&token=' + token
                )
                .then(res => {


                    this.orderData = res.list;
                    this.form = res.purchase_order_info;

                })
                .catch(err => {
                    that.$notify.error({
                        title: "错误",
                        message: err
                    });
                    console.log(err);
                });
            this.remoteOneSupply(sup_code);
            // // this.getWare();
            this.getCurrtype();
            this.getPurUser();
            this.getProject();
            this.getDepartment();
            this.getCbiztype();

        },
    },

}
</script>
