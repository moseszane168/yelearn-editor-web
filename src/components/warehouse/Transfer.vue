<template>
    <!-- 基础表格组件 -->
    <div>
        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                <!-- 单据号 -->
                {{ $t('default.Incoming_Batch') }}:<el-input v-model="query.tr_code" :placeholder="$t('default.Please_enter_a_keyword')"
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

                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')" @change="getWare()"
                    class="w200">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 转入仓库 -->
                {{ $t('default.Transferred_to_Warehouse') }}：<el-select multiple filterable v-model="query.in_ware_id"
                    :placeholder="$t('default.Please_select')" class="w200">
                    <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name"
                        :value="item.ware_id">
                    </el-option>
                </el-select>
                <!-- 转出仓库 -->
                {{ $t('default.Transfer_Out_Warehouse') }}：<el-select multiple filterable v-model="query.out_ware_id"
                    :placeholder="$t('default.Please_select')" class="w200">
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
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <el-button type="primary" class="handle-del mr10" @click="handleFinishedGoodsIn"
                    v-if="permission.includes('Transfer:handleadd')">{{ $t('default.Transfer') }}</el-button><!-- 转库 -->
                <!-- 转出签字 -->
                <el-button type="primary" class="handle-del mr10" @click="saveOutPass"
                    v-if="permission.includes('Transfer:saveOutPass')">{{ $t('default.Transfer_Signature')
                    }}</el-button>
                <!-- 转入签字 -->
                <el-button type="primary" class="handle-del mr10" @click="savePass"
                    v-if="permission.includes('Transfer:savePass')">{{ $t('default.Transfer_In_Signature')
                    }}</el-button>
                <!-- 转出取消签字 -->
                <el-button type="primary" class="handle-del mr10" @click="saveOutFail"
                    v-if="permission.includes('Transfer:saveOutFail')">{{
                    $t('default.Transfer_out_cancellation_signature') }}</el-button>
                <!-- 转入取消签字 -->
                <el-button type="primary" class="handle-del mr10" @click="saveFail"
                    v-if="permission.includes('Transfer:saveFail')">{{ $t('default.Transfer_in_cancellation_signature')
                    }}</el-button>

                <el-button type="primary" class="handle-del mr10" @click="handleCrpustU8"
                    v-if="permission.includes('Purchase:handleCrpustU8')">{{ $t('default.Create_push_U8')
                    }}</el-button><!-- 创建推送U8 -->
                <!-- 转库推送U8 -->
                <el-button type="primary" class="handle-del mr10" @click="Push"
                    v-if="permission.includes('Purchase:Push')">{{ $t('default.Transfer_push_U8') }}</el-button>

                <!-- 拉取U8 -->
                <el-button type="primary" class="handle-del mr10" @click="PuLLU8"
                    v-if="permission.includes('Purchase:Push')">{{ $t('default.Pull') }}U8</el-button>


                <!-- 导出 -->
                <el-button type="primary" class="handle-del mr10" @click="handleExport">{{ $t('default.Export')
                    }}</el-button>

                <!-- 联查 -->
                <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleSelectOne')"
                           @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>
            </div>
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 全部 -->
                    <el-tab-pane :label="$t('default.All')" name="all"></el-tab-pane>
                    <!-- 待审核 -->
                    <el-tab-pane :label="$t('default.Pending_Audit')" name="wait"></el-tab-pane>
                    <!-- 待入库签字 -->
                    <el-tab-pane :label="$t('default.Signature_for_Incoming_Warehouse')" name="out_pass"></el-tab-pane>
                    <!-- 审核通过 -->
                    <el-tab-pane :label="$t('default.Approved')" name="pass"></el-tab-pane>
                    <!-- 审核驳回 -->
<!--                    <el-tab-pane :label="$t('default.Rejected')" name="refuse"></el-tab-pane>-->

                </el-tabs>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center">
                    <template v-slot="scope">
                        <div v-if="scope.row.create_user == uid">
                            <!--  scope.row.status == 2 &&  isWareSuper ||-->
                            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                                v-if="permission.includes('Transfer:handleEdit')">{{ $t('default.Edit')
                                }}</el-button><!-- 编辑 -->
                            <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                                @click="handleDelete(scope.$index, scope.row)"
                                v-if="permission.includes('Transfer:handleCancel')">{{ $t('default.Delete')
                                }}</el-button><!-- 删除 -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>
                <el-table-column prop="tr_code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handleTr(scope.row.tr_code)"> {{
                    scope.row.tr_code }}</el-button>
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


                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
                <!-- 状态 -->
                <el-table-column prop="status_name" :label="$t('default.Status')">
                    <template v-slot="scope">
                        <div v-if="scope.row.status == 1">
                            <el-tag type="danger">{{ scope.row.status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.status == 2">
                            <el-tag type="warning">{{ scope.row.status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.status == 4">
                            <el-tag type="success">{{ scope.row.status_name }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <!-- 出库仓库 -->
                <el-table-column prop="out_ware_name" :label="$t('default.Outgoing_warehouse')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.out_ware_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.out_ware_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 出库部门 -->
                <el-table-column prop="out_department_name" :label="$t('default.Out_Department')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.out_department_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.out_department_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 入库仓库 -->
                <el-table-column prop="in_ware_name" :label="$t('default.Incoming_Warehouse')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.in_ware_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.in_ware_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 入库部门 -->
                <el-table-column prop="in_department_name" :label="$t('default.Incoming_Department')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.in_department_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.in_department_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 出库签字 -->
                <el-table-column prop="audit" :label="$t('default.In_Signature')">
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
                <!-- 入库签字 -->
                <el-table-column prop="audit" :label="$t('default.Out_Signature')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p> {{ scope.row.audit_user_1_name }}{{ scope.row.audit_time_1 }}{{ scope.row.audit_desc_1
                                }}
                            </p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);"> {{ scope.row.audit_user_1_name
                                    }}{{
                    scope.row.audit_time_1 }}{{ scope.row.audit_desc_1 }}</el-button>

                            </div>
                        </el-popover>
                    </template>

                </el-table-column>
                <!-- 单据日期 -->
                <el-table-column prop="dbilldate" :label="$t('default.Document_date')"></el-table-column>
                <el-table-column prop="fbillflag_name" :label="$t('default.U8Status')">
                    <template v-slot="scope">
                        <el-popover v-if="scope.row.push == 3" trigger="hover" placement="top">
                            <p>{{ scope.row.return_date }}</p>
                            <div slot="reference" class="name-wrapper">
                                <i class="el-icon-warning" style="color: red;"></i>
                            </div>
                        </el-popover>
                        <i v-if="scope.row.vbillcode" class="el-icon-top"></i>
                        <el-button type="text" style="color: rgb(39, 36, 36);" v-if="scope.row.push == 2"> {{
                    scope.row.fbillflag_name }}</el-button>
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


        <!-- 转库 -->
        <el-dialog :title="$t('default.Transfer')" :visible.sync="orderVisible" width="80%" :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')">
                    <el-cascader :options="department_options" v-model="form.department_first_list"
                                 @change="DepartmentChange()"></el-cascader>
                </el-form-item>
                <!-- 转出仓库 -->
                <el-form-item :label="$t('default.Transfer_Out_Warehouse')" prop="out_ware_id">
                    <el-select filterable v-model="form.out_ware_id" :placeholder="$t('default.Please_select')"
                        @change="handleIn()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in ware_options" :key="item.ware_id" :label="item.name"
                            :value="item.ware_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 转入仓库 -->
                <el-form-item :label="$t('default.Transferred_to_Warehouse')" prop="in_ware_id">
                    <el-select filterable v-model="form.in_ware_id" :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name"
                            :value="item.ware_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 保税出库类型 -->
                <el-form-item :label="$t('default.Bonded_out_type')">
                    <el-select v-model="form.delivery_type" :placeholder="$t('default.Please_select')" clearable transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in BondedWarehousingType_options" :key="item.value" :label="item.name"
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
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <template>
                <!-- 新增 -->
                <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                <el-button type="primary" @click="handleIn">{{ $t('default.Inventory_Enquiry')
                    }}</el-button><!-- 查询库存 -->
                <!-- 获取仓库下有库存物料 -->
                <el-button type="primary" @click="wareChange">{{ $t('default.Add') }}获取仓库下有库存物料(200)</el-button>
                <!-- 批量删除 -->
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10"
                    @click="delAllSelection">{{ $t('default.Batch_Delete') }}</el-button>

                <el-button type="primary" @click="downloadFile(download_file)">{{ $t('default.Download_Import_Template')
                    }}</el-button><!-- 下载导入模板 -->
                <el-tooltip class="item" effect="dark"
                    :content="$t('default.Batch_synchronization_of_customs_declaration_number_and_endorsement_list')"
                    placement="top-start">
                    <el-button type="primary" @click="syncHg">{{ $t('default.Batch_synchronisation')
                        }}</el-button><!-- 批同 -->
                </el-tooltip>
                <el-upload :on-success="handleSuccess" class="upload-demo" style="float: left;margin-right: 5px;"
                    :action="Transfer_url">

                    <el-button type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                </el-upload>

                <el-table :data="orderData" style="width: 100%" @selection-change="handleOrderSelectionChange" border
                    class="table" ref="multipleTable" header-cell-class-name="table-header" show-summary>
                    <el-table-column type="selection" width="55" align="center"></el-table-column>

                    <!-- 物料编码 -->
                    <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="150">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword
                                :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod"
                                :loading="loading" @change="handleIn()" transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in options" :key="item.mat_code" :label="item.mat_code"
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_name }}</el-button>
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications }}</el-button>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <!-- 转出仓库库存 -->
                    <el-table-column prop="real_num" label="转出仓库库存"></el-table-column>

                    <!-- 转出数 -->
                    <el-table-column prop="tr_num" label="转出数">
                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.tr_num"></el-input>
                        </template>
                    </el-table-column>


                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.desc"></el-input>
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

                    <!-- 异常 -->
                    <el-table-column prop="error" :label="$t('default.Abnormal')"></el-table-column>

                </el-table>
            </template>


            <span slot="footer" class="dialog-footer">
                <el-button @click="orderVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="handleSave">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>
        <!-- 出库签字 -->
        <el-dialog title="出库签字" :visible.sync="editOutVisible" width="70%">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 审核备注 -->
                <el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.audit_desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveOutPass">审核通过</el-button>
                <el-button @click="saveOutFail">审核不通过</el-button>
            </span>
        </el-dialog>


        <el-dialog :visible.sync="DetailVisible" append-to-body width="80%" title="转库单">
            <transfer-detail ref="transferDetail"></transfer-detail>
        </el-dialog>
        <!-- 编辑 -->
        <!-- 编辑 -->
        <el-dialog :title="$t('default.Edit')" :visible.sync="TransferVisible" width="80%" :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')">
                    <el-cascader :options="department_options" v-model="form.department_first_list"
                        :props="{ checkStrictly: true }" @change="DepartmentChange()"></el-cascader>
                </el-form-item>
                <el-form-item :label="$t('default.Document_date')" style="display: none;" >
                  <el-date-picker v-model="form.dbilldate" type="date" :placeholder="$t('default.Select_Date')">
                  </el-date-picker>
                </el-form-item>
                <!-- 转出仓库 -->
                <el-form-item label="转出仓库">

                    {{ form.out_ware_name }}
                </el-form-item>
                <!-- 转入仓库 -->
                <el-form-item label="转入仓库">


                    {{ form.in_ware_name }}
                </el-form-item>
                <!-- 保税出库类型 -->
                <el-form-item label="保税出库类型">
                    <el-select v-model="form.delivery_type" :placeholder="$t('default.Please_select')" clearable>
                        <el-option v-for="item in BondedWarehousingType_options" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <template>
                <el-tooltip class="item" effect="dark"
                    :content="$t('default.Batch_synchronization_of_customs_declaration_number_and_endorsement_list')"
                    placement="top-start">
                    <el-button type="primary" @click="syncHg">{{ $t('default.Batch_synchronisation') }}</el-button><!-- 批同 -->
                </el-tooltip>

                <el-table :data="orderData" style="width: 100%" @selection-change="handleOrderSelectionChange" border
                    class="table" ref="multipleTable" header-cell-class-name="table-header" show-summary>
                    <el-table-column type="selection" width="55" align="center"></el-table-column>

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

                    <!-- 转出仓库库存 -->
                    <el-table-column prop="out_ware_real_num" label="转出仓库库存" width="110"></el-table-column>

                    <!-- 转出数 -->
                    <el-table-column prop="tr_num" label="转出数">
                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.tr_num"></el-input>
                        </template>
                    </el-table-column>


                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.desc"></el-input>
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
                    <el-table-column :label="$t('default.Record_number')" width="130">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.inventory_order_no"></el-input>
                        </template>
                    </el-table-column>

                </el-table>
            </template>


            <span slot="footer" class="dialog-footer">
                <el-button @click="TransferVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="handleUpdate">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">
          <seledetail ref="seledetail"></seledetail>
        </el-dialog>


    </div>
</template>

<script>
import TransferDetail from '../warehouse/TransferDetail.vue';
import axios from 'axios';
import Vue from 'vue';
import Seledetail from "@/components/base/SelectOne.vue";

export default {
    name: 'basetable',
    components: {
        Seledetail,
        TransferDetail,

    },
    data() {
        return {
            SelectOneVisible: false,
            uid: localStorage.getItem("uid"),
            permission: sessionStorage.getItem('permission_button'),
            query: {

                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
            multipleSelection: [],
            multipleOrderSelection: [],
            delList: [],
            editVisible: false,
            orderVisible: false,
            DetailVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},

            rules: {

                out_ware_id: [
                    { required: true, message: '请选择转出仓库', trigger: 'blur' },

                ],
                in_ware_id: [
                    { required: true, message: '请输入实购数', trigger: 'blur' },

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
            BondedWarehousingType_options: [],
            options: [],
            mat_options: [],
            activeName: 'all',
            Transfer_url: '',
            editOutVisible: false,
            query_ware_options: [],
            user_options: [],
            TransferVisible: false,

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
          let tr_code = '';
          for (let i = 0; i < length; i++) {
            tr_code = this.multipleSelection[i].tr_code;
          }
          this.SelectOneVisible = true;
          let nextdata = {
            tr_code: tr_code
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
            this.axios.get('/ware/Transfer/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

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
        // 编辑
        handleEdit(index, row) {



            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            console.log(this.form);

            this.axios.post('/ware/Transfer/Detail', {
                token: localStorage.getItem("token"),
                params: this.form,
                tr_code: this.form.tr_code,
                // orderData: this.orderData,

            }).then((res) => {
                this.orderData = res.list;

            }).catch(() => {
                this.loading = false;
            })
            this.orderData = this.form.children;
            // 设置弹出编辑框标记为true
            this.TransferVisible = true;
        },
        handleUpdate() {
            this.axios.post('/ware/Transfer/update', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,

            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.TransferVisible = false;
                this.getData();

            }).catch(() => {
                this.loading = false;
            })
        },
        // 删除
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/ware/Transfer/delete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.getData();
                    }).catch(() => {
                        this.loading = false;
                    })

                })
                .catch(() => { })
        },
        // 根据部门获取仓库
        DepartmentChange() {
            this.axios.post('/ware/warehouse/warelist', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {
                this.ware_options = res;
                this.query_ware_options = res;

                // this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })
        },
        handleTr(tr_code) {
            this.DetailVisible = true;

            this.$nextTick(() => {
                this.$refs.transferDetail.dataInitialization(tr_code);
            })
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
        getWareData() {
            this.axios.post('/ware/warehouse/warelist', {
                token: localStorage.getItem("token"),
                // params: this.form
            }).then((res) => {
                this.ware_options = res;
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })
        },
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
        handleSuccess(file, fileList, row) {
            if (file.code == 201) {
                this.$message.error(file.msg);
            } else {
                this.orderData = file.data;
            }
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
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
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
        // 查询物料
        remoteMethod(query) {
            if (query !== '') {
                this.axios.post('/infor/material/getMaterialByCodeName', {
                    token: localStorage.getItem("token"),
                    mat_code: query,
                    status: 1,
                }).then((res) => {
                    this.options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },


        //删除行
        handleDeleteLine(index) {
            this.orderData.splice(index, 1)
        },
        // 获取仓库下所有物料
        wareChange(index, row) {

            this.axios.post('/ware/Transfer/getWareInventory', {
                token: localStorage.getItem("token"),
                params: this.form

            }).then((res) => {
                // console.log(res);
                this.orderData = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 查询库存
        handleIn() {

            this.otherVisible = true;
            this.axios.post('/ware/Transfer/handleIn', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form
            }).then((res) => {
                this.orderData = res.data;
                this.ware_options = res.warehouse_arr;

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
                let tr_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    tr_code_arr.push(this.multipleSelection[i].tr_code);
                }
                this.axios.post('/ware/Warehousing/crpustU8Finished', {
                    token: localStorage.getItem("token"),
                    tr_code_arr: tr_code_arr,
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
                let tr_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    tr_code_arr.push(this.multipleSelection[i].tr_code);
                }
                this.axios.post('/u8api/U8Special4k/Pust', {
                    token: localStorage.getItem("token"),
                    tr_code_arr: tr_code_arr,
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
                let tr_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    tr_code_arr.push(this.multipleSelection[i].tr_code);
                }
                this.axios.post('/u8api/U8Purchasein/PuLL', {
                    token: localStorage.getItem("token"),
                    tr_code_arr: tr_code_arr,
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
        // 获取保税入库类型
        BondedWarehousingType() {
            this.axios.post('/ware/PickingOut/getDeliveryType', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.BondedWarehousingType_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 产成品入库
        handleFinishedGoodsIn() {
            this.orderData = [];
            this.orderVisible = true;
        },

        handleSave() {
            this.form.dbilldate = Vue.prototype.FormatTime(this.form.dbilldate_w);
            this.axios.post('/ware/Transfer/save', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData

            }).then((res) => {

                this.$message.success('转库成功');
                this.orderVisible = false;
                this.getData();
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })


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
        handleOrderSelectionChange(val) {
            this.multipleOrderSelection = val;
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

        handleCancel() {
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
                this.axios.post('/ware/Transfer/delete', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,


                }).then((res) => {

                    // 弹出成功提示框
                    this.$message.success('取消成功');
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


        // 批量删除，对选中的选项数量进行判断，如果没有选中选项则弹出提示框，提示未选中选项，如果选中了选项之后将选中的选项全部删除
        delAllSelection() {
            // 选项的选项数量
            const length = this.multipleOrderSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {

                this.axios.post('/ware/Transfer/orderDataDelete', {
                    token: localStorage.getItem("token"),
                    params: this.form,
                    orderData: this.orderData,
                    OrderSelection: this.multipleOrderSelection

                }).then((res) => {
                    console.log(res);
                    this.orderData = res;
                    // this.multipleOrderSelection = [];
                }).catch(() => {
                    this.loading = false;
                })

            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },

        // 审核
        handleAudit() {
            const length = this.multipleSelection.length;
            if (length) {
                this.editVisible = true;
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },
        handleOutAudit() {
            const length = this.multipleSelection.length;
            if (length) {
                this.editOutVisible = true;
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }

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
        // 审核通过
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
                this.axios.post('/ware/Transfer/auditPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

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
        saveFail() {
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
                this.axios.post('/ware/Transfer/auditFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

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
        // 审核通过
        saveOutPass() {

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
                this.axios.post('/ware/Transfer/auditOutPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.editOutVisible = false;
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
        saveOutFail() {
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
                this.axios.post('/ware/Transfer/auditOutFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.editOutVisible = false;
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

        handleClick(tab, event) {

            if (this.activeName == 'wait') {
              // 待审核
                this.query.status = 1
            } else if (this.activeName == 'out_pass') {
              // 待入库签字
                this.query.status = 2
            } else if (this.activeName == 'pass') {
              // 审核通过
                this.query.status = 4
            } else if (this.activeName == 'refuse') {
              // 审核驳回
                this.query.status = '3, 5'
            } else if (this.activeName == 'all') {
              // 全部
                this.query.status = ''
            }
            // 重新获取数据
            this.getData();
        },
        // 列表导出
        handleExport() {
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let ob_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    ob_code_arr.push(this.multipleSelection[i].ob_code);
                }
                this.query.ob_code = ob_code_arr;

            }
            this.query.token = localStorage.getItem("token");
            this.axios.post('/ware/Transfer/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },



    },

    // 在钩子函数中调用getData方法
    created() {
        this.Transfer_url = axios.defaults.baseURL + '/com/ExcelIn/Transfer';

        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        this.query.create_time = [start, end];
        this.permission = JSON.parse(this.permission);
        this.getData();
        this.getWareData();
        this.BondedWarehousingType();
        this.getDepartment();

        this.DepartmentChange();

    }
}
</script>
