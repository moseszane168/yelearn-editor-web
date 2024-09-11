<template>
    <el-container>
        <el-header height="300">
            <el-descriptions class="margin-top">
                <el-descriptions-item :label="$t('default.Incoming_Batch')"><!-- 单据号 -->{{ form.wi_code
                    }}</el-descriptions-item>

                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name
                    }}</el-descriptions-item>
                <!-- 仓库 -->
                <el-descriptions-item :label="$t('default.Warehouse')">{{ form.ware_name }}</el-descriptions-item>
                <!-- 签字人 -->
                <el-descriptions-item :label="$t('default.Signatory')">{{ form.audit_user_name }}</el-descriptions-item>
                <!-- 签字时间 -->
                <el-descriptions-item :label="$t('default.Signature_Time')">{{ form.audit_time }}</el-descriptions-item>
                <!-- 审核备注 -->
                <el-descriptions-item :label="$t('default.Audit_Remarks')">{{ form.audit_desc }}</el-descriptions-item>

                <!-- 收发类别 -->
                <el-descriptions-item :label="$t('default.Receiving_and_Sending_Category')">{{ form.cdispatcherid_name
                    }}</el-descriptions-item>
                <!-- 创建人 -->
                <el-descriptions-item :label="$t('default.Creator')">{{ form.create_user_name }}</el-descriptions-item>
                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>
                <!-- 更新人 -->
                <el-descriptions-item :label="$t('default.Updated_by')">{{ form.update_user_name
                    }}</el-descriptions-item>
                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>

                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>
            </el-descriptions>
        </el-header>
        <el-main>
            <el-table :data="detailData" border class="table" style="width: 100%" show-summary
            :summary-method="getSummaries" max-height="550px">
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
                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')"></el-table-column> -->
                <!-- 入库数 -->
                <el-table-column prop="in_num" :label="$t('default.Inventory_Number')" width="90"
                    sortable></el-table-column>
                <!-- 库位 -->
                <el-table-column prop="location_name" :label="$t('default.Location')"></el-table-column>
                <!-- 采购单号 -->
                <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')"
                    v-if="form.type == 1 || form.type == 2">

                   
                </el-table-column>
                <!-- 采购员 -->
                <el-table-column prop="pur_name" :label="$t('default.Purchaser')"
                    v-if="form.type == 1 || form.type == 2" width="70"></el-table-column>
                <!-- 供应商 -->
                <el-table-column prop="sup_name" :label="$t('default.Supplier')"
                    v-if="form.type == 1 || form.type == 2">

                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.sup_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.sup_name
                }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 项目 -->
                <el-table-column prop="project_name" :label="$t('default.Project')"
                    v-if="form.type == 1 || form.type == 2">

                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.project_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.project_name
                }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 报关单号 -->
                <el-table-column prop="hscode" v-if="form.bonded"
                    :label="$t('default.Customs_declaration_number')"></el-table-column>
                <!-- 核注清单 -->
                <el-table-column prop="inventory" v-if="form.bonded"
                    :label="$t('default.Approved_list')"></el-table-column>
                <!-- 备案号 -->
                <el-table-column prop="inventory_order_no" v-if="form.bonded" :label="$t('default.Record_number')"
                    width="130"></el-table-column>

                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
            </el-table>
        </el-main>
      
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



            deliveryData: [],
            pur_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            purchaseVisible: false,
            current: {},

        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });
    },
    methods: {
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
                        // case 4:
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
        // handlePurDetail(pur_code) {
        //     this.purchaseVisible = true;
        //     this.$nextTick(() => {
        //         this.$refs.purchaseDetail.dataInitialization(pur_code);
        //     })
        // },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        refreshPage() {
            // 这里实现页面的更新逻辑
            // console.log('父页面刷新');
            // this.getData();
        },

        //初始化数据
        dataInitialization(wi_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.wi_code = wi_code;
            that.axios
                .get(
                    "/ware/Warehousing/Detail?wi_code=" + wi_code + '&token=' + token
                )
                .then(res => {


                    this.detailData = res.list;
                    this.form = res.info;
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

}
</script>
