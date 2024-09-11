


<template>
    <el-container>
        <el-header height="300">
            <el-descriptions class="margin-top">
                <!-- 采购单号 -->
                <el-descriptions-item :label="$t('default.Purchase_Order_Number')">{{ form.pur_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name }}</el-descriptions-item>



                <!-- 总价 -->
                <el-descriptions-item :label="$t('default.Total_Price')" v-if=cost_show >{{ form.total_price }}</el-descriptions-item>
                <!-- 状态 -->
                <el-descriptions-item :label="$t('default.Status')">{{ form.status_name }}</el-descriptions-item>
                <!-- 采购员 -->
                <el-descriptions-item :label="$t('default.Purchaser')">{{ form.pur_name }}</el-descriptions-item>
                <!-- 供应商 -->
                <el-descriptions-item :label="$t('default.Supplier')">{{ form.sup_name }}</el-descriptions-item>
                <!-- 需求交期 -->
                <el-descriptions-item :label="$t('default.Demand_Delivery')">{{ form.estimated_delivery_time }}</el-descriptions-item>


                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>


                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>



            </el-descriptions>
        </el-header>

        <el-main>
            <el-table :data="PurchaseInData" border class="table" style="width: 100%" height="500px">


                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>
                <el-table-column prop="wi_code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)"> {{
                            scope.row.wi_code }}</el-button>
                    </template>
                </el-table-column>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_name }}</el-button>
                            </div>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                                    scope.row.specifications }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>




                <!-- 入库数 -->
                <el-table-column prop="in_num" :label="$t('default.Inventory_Number')" width="100"></el-table-column>



                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>
            </el-table>

            <el-dialog :visible.sync="DetailVisible" append-to-body width="80%" title="入库单">
                <warehousing-detail ref="warehousingDetail"></warehousing-detail>
            </el-dialog>
        </el-main>
    </el-container>
</template>


<script>

import WarehousingDetail from '../warehouse/WarehousingDetail.vue';
export default {
    components: {

        WarehousingDetail
    },
    data() {
        return {



            deliveryData: [],
            pur_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            PurchaseInData: [],
            PurchaseInData_show: false,
            DetailVisible: false,



        };
    },
    mounted() {

    },
    methods: {

        handleWi(wi_code) {
            this.DetailVisible = true;

            this.$nextTick(() => {
                this.$refs.warehousingDetail.dataInitialization(wi_code);
            })
        },
        //初始化数据
        dataInitialization(pur_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.pur_code = pur_code;
            that.axios
                .get(
                    "/pur/Purchase/Detail?pur_code=" + pur_code + '&token=' + token
                )
                .then(res => {
                    // that.fromData = res.data.data.fromData;
                    // that.toData = res.data.data.toData;
                    // console.info("this id ");
                    this.deliveryData = res.delivery_array;
                    this.detailData = res.list;
                    this.form = res.purchase_order_info;
                    this.cost_show = res.cost_show;
                    this.PurchaseInData = res.warehousing_item_list;
                    // this.PurchaseInData_show = res.PurchaseInData_show;

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
