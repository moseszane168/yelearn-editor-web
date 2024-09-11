<template>
    <el-container>
        <el-header height="30">
            <el-descriptions :column="3">
                <!-- 需求单号 -->
                <el-descriptions-item :label="$t('default.Demand_Order_Number')">{{ form.apm_code
                    }}</el-descriptions-item>

                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name
                    }}</el-descriptions-item>

                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>

                <!-- 创建人 -->
                <el-descriptions-item :label="$t('default.Creator')">{{ form.create_user_name }}</el-descriptions-item>
                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>
                <!-- 更新人 -->
                <el-descriptions-item :label="$t('default.Updated_by')">{{ form.update_user_name
                    }}</el-descriptions-item>
                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>
                <!-- 领料单号 -->
                <el-descriptions-item :label="$t('default.Requisition_Order')">{{ form.pi_code }}</el-descriptions-item>


            </el-descriptions>
        </el-header>
        <el-main>
            <el-table :data="detailData" border show-summary class="table" style="width: 100%" max-height="700"
                :row-class-name="tableRowClassName" :summary-method="getSummaries">
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" fixed="left" width="55"
                    align="center"></el-table-column>



                <el-table-column prop="mat_code" fixed="left" label="物料编码" sortable width="120">
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
                <el-table-column prop="mat_name" label="物料名称">
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




                <!-- 申请 -->
                <el-table-column prop="apply_num" width="75" :label="$t('default.Request')" sortable></el-table-column>
                <el-table-column prop="buy_num" width="75" label="已购" sortable></el-table-column>
                <el-table-column prop="order_status_name" label="下单状态">
                    <template v-slot="scope">
                        <div v-if="scope.row.warning == 'success'">
                            <el-tag type="success">{{ scope.row.order_status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.warning == 'warning'">
                            <el-tag type="warning">{{ scope.row.order_status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.warning == 'danger'">
                            <el-tag type="danger">{{ scope.row.order_status_name }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <!-- 可用 -->
                <el-table-column prop="available_num" width="75" :label="$t('default.Available')"
                    sortable></el-table-column>
                <el-table-column prop="transit_num" width="75" label="在途" sortable></el-table-column>
                <el-table-column prop="safe_num" width="75" label="安全" sortable></el-table-column>

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

                <el-table-column v-if=cost_show prop="cost" width="75" label="单价" sortable></el-table-column>



                <!-- 类型 -->
                <el-table-column prop="type_name" :label="$t('default.Type')"></el-table-column> -->


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



                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
                <el-table-column prop="category_name" label="分类">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.category_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.category_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 采购单号 -->
                <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')">
                    <template v-slot="scope">

                        <el-button type="text" class="handle-del mr10" @click="handlePurchase(scope.row.pur_code)"> {{
                scope.row.pur_code }}</el-button>

                    </template>
                </el-table-column>
                <el-table-column prop="ap_code" label="-">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.ap_code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ap_code
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

            </el-table>

        </el-main>
        <!-- 采购单 -->
        <purchase-detail ref="purchaseDetail" :visible.sync="purchaseVisible" :data="current" @done="reload"
            @refreshParent="refreshPage">
        </purchase-detail>

    </el-container>
</template>


<script>
import PurchaseDetail from '../purchase/PurchaseDetail.vue';

export default {
    components: {
        PurchaseDetail,
        
    },
    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            apm_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            purchaseVisible: false,
            type: false,
            current: {},


        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });
    },
    methods: {

        handlePurchase(pur_code) {

            this.purchaseVisible = true;

            this.$nextTick(() => {
                this.$refs.purchaseDetail.dataInitialization(pur_code);
            })
        },
        tableRowClassName({ row, rowIndex }) {

            if (row.status === 3 || row.status === 5 || row.status === 7 || row.status === 8) {
                return 'warning-row';
            } else if (row.order_status === 3) {
                return 'success-row';
            }
            return '';
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
                        case 4:
                        case 5:
                        // case 13:
                        // case 14:
                        // case 15:
                            let total = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = total;


                            break;


                        default: '';
                    }

                } else {

                }
            });

            return sums;
        },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        refreshPage() {
            // 这里实现页面的更新逻辑
            // console.log('父页面刷新');
            this.getData();
        },
        //初始化数据
        dataInitialization(apm_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.apm_code = apm_code;
            that.axios
                .get(
                    "/plan/PlanApply/Detail?apm_code=" + apm_code + '&token=' + token
                )
                .then(res => {


                    this.detailData = res.list;
                    this.form = res.info;
                    this.cost_show = res.cost_show;
                    this.type = res.type;
                    console.log(res.type);

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
   
}
</script>
<style>
.table-container {
    overflow-y: auto;
    height: 400px;
    /* 根据需要设置高度 */
}

.table-header {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
}

.table-content {
    padding-top: 30px;
    /* 根据固定头部的高度调整 */
}
</style>