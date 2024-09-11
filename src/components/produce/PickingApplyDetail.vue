<template>
    <el-tabs>

        <el-header>
            <el-descriptions class="margin-top" :column="8">
                <!-- 领料单号 -->
                <el-descriptions-item :label="$t('default.Requisition_Order')">{{ form.pi_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name
                    }}</el-descriptions-item>



                <!-- 审核人 -->
                <el-descriptions-item :label="$t('default.Auditor')">{{ form.audit_user_name }}</el-descriptions-item>
                <!-- 审核时间 -->
                <el-descriptions-item :label="$t('default.AuditTime')">{{ form.audit_time }}</el-descriptions-item>
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
            <el-table :data="detailData" border class="table" style="width: 100%" max-height="550px" show-summary
                :summary-method="getSummaries">



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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                scope.row.specifications }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 丝印 -->
                <el-table-column prop="silk" :label="$t('default.Silkscreen')"></el-table-column>
                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')" width="75" sortable>
                    <template v-slot="scope">

                        <el-button type="text" style="color: rgb(39, 36, 36);">{{
                scope.row.cost }}</el-button>

                    </template>
                </el-table-column>
                <el-table-column prop="production_demand" width="75" sortable label="需求"></el-table-column>
                <el-table-column prop="available_num" width="75" sortable label="可用"></el-table-column>
                <el-table-column prop="transit_num" width="75" sortable label="在途"></el-table-column>
                <el-table-column prop="out_num" width="75" sortable label="已出"></el-table-column>
                <el-table-column prop="wait_out_num" width="75" sortable label="未出"></el-table-column>
                <el-table-column prop="pn" label="PN" width="70"></el-table-column>
                <!-- 任务令 -->
                <el-table-column prop="task_order" :label="$t('default.Task_Order')"></el-table-column>
                <!-- 项目 -->
                <el-table-column prop="project_name" :label="$t('default.Project')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.project_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.project_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="mat_model" label="使用机型"></el-table-column>

                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
            </el-table>
        </el-main>


    </el-tabs>
</template>


<script>

export default {

    data() {
        return {

            deliveryData: [],
            pur_code: "",
            cost_show: false,
            form: [],
            detailData: [],
            purchaseVisible: false,


        };
    },

    methods: {

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
                        case 9:
                        case 10:
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
        dataInitialization(pi_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.pi_code = pi_code;
            that.axios
                .get(
                    "/pro/PickingApply/Detail?pi_code=" + pi_code + '&token=' + token
                )
                .then(res => {
                    // that.fromData = res.data.data.fromData;
                    // that.toData = res.data.data.toData;
                    // console.info("this id ");

                    this.detailData = res.list;
                    this.form = res.info;
                    this.cost_show = res.cost_show;
                    this.outboundData = res.outbound_item_list;

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
