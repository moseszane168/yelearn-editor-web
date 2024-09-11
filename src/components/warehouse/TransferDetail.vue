<template>
    <el-container>
        <el-header height="300">
            <el-descriptions class="margin-top">
                <el-descriptions-item :label="$t('default.Incoming_Batch')"><!-- 单据号 -->{{ form.tr_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name }}</el-descriptions-item>
                <!-- 状态 -->
                <el-descriptions-item :label="$t('default.Status')">{{ form.status_name }}</el-descriptions-item>
                <el-descriptions-item label="保税出库类型">{{ form.delivery_type_name }}</el-descriptions-item>
              
                 <!-- 收发类别 -->
                <el-descriptions-item :label="$t('default.Receiving_and_Sending_Category')">{{ form.cdispatcherid_name }}</el-descriptions-item>
                 <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>
                 <!-- 审核人 -->
                <el-descriptions-item :label="$t('default.Auditor')">{{ form.audit_user_name }}</el-descriptions-item>
                <!-- 审核时间 -->
                <el-descriptions-item :label="$t('default.AuditTime')">{{ form.audit_time }}</el-descriptions-item>
                <!-- 审核备注 -->
                <el-descriptions-item :label="$t('default.Audit_Remarks')">{{ form.audit_desc }}</el-descriptions-item>
              
                 <!-- 创建人 -->
                <el-descriptions-item :label="$t('default.Creator')">{{ form.create_user_name }}</el-descriptions-item>
                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>
                <!-- 更新人 -->
                <el-descriptions-item :label="$t('default.Updated_by')">{{ form.update_user_name }}</el-descriptions-item>
                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>
                
            </el-descriptions>
        </el-header>
        <el-main>
            <el-table :data="detailData" border class="table" style="width: 100%" show-summary  :summary-method="getSummaries" max-height="550px">

                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="50"></el-table-column>

                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
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
                <!-- 型号 -->
                <el-table-column prop="model" :label="$t('default.Model')" >
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
                <el-table-column prop="specifications" :label="$t('default.Specification')" >
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.specifications }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')"></el-table-column>
       




                <el-table-column prop="tr_num" label="转库数"></el-table-column>
                
                <!-- 报关单号 -->
                <el-table-column prop="hscode" :label="$t('default.Customs_declaration_number')"></el-table-column>
                <!-- 核注清单 -->
                <el-table-column prop="inventory" :label="$t('default.Approved_list')"></el-table-column>
                <!-- 备案号 -->
                <el-table-column prop="inventory_order_no" :label="$t('default.Record_number')"></el-table-column>
              

                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>
            </el-table>
        </el-main>
        

    </el-container>
</template>


<script>

export default {
    components: {
        
        
    },
    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            pur_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            purchaseVisible: false,


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
                this.$refs.detail.dataInitialization(pur_code);
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
                        // case 5:
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
        //初始化数据
        dataInitialization(tr_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.tr_code = tr_code;
            that.axios
                .get(
                    "/ware/Transfer/Detail?tr_code=" + tr_code + '&token=' + token
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
