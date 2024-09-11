<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 单据号 -->
                {{ $t('default.Incoming_Batch') }}:<el-input v-model="query.code" :placeholder="$t('default.Please_enter_a_keyword')"
                    class="handle-input mr10 w150"></el-input>
                <!-- 物料编码 -->
                {{ $t('default.Material_Code') }}:
                <el-select v-model="query.mat_code" multiple filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMaterial"
                    :loading="loading" class="w150">
                    <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                        :value="item.mat_code">
                        <span style="float: left">{{ item.mat_code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.label }}</span>
                    </el-option>
                </el-select>


                <!-- 供应商 -->
                {{ $t('default.Supplier') }}：
                <el-select v-model="query.sup_code" multiple filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod" :loading="loading"
                    clearable class="w200">
                    <el-option v-for="item in sup_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 部门 -->
                {{ $t('default.Department') }}：
                <el-select v-model="query.department_id" multiple filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod" :loading="loading"
                    clearable @change="getWare()" class="w200">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 仓库 -->
                {{ $t('default.Warehouse') }}：
                <el-select filterable v-model="query.ware_id" :placeholder="$t('default.Please_select')" clearable
                           class="w150">
                  <el-option v-for="item in ware_options" :key="item.ware_id" :label="item.name"
                             :value="item.ware_id">
                  </el-option>
                </el-select>
                <!-- 收发类别 -->
                {{ $t('default.Receiving_and_Sending_Category') }}
                <el-select v-model="query.cdispatcherid" multiple clearable class="w150">
                    <el-option v-for="item in send_receiving_options" :key="item.se_code" :label="item.name"
                        :value="item.se_code">
                    </el-option>
                </el-select>
                <!-- 签字状态 -->
                {{ $t('default.Signature_Status') }}:
                <el-select v-model="query.status" clearable class="w150">
                    <el-option v-for="item in status_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 创建人 -->
                {{ $t('default.Creator') }}：
                <el-select v-model="query.create_user" filterable multiple remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser"
                    :loading="loading" class="w150">
                    <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <!-- 创建时间 -->
                {{ $t('default.Creation_Date') }}：
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />

                <el-button type="primary" class="handle-del mr10" @click="handleExport">{{ $t('default.Export')
                    }}</el-button><!-- 导出 -->

                <!-- 联查 -->
                <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleSelectOne')"
                           @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>


            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" max-height="550px">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>
                <el-table-column prop="code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.code }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>


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




                <!-- 出库数 -->
                <el-table-column prop="out_num" :label="$t('default.Number_of_outgoing_goods')" width="90"
                    sortable></el-table-column>
              <!-- 签字状态 -->
                <el-table-column prop="status_name" width="105" :label="$t('default.Signature_Status')" sortable>
                    <template v-slot="scope">
                        <div v-if="scope.row.status == 1">
                            <el-tag type="success">{{ scope.row.status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.status == 2">
                            <el-tag type="danger">{{ scope.row.status_name }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <!-- 领料单号 -->
                <el-table-column prop="pi_code" :label="$t('default.Requisition_Order')" align="center">
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handlePicking(scope.row.pi_code)"> {{
                    scope.row.pi_code }}</el-button>
                    </template>
                </el-table-column>
             
               
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

                <!-- 仓库 -->
                <el-table-column prop="ware_name" :label="$t('default.Warehouse')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.ware_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ware_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 收发类别 -->
                <el-table-column prop="cdispatcherid_name" :label="$t('default.Receiving_and_Sending_Category')"
                    width="105" sortable></el-table-column>

                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')" width="75"
                    sortable></el-table-column>
                <el-table-column v-if=cost_show prop="sum_cost" label="总金额" width="90" sortable></el-table-column>
               

                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.create_user_name }}
                                {{ scope.row.create_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.create_user_name
                                    }}{{
                    scope.row.create_time }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="DetailVisible" append-to-body width="80%" title="领料单">
            <picking-detail ref="pickingDetail"></picking-detail>
        </el-dialog>

        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">
          <seledetail ref="seledetail"></seledetail>
        </el-dialog>

        <!-- 导出 -->
        <export ref="export" :data="current" :visible.sync="ExportVisible" @done="reload"></export>

    </div>
</template>

<script>
import PickingDetail from '../produce/PickingApplyDetail.vue';
import Vue from 'vue';
import Export from '../common/Export.vue';
import Seledetail from "@/components/base/SelectOne.vue";
export default {
    name: 'basetable',
    components: {
        Seledetail,
        PickingDetail,
        Export
    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            SelectOneVisible: false,
            query: {
                inout_type: 'out',
                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
            multipleSelection: [],
            delList: [],

            pageTotal: 0,
            form: {},
            value: [],
            list: [],
            loading: false,
            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            ware_options: [],
            department_options: [],
            type_options: [],
            sup_options: [],
            cost_show: false,
            send_receiving_options: [],
            DetailVisible: false,
            mat_options: [],
            user_options: [],
            status_options: [],
            current: {},
            ExportVisible: false,
        };
    },
    mounted() {
        this.list = this.states.map(item => {
            return { value: `${item}`, label: `${item}` };
        });
    },
    methods: {
        // 联查
        handleSelectOne() {
          // 选项的选项数量
          const length = this.multipleSelection.length;
          console.log(this.multipleSelection)
          // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
          if (length == 1) {
            let code = '';
            for (let i = 0; i < length; i++) {
              code = this.multipleSelection[i].code;
            }
            this.SelectOneVisible = true;
            let nextdata = {
              code: code
            };
            this.$nextTick(() => {
              this.$refs.seledetail.dataInitialization(nextdata);
            })
          } else if (length > 1) {
            // 只能选中一项
            this.$message.error(this.$t('default.Only_one_item_can_be_selected'));
          }
          else {
            // 未选中选项！
            this.$message.error(this.$t('default.Unchecked_option'));
          }
        },
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            const create_time = this.query.create_time;
            const create_time_1 = create_time[0];
            const create_time_2 = create_time[1];

            if (create_time_1) {
                this.query.create_time1 = Vue.prototype.FormatTime(create_time_1);
            }
            if (create_time_2) {
                this.query.create_time2 = Vue.prototype.FormatTime(create_time_2);
            }

            this.query.token = localStorage.getItem("token");
            this.axios.get('/ware/InOutLog/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.cost_show = res.cost_show;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

        },
        handlePicking(pi_code) {
            this.DetailVisible = true;

            this.$nextTick(() => {
                this.$refs.pickingDetail.dataInitialization(pi_code);
            })
        },
        // 签收状态
        getStatusArr() {
            var token = localStorage.getItem("token");
            this.axios.post('/ware/Warehousing/getStatusArr', {
                token: token
            }).then((res) => {
                this.status_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                name: '',
                pageIndex: 1,
                pageSize: 20,
                create_time: [],
            }
        },
        remoteMaterial(query) {
            if (query !== '') {
                this.axios.post('/infor/material/getMaterialByCodeName', {
                    token: localStorage.getItem("token"),
                    mat_code: query
                }).then((res) => {
                    this.mat_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },
        // 用户搜索
        remoteMethodUser(query) {
            if (query !== '') {
                this.axios.post('/index/user/getUser', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.user_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },
        // 获取部门
        getDepartment() {
            var token = localStorage.getItem("token");
            this.axios.post('/index/Department/all_department', {
                token: token
            }).then((res) => {
                this.department_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 出库收发存
        getOutSendReceiving() {
            var token = localStorage.getItem("token");
            this.axios.post('/ware/SendReceiving/OutSendReceiving', {
                token: token
            }).then((res) => {
                this.send_receiving_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },

        // 列表导出
        handleExport() {
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    code_arr.push(this.multipleSelection[i].code);
                }
                this.query.code = code_arr;

            }
            this.ExportVisible = true;
            this.query.inout_type = 'out';
            console.log(this.query);
            // return false;

            this.$nextTick(() => {
                this.$refs.export.dataInitialization(this.query, '/ware/InOutLog/ExportFields', '/ware/InOutLog/HandleExport1');

            })

        },
        // 列表导出
        // handleExport() {
        //     this.query.token = localStorage.getItem("token");
        //     this.axios.post('/ware/InOutLog/handleExport1', {
        //         token: localStorage.getItem("token"),
        //         params: this.query
        //     }).then((res) => {
        //         window.open(res);
        //     }).catch(() => {
        //         this.loading = false;
        //     })
        // },
        // 搜索,触发搜索按钮
        handleSearch() {
            // 为this.query新增属性，并更新视图
            this.$set(this.query, 'pageIndex', 1);
            // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
            this.getData();
        },
        // 多选,对表格中的复选框列表做监听，当选择项发生变化则触发handleSelectionChange方法，val为选中数据的集合，通过this.multipleSelection.
        // prop字段取得每一个选项的值，prop字段就是表格子项的prop值。this.multipleSelection.length为选择了多少项
        handleSelectionChange(val) {
            // val表示当前选中的行数据组成的数组
            //选中数据的集合赋给 this.mutipleSelection
            this.multipleSelection = val;
        },
        remoteMethod(query) {
            if (query !== '') {
                this.axios.post('/infor/supply/getSupply', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.sup_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },


        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
        },
        // 获取仓库
        getWare() {
            this.axios.post('/ware/warehouse/ware_list_base_department', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                this.ware_options = res;
            }).catch(() => {
                this.loading = false;
            })
            this.$forceUpdate();
        },
        getType() {
            this.axios.post('/ware/InOutLog/getInOutLogType', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.type_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },

    },
    // 在钩子函数中调用getData方法
    created() {

        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.query.create_time = [start, end];
        this.getData();
        this.getDepartment();
        this.getWare();
        this.getType();
        this.getOutSendReceiving();
        this.getStatusArr();
    }
}
</script>
