


<template>
    
    <el-container>
        <el-header height="300">
            <el-descriptions class="margin-top" >
                <!-- 采购单号 -->
                <el-descriptions-item :label="$t('default.Purchase_Order_Number')">{{ form.pur_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name }}</el-descriptions-item>


                <div v-if=cost_show>
                    <el-descriptions-item label="总价">{{ form.total_price }}</el-descriptions-item>

                </div>
                <!-- 状态 -->
                <el-descriptions-item :label="$t('default.Status')">{{ form.status_name }}</el-descriptions-item>
                <!-- 采购员 -->
                <el-descriptions-item :label="$t('default.Purchaser')">{{ form.pur_name }}</el-descriptions-item>
                <!-- 供应商 -->
                <el-descriptions-item :label="$t('default.Supplier')">{{ form.sup_name }}</el-descriptions-item>
                <!-- 需求交期 -->
                <el-descriptions-item :label="$t('default.Demand_Delivery')">{{ form.estimated_delivery_time }}</el-descriptions-item>

                <!-- 审核人 -->
                <el-descriptions-item :label="$t('default.Auditor')">{{ form.audit_user_name }}</el-descriptions-item>
                <!-- 审核时间 -->
                <el-descriptions-item :label="$t('default.AuditTime')">{{ form.audit_time }}</el-descriptions-item>
                <!-- 审核备注 -->
                <el-descriptions-item :label="$t('default.Audit_Remarks')">{{ form.audit_desc }}</el-descriptions-item>


                <!-- 扣税类别 -->
                <el-descriptions-item :label="$t('default.Tax_Deduction_Category')">{{ form.tax_deduction_name }}</el-descriptions-item>


                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>


                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>

                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>



            </el-descriptions>
        </el-header>
        <el-main>
            <el-table :data="detailData" border class="table" style="width: 100%">



                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code }}</el-button>                            </div>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications }}</el-button>
                            </div>
                        </el-popover>
                    </template> 
                </el-table-column>

                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')"></el-table-column>
                <!-- 含税单价 -->
                <el-table-column v-if=cost_show prop="norgtaxprice" :label="$t('default.Including_tax_unit_price')"></el-table-column>




                <!-- 实购数 -->
                            <el-table-column prop="real_num" :label="$t('default.Purchase_Number')"></el-table-column>
                <el-table-column prop="available_num" label="库存" width="100">
                    <template v-slot="scope">

                        可用：{{ scope.row.available_num }}
                        <br />
                        在途：{{ scope.row.transit_num }}
                        <br />
                        安全：{{ scope.row.safe_num }}


                    </template>
                </el-table-column>
                <!-- 入库数 -->
                <el-table-column prop="in_num" :label="$t('default.Inventory_Number')" width="100">
                    <template v-slot="scope">

                        已入：{{ scope.row.in_num }}
                        <br />
                        未入：{{ scope.row.wait_in_num }}
                        <br />
                        退货：{{ scope.row.return_num }}

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
                <!-- 项目 -->
                            <el-table-column prop="project_name" :label="$t('default.Project')"></el-table-column>

                <el-table-column prop="ap_code" label="申请编码"></el-table-column>
                <el-table-column prop="pl_code" label="计划编码"></el-table-column>


                <!-- 税率 -->
                    <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>
                <!-- 类型 -->
                            <el-table-column prop="type_name" :label="$t('default.Type')" width="55"></el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>
            </el-table>
        </el-main>
        <el-main>
            <el-table :data="deliveryData" border class="table" style="width: 100%">


                <!-- 送货单号 -->
                <el-table-column prop="order_no" :label="$t('default.Delivery_Order_Number')" width="180">

                    <template slot-scope="scope">
                        <el-input v-model="scope.row.order_no"></el-input>
                    </template>
                </el-table-column>
                <!-- 图片 -->
                            <el-table-column prop="picture" :label="$t('default.Picture')" align="center">
                    <template v-slot="scope">


                        <div v-if=scope.row.picture_url>
                            <el-image class="table-td-thumb" :src="scope.row.picture_url"
                                :preview-src-list="[scope.row.picture_url]"></el-image>
                        </div>
                        <div v-else>
                            <!-- 无图 -->
                            {{ $t('default.No_Picture') }}
                        </div>
                    </template>

                </el-table-column>
                <!-- 备注 -->
                            <el-table-column prop="desc" :label="$t('default.Desc')" width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.desc"></el-input>
                    </template>
                </el-table-column>



            </el-table>
        </el-main>
    </el-container>


</template>


<script>
// import treeTransfer from 'el-tree-transfer' // 引入
// import axios from 'axios'
export default {
    // name: 'PurchaseDetail',
    // components: {
    //     treeTransfer
    // },
    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            pur_code: "",
            cost_show: false,
            form: [],
            detailData: [],



        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });
    },
    methods: {

        // 获取币种
        // getData() {
        //     var token = localStorage.getItem("token");
        //     this.axios.post('/pur/Purchase/Detail', {
        //         token: token
        //     }).then((res) => {
        //         // this.currtype_option = res;
        //         console.log(res);
        //     }).catch(() => {
        //         this.loading = false;
        //     })
        // },
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
