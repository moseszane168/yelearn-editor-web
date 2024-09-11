<template>
    <el-container>
        <el-header height="300">
            <el-descriptions class="margin-top">
                <el-descriptions-item :label="$t('default.Incoming_Batch')"><!-- 单据号 -->{{ form.ob_code
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
             max-height="550px" :summary-method="getSummaries">



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
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')" width="75"
                    sortable></el-table-column>
                <!-- 含税单价 -->
                <el-table-column v-if=cost_show prop="norgtaxprice"
                    :label="$t('default.Including_tax_unit_price')"></el-table-column>

                <!-- 出库数 -->
                <el-table-column prop="out_num" :label="$t('default.Number_of_outgoing_goods')" width="90"
                    sortable></el-table-column>
                <!-- 库位 -->
                <el-table-column prop="location_name" :label="$t('default.Location')"></el-table-column>
                <!-- 领料单号 -->
                <el-table-column prop="pi_code" :label="$t('default.Requisition_Order')" v-if="form.type == 2">
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handlePicking(scope.row.pi_code)"> {{
                    scope.row.pi_code }}</el-button>
                    </template>
                </el-table-column>
                <!-- 领料人 -->
                <el-table-column prop="pi_user_name" :label="$t('default.Receiver')"
                    v-if="form.type == 2"></el-table-column>
                <!-- 报关单号 -->
                <el-table-column prop="hscode" v-if="form.bonded"  :label="$t('default.Customs_declaration_number')"></el-table-column>
                <!-- 核注清单 -->
                <el-table-column prop="inventory" v-if="form.bonded"  :label="$t('default.Approved_list')"></el-table-column>
                <!-- 备案号 -->
                <el-table-column prop="inventory_order_no" v-if="form.bonded"  :label="$t('default.Record_number')"></el-table-column>
              
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
            </el-table>
        </el-main>
        <!-- 领料单 -->
        <el-dialog :visible.sync="PickingVisible" append-to-body width="90%" :title="$t('default.Requisition_Order')">
            <picking-detail ref="pickingDetail"></picking-detail>
        </el-dialog>

    </el-container>
</template>


<script>
import PickingDetail from '../produce/PickingApplyDetail.vue';
import { Pagination, Table } from 'element-ui';
export default {
    components: {
        // quillEditor,
        PickingDetail,

    },
    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            pur_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            PickingVisible: false,


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
                        case 6:
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
        handlePicking(pi_code) {
            this.PickingVisible = true;

            this.$nextTick(() => {
                this.$refs.pickingDetail.dataInitialization(pi_code);
            })
        },


        //初始化数据
        dataInitialization(ob_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.ob_code = ob_code;
            that.axios
                .get(
                    "/ware/Outbound/Detail?ob_code=" + ob_code + '&token=' + token
                )
                .then(res => {
                    // that.fromData = res.data.data.fromData;
                    // that.toData = res.data.data.toData;
                    // console.info("this id ");

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

}
</script>
