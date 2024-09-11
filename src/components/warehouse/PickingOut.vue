<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                {{ $t('default.Material_Code') }}:
                <el-input v-model="query.mat_code" placeholder="物料编码" class="handle-input w120"></el-input>
                <!-- 领料单号 -->
                {{ $t('default.Requisition_Order') }}:
                <el-input v-model="query.pi_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input w120"></el-input>
                <!-- 单据号 -->
                {{ $t('default.Incoming_Batch') }}:<el-input v-model="query.ob_code"
                    :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input w120"></el-input>

                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    reserve-keyword class="w120" :placeholder="$t('default.Please_enter_a_keyword')"
                    :remote-method="remoteMethod" :loading="loading" @change="getWare()">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 仓库 -->
                {{ $t('default.Warehouse') }}：<el-select multiple filterable v-model="query.ware_id"
                    :placeholder="$t('default.Please_select')" class="w120">
                    <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name"
                        :value="item.ware_id">
                    </el-option>
                </el-select>
                <!-- 签字状态 -->
                {{ $t('default.Signature_Status') }}:
                <el-select v-model="query.status" clearable class="w120">
                    <el-option v-for="item in status_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 推送状态 -->
                {{ $t('default.Push_Status') }}:<el-select filterable v-model="query.push"
                    :placeholder="$t('default.Please_select')" clearable>
                    <el-option v-for="item in push_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 领料人 -->
                {{ $t('default.Receiver') }}: <el-input v-model="query.create_name" :placeholder="$t('default.Please_enter_a_keyword')"
                    class="handle-input w120"></el-input>

                <!-- 创建人 -->
                {{ $t('default.Creator') }}：
                <el-select v-model="query.create_user" filterable multiple remote reserve-keyword class="w120"
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser"
                    :loading="loading">
                    <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <!-- 创建时间 -->
                {{ $t('default.Creation_Date') }}：
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>
                <!-- 签字时间 -->
                {{ $t('default.Signature_Time') }}：<el-date-picker v-model="query.audit_time" type="daterange"
                    align="right" unlink-panels :range-separator="$t('default.To')"
                    :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>



            </div>

            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 待出库 -->
                    <el-tab-pane :label="$t('default.To_be_out_of_stock')" name="wait">
                        <!-- 出库 -->
                        <el-button type="primary" class="handle-del mr10" @click="handleadd"
                            v-if="permission.includes('PickingOut:handleadd')">{{ $t('default.Dispatch') }}</el-button>
                        <!-- 手动出库 -->
                        <el-button type="primary" class="handle-del mr10" @click="handleOut"
                            v-if="permission.includes('PickingOut:handleOut')">{{ $t('default.Manual_Outbound')
                            }}</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="handleEnd"
                            v-if="permission.includes('PickingApply:handleEnd')">{{ $t('default.Manual_Completion')
                            }}</el-button>
                        <!-- 手动完成 -->
                        <el-table :data="tableData" border class="table" ref="multipleTable"
                            header-cell-class-name="table-header" @selection-change="handleSelectionChange">

                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <!-- 序号 -->
                            <el-table-column prop="no" :label="$t('default.No')" width="55"
                                align="center"></el-table-column>

                            <!-- 领料单号 -->
                            <el-table-column prop="pi_code" :label="$t('default.Requisition_Order')" align="center">
                                <template v-slot="scope">
                                    <el-button type="text" class="handle-del mr10"
                                        @click="handlePicking(scope.row.pi_code)"> {{
                    scope.row.pi_code }}</el-button>
                                </template>
                            </el-table-column>
                            <!-- 部门 -->
                            <el-table-column prop="department_name" :label="$t('default.Department')">

                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.department_name }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.department_name }}</el-button>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                            <!-- 状态 -->
                            <el-table-column prop="status_name" :label="$t('default.Status')"></el-table-column>
                            <!-- 领料人 -->
                            <el-table-column prop="picking_name" :label="$t('default.Receiver')"
                                align="center"></el-table-column>


                            <!-- 创建时间 -->
                            <el-table-column prop="create_time" :label="$t('default.Creation_time')">

                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.create_user_name }}
                                            {{ scope.row.create_time }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.create_user_name }}{{ scope.row.create_time }}</el-button>
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
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.update_user_name }}
                                                {{ scope.row.update_time }}</el-button>

                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                        </el-table>
                    </el-tab-pane>
                    <!-- 材料出库单 -->
                    <el-tab-pane :label="$t('default.Material_Out')" name="pass">
                        <el-button type="primary" class="handle-del mr10" @click="handleExport">{{ $t('default.Export')
                            }}</el-button><!-- 导出 -->

                        <el-button type="primary" class="handle-del mr10" @click="saveAuditPass"
                            v-if="permission.includes('PickingOut:handleAudit')">{{
                    $t('default.Signature') }}</el-button><!-- 签字 -->
                        <el-button type="primary" class="handle-del mr10" @click="saveAuditFail"
                            v-if="permission.includes('PickingOut:handleCancelAudit')">{{
                    $t('default.Cancel_Signature') }}</el-button><!-- 取消签字 -->
                        <el-button type="primary" class="handle-del mr10" @click="handleSelectOne">{{
                    $t('default.Manual_Completion')
                }}</el-button>
                        <!-- 手动完成 -->


                        <el-button type="primary" class="handle-del mr10" @click="Push"
                            v-if="permission.includes('Purchase:Push')">{{
                    $t('default.Push') }}U8</el-button><!-- 推送U8 -->
                        <el-button type="primary" class="handle-del mr10" @click="PuLLU8"
                            v-if="permission.includes('Purchase:Push')">{{
                    $t('default.Pull') }}U8</el-button><!-- 拉取U8 -->

                      <!-- 联查 -->
                      <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleSelectOne')"
                                 @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>

                        <el-table :data="tableData" border class="table" ref="multipleTable"
                            header-cell-class-name="table-header" @selection-change="handleSelectionChange"
                            max-height="550px">
                            <!-- 操作 -->
                            <el-table-column :label="$t('default.Action')" align="center">

                                <template v-slot="scope">
                                    <div v-if="isWareSuper || scope.row.create_user == uid">

                                        <el-button type="text"
                                            @click="handleEdit(scope.row.ob_code, scope.row.department_id)"
                                            v-if="scope.row.status == 2 && permission.includes('PickingOut:handleEdit')">{{
                    $t('default.Edit') }}</el-button><!-- 编辑 -->
                                        <el-button type="text" class="red"
                                            :title="$t('default.Are_you_sure_you_want_to_delete')"
                                            @click="handleDelete(scope.$index, scope.row)"
                                            v-if="scope.row.status == 2 && permission.includes('PickingOut:handleDelete')">{{
                    $t('default.Delete') }}</el-button><!-- 删除 -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <!-- 序号 -->
                            <el-table-column prop="no" :label="$t('default.No')" width="55"
                                align="center"></el-table-column>

                            <el-table-column prop="ob_code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->

                                <template v-slot="scope">
                                    <el-button type="text" class="handle-del mr10"
                                        @click="handleOutbound(scope.row.ob_code)"> {{
                    scope.row.ob_code }}</el-button>
                                </template>
                            </el-table-column>
                            <!-- 仓库 -->
                            <el-table-column prop="ware_name" :label="$t('default.Warehouse')">

                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.ware_name }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.ware_name }}</el-button>
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
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.department_name }}</el-button>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>


                            <!-- 领料单号 -->
                            <el-table-column prop="pi_code" :label="$t('default.Requisition_Order')">

                                <template v-slot="scope">
                                    <el-button type="text" class="handle-del mr10"
                                        @click="handlePicking(scope.row.pi_code)"> {{
                    scope.row.pi_code }}</el-button>
                                </template>
                            </el-table-column>
                            <!-- 领料人 -->
                            <el-table-column prop="pi_user_name" :label="$t('default.Receiver')"></el-table-column>
                            <!-- 签字状态 -->
                            <el-table-column prop="status_name" width="105" :label="$t('default.Signature_Status')"
                                sortable>

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
                            <!-- 收发类别 -->
                            <el-table-column prop="cdispatcherid_name"
                                :label="$t('default.Receiving_and_Sending_Category')"></el-table-column>
                            <!-- 备注 -->
                            <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
                            <!-- 单据日期 -->
                            <el-table-column prop="dbilldate" :label="$t('default.Document_date')"></el-table-column>
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
                            <!-- 创建时间 -->
                            <el-table-column prop="create_time" :label="$t('default.Creation_time')">

                                <template v-slot="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.create_user_name }}
                                            {{ scope.row.create_time }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.create_user_name }}{{ scope.row.create_time }}</el-button>
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
                                            <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.update_user_name }}
                                                {{ scope.row.update_time }}</el-button>

                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                        </el-table>
                    </el-tab-pane>

                </el-tabs>
            </div>



            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>
        <!-- 领料出库 -->
        <el-dialog :title="$t('default.PickingOut')" :visible.sync="editVisible" width="80%"
            :before-close="handleClose">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">

                <!-- 仓库 -->
                <el-form-item :label="$t('default.Warehouse')" prop="ware_id">
                    <el-select v-model="form.ware_id" filterable :placeholder="$t('default.Please_select')"
                        @change="wareChange()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in ware_have_options" :key="item.ware_id" :label="item.name"
                            :value="item.ware_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>

            <template>
                <el-table :data="orderData" style="width: 100%" row-key="id" border
                    :tree-props="{ children: 'item_arr', hasChildren: 'hasChildren' }" show-summary>
                    <!-- 序号 -->
                    <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>

                    <!-- 部门 -->
                    <el-table-column prop="department_name" :label="$t('default.Department')">
                        <template v-slot="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>{{ scope.row.department_name }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.department_name }}</el-button>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <!-- 领料单号 -->
                    <el-table-column prop="pi_code" :label="$t('default.Requisition_Order')"></el-table-column>

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
                    <!-- 需求 -->
                    <el-table-column prop="production_demand" width="55"
                        :label="$t('default.Requirement')"></el-table-column>
                    <!-- 可用 -->
                    <el-table-column prop="available_num" width="55" :label="$t('default.Available')"></el-table-column>
                    <!-- 在途 -->
                    <el-table-column prop="transit_num" width="55" :label="$t('default.In_Transit')"></el-table-column>
                    <!-- 冻结 -->
                    <el-table-column prop="freeze_num" width="55" :label="$t('default.Frozen')"></el-table-column>
                    <!-- 已出 -->
                    <el-table-column prop="out_num" width="55" :label="$t('default.Discharged')"></el-table-column>
                    <!-- 未出 -->
                    <el-table-column prop="wait_out_num" width="55" :label="$t('default.Not_out')"></el-table-column>
                    <!-- 库存 -->
                    <el-table-column prop="real_num" width="55" :label="$t('default.Inventory')"></el-table-column>
                    <!-- 出库数 -->
                    <el-table-column prop="real_out_num" :label="$t('default.Number_of_outgoing_goods')">

                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.real_out_num"></el-input>
                        </template>
                    </el-table-column>

                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">

                        <template v-slot="scope">
                            <el-input v-model="scope.row.desc"></el-input>
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

                </el-table>
            </template>
            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>
        <!-- 手动出库 -->
        <el-dialog :title="$t('default.Manual_Outbound')" :visible.sync="orderVisible" width="80%" :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">

                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')" prop="department_id">
                    <el-select v-model="form.department_id" filterable remote reserve-keyword
                        :placeholder="$t('default.Please_enter_a_keyword')"  @change="change()">
                        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 仓库 -->
                <el-form-item :label="$t('default.Warehouse')" prop="ware_id">
                    <el-select filterable v-model="form.ware_id" :placeholder="$t('default.Please_select')"
                        @change="PickingOutWareChange()" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in ware_have_options" :key="item.ware_id" :label="item.name"
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
                <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                <!-- 获取有库存仓库 -->
                <el-button type="primary" @click="PickingOutWareChange">{{ $t('default.Get_Inventory_Warehouse')
                    }}</el-button>
                <el-button type="primary" @click="downloadFile(download_file)">{{ $t('default.Download_Import_Template')
                    }}</el-button><!-- 下载导入模板 -->

                <el-upload :on-success="handleSuccess" class="upload-demo" style="float: left;margin-right: 5px;"
                    :action="Outbound_url">
                    <el-button type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                </el-upload>

                <el-table :data="orderData" style="width: 100%" show-summary border>

                    <!-- 物料编码 -->
                    <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.mat_code"  filterable remote reserve-keyword
                                :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod"
                                :loading="loading" @change="PickingOutWareChange()" transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in options" :key="item.mat_code" :label="item.mat_code"
                                    :value="item.mat_code">
                                    <span style="float: left">{{ item.mat_code }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.label }}</span>
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
                    <!-- 出库数 -->
                    <el-table-column prop="real_out_num" :label="$t('default.Number_of_outgoing_goods')">

                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.real_out_num"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 库位 -->
                    <el-table-column prop="ware_location" :label="$t('default.Location')" width="120">
                        <template v-slot="scope">
                            <el-select v-model="scope.row.loc_id" remote filterable allow-create default-first-option
                                :placeholder="$t('default.Please_select')" :remote-method="remoteLocation">
                                <el-option v-for="item in location_options" :key="item.id" :label="item.p_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
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
                                @click="handleDeleteLine(scope.$index, scope.row)">{{$t('default.Delete')}}
                            </el-button><!-- 删除 -->
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
        <!-- 领料单 -->
        <el-dialog :visible.sync="PickingVisible" append-to-body width="90%" :title="$t('default.Requisition_Order')">
            <picking-detail ref="pickingDetail"></picking-detail>
        </el-dialog>
        <!-- 出库单 -->
        <el-dialog :visible.sync="OutboundVisible" append-to-body width="80%" :title="$t('default.Outbound_Order')">
            <outbound-detail ref="outboundDetail"></outbound-detail>
        </el-dialog>
        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">
            <seledetail ref="seledetail"></seledetail>
        </el-dialog>

        <outbound-update ref="outboundUpdate" :visible.sync="OutboundUpdateVisible" @done="reload"></outbound-update>


    </div>
</template>

<script>
import axios from 'axios'

import OutboundDetail from '../warehouse/OutboundDetail.vue';
import PickingDetail from '../produce/PickingApplyDetail.vue';
import OutboundUpdate from '../warehouse/OutboundUpdate.vue';
import Seledetail from '../base/SelectOne.vue';
import Vue from 'vue';

export default {
    name: 'basetable',
    components: {
        PickingDetail,
        OutboundDetail,
        Seledetail,
        OutboundUpdate,

    },
    data() {
        return {
            uid: localStorage.getItem("uid"),
            permission: sessionStorage.getItem('permission_button'),
            department_id: localStorage.getItem("department_id"),
            query: {
                token: '',
                create_time: [],
                audit_time: [],
                // status: 2,
                type: 2,
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
            send_receiving_options: [],
            multipleSelection: [],
            delList: [],
            query_ware_options: [],
            editVisible: false,
            orderVisible: false,
            SelectOneVisible: false,
            OutboundUpdateVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            rules: {
                ware_id: [
                    { required: true, message: '请选择仓库', trigger: 'blur' },
                    // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                ],
                production_demand: [
                    { required: true, message: '请输入申请量', trigger: 'blur' },
                    // { pattern: '/^[A-Za-z0-9]*$/', message: '需求量不能小于零', trigger: 'blur' }
                    { type: 'number', message: '需求量必须为数字值' }
                ],
                cdispatcherid: [
                        { required: true, message: '请选择收发类别', trigger: 'blur' },
                ],
            },
            options: [],
            value: [],
            list: [],
            loading: false,
            department_options: [],
            idx: -1,
            id: -1,
            states: [],
            activeName: 'wait',
            Outbound_url: '',
            download_file: '',
            ware_have_options: [],
            PickingVisible: false,
            OutboundVisible: false,
            location_options: [],
            user_options: [],
            status_options: [],
            isWareSuper: false,
            push_options: []
        };
    },
    mounted() {
        this.list = this.states.map(item => {
            return { value: `${item}`, label: `${item}` };
        });
    },
    methods: {
        getData() {
            const create_time = this.query.create_time;
            const create_time_1 = create_time[0];
            const create_time_2 = create_time[1];
            console.log(create_time);
            console.log(create_time_1);
            if (create_time_1) {
                this.query.create_time1 = Vue.prototype.FormatTime(create_time_1);
            }
            if (create_time_2) {
                this.query.create_time2 = Vue.prototype.FormatTime(create_time_2);
            }

            const audit_time = this.query.audit_time;
            const audit_time_1 = audit_time[0];
            const audit_time_2 = audit_time[1];

            if (audit_time_1) {
                this.query.audit_time1 = Vue.prototype.FormatTime(audit_time_1);
            }
            if (audit_time_2) {
                this.query.audit_time2 = Vue.prototype.FormatTime(audit_time_2);
            }

            this.query.token = localStorage.getItem("token");
            this.axios.get('/ware/PickingOut/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
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
        getisWareSuper() {
            this.axios.post('/index/user/isWareSuper', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.isWareSuper = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        getListData() {
            const create_time = this.query.create_time;
            const create_time_1 = create_time[0];
            const create_time_2 = create_time[1];
            console.log(create_time);
            console.log(create_time_1);
            if (create_time_1) {
                this.query.create_time1 = Vue.prototype.FormatTime(create_time_1);
            }
            if (create_time_2) {
                this.query.create_time2 = Vue.prototype.FormatTime(create_time_2);
            }

            const audit_time = this.query.audit_time;
            const audit_time_1 = audit_time[0];
            const audit_time_2 = audit_time[1];

            if (audit_time_1) {
                this.query.audit_time1 = Vue.prototype.FormatTime(audit_time_1);
            }
            if (audit_time_2) {
                this.query.audit_time2 = Vue.prototype.FormatTime(audit_time_2);
            }

            this.query.token = localStorage.getItem("token");
            this.axios.get('/ware/Outbound/index', {
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
        // 联查
        handleSelectOne() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length == 1) {
                let ob_code = '';
                for (let i = 0; i < length; i++) {
                    ob_code = this.multipleSelection[i].ob_code;
                }
                this.SelectOneVisible = true;
                let nextdata = {
                    ob_code: ob_code
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
        handlePicking(pi_code) {
            this.PickingVisible = true;

            this.$nextTick(() => {
                this.$refs.pickingDetail.dataInitialization(pi_code);
            })
        },
        handleOutbound(ob_code) {
            this.OutboundVisible = true;

            this.$nextTick(() => {
                this.$refs.outboundDetail.dataInitialization(ob_code);
            })
        },
        change() {
          this.axios.post('/ware/warehouse/ware_list_base_department', {
            token: localStorage.getItem("token"),
            params: this.form
          }).then((res) => {
            this.ware_have_options = res;
          }).catch(() => {
            this.loading = false;
          })
          this.$forceUpdate();
        },
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/ware/Outbound/delete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getListData();
                    }).catch(() => {
                        this.loading = false;
                    })

                })
                .catch(() => { })
        },
        // 完成
        handleEnd() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];

                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pro/PickingApply/End', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,
                }).then((res) => {

                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    this.auditVisible = false;
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
        getWareInventory() {
            this.axios.post('/ware/Outbound/getWareInventory', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
            }).then((res) => {
                console.log(res);
                this.orderData = res;

                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
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
                this.options = [
                    { id: query, p_name: query }
                ];
            }
        },
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },

        handleEdit(ob_code, department_id) {
            this.OutboundUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.outboundUpdate.dataInitialization(ob_code);
                this.$refs.outboundUpdate.UpdateWare(department_id);
                this.$refs.outboundUpdate.getOutSendReceiving();

            })
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
                this.PickingOutWareChange();
            }
        },
        handleSave() {
            this.form.dbilldate = Vue.prototype.FormatTime(this.form.dbilldate_w);
            this.axios.post('/ware/PickingOut/handleSave', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData

            }).then((res) => {

                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                this.orderVisible = false;
                this.getData();
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
        // 获取仓库
        getWareChange() {
            this.axios.post('/ware/warehouse/warelist', {
                token: localStorage.getItem("token"),
                // params: this.form
            }).then((res) => {
                this.query_ware_options = this.ware_options = res;

            }).catch(() => {
                this.loading = false;
            })
        },
        // 材料出库-手动出库
        handleOut() {
            this.form = {};

            if (this.form.department_id) {
            } else {
                this.form.department_id = this.department_id;
            }
            this.orderData = [];
            this.orderVisible = true;
        },
        // 新增
        handleadd() {
            this.form = {};
            if (this.form.department_id) {
            } else {
                this.form.department_id = this.department_id;
            }
            const length = this.multipleSelection.length;
            this.orderData = [];

            if (length) {
                this.axios.post('/ware/PickingOut/handleOut', {
                    token: localStorage.getItem("token"),
                    selection: this.multipleSelection,
                    params: this.form,
                }).then((res) => {
                    this.orderData = res.data;
                    this.ware_have_options = res.warehouse_arr;
                }).catch(() => {
                    this.loading = false;
                })
                this.editVisible = true;
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },
        wareChange() {
            this.axios.post('/ware/PickingOut/handleOut', {
                token: localStorage.getItem("token"),
                selection: this.multipleSelection,
                params: this.form,
            }).then((res) => {
                this.orderData = res.data;
                this.ware_have_options = res.warehouse_arr;
                this.location_options = res.location_arr;
            }).catch(() => {
                this.loading = false;
            })
        },
        PickingOutWareChange() {
            this.axios.post('/ware/Outbound/getWareInventory', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
            }).then((res) => {
                console.log(res);
                this.orderData = res.data;
                this.ware_have_options = res.warehouse_arr;
                this.location_options = res.location_arr;

            }).catch(() => {
                this.loading = false;
            })
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
        //删除行
        handleDeleteLine(index) {
            this.orderData.splice(index, 1)
        },
        // 搜索,触发搜索按钮
        handleSearch() {
            // 为this.query新增属性，并更新视图
            this.$set(this.query, 'pageIndex', 1);
            // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
            if (this.activeName == 'wait') {
                this.getData();
            } else if (this.activeName == 'pass') {
                this.getListData();
            }

        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            if (this.activeName == 'wait') {
                this.getData();
            } else if (this.activeName == 'pass') {
                this.getListData();
            }
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            if (this.activeName == 'wait') {
                this.getData();
            } else if (this.activeName == 'pass') {
                this.getListData();
            }
        },
        // 保存编辑
        saveEdit() {
            this.axios.post('/ware/PickingOut/outSave', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData
            }).then((res) => {

                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.editVisible = false;
                this.getData();

            }).catch(() => {
                this.loading = false;
            })


        },
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
            this.axios.post('/ware/Outbound/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },
        // 审核通过
        saveAuditPass() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let ob_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    ob_code_arr.push(this.multipleSelection[i].ob_code);
                }
                this.axios.post('/ware/Outbound/auditPass', {
                    token: localStorage.getItem("token"),
                    ob_code_arr: ob_code_arr,
                    params: this.form,
                    // multipleSelection:this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
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
        // 审核不通过
        saveAuditFail() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let ob_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    ob_code_arr.push(this.multipleSelection[i].ob_code);
                }
                this.axios.post('/ware/Outbound/auditFail', {
                    token: localStorage.getItem("token"),
                    ob_code_arr: ob_code_arr,
                    params: this.form,
                    multipleSelection: this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
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

        // 创建推送U8
        handleCrpustU8() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let ob_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    ob_code_arr.push(this.multipleSelection[i].ob_code);
                }
                this.axios.post('/ware/Warehousing/crpustU8Other', {
                    token: localStorage.getItem("token"),
                    ob_code_arr: ob_code_arr,
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
                let ob_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    ob_code_arr.push(this.multipleSelection[i].ob_code);
                }
                this.axios.post('/u8api/U8Materialout/Pust', {
                    token: localStorage.getItem("token"),
                    ob_code_arr: ob_code_arr,
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
                let ob_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    ob_code_arr.push(this.multipleSelection[i].ob_code);
                }
                this.axios.post('/u8api/U8Materialout/PuLL', {
                    token: localStorage.getItem("token"),
                    ob_code_arr: ob_code_arr,
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


        handleClick(tab, event) {
            if (this.activeName == 'wait') {

                // 重新获取数据
                this.getData();
            } else if (this.activeName == 'pass') {
                // this.query.status = ''
                this.query.type = 2
                this.getListData();
            }

        }


    },
    // 在钩子函数中调用getData方法
    created() {

        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.query.create_time = [start, end];
        this.permission = JSON.parse(this.permission);
        this.Outbound_url = axios.defaults.baseURL + '/com/ExcelIn/Outbound';
        this.getisWareSuper();
        this.getData();
        this.getDepartment();
        this.getWareChange();
        this.department_id = parseInt(this.department_id);
        this.getStatusArr();
        this.getPustArr();
    }
}
</script>
