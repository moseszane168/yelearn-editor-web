<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">

            <el-row :gutter="12">
                <el-col :span="6" v-if="transfer_item_show">
                  <el-card shadow="hover">
                    <!-- 转库单 -->
                    {{ $t('default.Transfers_Order') }}
                    <div v-for="(item, index) in transfer_item_list">
                      <br />
                      <el-button type="info" plain @click="handleTransferDetail(item.tr_code)">{{ item.tr_code }}</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="6" v-if="plan_apply_item_show">
                    <el-card shadow="hover">
                        <!-- 需求单 -->
                        {{ $t('default.Requirement') }}
                        <div v-for="(item, index) in plan_apply_item_list">
                            <br />
                            <el-button type="info" plain @click="handleApply(item.apm_code)">{{ item.apm_code }}</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6" v-if="purchase_order_show">
                    <el-card shadow="hover" >
                        <!-- 采购单 -->
                        {{ $t('default.Purchase_Order') }}
                        <div v-for="(item, index) in purchase_order_list">
                            <br />
                            <el-button type="info" plain @click="handlePurDetail(item.pur_code)">{{ item.pur_code
                            }}</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6" v-if="warehousing_item_show">
                    <el-card shadow="hover">
                        <!-- 入库单 -->
                        {{ $t('default.Warehouse_receipt') }}
                        <div v-for="(item, index) in warehousing_item_list">
                            <br />
                            <el-button type="info" plain @click="handleWi(item.wi_code)">{{ item.wi_code }}</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6" v-if="invoice_item_show">
                    <el-card shadow="hover">
                        <!-- 发票 -->
                        {{ $t('default.Invoice') }}
                        <div v-for="(item, index) in invoice_item_list">
                            <br />
                            <el-button type="info" plain @click="handleInvoice(item.inv_code)">{{ item.inv_code }}</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6" v-if="picking_apply_show">
                    <el-card shadow="hover">
                        <!-- 领料单 -->
                        {{ $t('default.Requisition_Order') }}
                        <div v-for="(item, index) in picking_apply_list">
                            <br />
                            <el-button type="info" plain @click="handlePicking(item.pi_code)">{{ item.pi_code }}</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6" v-if="outbound_item_show">
                    <el-card shadow="hover">
                        <!-- 出库单 -->
                        {{ $t('default.Outbound_Order') }}
                        <div v-for="(item, index) in outbound_item_list">
                            <br />
                            <el-button type="info" plain @click="handleOutbound(item.ob_code)">{{ item.ob_code }}</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>



        </div>


        <!-- 转库单 -->
        <el-dialog :visible.sync="transferVisible" append-to-body width="100%" :title="$t('default.Transfers_Order')">
          <transferDetail ref="transferDetail"></transferDetail>
        </el-dialog>
        <!-- 需求单 -->
        <el-dialog :visible.sync="applyVisible" append-to-body width="100%" :title="$t('default.Requirement')">
            <apply ref="apply"></apply>
        </el-dialog>

        <!-- 采购单 -->
        <purchase-detail ref="purchaseDetail" :visible.sync="purchaseVisible" :data="current" @done="reload"
            @refreshParent="refreshPage">
        </purchase-detail>
        <!-- 入库单 -->
        <el-dialog :visible.sync="WiVisible" append-to-body width="80%" :title="$t('default.Warehouse_receipt')">
            <warehousing-detail ref="warehousingDetail"></warehousing-detail>
        </el-dialog>
        <el-dialog :visible.sync="InvoiceDetailVisible" append-to-body width="90%" title="发票">
            <invoice-detail ref="invoiceDetail"></invoice-detail>
        </el-dialog>
        <el-dialog :visible.sync="PickingVisible" append-to-body width="80%" title="领料单">
            <picking-detail ref="pickingDetail"></picking-detail>
        </el-dialog>
        <el-dialog :visible.sync="OutboundVisible" append-to-body width="80%" title="出库单">
            <outbound-detail ref="outboundDetail"></outbound-detail>
        </el-dialog>

    </div>
</template>

<script>
import PurchaseDetail from '../purchase/PurchaseDetail.vue';
import WarehousingDetail from '../warehouse/WarehousingDetail.vue';
import Apply from '../plan/ApplyDetail.vue';
import InvoiceDetail from '../purchase/InvoiceDetail.vue';

import OutboundDetail from '../warehouse/OutboundDetail.vue';
import PickingDetail from '../produce/PickingApplyDetail.vue';
import TransferDetail from '../warehouse/TransferDetail.vue';

export default {
    name: 'basetable',
    components: {
        PurchaseDetail,
        WarehousingDetail,
        Apply,
        InvoiceDetail,
        PickingDetail,
        OutboundDetail,
        TransferDetail,
    },
    data() {
        return {
            query: {

                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                ],
            },

            idx: -1,
            id: -1,

            transferVisible:false,
            WiVisible: false,
            purchaseVisible: false,
            applyVisible: false,
            InvoiceDetailVisible:false,
            OutboundVisible:false,
            PickingVisible:false,

            transfer_item_list:[],
            purchase_order_list: [],
            plan_apply_item_list: [],
            warehousing_item_list: [],
            invoice_item_list: [],
            purchase_order_item_list:[],
            picking_apply_list:[],
            outbound_item_list:[],

            transfer_item_show:false,
            plan_apply_item_show:false,
            invoice_item_show:false,
            purchase_order_show:false,
            purchase_order_item_show:false,
            warehousing_item_show:false,
            picking_apply_show:false,
            outbound_item_show:false,
            current:{},
        };
    },
    methods: {
        //初始化数据
        dataInitialization(pur_code) {
            this.query.token = localStorage.getItem("token");
            this.axios.post('/index/SelectOne/SelectOne', {
                token: localStorage.getItem("token"),
                params: pur_code,
                // orderData: this.orderData,
            }).then((res) => {
                // this.orderData = res;
                this.purchase_order_list = res.purchase_order_list;
                this.purchase_order_item_list = res.purchase_order_item_list;
                this.warehousing_item_list = res.warehousing_item_list;
                this.invoice_item_list = res.invoice_item_list;
                this.plan_apply_item_list = res.plan_apply_item_list;
                this.picking_apply_list=res.picking_apply_list;
                this.outbound_item_list=res.outbound_item_list;
                this.transfer_item_list=res.transfer_item_list;

                this.plan_apply_item_show = res.plan_apply_item_show;
                this.purchase_order_show = res.purchase_order_show;
                this.purchase_order_item_show = res.purchase_order_item_show;
                this.warehousing_item_show = res.warehousing_item_show;
                this.invoice_item_show = res.invoice_item_show;
                this.picking_apply_show = res.picking_apply_show;
                this.outbound_item_show = res.outbound_item_show;
                this.transfer_item_show = res.transfer_item_show;


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
        handleWi(wi_code) {
            this.WiVisible = true;

            this.$nextTick(() => {
                this.$refs.warehousingDetail.dataInitialization(wi_code);
            })
        },
        handlePurDetail(pur_code) {
            this.purchaseVisible = true;
            this.$nextTick(() => {
                this.$refs.purchaseDetail.dataInitialization(pur_code);
            })
        },
        handleTransferDetail(tr_code) {
          this.transferVisible = true;
          this.$nextTick(() => {
            this.$refs.transferDetail.dataInitialization(tr_code);
          })
        },
        handleApply(apm_code) {
            this.applyVisible = true;
            this.$nextTick(() => {
                this.$refs.apply.dataInitialization(apm_code);
            })
        },
        handleInvoice(inv_code) {
            this.InvoiceDetailVisible = true;

            this.$nextTick(() => {
                this.$refs.invoiceDetail.dataInitialization(inv_code);
            })
        },
        handlePicking(pi_code) {
            this.PickingVisible = true;

            this.$nextTick(() => {
                this.$refs.pickingDetail.dataInitialization(pi_code);
            })
        },
        handleOutbound(ob_code) {
            this.OutboundVisible = true;

            this.$nextTick(() => {
                this.$refs.outboundDetail.dataInitialization(ob_code);
            })
        },



    },
    // 在钩子函数中调用getData方法
    // created() {
    //     this.getData();
    // }
}
</script>

