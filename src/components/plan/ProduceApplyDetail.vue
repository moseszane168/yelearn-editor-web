<template>
    <el-container>
        <el-header height="30">
            <el-descriptions :column="8">
                <!-- 需求单号 -->
                <el-descriptions-item :label="$t('default.Demand_Order_Number')">{{ form.ppm_code
                    }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name
                    }}</el-descriptions-item>
                <div v-if=cost_show>
                    <el-descriptions-item label="总价">{{ form.total_price }}</el-descriptions-item>
                </div>
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
            <el-table :data="detailData" border show-summary class="table" style="width: 100%" height="500">
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>




                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" sortable width="105">
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




                <!-- 申请 -->
                <el-table-column prop="apply_num" width="75" :label="$t('default.Request')" sortable></el-table-column>
                <!-- 可用 -->
                <el-table-column prop="available_num" width="75" :label="$t('default.Available')"
                    sortable></el-table-column>
                <el-table-column prop="transit_num" width="75" label="在途" sortable></el-table-column>
                <el-table-column prop="safe_num" width="75" label="安全" sortable></el-table-column>



                <el-table-column v-if=cost_show prop="cost" width="75" label="单价" sortable></el-table-column>



                <!-- 类型 -->
                <el-table-column prop="type_name" :label="$t('default.Type')"></el-table-column>


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


            </el-table>

        </el-main>


    </el-container>
</template>


<script>

export default {

    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            ppm_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            purchaseVisible: false,
            type: false,


        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });
    },
    methods: {



        //初始化数据
        dataInitialization(ppm_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.ppm_code = ppm_code;
            that.axios
                .get(
                    "/plan/ProduceApply/Detail?ppm_code=" + ppm_code + '&token=' + token
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
