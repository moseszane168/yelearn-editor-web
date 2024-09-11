<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 单据号 -->
                {{ $t('default.Incoming_Batch') }}:
                <el-input v-model="query.wi_code" :placeholder="$t('default.Please_enter_a_keyword')"
                    class="handle-input mr10 w150"></el-input>
                <!-- 部门 -->
                {{ $t('default.Department') }}：
                <el-select v-model="query.department_id" multiple clearable :placeholder="$t('default.Please_select')"
                    @change="getWare()">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 仓库 -->
                {{ $t('default.Warehouse') }}：<el-select multiple filterable v-model="query.ware_id"
                    :placeholder="$t('default.Please_select')">
                    <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name"
                        :value="item.ware_id">
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
                {{ $t('default.Creation_time') }}：<el-date-picker v-model="query.create_time" type="daterange"
                    align="right" unlink-panels :range-separator="$t('default.To')"
                    :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>

                <!-- 收发类别 -->
                {{ $t('default.Receiving_and_Sending_Category') }}：
                <el-select v-model="query.cdispatcherid" multiple clearable :placeholder="$t('default.Please_select')"
                    class="w150">
                    <el-option v-for="item in send_receiving_options" :key="item.value" :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 签字状态 -->
                {{ $t('default.Signature_Status') }}:
                <el-select v-model="query.status" clearable :placeholder="$t('default.Please_select')" class="w150">
                    <el-option v-for="item in status_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 推送状态 -->
                {{ $t('default.Push_Status') }}:<el-select filterable v-model="query.push"
                    :placeholder="$t('default.Please_select')" clearable class="w150">
                    <el-option v-for="item in push_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>

                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>

                <br />
                <br />
                <!-- 其他入库 -->
                <el-button type="primary" class="handle-del mr10" @click="handleOtherIn"
                    v-if="permission.includes('Warehousing:handleOtherIn')">{{ $t('default.Other_Inbound')
                    }}</el-button>
                <el-button type="primary" class="handle-del mr10" @click="saveAuditPass"
                    v-if="permission.includes('Warehousing:handleAudit')">{{
                    $t('default.Signature') }}</el-button><!-- 签字 -->
                <el-button type="primary" class="handle-del mr10" @click="saveAuditFail"
                    v-if="permission.includes('Warehousing:handleCancelAudit')">{{
                    $t('default.Cancel_Signature') }}</el-button><!-- 取消签字 -->
                <!-- 导出 -->
                <el-button type="primary" class="handle-del mr10" @click="handleExport">{{ $t('default.Export')
                    }}</el-button>


                <el-button type="primary" class="handle-del mr10" @click="handleCrpustU8"
                    v-if="permission.includes('Purchase:handleCrpustU8')">{{ $t('default.Create_push_U8')
                    }}</el-button><!-- 创建推送U8 -->
                <!-- 推送U8 -->
                <el-button type="primary" class="handle-del mr10" @click="Push"
                    v-if="permission.includes('Purchase:Push')">{{ $t('default.Push') }}U8</el-button>
                <!-- 拉取U8 -->
                <el-button type="primary" class="handle-del mr10" @click="PuLLU8"
                    v-if="permission.includes('Purchase:Push')">{{ $t('default.Pull') }}U8</el-button>

              <!-- 联查 -->
              <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleSelectOne')"
                         @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>


            </div>



            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" max-height="550px">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center">
                    <template v-slot="scope">
                        <div v-if="isWareSuper || scope.row.create_user == uid">

                            <el-button type="text" @click="handleEdit(scope.row.wi_code,scope.row.department_id)"
                                v-if="scope.row.status == 2 && permission.includes('Warehousing:handleEdit')">{{
                    $t('default.Edit') }}</el-button><!-- 编辑 -->
                            <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                                @click="handleDelete(scope.$index, scope.row)"
                                v-if="scope.row.status == 2 && permission.includes('Warehousing:handleDelete')">{{
                    $t('default.Delete') }}</el-button><!-- 删除 -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="50"></el-table-column>
                <el-table-column prop="wi_code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)"> {{
                    scope.row.wi_code }}</el-button>
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
                <!-- 收发类别 -->
                <el-table-column prop="cdispatcherid_name"
                    :label="$t('default.Receiving_and_Sending_Category')"></el-table-column>
                <!-- 签字状态 -->
                <el-table-column prop="status_name" :label="$t('default.Signature_Status')" width="105" sortable>
                    <template v-slot="scope">
                        <div v-if="scope.row.status == 1">
                            <el-tag type="success">{{ scope.row.status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.status == 2">
                            <el-tag type="danger">{{ scope.row.status_name }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <!-- U8状态 -->
                <el-table-column prop="fbillflag_name" :label="$t('default.U8Status')">
                    <template v-slot="scope">
                        <el-popover v-if="scope.row.push == 3" trigger="hover" placement="top">
                            <p>{{ scope.row.return_date }}</p>
                            <div slot="reference" class="name-wrapper">
                                <i class="el-icon-warning" style="color: red;"></i>
                            </div>
                        </el-popover>
                        <i v-if="scope.row.vbillcode" class="el-icon-top"></i>
                        <el-button type="text" style="color: rgb(39, 36, 36);" v-if="scope.row.push == 2">
                            {{
                    scope.row.fbillflag_name }}</el-button>
                    </template>
                </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>


                <!-- 签字时间 -->
                <el-table-column prop="audit_time" :label="$t('default.Signature_Time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_name }}
                                {{ scope.row.audit_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.audit_user_name }}{{
                    scope.row.audit_time }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 单据日期 -->
                <el-table-column prop="dbilldate" :label="$t('default.Document_date')"></el-table-column>
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

        <!-- 其他入库 -->
        <el-dialog :title="$t('default.Other_Inbound')" :visible.sync="otherVisible" width="80%"
            :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="105px" size="mini">
                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')" prop="department_id">
                    <el-select v-model="form.department_id" @change="DepartmentChange()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 仓库 -->
                <el-form-item :label="$t('default.Warehouse')" prop="ware_id">
                    <el-select filterable v-model="form.ware_id" :placeholder="$t('default.Please_select')"
                        @change="wareChange()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in ware_options" :key="item.ware_id" :label="item.name"
                            :value="item.ware_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 收发类别 -->
                <el-form-item :label="$t('default.Receiving_and_Sending_Category')" prop="cdispatcherid">
                    <el-select v-model="form.cdispatcherid" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in send_receiving_options" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 单据日期 -->
                <el-form-item :label="$t('default.Document_date')">
                    <el-date-picker v-model="form.dbilldate_w" type="date" :placeholder="$t('default.Select_Date')">
                    </el-date-picker>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <div v-show="bonded_show">
                    <!-- 保税入库类型 -->
                    <el-form-item :label="$t('default.Bonded_In_Type')">
                        <el-select v-model="form.stotage_type" :placeholder="$t('default.Please_select')" clearable
                                   transfer="true" :popper-append-to-body="false">
                            <el-option v-for="item in BondedWarehousingType_options" :key="item.value"
                                :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

            </el-form>
            <template>
                <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                <el-button type="primary" @click="getDefaultLocation">{{ $t('default.Inventory_Enquiry')
                    }}</el-button><!-- 查询库存 -->
                <el-button type="primary" @click="downloadFile(other_download_file)">{{
                    $t('default.Download_Import_Template') }}</el-button><!-- 下载导入模板 -->
                <el-tooltip class="item" effect="dark"
                    :content="$t('default.Batch_synchronization_of_customs_declaration_number_and_endorsement_list')"
                    placement="top-start">
                    <el-button type="primary" @click="syncHg">{{ $t('default.Batch_synchronisation')
                        }}</el-button><!-- 批同 -->
                </el-tooltip>
                <el-upload :on-success="handleSuccess" class="upload-demo" style="float: left;margin-right: 5px;"
                    :action="OtherWarehousing_url">

                    <el-button type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                </el-upload>

                <el-table :data="orderData" style="width: 100%" @selection-change="handleOrderSelectionChange" border
                    class="table" ref="multipleTable" header-cell-class-name="table-header" show-summary
                    :summary-method="getSummaries">


                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <!-- 物料编码 -->
                    <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword
                                :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod"
                                :loading="loading" @change="wareChange()"
                                transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                                    :value="item.mat_code">
                                    <span style="float: left">{{ item.mat_code }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                                </el-option>
                            </el-select>
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.model
                                        }}</el-button>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <!-- 库存 -->
                    <el-table-column prop="real_num" :label="$t('default.Inventory')"></el-table-column>
                    <!-- 入库数 -->
                    <el-table-column prop="real_in_num" :label="$t('default.Inventory_Number')">
                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.real_in_num"></el-input>
                        </template>
                    </el-table-column>

                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">
                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.desc"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 库位 -->
                    <el-table-column prop="ware_location" :label="$t('default.Location')" width="120">
                        <template v-slot="scope">
                            <el-select v-model="scope.row.loc_id" remote filterable allow-create default-first-option
                                :placeholder="$t('default.Please_select')" :remote-method="remoteLocation"
                                       transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in location_options" :key="item.id" :label="item.p_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column prop="operate" :label="$t('default.Action')">
                        <template slot-scope="scope">

                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                            </el-button><!-- 删除 -->
                        </template>
                    </el-table-column>
                    <div v-if="bonded_show">
                        <!-- 报关单号 -->
                        <el-table-column :label="$t('default.Customs_declaration_number')">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.hscode"></el-input>
                            </template>
                        </el-table-column>
                        <!-- 核注清单 -->
                        <el-table-column :label="$t('default.Approved_list')">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.inventory"></el-input>
                            </template>
                        </el-table-column>
                        <!-- 备案号 -->
                        <el-table-column :label="$t('default.Record_number')">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.inventory_order_no"></el-input>
                            </template>
                        </el-table-column>
                    </div>

                </el-table>
            </template>


            <span slot="footer" class="dialog-footer">
                <el-button @click="otherVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="handleOtherSave">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>
        <!-- 入库单 -->
        <el-dialog :visible.sync="WiVisible" append-to-body width="80%" :title="$t('default.Warehouse_receipt')">
            <warehousing-detail ref="warehousingDetail"></warehousing-detail>
        </el-dialog>

        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">

          <seledetail ref="seledetail"></seledetail>
        </el-dialog>

        <warehousing-update ref="warehousingUpdate" :data="current" :visible.sync="WarehousingUpdateVisible"
            @done="reload"></warehousing-update>


    </div>
</template>

<script>
import axios from 'axios'
import WarehousingDetail from '../warehouse/WarehousingDetail.vue';
import WarehousingUpdate from '../warehouse/WarehousingUpdate.vue';
import Vue from 'vue';
import Seledetail from "@/components/base/SelectOne.vue";
//import Seledetail from '../base/SelectOne.vue';


export default {
    name: 'basetable',
    components: {
        WarehousingDetail,
        WarehousingUpdate,
        Seledetail,

    },
    data() {
        return {
            uid: localStorage.getItem("uid"),
            permission: sessionStorage.getItem('permission_button'),
            department_id: localStorage.getItem("department_id"),
            query: {
                type: 4,
                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
            multipleSelection: [],
            query_ware_options: [],
            delList: [],
            editVisible: false,
            orderVisible: false,
            otherVisible: false,
            WiVisible: false,
            WarehousingUpdateVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            current: {},
            rules: {
                department_id: [
                    { required: true, message: '请选择部门', trigger: 'blur' },
                ],
                ware_id: [
                    { required: true, message: '请选择仓库', trigger: 'blur' },
                ],
                cdispatcherid: [
                    { required: true, message: '请选择收发类别', trigger: 'blur' },
                ],
            },
            value: [],
            list: [],
            loading: false,
            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            ware_options: [],
            department_options: [],
            location_options: [],
            mat_options: [],
            download_file: '',
            other_download_file: '',
            bonded_show: false,
            multipleOrderSelection: [],
            BondedWarehousingType_options: [],
            send_receiving_options: [],
            user_options: [],
            isWareSuper: false,
            status_options: [],
            push_options: [],
            SelectOneVisible: false,
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
        // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
        if (length == 1) {
          let wi_code = '';
          for (let i = 0; i < length; i++) {
            wi_code = this.multipleSelection[i].wi_code;
          }
          this.SelectOneVisible = true;
          let nextdata = {
            wi_code: wi_code
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
            this.axios.get('/ware/Warehousing/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.other_download_file = res.other_download_file;
                this.send_receiving_options = res.send_receiving_options;

                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

        },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        getPustArr() {
            this.axios.post('/u8api/U8Order/getPustArr', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.push_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        getisWareSuper() {
            this.axios.post('/index/user/isWareSuper', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.isWareSuper = res;
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
                        // case 4:
                        case 5:
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
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        handleEdit(wi_code,department_id) {
            this.WarehousingUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.warehousingUpdate.UpdateWare(department_id);
                this.$refs.warehousingUpdate.getDepartment();
                this.$refs.warehousingUpdate.BondedWarehousingType();
                this.$refs.warehousingUpdate.dataInitialization(wi_code);
                
            })
        },
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/ware/Warehousing/delete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getData();
                    }).catch(() => {
                        this.loading = false;
                    })

                })
                .catch(() => { })
        },
        handleWi(wi_code) {
            this.WiVisible = true;

            this.$nextTick(() => {
                this.$refs.warehousingDetail.dataInitialization(wi_code);
            })
        },
        remoteLocation(query) {
            if (query !== '') {
                this.axios.post('/ware/wareLocation/getBuyNameForWareLocation', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.location_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.mat_options = [
                    { id: query, p_name: query }
                ];
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
                this.user_options = [];
            }
        },
        handleOrderSelectionChange(val) {
            this.multipleOrderSelection = val;
        },
        // 获取保税入库类型
        BondedWarehousingType() {
            this.axios.post('/ware/Warehousing/BondedWarehousingType', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.BondedWarehousingType_options = res;
            }).catch(() => {
                this.loading = false;
            })
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

        syncHg() {
            this.axios.post('/ware/Transfer/sync', {
                token: localStorage.getItem("token"),
                // params: this.form,
                orderData: this.orderData,
                OrderSelection: this.multipleOrderSelection
            }).then((res) => {
                this.orderData = res;
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
                let wi_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    wi_code_arr.push(this.multipleSelection[i].wi_code);
                }
                this.query.wi_code = wi_code_arr;

            }
            this.query.token = localStorage.getItem("token");
            this.axios.post('/ware/Warehousing/handleExport2', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },

        // 创建推送U8
        handleCrpustU8() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let wi_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    wi_code_arr.push(this.multipleSelection[i].wi_code);
                }
                this.axios.post('/ware/Warehousing/crpustU8Other', {
                    token: localStorage.getItem("token"),
                    wi_code_arr: wi_code_arr,
                    params: this.form

                }).then((res) => {
                    // console.log(res);
                    // 弹出成功提示框
                    this.$message.success('更新成功');
                    this.editVisible = false;
                    this.getListData();

                    this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })


            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }


        },


        // 推送U8
        Push() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let wi_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    wi_code_arr.push(this.multipleSelection[i].wi_code);
                }
                this.axios.post('/u8api/U8Otherin/Pust', {
                    token: localStorage.getItem("token"),
                    wi_code_arr: wi_code_arr,
                    params: this.form

                }).then((res) => {
                    // console.log(res);
                    // 弹出成功提示框
                    // 推送成功
                    this.$message.success(this.$t('default.Push_Successful'));
                    this.editVisible = false;
                    this.getListData();
                    // 为this.tableData新增属性
                    this.$set(this.tableData, this.idx, this.form);
                    this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })


            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }


        },
        // 拉取U8
        PuLLU8() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let wi_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    wi_code_arr.push(this.multipleSelection[i].wi_code);
                }
                this.axios.post('/u8api/U8Otherin/PuLL', {
                    token: localStorage.getItem("token"),
                    wi_code_arr: wi_code_arr,
                    params: this.form

                }).then((res) => {

                    // 弹出成功提示框
                    this.$message.success('拉取成功');
                    this.editVisible = false;
                    this.getListData();
                    // 为this.tableData新增属性
                    this.$set(this.tableData, this.idx, this.form);
                    this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })


            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
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
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
        handleSuccess(file, fileList, row) {

            if (file.code == 201) {
                this.$message.error(file.msg);
            } else {
                // 上传成功
                this.$message.success(this.$t('default.Uploaded_successfully'));
                this.orderData = file.data;
            }
        },
        handleOtherIn() {
            this.form = {};
            if (this.form.department_id) {
            } else {
                this.form.department_id = this.department_id;
            }
            this.orderData = [];
            this.otherVisible = true;
            this.axios.post('/ware/PurchaseIn/handleIn', {
                token: localStorage.getItem("token"),
                selection: this.multipleSelection,
            }).then((res) => {


            }).catch(() => {
                this.loading = false;
            })
            for (let i = 0; i < length; i++) {
                if (this.multipleSelection[i].is_main == 1) {
                    // 子选项的选项数量
                    var this_list = this.multipleSelection[i];
                    var children_date = this_list.children;
                    const clength = children_date.length;
                    for (let j = 0; j < clength; j++) {
                        // 子选项的选项数量
                        this.orderData.push(children_date[j]);
                    }
                } else {
                    this.orderData.push(this.multipleSelection[i]);
                }
            }

        },
        // 获取仓库
        getWare() {
            this.axios.post('/ware/warehouse/warelist', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                this.query_ware_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },

        // 根据部门获取仓库
        DepartmentChange() {
            this.axios.post('/ware/warehouse/warelist', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {
                this.ware_options = res;
                // this.query_ware_options = res;

                // this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })
        },
        // 获取库位
        wareChange() {
            this.axios.post('/ware/Warehousing/handleIn', {
                token: localStorage.getItem("token"),
                // selection: this.multipleSelection,
                params: this.form,
                orderData: this.orderData,
            }).then((res) => {

                console.log(res);
                this.orderData = res.orderData;
                this.location_options = res.location_options;
                this.bonded_show = res.bonded_show;
                this.location_options = res.location_arr;


            }).catch(() => {
                this.loading = false;
            })

        },


        // 其他入库保存
        handleOtherSave() {
            this.form.dbilldate = Vue.prototype.FormatTime(this.form.dbilldate_w);


            this.axios.post('/ware/Warehousing/otherSave', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData
            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.otherVisible = false;
                this.getData();

            }).catch(() => {
                this.loading = false;
            })
        },
        getDefaultLocation() {
            this.axios.post('/ware/wareLocation/getDefaultLocation', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                ware_id: this.form.ware_id,
            }).then((res) => {
                // console.log(res);
                this.orderData = res;
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })
        },
        //增加行
        handleAddLine() {
            if (this.orderData == undefined) {
                this.orderData = new Array();
            }
            let obj = {};

            this.orderData.push(obj);
        },
        //删除行
        handleDeleteLine(index) {

            this.orderData.splice(index, 1)
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
        // 审核通过
        saveAuditPass() {
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
                this.axios.post('/ware/WarehousingAudit/auditPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,
                    // multipleSelection:this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.editVisible = false;
                    this.getData();

                    this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },
        // 审核不通过
        saveAuditFail() {
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
                this.axios.post('/ware/WarehousingAudit/auditFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,
                    multipleSelection: this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.editVisible = false;
                    this.getData();

                    this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })


            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },

        remoteMethod(query) {
            if (query !== '') {
                this.axios.post('/infor/material/getMaterialByCodeName', {
                    token: localStorage.getItem("token"),
                    mat_code: query,
                    status: 1,
                }).then((res) => {
                    this.mat_options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.mat_options = [];
            }
        },




    },
    // 在钩子函数中调用getData方法
    created() {
        this.OtherWarehousing_url = axios.defaults.baseURL + '/com/ExcelIn/OtherWarehousing';

        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.query.create_time = [start, end];
        this.getisWareSuper();
        this.getData();
        this.permission = JSON.parse(this.permission);
        this.getDepartment();
        this.DepartmentChange();
        this.BondedWarehousingType();
        this.getStatusArr();
        this.getWare();
        this.department_id = parseInt(this.department_id);
        this.getPustArr();

    }
}
</script>
