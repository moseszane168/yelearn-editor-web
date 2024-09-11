


<template>
    <el-container>
        <el-header height="300">
            <el-descriptions>
                <el-descriptions-item label="发票号">{{ form.inv_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name }}</el-descriptions-item>


                <!-- 供应商 -->
                <el-descriptions-item :label="$t('default.Supplier')">{{ form.sup_name }}</el-descriptions-item>
                <!-- 扣税类别 -->
                <el-descriptions-item :label="$t('default.Tax_Deduction_Category')">{{ form.idiscounttaxtype_name }}</el-descriptions-item>
                <el-descriptions-item label="整单税率">{{ form.tax_rate }}</el-descriptions-item>
                <el-descriptions-item label="业务流程">{{ form.cbiztype_name }}</el-descriptions-item>

                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>
                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>


                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>






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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications
                                }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="ninvoicenum" label="发票数量"></el-table-column>
                <!-- 含税单价 -->
                <el-table-column v-if=cost_show prop="norgtaxprice" :label="$t('default.Including_tax_unit_price')"></el-table-column>
                <el-table-column v-if=cost_show prop="noriginalcurprice" label="单价"></el-table-column>
                <el-table-column v-if=cost_show prop="noriginalsummny" label="价税合计"></el-table-column>
                <!-- 金额 -->
                <el-table-column v-if=cost_show prop="total_price" :label="$t('default.Amount')"></el-table-column>
                <!-- 税率 -->
                <el-table-column v-if=cost_show prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>


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
            
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>
                <el-table-column prop="wi_code" label="入库单号"></el-table-column>
            </el-table>
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

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            inv_code: "",
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
        //初始化数据
        dataInitialization(inv_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.inv_code = inv_code;
            that.axios
                .get(
                    "/pur/Invoice/InvoiceDetail?inv_code=" + inv_code + '&token=' + token
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
