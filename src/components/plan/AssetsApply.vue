<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 物料编码 -->
                {{ $t('default.Material_Code') }}：
                <el-select v-model="query.mat_code" multiple filterable class="w150" remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMaterial"
                    :loading="loading">
                    <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                        :value="item.mat_code">
                        <span style="float: left">{{ item.mat_code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.label }}</span>
                    </el-option>
                </el-select>
                <!-- 申请主表编码 -->
                {{ $t('default.Request_Master_Table_Code') }}：
                <el-input v-model="query.apm_code" :placeholder="$t('default.Please_enter_a_keyword')"  class="handle-input mr10 w150"></el-input>
                <!-- 申请编码 -->
                {{ $t('default.Application_Code') }}：
                <el-input v-model="query.ap_code" :placeholder="$t('default.Please_enter_a_keyword')"  class="handle-input mr10 w150"></el-input>
                <!-- 创建人 -->
                {{ $t('default.Creator') }}：
                <el-select v-model="query.create_user" filterable multiple remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser"
                    :loading="loading">
                    <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')" :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />

                <el-button type="primary" class="handle-del mr10" @click="handleAuditOne"
                    v-if="permission.includes('AssetsApply:handleAuditOne')">生产部门审核</el-button>
             
                <el-button type="primary" class="handle-del mr10" @click="handleAuditThree"
                    v-if="permission.includes('AssetsApply:handleAuditThree')">资材经理审核</el-button>
                <el-button type="primary" class="handle-del mr10" @click="handleAuditFour"
                    v-if="permission.includes('AssetsApply:handleAuditFour')">副总审核</el-button>

            </div>

            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="ten"></el-tab-pane>
                    <el-tab-pane label="生产部门审核" name="first"></el-tab-pane>
                   
                    <el-tab-pane label="资材经理审核" name="third"></el-tab-pane>
                    <el-tab-pane label="副总审核" name="fourth"></el-tab-pane>
                    <el-tab-pane label="审核通过" name="five"></el-tab-pane>

                    <el-tab-pane label="生产部门驳回" name="six"></el-tab-pane>
               
                    <el-tab-pane label="资材经理驳回" name="eight"></el-tab-pane>
                    <el-tab-pane label="副总驳回" name="nine"></el-tab-pane>

                </el-tabs>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                
                <!-- 需求单号 -->
                <el-table-column prop="apm_code" :label="$t('default.Demand_Order_Number')">
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" :style="scope.row.status== '3' ? 'color:red;' : 'color:#409EFF;'" @click="handleApply(scope.row.apm_code)"> {{
                    scope.row.apm_code }}</el-button>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center">
                    <template v-slot="scope">

                        <el-button type="text"
                            v-if="permission.includes('AssetsApply:handleAuditOne') && scope.row.status == 1"
                            @click="handleEdit(scope.$index, scope.row)">{{ $t('default.Audit') }}</el-button><!-- 审核 -->

                        <el-button type="text"
                            v-if="permission.includes('AssetsApply:handleAuditTwo') && scope.row.status == 2"
                            @click="handleEdit(scope.$index, scope.row)">{{ $t('default.Audit') }}</el-button><!-- 审核 -->

                        <el-button type="text"
                            v-if="permission.includes('AssetsApply:handleAuditThree') && scope.row.status == 4"
                            @click="handleEdit(scope.$index, scope.row)">{{ $t('default.Audit') }}</el-button><!-- 审核 -->

                        <el-button type="text"
                            v-if="permission.includes('AssetsApply:handleAuditFour') && scope.row.status == 6"
                            @click="handleEdit(scope.$index, scope.row)">{{ $t('default.Audit') }}</el-button><!-- 审核 -->


                    </template>
                </el-table-column>

                <!-- 状态 -->
                <el-table-column prop="status_name" :label="$t('default.Status')">
                    <template v-slot="scope">
                        {{ scope.row.status_name }}
                        <br />
                        {{ scope.row.order_status_name }}

                    </template>
                </el-table-column>




                <!-- 预警 -->
                <el-table-column prop="warning" :label="$t('default.Early_warning')">
                    <template v-slot="scope">
                        <div v-if="scope.row.warning == 'success'">
                            <el-button type="success" disabled>正常</el-button>
                        </div>
                        <div v-if="scope.row.warning == 'warning'">
                            <el-button type="warning" disabled>警告</el-button>
                        </div>
                        <div v-if="scope.row.warning == 'danger'">
                            <el-button type="danger" disabled>危险</el-button>
                        </div>

                    </template>
                </el-table-column>

                <!-- 生产审核 -->
                <el-table-column prop="audit_user_name" :label="$t('default.Production_Audit')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_name }}{{ scope.row.audit_time }}{{ scope.row.audit_desc }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_name }}{{
                    scope.row.audit_time }}{{ scope.row.audit_desc }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 资材审核 -->
                <el-table-column prop="audit_user_twe_name" :label="$t('default.Material_Audit')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_twe_name }}{{ scope.row.audit_time_twe }}{{
                    scope.row.audit_desc_twe }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_twe_name
                                    }}{{
                    scope.row.audit_time_twe }}{{ scope.row.audit_desc_twe }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>
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
                <!-- 更新时间 -->
                <el-table-column prop="update_time" :label="$t('default.Update_Time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.update_user_name }}
                                {{ scope.row.update_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.update_user_name }}
                                    {{ scope.row.update_time }}</el-button>

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

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog :title=dialogAudit :visible.sync="auditVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">


                <el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.desc"></el-input>

                </el-form-item>


            </el-form>

            <span slot="footer" class="dialog-footer">

                <el-button type="primary" @click="savePass">审核通过</el-button>
                <el-button @click="saveFail">审核不通过</el-button>
            </span>
        </el-dialog>




        <el-dialog title="审核" :visible.sync="editVisible" width="90%">
            <el-descriptions>
                <!-- 需求单号 -->
                <el-descriptions-item :label="$t('default.Demand_Order_Number')">{{ form.apm_code }}</el-descriptions-item>
                <!-- 部门 -->
                <el-descriptions-item :label="$t('default.Department')">{{ form.department_name }}</el-descriptions-item>


                <div v-if=cost_show>
                    <el-descriptions-item label="总价">{{ form.total_price }}</el-descriptions-item>

                </div>

                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>





            </el-descriptions>
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">

                <el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.desc"></el-input>

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">

                <el-button type="primary" @click="auditDetailPass">审核通过</el-button>
                <el-button @click="saveDetailFail">审核不通过</el-button>
            </span>


            <el-table :data="detailData" border class="table" style="width: 100%" height="500">


                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center" width="100">
                    <template v-slot="scope">

                        
                        <el-radio v-model="scope.row.audit" label="2">驳回</el-radio>


                    </template>
                </el-table-column>
                <el-table-column label="审核备注" align="center">
                    <template v-slot="scope">

                        <el-input v-model="scope.row.audit_desc_null"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="ap_code" label="明细编码" align="center"></el-table-column>
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
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
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
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




                <el-table-column prop="production_demand" label="申请量">
                    <template v-slot="scope">
                        需求: {{ scope.row.production_demand }}
                        <br />
                        申请:{{ scope.row.apply_num }}

                    </template>
                </el-table-column>

                <el-table-column prop="available_num" label="库存">
                    <template v-slot="scope">
                        可用：{{ scope.row.available_num }}
                        <br />
                        在途：{{ scope.row.transit_num }}
                        <br />
                        安全：{{ scope.row.safe_num }}
                    </template>
                </el-table-column>
                <div v-if=cost_show>
                    <!-- 单价 -->
                    <el-table-column prop="cost" :label="$t('default.Unit_Price')" width="55"></el-table-column>

                </div>

                <!-- 类型 -->
                            <el-table-column prop="type_name" :label="$t('default.Type')" width="55"></el-table-column>
                <!-- 状态 -->
                <el-table-column prop="status_name" :label="$t('default.Status')">
                    <template v-slot="scope">
                        {{ scope.row.status_name }}
                        <br />
                        {{ scope.row.order_status_name }}

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
                </el-table-column> -->

                <!-- 预警 -->
                <el-table-column prop="warning" :label="$t('default.Early_warning')">
                    <template v-slot="scope">
                        <div v-if="scope.row.warning == 'success'">
                            <el-button type="success" disabled>正常</el-button>
                        </div>
                        <div v-if="scope.row.warning == 'warning'">
                            <el-button type="warning" disabled>警告</el-button>
                        </div>
                        <div v-if="scope.row.warning == 'danger'">
                            <el-button type="danger" disabled>危险</el-button>
                        </div>

                    </template>
                </el-table-column>

                <!-- 生产审核 -->
                <el-table-column prop="audit_user_name" :label="$t('default.Production_Audit')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_name }}{{ scope.row.audit_time }}{{ scope.row.audit_desc }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_name }}{{
                    scope.row.audit_time }}{{ scope.row.audit_desc }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="audit_user_one_name" label="行政审核">
                    <template v-slot="scope">
                        {{ scope.row.audit_user_one_name }}
                        <br />
                        {{ scope.row.audit_time_one }}
                        <br />
                        {{ scope.row.audit_desc_one }}
                    </template>
                </el-table-column>
                <!-- 资材审核 -->
                <el-table-column prop="audit_user_twe_name" :label="$t('default.Material_Audit')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_twe_name }}{{ scope.row.audit_time_twe }}{{
                    scope.row.audit_desc_twe }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_twe_name
                                    }}{{
                    scope.row.audit_time_twe }}{{ scope.row.audit_desc_twe }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 副总审核 -->
                <el-table-column prop="apply_num" :label="$t('default.Vice_President_Audit')">
                    <template v-slot="scope">
                        {{ scope.row.audit_user_three_name }}
                        <br />
                        {{ scope.row.audit_time_three }}
                        <br />
                        {{ scope.row.audit_desc_three }}
                    </template>
                </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>



               

            </el-table>

        </el-dialog>

        <el-dialog :visible.sync="detailVisible" append-to-body width="100%" :title="$t('default.Requirement')"><!-- 需求单 -->
            <apply ref="apply"></apply>
        </el-dialog>


    </div>
</template>

<script>
import Apply from '../plan/ApplyDetail.vue';
import Vue from 'vue';

export default {
    name: 'basetable',
    components: {
        Apply,
        
    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                token: '',
                create_time: [],
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],

            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            rules: {
                // mat_code: [
                //     { required: true, message: '请输入物料编码', trigger: 'blur' },
                //     // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                // ],
                // apply_num: [
                //     { required: true, message: '请输入申请量', trigger: 'blur' },
                //     // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                // ],
            },
            options: [],
            value: [],
            list: [],
            loading: false,

            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            available_num: '',
            transit_num: '',
            mat_name: '',
            show_type: true,
            audit_type: 1,
            dialogAudit: '',
            auditVisible: false,
            assetCodeShow: false,
            cost_show: false,
            detailData: [],
            detailVisible: false,
            editVisible: false,
            activeName: 'ten',
            user_options: [],
            mat_options:[],
        };
    },
    mounted() {
        this.list = this.states.map(item => {
            return { value: `${item}`, label: `${item}` };
        });
    },
    methods: {
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
            this.axios.get('/plan/planAssetsApply/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.cost_show = res.cost_show
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })
        },
        handleEdit(index, row) {
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            this.detailData = this.form.audit_arr;
            this.editVisible = true;
        },
        //需求单详情页
        handleApply(apm_code) {
            this.detailVisible = true;
            this.$nextTick(() => {
                this.$refs.apply.dataInitialization(apm_code);
                // this.$refs.apply.tableRowClassName();
            })
        },
        // 获取物料
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
                this.mat_options = [];
            }
        },
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
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
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

        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
        },

        remoteMethod(query) {
            if (query !== '') {
                this.axios.post('/infor/material/getMaterialByCodeName', {
                    token: localStorage.getItem("token"),
                    mat_code: query
                }).then((res) => {
                    this.options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
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
        handleAuditOne() {
            this.dialogAudit = '生产部门审核';
            this.auditVisible = true;
            this.audit_type = 1;
            this.assetCodeShow = false;
        },
        handleAuditTwo() {
            this.dialogAudit = '行政审核';
            this.auditVisible = true;
            this.audit_type = 2;
            this.assetCodeShow = true;
        },
        handleAuditThree() {
            this.dialogAudit = '资材经理审核';
            this.auditVisible = true;
            this.audit_type = 4;
            this.assetCodeShow = false;
        },
        handleAuditFour() {
            this.dialogAudit = '副总审核';
            this.auditVisible = true;
            this.audit_type = 6;
            this.assetCodeShow = false;
        },

        savePass() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/plan/planAssetsApply/auditPass', {
                    token: localStorage.getItem("token"),
                    selection: this.multipleSelection,
                    params: this.form,
                    audit_type: this.audit_type

                }).then((res) => {
                    console.log(res);
                    this.$message.success('审核成功');
                    this.auditVisible = false;
                    this.getData();
                    this.$set(this.tableData, this.idx, this.form);
                }).catch(() => {
                    this.loading = false;
                })
                this.multipleSelection = [];
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },

        saveFail() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/plan/planAssetsApply/auditFail', {
                    token: localStorage.getItem("token"),
                    selection: this.multipleSelection,
                    params: this.form,
                    audit_type: this.audit_type

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.auditVisible = false;
                    this.getData();

                    this.$set(this.tableData, this.idx, this.form);
                }).catch(() => {
                    this.loading = false;
                })

                // 将选中的选项置为空，即不再选中任何一项
                this.multipleSelection = [];
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },


        auditDetailPass() {

            this.axios.post('/plan/planAssetsApply/auditDetailPass', {
                token: localStorage.getItem("token"),
                // selection: this.multipleSelection,
                params: this.form,
                // audit_type: this.audit_type,
                orderData: this.detailData,

            }).then((res) => {
                console.log(res);
                this.$message.success('审核成功');
                this.editVisible = false;
                this.getData();
                // this.$set(this.tableData, this.idx, this.form);
                // this.multipleSelection = [];
            }).catch(() => {
                this.loading = false;
            })
        },
        saveDetailFail() {
            this.axios.post('/plan/planAssetsApply/auditDetailFail', {
                token: localStorage.getItem("token"),
                // selection: this.multipleSelection,
                params: this.form,
                // audit_type: this.audit_type,
                orderData: this.detailData,

            }).then((res) => {
                console.log(res);
                this.$message.success('审核成功');
                this.editVisible = false;
                this.getData();
                // this.$set(this.tableData, this.idx, this.form);
                // this.multipleSelection = [];
            }).catch(() => {
                this.loading = false;
            })
        },
        handleClick(tab, event) {
            // console.log(tab, event);

            console.log(tab._props.label);
            if (tab._props.label == '生产部门审核') {
                this.query.status = 1
            } else if (tab._props.label == '行政审核') {
                this.query.status = 2
            } else if (tab._props.label == '生产部门驳回') {
                this.query.status = 3
            } else if (tab._props.label == '资材经理审核') {
                this.query.status = 4
            } else if (tab._props.label == '行政驳回') {
                this.query.status = 5
            } else if (tab._props.label == '副总审核') {
                this.query.status = 6
            } else if (tab._props.label == '资产经理驳回') {
                this.query.status = 7
            } else if (tab._props.label == '副总驳回') {
                this.query.status = 8
            } else if (tab._props.label == '审核通过') {
                this.query.status = 9
            } else if (tab._props.label == '全部') {
                this.query.status = ''
            }

            // 重新获取数据
            this.getData();

        }
    },
    // 在钩子函数中调用getData方法
    created() {

        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        this.query.create_time = [start, end];
        this.permission = JSON.parse(this.permission);
        this.getData();
    }
}
</script>
