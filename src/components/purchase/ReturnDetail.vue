<template>
    <el-container>
        <el-header height="300">
            <el-descriptions>
                <!-- 退货单 -->
                <el-descriptions-item :label="$t('default.Refund_Order')">{{ form.ret_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name
                    }}</el-descriptions-item>

                <!--退款总金额  -->
                <el-descriptions-item :label="$t('default.Total_Refund_Amount')" v-if=cost_show>{{ form.total_price
                    }}</el-descriptions-item>
                <!-- 货款 -->
                <el-descriptions-item :label="$t('default.Payment_for_goods')" v-if=cost_show>{{ form.good_price
                    }}</el-descriptions-item>
                <!-- 其他退款 -->
                <el-descriptions-item :label="$t('default.Other_Refunds')" v-if=cost_show>{{ form.other_price
                    }}</el-descriptions-item>

                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>
                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>


                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>






            </el-descriptions>
        </el-header>

        <el-main>
            <el-table :data="detailData" border class="table" style="width: 100%" show-summary
                :summary-method="getSummaries">
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')"></el-table-column>
                <!-- 原币无税净单价 -->
                <el-table-column :label="$t('default.Net_unit_price_in_original_currency_without_tax')" v-if=cost_show prop="noriginalcurprice"></el-table-column>
                <!-- 原币价税合计 -->
                <el-table-column v-if=cost_show prop="noriginalsummny" :label="$t('default.Original_Currency_Total')"></el-table-column>
                <!-- 发票数量 -->
                <el-table-column prop="ninvoicenum" :label="$t('default.Invoice_Quantity')"></el-table-column>


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
                <!-- 项目 -->
                <el-table-column prop="project_name" :label="$t('default.Project')"></el-table-column>
                <!-- 税率 -->
                <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>
<script>

// import WarehousingDetail from '../warehouse/WarehousingDetail.vue';
export default {
    components: {

        // WarehousingDetail
    },
    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            ret_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            PurchaseInData: [],
            PurchaseInData_show: false,
            DetailVisible: false,




        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });
    },
    methods: {

        handleWi(wi_code) {
            this.DetailVisible = true;

            this.$nextTick(() => {
                this.$refs.warehousingDetail.dataInitialization(wi_code);
            })
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
        //初始化数据
        dataInitialization(ret_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.ret_code = ret_code;
            that.axios
                .get(
                    "/pur/PurchaseReturn/Detail?ret_code=" + ret_code + '&token=' + token
                )
                .then(res => {


                    this.detailData = res.list;
                    this.form = res.info;
                    this.cost_show = res.cost_show;


                    // console.info(res);
                    // that.$notify({
                    //     title: "成功",
                    //     message: "--",
                    //     type: "success"
                    // });
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

    // this.getData();
    // this.dataInitialization();


    // }
}
</script>
