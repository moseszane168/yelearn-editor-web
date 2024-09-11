<template>
    <!-- 一、用户登录信息卡片 -->
    <!-- span占据的列数，占8列 -->
    <div>
        <!-- 第一部分 -->
        <el-row :gutter="20">
            <!-- 1.1 -->
            <el-col :span="8">

                <el-card shadow="hover" class="mgb20" style="height:260px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="" />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ name }}</div>
                        </div>
                    </div>

                    <div class="user-info-list">{{ $t('default.Role') }}:<span>{{ userinfo.role_name }}</span></div>
                    <div class="user-info-list">{{ $t('default.department') }}：<span>{{ userinfo.department_name
                            }}</span></div>
                </el-card>




                <el-card shadow="hover">
                    <!-- 采购订单 -->
                    <el-descriptions class="margin-top" :title="$t('default.Purchase_Order')" :column="2" border>
                        <!-- 价格变动审核 -->
                        <el-descriptions-item label-class-name="my-label">
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Price_Change_Audit')}}</span>
                            </template>
                            {{ PUTable.wait_count }}
                        </el-descriptions-item>
                        <!-- 价格变动驳回 -->
                        <el-descriptions-item label-class-name="my-label">
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Price_Change_Reject')}}</span>
                            </template>
                            {{ PUTable.refuse_count }}
                        </el-descriptions-item>

                        <!-- 待审核 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Pending_Audit')}}</span>
                            </template>
                            {{ PUTable.pass_count }}
                        </el-descriptions-item>
                        <!-- 超期预警 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Overdue_Alert')}}</span>
                            </template>
                            {{ PLTable.warning_cutoff_order }}
                        </el-descriptions-item>
                        <!-- 在途 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.In_Transit')}}</span>
                            </template>
                            {{ PUTable.ining_count }}
                        </el-descriptions-item>
                    </el-descriptions>



                </el-card>
                <!-- 发票 -->
                <el-card shadow="hover">
                    <el-descriptions class="margin-top" :title="$t('default.Invoice')" :column="2" border>
                        <!-- 待发票制作 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Pending_Invoice')
                                    }}</span>
                            </template>
                            {{ INVTable.wait_doing }}
                        </el-descriptions-item>

                        <!-- 待审核 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Pending_Audit')
                                    }}</span>
                            </template>
                            {{ INVTable.wait_count }}
                        </el-descriptions-item>
                    </el-descriptions>

                </el-card>
            </el-col>


            <!-- 需求申请 -->
            <el-col :span="16">
                <el-card shadow="hover">

                    <el-descriptions class="margin-top" :title="$t('default.Demand_Request')" :column="3" border>
                        <!-- 待生产审核 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{
            $t('default.Pending_Production_Approval') }}</span>
                            </template>
                            {{ APTable.wait_count }}
                        </el-descriptions-item>
                        <!-- 待资产审核 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{
            $t('default.To_be_reviewed_by_Finance') }}</span>
                            </template>
                            {{ APTable.one_count }}
                        </el-descriptions-item>
                        <!-- 待副总审核 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{
            $t('default.To_be_reviewed_by_Vice_President') }}</span>
                            </template>
                            {{ APTable.twe_count }}
                        </el-descriptions-item>
                        <!-- 物料申请 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Material_Request')
                                    }}</span>
                            </template>
                            {{ APTable.mat_count }}
                        </el-descriptions-item>
                        <!-- 固资申请 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Fixtures_Request')
                                    }}</span>
                            </template>
                            {{ APTable.assets_count }}
                        </el-descriptions-item>
                        <!-- 待下单 -->
                        <el-descriptions-item>
                            <template slot="label">
                                <span style="font-weight: bolder;font-size: 12.5px;">{{ $t('default.Pending_Order')
                                    }}</span>
                            </template>
                            {{ APTable.wait_buy_count }}
                        </el-descriptions-item>


                    </el-descriptions>
                </el-card>



                <el-card shadow="hover">

                    <el-descriptions class="margin-top" :title="$t('default.Departmental_Statistics')" :column="2"
                        border>

                    </el-descriptions>
                    <el-table :data="PITable" style="width: 100%" border show-summary :sum-text="$t('default.total')">
                        <el-table-column prop="department_name" :label="$t('default.department')" width="180">

                            <!-- 部门" -->

                        </el-table-column>
                        <el-table-column prop="warning_wait_order" :label="$t('default.Purchasing_to_be_stocked')">
                        </el-table-column>
                        <el-table-column prop="picking_wait_order"
                            :label="$t('default.Receiving_material_to_be_out_of_stock')">
                        </el-table-column>

                        <el-table-column prop="plan_wait_order" :label="$t('default.Requirements_to_be_reviewed')">
                        </el-table-column>
                        <el-table-column prop="warehousing_wait" :label="$t('default.Incoming_stock_pending_review')">
                        </el-table-column>
                        <el-table-column prop="outbound_wait" :label="$t('default.Outbound_Pending')">
                        </el-table-column>
                        <el-table-column prop="transfer_wait_order" width="100"
                            :label="$t('default.Transfers_out_to_be_reviewed')">
                        </el-table-column>
                        <el-table-column prop="transfer_wait_in_order" width="100"
                            :label="$t('default.Transfer_in_pending_review')">
                        </el-table-column>
                    </el-table>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>
<script>
import CustomCard from '../common/CustomCard';
import MyEcharts from '../common/MyEcharts.vue';
import { option1, option2 } from '../../options';
// import VueI18n from 'vue-i18n';
// import { messages } from './utils/i18n';


export default {
    name: 'dashboard',
    components: {
        CustomCard,
        MyEcharts
    },

    data() {
        return {
            name: localStorage.getItem('ms_username'),
            department_id: localStorage.getItem('department_id'),
            options: option1,
            options1: option2,
            width: '100%',
            userinfo: [],
            // Demand_Request: this.$t('default.Demand_Request'),
            data: [
                {
                    name: '2021/09/04',
                    value: 1083
                },
                {
                    name: '2021/09/05',
                    value: 941
                },
                {
                    name: '2021/09/06',
                    value: 1139
                },
                {
                    name: '2021/09/07',
                    value: 816
                },
                {
                    name: '2021/09/08',
                    value: 327
                },
                {
                    name: '2021/09/09',
                    value: 228
                },
                {
                    name: '2021/09/10',
                    value: 1065
                }
            ],

            APTable: [],// 需求申请
            PUTable: [],// 采购计划
            PLTable: [],//
            PITable: [],// 领料单
            FIXTable: [],// 固定资产
            INVTable: [],// 发票
            PENDTable: [],
            deputyTable: [],// 副总待审核
            department_options: [],
        };
    },
    computed: {
        // 利用三元表达式对用户登录后身份进行判定
        role() {
            return this.name === 'AsunaCC' ? '超级管理员' : '普通用户';
        }
    },
    created() {
        this.getTable();
        this.changeDate();
        this.getUserInfo();

        // console.log(Demand_Request);
        // this.getDepartment();
    },
    methods: {
        changeDate() {
            // 获取1970年1月1日至今德邦毫秒数
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                //将data中的模拟数据转化为当前日期为基准的时间
                const date = new Date(now - (6 - index) * 86400000);
                // 从当前日期往前推算一周，计算出一周内每一天的日期。
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        goToOtherUrl() {
            var token = localStorage.getItem("token");
            window.location.href = 'http://127.0.0.1:1011/lYmQViuDMo.php/index/index?token=' + token;
        },
        // 获取部门
        getUserInfo() {
            var token = localStorage.getItem("token");
            this.axios.post('/index/user/getThisUserInfo', {
                token: token
            }).then((res) => {
                this.userinfo = res;
                // console.log(res);
            }).catch(() => {
                this.loading = false;
            })
        },

        getTable() {
            var token = localStorage.getItem("token");
            this.axios.post('/index/Dashboard/index', {
                token: token
            }).then((res) => {
                // console.log(res);
                this.APTable = res.AP;
                this.PUTable = res.PU;
                this.PITable = res.PI;
                this.PLTable = res.PL;
                this.FIXTable = res.FIX;
                this.PENDTable = res.PEND;
                this.INVTable = res.INV;
                // console.log(res);
                // this.deputyTable = res.deputy;
                // console.log(this.PITable);
            }).catch(() => {
                this.loading = false;
            })
        },
    },
}
</script>
<style scoped>
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
    float: right;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.el-row {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}
</style>