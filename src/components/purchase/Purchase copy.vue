<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">
                {{ $t('default.Purchase_Order_Number') }}:<el-input v-model="query.pur_code"
                    class="handle-input mr10 w150"></el-input>

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

                <!-- 项目 -->
                {{ $t('default.Project') }}:
                <el-select v-model="query.pro_code" multiple filterable remote
                    :placeholder="$t('default.Please_select')" class="w150">
                    <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    :placeholder="$t('default.Please_select')" class="w150">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 采购员 -->
                {{ $t('default.Purchaser') }}：
                <el-select v-model="query.pur_user" multiple filterable remote
                    :placeholder="$t('default.Please_enter_a_keyword')" class="w120">
                    <el-option v-for="item in pur_user_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 供应商 -->
                {{ $t('default.Supplier') }}：
                <el-select v-model="query.sup_code" filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteSupply"
                    :loading="loading">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 创建时间 -->
                {{ $t('default.Creation_Date') }}：
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>
                <br />

                <!-- 排序 -->
                {{ $t('default.Sort_by') }}：
                <el-select v-model="query.sort" :placeholder="$t('default.Please_select')" class="w120">
                    <el-option v-for="item in sort_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="query.sort_type" class="w80">
                    <el-option v-for="item in sort_type_options" :key="item.value" :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <!-- 价格变动审核 -->
                <el-button type="primary" class="handle-del mr10" @click="handlePriceAudit"
                    v-if="permission.includes('Purchase:audit')">{{ $t('default.Price_Change_Audit') }}</el-button>
                <el-button type="primary" class="handle-del mr10" @click="savePass"
                    v-if="permission.includes('Purchase:audit')">{{ $t('default.Audit') }}</el-button><!-- 审核 -->

                <!-- 弃审 -->
                <el-button type="primary" class="handle-del mr10" @click="saveFail"
                    v-if="permission.includes('Purchase:audit')">{{ $t('default.Abandonment') }}</el-button>
                <!-- 修复 -->
                <el-button type="primary" class="handle-del mr10" @click="handleFix"
                    v-if="permission.includes('Purchase:audit')">{{ $t('default.Abandonment') }}</el-button>
                <!-- 导出明细 -->
                <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Purchase:handleExport')"
                    @click="handleExport">{{ $t('default.Export_Details') }}</el-button>

                <!-- 取消 -->
                <!-- <el-button type="primary" class="handle-del mr10" @click="Cancel"
                    v-if="permission.includes('Purchase:cancel')">{{ $t('default.Cancel') }}</el-button> -->
                <!-- 手动完成 -->
                <el-button type="primary" class="handle-del mr10" @click="handleEnd"
                    v-if="permission.includes('Purchase:end')">{{ $t('default.Manual_Completion') }}</el-button>

                <!-- 创建推送U8 -->
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
                <!-- 手动完成 -->
                <el-button type="primary" class="handle-del mr10" @click="handleSelectOne">{{
                    $t('default.Manual_Completion') }}</el-button>

            </div>

            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 待处理 -->
                    <el-tab-pane :label="$t('default.Pending')" name="doing"></el-tab-pane>


                    <!-- 价格变动审核 -->
                    <el-tab-pane :label="$t('default.Price_Change_Audit')" name="wait"></el-tab-pane>
                    <!-- 价格变动驳回 -->
                    <el-tab-pane :label="$t('default.Price_Change_Reject')" name="refuse"></el-tab-pane>
                    <!-- 待审核 -->
                    <el-tab-pane :label="$t('default.Pending_Audit')" name="audit"></el-tab-pane>
                    <!-- 在途 -->
                    <el-tab-pane :label="$t('default.In_Transit')" name="transit"></el-tab-pane>
                    <!-- 完成 -->
                    <el-tab-pane :label="$t('default.Completed')" name="complete"></el-tab-pane>
                    <!-- 全部 -->
                    <el-tab-pane :label="$t('default.All')" name="all"></el-tab-pane>
                </el-tabs>
            </div>



            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center" width="120">
                    <template v-slot="scope">

                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                            v-if="permission.includes('Purchase:update') && (scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 3)">{{
                    $t('default.Edit') }}</el-button><!-- 编辑 -->

                        <!-- handlePurUpdate -->
                        <el-button type="text" @click="handlePurUpdate( scope.row.pur_code)"
                            v-if="permission.includes('Purchase:update') && (scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 3)">{{
                    $t('default.Edit') }}</el-button><!-- 编辑 -->
                        <el-button type="text" v-if="permission.includes('Purchase:handleOut')"
                            @click="handleOut(scope.$index, scope.row)">{{ $t('default.Export')
                            }}</el-button><!-- 导出 -->
                        <!-- 退货 -->
                        <el-button type="text" @click="handleReturn(scope.$index, scope.row)"
                            v-if="permission.includes('Purchase:handleReturn')">{{ $t('default.Returns') }}</el-button>

                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

                <!-- 采购单号 -->
                <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')">

                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handlePurDetail(scope.row.pur_code)"> {{
                    scope.row.pur_code }}</el-button>
                    </template>
                </el-table-column>


                <el-table-column prop="total_price" :label="$t('default.Total_Price')" v-if=cost_show></el-table-column>
                <!-- 退款 -->
                <el-table-column v-if=cost_show prop="return_price" :label="$t('default.Refund')"></el-table-column>


                <el-table-column prop="delivery_note" :label="$t('default.Delivery_Orders')">

                    <template v-slot="scope">

                        <el-button type="text" icon="el-icon-edit"
                            @click="handleDeliveryNote(scope.$index, scope.row)">{{ scope.row.delivery_note
                            }}</el-button>
                    </template>

                </el-table-column>

                <!-- 状态 -->
                <el-table-column prop="status_name" :label="$t('default.Status')"></el-table-column>



                <!-- U8状态 -->
                <el-table-column prop="forderstatus_name" :label="$t('default.U8Status')">
                    <template v-slot="scope">
                        <el-popover v-if="scope.row.push == 3" trigger="hover" placement="top">
                            <p>{{ scope.row.return_date }}</p>
                            <div slot="reference" class="name-wrapper">
                                <i class="el-icon-warning" style="color: red;"></i>
                            </div>
                        </el-popover>
                        <i v-if="scope.row.vordercode" class="el-icon-top"></i>
                        <el-button style="color: rgb(39, 36, 36);" type="text" v-if="scope.row.push == 2"> {{
                    scope.row.forderstatus_name }}</el-button>
                    </template>
                </el-table-column>



                <!-- 采购员 -->
                <el-table-column prop="pur_name" :label="$t('default.Purchaser')"></el-table-column>
                <!-- 需求交期 -->
                <el-table-column prop="estimated_delivery_time" :label="$t('default.Demand_Delivery')" width="105">

                    <template v-slot="scope">

                        <el-tag v-if="scope.row.estimated_delivery_button == 'success'" type="success">{{
                    scope.row.estimated_delivery_time }}</el-tag>



                        <el-tag v-if="scope.row.estimated_delivery_button == 'warning'" type="warning">{{
                    scope.row.estimated_delivery_time }}</el-tag>



                        <el-tag v-if="scope.row.estimated_delivery_button == 'danger'" type="danger">{{
                    scope.row.estimated_delivery_time }}</el-tag>


                    </template>
                </el-table-column>


                <!-- 日志 -->
                <el-table-column prop="log" :label="$t('default.Logbook')" width="55">

                    <template v-slot="scope">

                        <el-button type="text" icon="el-icon-document"
                            @click="showLog(scope.$index, scope.row)"></el-button>
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
                <!-- 供应商 -->
                <el-table-column prop="sup_name" :label="$t('default.Supplier')" width="100">

                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.sup_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.sup_name }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 审核 -->
                <el-table-column prop="audit_time" :label="$t('default.Audit')">

                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_name }}{{ scope.row.audit_time }}{{ scope.row.audit_desc }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_name
                                    }}{{ scope.row.audit_time }}{{ scope.row.audit_desc }}</el-button>
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

        <!-- 修改采购单 -->
        <el-dialog :title="$t('default.Modify_Purchase_Order')" :visible.sync="orderVisible1" width="85%"
            :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="order_rules" :model="form" label-width="80px" size="mini">
                <!-- 采购单号 -->
                <el-form-item :label="$t('default.Purchase_Order_Number')">
                    {{ form.pur_code }}
                </el-form-item>
                <!-- 采购员 -->
                <el-form-item :label="$t('default.Purchaser')">
                    {{ form.pur_name }}
                </el-form-item>
                <!-- 部门 -->
                <el-form-item :label="$t('default.Department')">
                    {{ form.department_name }}
                </el-form-item>
                <!-- 供应商 -->
                <el-form-item :label="$t('default.Supplier')" prop="sup_code">
                    <el-select v-model="form.sup_code" filterable remote reserve-keyword
                        :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteSupply"
                        :loading="loading" @change="sup_change()">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 币种 -->
                <el-form-item :label="$t('default.Currency')">
                    <el-select v-model="form.currtypecode" filterable :placeholder="$t('default.Please_select')">
                        <el-option v-for="item in currtype_option" :key="item.currtypecode" :label="item.currtypename"
                            :value="item.currtypecode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 业务流程 -->
                <el-form-item :label="$t('default.Business_Process')" prop="cbiztype">
                    <el-select v-model="form.cbiztype">
                        <el-option v-for="item in cbiztype_options" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 需求交期 -->
                <el-form-item :label="$t('default.Requirement_Lead_Time')" prop="estimated_delivery_time">

                    <el-date-picker v-model="form.estimated_delivery_time" type="date"
                        :placeholder="$t('default.Select_Date')">
                    </el-date-picker>
                </el-form-item>
                <!-- 扣税类别 -->
                <el-form-item :label="$t('default.Tax_Deduction_Category')" prop="tax_deduction">
                    <el-select v-model="form.tax_deduction" :placeholder="$t('default.Please_select')">
                        <el-option v-for="item in tax_deduction_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 整单税率 -->
                <el-form-item :label="$t('default.Tax_Rate')" prop="tax_rate">
                    <el-input v-model="form.tax_rate" @blur="handleTaxRate"></el-input>
                </el-form-item>


                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>

            </el-form>

            <template>
                <el-button type="primary" @click="handleAddOrderLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                <el-table :data="orderData" style="width: 100%" show-summary :summary-method="getSummaries">
                    <!-- 部门 -->
                    <el-table-column :label="$t('default.Department')">
                        <template v-slot="scope">
                            <el-select v-model="scope.row.department_id" filterable remote reserve-keyword
                                :placeholder="$t('default.Please_enter_a_keyword')">
                                <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <!-- 物料编码 -->
                    <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="160px">
                        <template v-slot="scope">
                            <div v-if="scope.row.id">
                                <el-popover trigger="hover" placement="top">
                                    <p>{{ scope.row.mat_code }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code
                                            }}</el-button>
                                    </div>
                                </el-popover>
                            </div>
                            <div v-else>
                                <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword
                                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="getPlanning"
                                    :loading="loading"
                                    @change="getPlanningOne(scope.$index, scope.row, scope.row.mat_code)">

                                    <el-option v-for="item in plan_options" :key="item.mat_code" :label="item.mat_code"
                                        :value="item.mat_code">
                                        <span style="float: left">{{ item.mat_code }}</span>

                                    </el-option>
                                </el-select>

                            </div>

                        </template>
                    </el-table-column>
                    <!-- 物料名称 -->
                    <el-table-column prop="mat_name" :label="$t('default.Material_Name')">

                        <template v-slot="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>{{ scope.row.mat_name }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.mat_name }}</el-button>
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

                    <!-- 实购数 -->
                    <el-table-column prop="real_num" :label="$t('default.Purchase_Number')">

                        <template v-slot="scope">

                            <div v-if="form.status == 1 || form.status == 2 || form.status == 3">
                                <el-input v-model.number="scope.row.real_num"
                                    @blur="handleOrderChageRowRealNum(scope.$index, scope.row)"></el-input>
                            </div>

                            <div v-else>
                                {{ scope.row.real_num }}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 退货数 -->
                    <el-table-column prop="return_num" :label="$t('default.Number_of_Returns')">

                        <template v-slot="scope">

                            <div v-if="form.status < 8 && form.status > 3">
                                <el-input v-model.number="scope.row.return_num"></el-input>
                            </div>

                            <div v-else>
                                {{ scope.row.return_num }}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 项目 -->
                    <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">

                        <template v-slot="scope">
                            <el-select v-model="scope.row.pro_code" :placeholder="$t('default.Please_select')">
                                <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                                    :value="item.value">
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
                    <!-- 原单价 -->
                    <el-table-column prop="old_cost" :label="$t('default.Original_Order_Price')"></el-table-column>
                    <!-- 含税单价 -->
                    <el-table-column prop="tax_cost" :label="$t('default.Including_tax_unit_price')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.tax_cost"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 单价 -->
                    <el-table-column prop="cost" :label="$t('default.Unit_Price')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.cost"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 税率 -->
                    <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.tax_rate"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 金额 -->
                    <el-table-column prop="total_price" :label="$t('default.Amount')"></el-table-column>
                    <!-- 税额 -->
                    <el-table-column prop="noriginaltaxmny" :label="$t('default.Tax_amount')"></el-table-column>
                    <!-- 价税合计 -->
                    <el-table-column prop="ntaxpricemny" :label="$t('default.Total_price_and_tax')"></el-table-column>
                    <!-- 操作 -->
                    <el-table-column prop="operate" :label="$t('default.Action')">
                        <template v-slot="scope">
                            <div v-if="scope.row.id">

                                <el-radio v-model="scope.row.delete_time" label="2">{{ $t('default.Delete')
                                    }}</el-radio>
                            </div>
                            <div v-else>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="handleDeleteOrderLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                </el-button><!-- 删除 -->
                            </div>


                        </template>

                    </el-table-column>

                </el-table>
            </template>





            <span slot="footer" class="dialog-footer">
                <el-button @click="orderVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveOrder">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>


        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="送货单"  -->
        <el-dialog :title="$t('default.Delivery_Orders')" :visible.sync="deliveryVisible" width="70%"
            :before-close="handleClose">

            <el-form :inline="true" ref="form" :model="form" label-width="200px">


                <el-form-item :label="$t('default.Delivery_Orders')">
                    <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <el-upload class="upload-demo" :action="uploadFile_url" :on-remove="handleRemove" multiple
                        :limit="10" style="float: left;margin-right: 5px;" :on-exceed="handleExceed"
                        :file-list="fileList" :on-success="handleFileSuccess">
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload')
                            }}</el-button><!-- 点击上传 -->

                    </el-upload>

                    <template>
                        <el-table :data="deliveryData" style="width: 100%">
                            <!-- 送货单号 -->
                            <el-table-column prop="order_no" :label="$t('default.Delivery_Orders')" width="180">

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
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="deliveryVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="DeliveryNoteSave">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>






        <!-- 日志 -->
        <el-dialog :title="$t('default.Logbook')" :visible.sync="LogVisible" width="70%">

            <el-table :data="LogData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">

                <!-- 采购单号 -->
                <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')"
                    align="center"></el-table-column>



                <!-- 操作类型 -->
                <el-table-column prop="type_name" :label="$t('default.Operation_Type')"></el-table-column>


                <!-- 备注 -->
                <el-table-column prop="note" :label="$t('default.Desc')"></el-table-column>
                <!-- 明细备注 -->
                <el-table-column prop="item_note" :label="$t('default.Detailed_Remarks')"></el-table-column>

                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')"></el-table-column>

                <!-- 操作人 -->
                <el-table-column prop="create_user_name" :label="$t('default.Operator')"></el-table-column>


            </el-table>





        </el-dialog>

        <el-dialog title='价格变动审核' :visible.sync="PriceAuditVisible" width="80%">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="审核备注">
                    <el-input v-model="form.price_audit_desc"></el-input>
                </el-form-item>
            </el-form>
            <span class="dialog-footer">
                <el-button @click="PriceAuditVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="PriceAudit">通 过</el-button>
           
            </span>

            <template>

                <el-table :data="orderData" style="width: 100%" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header">
                    <!-- 序号 -->
                    <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

                    <!-- 采购单号 -->
                    <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')">
                        <template v-slot="scope">


                            <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.pur_code
                                }}</el-button>

                        </template>
                    </el-table-column>
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
                    <!-- 实购数 -->
                    <el-table-column prop="real_num" :label="$t('default.Purchase_Number')"></el-table-column>
                    <el-table-column prop="old_cost" label="当前单价"></el-table-column>
                    <!-- 单价 -->
                    <el-table-column prop="cost" :label="$t('default.Unit_Price')"></el-table-column>
                    <el-table-column prop="noriginaltaxmny" label="含税单价"></el-table-column>

                    <!-- 税率 -->
                    <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>
                    <!-- <el-table-column prop="noriginalsummny" label="原币价税合计" width="110"></el-table-column> -->

                    <el-table-column prop="price_audit_desc" label="审核备注">

                        <template v-slot="scope">
                            <el-input v-model="scope.row.price_audit_desc"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column :label="$t('default.Action')" align="center" width="160">
                        <template v-slot="scope">

                            <el-radio v-model="scope.row.price_audit_status" label="1">通过</el-radio>
                            <el-radio v-model="scope.row.price_audit_status" label="3">驳回</el-radio>


                        </template>
                    </el-table-column>

                    <el-table-column prop="pro_code" label="项目" width="150"></el-table-column>
                    <el-table-column prop="currtypecode" label="币种" width="150"></el-table-column>



                </el-table>
            </template>

        </el-dialog>

        <el-dialog title='退款退货' :visible.sync="returnVisible" width="75%" :before-close="handleClose">
            <el-form :inline="true" ref="form" :rules="order_rules" :model="form" label-width="200px">
                <el-form-item v-if=cost_show label="退款总金额" prop="total_price">
                    <el-input v-model="form.total_price" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item v-if=cost_show label="货款" prop="good_price">
                    <el-input v-model="form.good_price" @blur="handleReturnGood"></el-input>
                </el-form-item>
                <el-form-item v-if=cost_show label="其他退款" prop="other_price">
                    <el-input v-model="form.other_price" @blur="handleReturnGood"></el-input>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>

            <template>
                <el-table :data="orderData" style="width: 100%">
                    <!-- 序号 -->
                    <el-table-column prop="no" :label="$t('default.No')"></el-table-column>
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
                    <!-- 实购数 -->
                    <el-table-column prop="real_num" :label="$t('default.Purchase_Number')"></el-table-column>
                    <!-- 入库数 -->
                    <el-table-column prop="in_num" :label="$t('default.Inventory_Number')"></el-table-column>
                    <el-table-column prop="return_num" label="已退货数"></el-table-column>
                    <el-table-column prop="new_return_num" label="退货数">

                        <template v-slot="scope">

                            <el-input v-model.number="scope.row.new_return_num" @blur="handleReturnGood"></el-input>

                        </template>
                    </el-table-column>
                    <el-table-column v-if=cost_show prop="cost" label="成本价"></el-table-column>
                    <!-- 税率 -->
                    <el-table-column v-if=cost_show prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>
                    <el-table-column prop="pro_name" label="项目"></el-table-column>
                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">

                        <template v-slot="scope">
                            <el-input v-model.number="scope.row.desc"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </template>





            <span slot="footer" class="dialog-footer">
                <el-button @click="returnVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveReturn">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <!-- 采购单 -->
        <purchase-detail ref="purchaseDetail" :visible.sync="purchaseVisible" :data="current" @done="reload"
            @refreshParent="refreshPage">
        </purchase-detail>
        <!-- 采购单修改 -->
        <purchase-update ref="purchaseUpdate" :visible.sync="orderVisible" :data="current" @done="reload"
            @refreshParent="refreshPage">
        </purchase-update>

        <el-dialog :visible.sync="InDetailVisible" append-to-body width="90%" title="采购入库单">
            <in-detail ref="inDetail"></in-detail>
        </el-dialog>
        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">

            <seledetail ref="seledetail"></seledetail>
        </el-dialog>

    </div>
</template>

<script>
import PurchaseDetail from '../purchase/PurchaseDetail.vue';
import PurchaseUpdate from '../purchase/PurchaseUpdate.vue';
import InDetail from '../purchase/PurchaseInDetail.vue';
import Seledetail from '../base/SelectOne.vue';
import axios from 'axios';
import Vue from 'vue';

export default {
    name: 'basetable',
    components: {
        PurchaseDetail,
        PurchaseUpdate,
        InDetail,
        Seledetail,

    },
    data() {
        return {
            query: {
                status: '1,2,3,4,5,6,7',
                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20,
                sort: 'm.create_time',
                sort_type: 'desc',
            },
            permission: sessionStorage.getItem('permission_button'),
            tableData: [],
            orderData: [],
            current: {},
            deliveryData: [],
            multipleSelection: [],
            delList: [],
            fileList: [],
            sort_options: [],
            sort_type_options: [
                { value: 'asc', name: '升序' },
                { value: 'desc', name: '倒序' },
            ],
            uploadFile_url: '',
            editVisible: false,
            orderVisible: false,
            orderVisible1: false,
            deliveryVisible: false,
            detailVisible: false,
            LogVisible: false,

            purchaseVisible: false,
            InDetailVisible: false,
            returnVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            rules: {
                real_num: [
                    { required: true, message: '请输入实购数', trigger: 'blur' },
                    { type: 'number', message: '实购数必须为数字值' }
                ],
            },
            order_rules: {
                sup_code: [
                    { required: true, message: '请输入供应商', trigger: 'blur' },
                ],
                tax_deduction: [
                    { required: true, message: '请输入扣税类别', trigger: 'blur' },
                ],
                department_id: [
                    { required: true, message: '请输入部门', trigger: 'blur' },
                ],
                tax_rate: [
                    { required: true, message: '请输入整单税率', trigger: 'blur' },
                ],
                cbiztype: [
                    { required: true, message: '请输入业务流程', trigger: 'blur' },
                ],
                estimated_delivery_time: [
                    { required: true, message: '请输入需求交期', trigger: 'blur' },
                ],
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
            activeName: 'doing',
            pur_user_options: [],
            department_options: [],
            project_options: [],
            tax_deduction_options: [{
                value: 0,
                label: '应税内含'
            }, {
                value: 1,
                label: '应税外加'
            }, {
                value: 2,
                label: '不计税'
            }],
            deliveryData: [],
            buyVisible: false,
            detailData: [],
            LogData: [],
            cost_show: false,
            PriceAuditVisible: false,
            cbiztype_options: [],
            currtype_option: [],
            SelectOneVisible: false,
            plan_options: [],
            mat_options: [],
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
            if (create_time) {
                const create_time_1 = create_time[0];
                const create_time_2 = create_time[1];

                if (create_time_1) {
                    this.query.create_time1 = Vue.prototype.FormatTime(create_time_1);
                }

                if (create_time_2) {
                    this.query.create_time2 = Vue.prototype.FormatTime(create_time_2);
                }
            }
            // return false;
            // return false;
            this.query.token = localStorage.getItem("token");
            this.axios.get('/pur/Purchase/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.cost_show = res.cost_show;
                this.cbiztype_options = res.cbiztype_options;
                this.sort_options = res.sort_options;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })

        },
        tableRowClassName({ row, rowIndex }) {
            if (row.status === 8) {
                return 'success-row';
            } else if (rowIndex === 3) {

            }
            return '';
        },
        handlePurDetail(pur_code) {
            this.purchaseVisible = true;
            this.$nextTick(() => {
                this.$refs.purchaseDetail.dataInitialization(pur_code);
            })
        },
        handlePurUpdate(pur_code) {
          
            this.orderVisible = true;
            this.$nextTick(() => {
                this.$refs.purchaseUpdate.dataInitialization(pur_code);
            })
        },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        refreshPage() {
            // 这里实现页面的更新逻辑
            // console.log('父页面刷新');
            this.getData();
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
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        // 联查
        handleSelectOne() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // console.log(length);
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length == 1) {
                // console.log(3333);
                // let id_arr = [];
                let pur_code = '';
                for (let i = 0; i < length; i++) {
                    // id_arr.push(this.multipleSelection[i].id);
                    pur_code = this.multipleSelection[i].pur_code;
                }
                this.SelectOneVisible = true;
                let nextdata = {
                    pur_code: pur_code
                };
                this.$nextTick(() => {
                    this.$refs.seledetail.dataInitialization(nextdata);
                })

                console.log(pur_code);
                // this.purchaseVisible = true;
                // this.$nextTick(() => {
                //     this.$refs.detail.dataInitialization(pur_code);
                // })

            } else if (length > 1) {
                // 只能选中一项
                this.$message.error(this.$t('default.Only_one_item_can_be_selected'));
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
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
                        case 5:
                        case 6:
                        case 13:
                        case 14:
                        case 15:
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            // sums[index] +='';

                            break;


                        default: '';
                    }
                    // sums[index] += ' 元';
                } else {
                    // sums[index] = 'N/A';
                }
            });

            return sums;
        },
        handlePurDetailIn(pur_code) {
            this.InDetailVisible = true;
            // this.dataInitialization(pur_code);
            this.$nextTick(() => {
                this.$refs.inDetail.dataInitialization(pur_code);
            })
        },

        // 推送U8
        Push() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let pur_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    pur_code_arr.push(this.multipleSelection[i].pur_code);
                }
                this.axios.post('/u8api/U8Order/Pust', {
                    token: localStorage.getItem("token"),
                    pur_code_arr: pur_code_arr,
                    params: this.form

                }).then((res) => {
                    // console.log(res);
                    // 弹出成功提示框
                    // 推送成功
                    this.$message.success(this.$t('default.Push_Successful'));
                    this.editVisible = false;
                    this.getData();
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
                let pur_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    pur_code_arr.push(this.multipleSelection[i].pur_code);
                }
                this.axios.post('/u8api/U8Order/PuLL', {
                    token: localStorage.getItem("token"),
                    pur_code_arr: pur_code_arr,
                    params: this.form

                }).then((res) => {
                    // console.log(res);
                    // 弹出成功提示框
                    // 推送成功
                    this.$message.success(this.$t('default.Push_Successful'));
                    this.editVisible = false;
                    this.getData();
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

        // 创建推送U8
        handleCrpustU8() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let pur_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    pur_code_arr.push(this.multipleSelection[i].pur_code);
                }
                this.axios.post('/pur/Purchase/crpustU8', {
                    token: localStorage.getItem("token"),
                    pur_code_arr: pur_code_arr,
                    params: this.form

                }).then((res) => {
                    // console.log(res);
                    // 弹出成功提示框
                    this.$message.success('更新成功');
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
        handleTaxRate() {
            this.orderData.forEach((e, i) => {
                this.$set(this.orderData[i], 'tax_rate', this.form.tax_rate);
            });
        },
        // 手动完成
        handleEnd() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pur/Purchase/End', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    // params: this.form
                }).then((res) => {
                    // console.log(res);
                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    // this.buyVisible = false;
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



        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                pageIndex: 1,
                pageSize: 20,
                sort: 'm.create_time',
                sort_type: 'desc',
                // status:'1,2,3,4,5,6,7'
            }

            if (this.activeName == 'doing') {
                this.query.status = '1,2,3,4,5,6,7';
            } else if (tab._props.label == 'wait') {
                this.query.status = 1
            } else if (tab._props.label == 'refuse') {
                this.query.status = 3
            } else if (tab._props.label == 'audit') {
                this.query.status = 2
            } else if (tab._props.label == 'transit') {
                this.query.status = "4,5,6,7"
            } else if (tab._props.label == 'complete') {
                this.query.status = 8
            } else if (tab._props.label == 'all') {
                this.query.status = ''
            }
        },

        change() {
            this.$forceUpdate();
        },
        sup_change() {
            // 获取采购员,部门，
            this.axios.post('/infor/supply/getSupplyInfo', {
                token: localStorage.getItem("token"),
                params: this.form,
            }).then((res) => {
                this.form.currtypecode = res.currtypecode;
                this.$forceUpdate();
            }).catch(() => {
                this.loading = false;
            })

        },
        // 获取项目
        getProject() {
            this.axios.post('/pur/Project/getProject', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.project_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 退款退货
        // 仓库只退货,采购可修改退款金额
        handleReturn(index, row) {
            this.idx = index;
            this.form = JSON.parse(JSON.stringify(row));
            this.orderData = this.form.children;

            this.returnVisible = true;
            this.axios.post('/pur/PurchaseReturn/handleReturn', {
                token: localStorage.getItem("token"),

                params: this.form,
                orderData: this.orderData,

            }).then((res) => {
                this.form = res.info;
                this.orderData = res.orderData;
            }).catch(() => {
                this.loading = false;
            })

        },
        handleReturnGood() {
            this.axios.post('/pur/PurchaseReturn/handleReturn', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,

            }).then((res) => {
                this.form = res.info;
                this.orderData = res.orderData;
            }).catch(() => {
                this.loading = false;
            })
        },
        saveReturn() {
            this.axios.post('/pur/PurchaseReturn/save', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,

            }).then((res) => {

                this.returnVisible = false;
                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                // this.form=res.info;
                // this.orderData=res.orderData;
            }).catch(() => {
                this.loading = false;
            })
        },
        handlePriceAudit() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                this.PriceAuditVisible = true;
                let pur_code_arr = [];
                for (let i = 0; i < length; i++) {
                    pur_code_arr.push(this.multipleSelection[i].pur_code);
                }
                this.axios.post('/pur/Purchase/PriceAuditShow', {
                    token: localStorage.getItem("token"),
                    pur_code_arr: pur_code_arr,
                    params: this.form
                }).then((res) => {
                    // console.log(res);
                    // this.$message.success('修复成功');
                    // this.buyVisible = false;
                    this.orderData = res;
                    // this.getData();
                    // this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })

            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },
        PriceAudit() {
            this.axios.post('/pur/Purchase/PriceAudit', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form
            }).then((res) => {
                this.PriceAuditVisible = false;
                // console.log(res);
                this.$message.success('审核成功');
                // this.buyVisible = false;
                // this.orderData = res;
                // this.getData();
                // this.multipleSelection = [];
            }).catch(() => {
                this.loading = false;
            })
        },
        // 获取采购员
        getPurUser() {
            // 获取采购员,部门，
            this.axios.post('/index/user/getPurUser', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.pur_user_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },

        // 显示日志
        showLog(index, row) {
            this.form = JSON.parse(JSON.stringify(row));
            this.axios.post('/pur/PurchaseLog/showLog', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {

                this.LogData = res;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })

            this.LogVisible = true;
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
        // 审核
        handleAudit() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                this.editVisible = true;
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },
        // 修复
        handleFix() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let pur_code_arr = [];
                for (let i = 0; i < length; i++) {
                    pur_code_arr.push(this.multipleSelection[i].pur_code);
                }
                this.axios.post('/pur/Purchase/Fix', {
                    token: localStorage.getItem("token"),
                    pur_code_arr: pur_code_arr,
                    params: this.form
                }).then((res) => {
                    // console.log(res);
                    this.$message.success('修复成功');
                    // this.buyVisible = false;
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
        // 显示送货单
        handleDeliveryNote(index, row) {
            this.FileList = [];
            this.form = JSON.parse(JSON.stringify(row));
            this.axios.post('/pur/Delivery/getDelivery', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {
                // console.log(res);
                // this.$message.success('标记已下单成功');
                this.deliveryData = res;
                // this.getData();
                // this.multipleSelection = [];
            }).catch(() => {
                this.loading = false;
            })

            this.deliveryVisible = true;

        },
        // 保存送货单
        DeliveryNoteSave() {

            this.axios.post('/pur/Delivery/Save', {
                token: localStorage.getItem("token"),
                params: this.form,
                deliveryData: this.deliveryData,
            }).then((res) => {
                // console.log(res);
                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                // this.deliveryData = res;
                this.deliveryVisible = false;
            }).catch(() => {
                this.loading = false;
            })


        },
        handleFileSuccess(file, FileList, row) {
            if (this.deliveryData == undefined) {
                this.deliveryData = new Array();
            }
            var picture = FileList.response.data;
            var picture_url = axios.defaults.basePicURL + picture;
            let obj = {
                picture: picture,
                picture_url: picture_url,
            };

            this.deliveryData.push(obj);
        },
        handleAddOrderLine() {
            if (this.orderData == undefined) {
                this.orderData = new Array();
            }
            let obj = {};

            this.orderData.push(obj);
        },
        handleDeleteOrderLine(index) {
            this.orderData.splice(index, 1)
        },
        handleAddLine() {
            if (this.deliveryData == undefined) {
                this.deliveryData = new Array();
            }
            let obj = {};

            this.deliveryData.push(obj);
        },
        handleDeleteLine(index) {
            this.deliveryData.splice(index, 1)
        },
        handleRemove(file, fileList) {

        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // 标记已下单
        handleBuy() {
            this.buyVisible = true;
        },
        // 标记已下单
        handleBuySave() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pur/Purchase/updateBuyStatus', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form
                }).then((res) => {
                    console.log(res);
                    this.$message.success('标记已下单成功');
                    this.buyVisible = false;
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

        // 标记在途
        handleTransit() {
            const length = this.multipleSelection.length;
            if (length) {
                let id_arr = [];
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pur/Purchase/updateTransitStatus', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                }).then((res) => {
                    this.$message.success('标记在途成功');
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
        // 标记待提货
        handlePicked() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }

                this.axios.post('/pur/Purchase/updatePickedStatus', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,


                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('标记待提货成功');
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

        Cancel() {
            const length = this.multipleSelection.length;
            if (length) {
                let id_arr = [];
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pur/Purchase/Cancel', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {
                    this.$message.success(res);
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
        savePass() {
            const length = this.multipleSelection.length;
            if (length) {
                let id_arr = [];
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pur/Purchase/auditPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {
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
        // 导出
        handleOut(index, row) {
            this.idx = index;
            this.form = JSON.parse(JSON.stringify(row));
            this.axios.post('/pur/Purchase/excelOut1', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {

                window.open(res);

            }).catch(() => {
                this.loading = false;
            })
        },
        // 审核不通过
        saveFail() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            if (length) {
                let id_arr = [];
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/pur/Purchase/auditFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {

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

        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
        // 搜索,触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleSelectionChange(val) {

            this.multipleSelection = val;
        },

        // 编辑
        handleEdit(index, row) {
            this.idx = index;
            this.form = JSON.parse(JSON.stringify(row));

            this.orderData = this.form.children;
            console.log(this.orderData);
            this.options = this.form.sup_options;

            this.orderVisible = true;
        },
        getPlanning(query) {
            if (query !== '') {
                this.axios.post('/plan/Planning/UpdateAdd', {
                    token: localStorage.getItem("token"),
                    mat_code: query,
                    status: 1,
                }).then((res) => {
                    this.plan_options = res;
                }).catch(() => {
                    this.plan_options = false;
                })
            } else {
                this.plan_options = [];
            }
        },
        getPlanningOne(index, row, mat_code) {

            this.axios.post('/plan/Planning/UpdateAdd', {
                token: localStorage.getItem("token"),
                mat_code: mat_code,
                status: 1,
            }).then((res) => {
                console.log(res);
                var re_data = res[0];
                this.$set(this.orderData[index], 'mat_name', re_data.name);
                this.$set(this.orderData[index], 'model', re_data.model);
                this.$set(this.orderData[index], 'real_num', re_data.real_num);
                this.$set(this.orderData[index], 'old_cost', re_data.cost);
                this.$set(this.orderData[index], 'tax_cost', re_data.cost);
                this.$set(this.orderData[index], 'ap_code', re_data.ap_code);
                this.$set(this.orderData[index], 'tax_rate', 0);
                this.$set(this.orderData[index], 'delete_time', 0);
                // ap_code
                // this.plan_options = res;
            }).catch(() => {
                // this.plan_options = false;
            })
        },
        handlePostDetail() {

            this.axios.post('/pur/Purchase/Detail', {
                token: localStorage.getItem("token"),
                pur_code: this.form.pur_code
            }).then((res) => {
                this.orderData = res.list;
                // this.department_options = res.department_arr;
            }).catch(() => {
                this.loading = false;
            })


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

        // 获取供应商
        remoteSupply(query) {
            if (query !== '') {
                this.axios.post('/infor/supply/getSupply', {
                    token: localStorage.getItem("token"),
                    name: query
                }).then((res) => {
                    this.options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },
        // handleOrderChage() {
        //     this.axios.post('/plan/Planning/applyCreateOrder', {
        //         token: localStorage.getItem("token"),
        //         orderData: this.orderData,
        //         params: this.form,
        //         // apm_code_arr: apm_code_arr,
        //         // selection: this.multipleSelection
        //     }).then((res) => {
        //         this.orderData = res.orderData;
        //         // this.form = res.info;
        //         this.error = res.error;
        //     }).catch(() => {
        //         this.loading = false;
        //     })
        // },
        saveOrder() {
            const dateObj = new Date(this.form.estimated_delivery_time);

            // 获取年、月、日等信息
            const year = dateObj.getFullYear(); // 年份
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份（注意月份从0开始计算）
            const day = dateObj.getDate().toString().padStart(2, '0'); // 天数

            this.form.estimated_delivery_time = `${year}-${month}-${day}`;
            this.axios.post('/pur/Purchase/update', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData
            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.orderVisible = false;
                this.getData();

            }).catch(() => {
                this.loading = false;
            })
        },
        // 列表导出
        handleExport() {
            this.query.token = localStorage.getItem("token");
            this.axios.post('/pur/Purchase/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },
        handleClick(tab, event) {
            if (this.activeName == 'wait') {
                // 价格变动审核
                this.query.status = 1
            } else if (this.activeName == 'audit') {
                // 待审核
                this.query.status = 2
            } else if (this.activeName == 'refuse') {
                // 价格变动驳回
                this.query.status = 3
            } else if (this.activeName == 'transit') {
                // 在途
                this.query.status = "4,5,6,7"
            } else if (this.activeName == 'complete') {
                // 完成
                this.query.status = 8
            } else if (this.activeName == 'all') {
                // 全部
                this.query.status = ''
            } else if (this.activeName == 'doing') {
                // 待处理
                this.query.status = '1,2,3,4,5,6,7'
            }
            // 重新获取数据
            this.getData();

        },
        // 获取币种
        getCurrtype() {
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Currtype/getCurrtype', {
                token: token
            }).then((res) => {
                this.currtype_option = res;
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
        this.permission = JSON.parse(this.permission);
        this.uploadFile_url = axios.defaults.baseURL + '/com/upload/uploadPicture';
        this.getData();
        this.getCurrtype();
        this.getPurUser();
        this.getProject();
        this.getDepartment();

    }
}
</script>
