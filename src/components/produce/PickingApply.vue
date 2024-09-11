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
                <!-- 领料单号 -->
                {{ $t('default.Requisition_Order') }}:
                <el-input v-model="query.pi_code" :placeholder="$t('default.Please_enter_a_keyword')"  class="handle-input mr10 w150"></el-input>
                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                    reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')" class="w200">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 领料人 -->
                {{ $t('default.Receiver') }}:<el-select v-model="query.picking_user" filterable remote reserve-keyword
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
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <!-- 申请 -->
                <el-button type="primary" class="handle-del mr10" @click="handleadd"
                    v-if="permission.includes('PickingApply:handleadd')">{{ $t('default.Request') }}</el-button>
                <!-- 取消 -->
                <el-button type="primary" class="handle-del mr10" @click="handleDelete"
                    v-if="permission.includes('PickingApply:handleDelete')">{{ $t('default.Cancel') }}</el-button>

                <!-- 手动完成 -->
                <el-button type="primary" class="handle-del mr10" @click="handleEnd"
                    v-if="permission.includes('PickingApply:handleEnd')">{{ $t('default.Manual_Completion')
                    }}</el-button>
                <!-- 联查 -->
                <el-button type="primary" class="handle-del mr10" @click="handleSelectOne">{{
                    $t('default.Joint_Check') }}</el-button>


            </div>

            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 待出库 -->
                    <el-tab-pane :label="$t('default.To_be_out_of_stock')" name="wait"></el-tab-pane>
                    <!-- 已完成 -->
                    <el-tab-pane :label="$t('default.Completed')" name="pass"></el-tab-pane>
                    <!-- 全部 -->
                    <el-tab-pane :label="$t('default.All')" name="all"></el-tab-pane>
                </el-tabs>
            </div>


            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="55" align="center">
                    <template v-slot="scope">
                        <div v-if="scope.row.is_main == 1 && scope.row.status == 1">
                            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                                v-if="permission.includes('PickingApply:handleEdit')">{{ $t('default.Edit')
                                }}</el-button><!-- 编辑 -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>


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



                <!-- 领料人 -->
                <el-table-column prop="picking_name" :label="$t('default.Receiver')" align="center"></el-table-column>

                <!-- 状态 -->
                <el-table-column prop="status_name" :label="$t('default.Status')"></el-table-column>
                <!-- 审核 -->
                <el-table-column prop="audit_user" :label="$t('default.Audit')">

                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.audit_user_name }}{{ scope.row.audit_desc }}{{ scope.row.audit_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.audit_user_name }}{{
                    scope.row.audit_desc }}{{ scope.row.audit_time }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
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
        <!-- 领料申请 -->
        <el-dialog :title="$t('default.Material_Request')" :visible.sync="AddVisible" width="90%"
            :before-close="handleClose">
            <el-form ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 领料人 -->
                <el-form-item :label="$t('default.Receiver')">
                    <el-select v-model="form.picking_user" filterable remote reserve-keyword placeholder="空值默认为本人"
                        :remote-method="remoteMethodUser" :loading="loading">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleAddLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
            <!-- 库存查询 -->
            <el-button type="primary" @click="getInventoryByMaterial">{{ $t('default.Inventory_Enquiry') }}</el-button>
            <!-- 下载导入模板 -->
            <el-button type="primary" @click="downloadFile(download_file)">{{ $t('default.Download_Import_Template') }}</el-button>
            <!-- 库存不足转物料申请 -->
            <el-button type="primary" @click="VerifyToBuy">{{ $t('default.Insufficient_Stock_to_Material_Request') }}</el-button>
            <el-upload :on-success="handleSuccess" style="float: left;margin-right: 5px;" :action="PickingApply_url">
                <el-button size="small" type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
            </el-upload>

            <el-table :data="applyDate" border style="width: 100%" show-summary :summary-method="getSummaries">
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="150">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword
                            :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod"
                            :loading="loading" @change="getInventoryByMaterial()" transfer="true" :popper-append-to-body="false">
                            <el-option v-for="item in options" :key="item.mat_code" :label="item.mat_code"
                                :value="item.mat_code">
                                <span style="float: left">{{ item.mat_code }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{item.label }}
                                </span>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')">
                    <template v-slot="scope">
                        <el-button type="text" @click="handleMaterialDetail(scope.row.mat_code)"> {{ scope.row.mat_name }}
                        </el-button>
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
                <!-- 替代料 -->
                <el-table-column prop="mat_name" :label="$t('default.Substitute')">
                    <template v-slot="scope">
                        <el-popover placement="right" width="400" trigger="hover">
                            <el-table :data="scope.row.replace_ware_arr">
                                <el-table-column width="150" property="name"
                                    :label="$t('default.Substitute')"></el-table-column>
                                <el-table-column width="100" property="ware_name"
                                    :label="$t('title.wareManagement')"></el-table-column>
                                <el-table-column width="300" property="real_num"
                                    :label="$t('default.Inventory_Number')"></el-table-column>
                            </el-table>
                            <el-button slot="reference" type="text">{{ scope.row.replace_ware_str }}</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 丝印 -->
                <el-table-column prop="silk" :label="$t('default.Silkscreen')"></el-table-column>
                <!-- 需求量 -->
                <el-table-column prop="production_demand" :label="$t('default.Requirement')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.production_demand"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="pn" label="PN">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.pn"></el-input>
                    </template>
                </el-table-column>
                <!-- 任务令 -->
                <el-table-column prop="task_order" :label="$t('default.Task_Order')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.task_order"></el-input>
                    </template>
                </el-table-column>
                <!-- 项目 -->
                <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">
                    <template v-slot="scope">
                        <el-select filterable v-model="scope.row.pro_code" :placeholder="$t('default.Please_select')"
                                   transfer="true" :popper-append-to-body="false">
                            <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 使用机型 -->
                <el-table-column prop="mat_model" :label="$t('default.Use_Model')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.mat_model"></el-input>
                    </template>
                </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.desc"></el-input>
                    </template>
                </el-table-column>

                <!-- 可用 -->
                <el-table-column prop="available_num" :label="$t('default.Available')"></el-table-column>
                <!-- 本部门可用 -->
                <el-table-column prop="real_num" :label="$t('default.Available_in_this_department')"></el-table-column>
                <!-- 在途 -->
                <el-table-column prop="transit_num" :label="$t('default.In_Transit')"></el-table-column>

                <!-- 操作 -->
                <el-table-column prop="operate" :label="$t('default.Action')">
                    <template slot-scope="scope">
                        <!-- 删除 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                        </el-button>
                    </template>
                </el-table-column>
                <!-- 采购数 -->
                <el-table-column prop="apply_num" :label="$t('default.Number_of_Purchases')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.apply_num"></el-input>
                    </template>
                </el-table-column>
                <!-- 异常 -->
                <el-table-column prop="error" :label="$t('default.Abnormal')"></el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="AddVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog :title="$t('default.Edit')" :visible.sync="editVisible" width="80%" :before-close="handleClose">
            <el-form ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 领料人 -->
                <el-form-item :label="$t('default.Receiver')">
                    <el-select v-model="form.picking_user" filterable remote reserve-keyword
                        :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser"
                        :loading="loading">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>

            <template>
                <el-table :data="applyDate" style="width: 100%">
                    <!-- 物料编码 -->
                    <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="130">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword
                                :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethod"
                                :loading="loading" transfer="true" :popper-append-to-body="false" >
                                <el-option v-for="item in options" :key="item.mat_code" :label="item.label"
                                    :value="item.mat_code">
                                    <span style="float: left">{{ item.label }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mat_code }}</span>
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">
                                      {{ scope.row.mat_name }}
                                    </el-button>
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">
                                      {{ scope.row.model }}
                                    </el-button>
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
                                    <el-button type="text" style="color: rgb(39, 36, 36);">
                                      {{ scope.row.specifications }}
                                    </el-button>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <!-- 替代料 -->
                    <el-table-column prop="mat_name" :label="$t('default.Substitute')">
                        <template v-slot="scope">
                            <el-popover placement="right" width="400" trigger="hover">
                                <el-table :data="scope.row.replace_ware_arr">
                                    <el-table-column width="150" property="name"
                                        :label="$t('default.Substitute')"></el-table-column>
                                    <el-table-column width="100" property="ware_name"
                                        :label="$t('title.wareManagement')"></el-table-column>
                                    <el-table-column width="300" property="real_num"
                                        :label="$t('default.Inventory_Number')"></el-table-column>
                                </el-table>
                                <el-button slot="reference" type="text">{{ scope.row.replace_ware_str }}</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <!-- 丝印 -->
                    <el-table-column prop="silk" :label="$t('default.Silkscreen')"></el-table-column>
                    <!-- 需求量 -->
                    <el-table-column prop="production_demand" :label="$t('default.Requirement')">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.production_demand"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pn" label="PN">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pn"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 任务令 -->
                    <el-table-column prop="task_order" :label="$t('default.Task_Order')">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.task_order"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 项目 -->
                    <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">
                        <template v-slot="scope">
                            <el-select filterable v-model="scope.row.pro_code"
                                :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                                <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <!-- 使用机型 -->
                    <el-table-column prop="mat_model" :label="$t('default.Use_Model')">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.mat_model"></el-input>
                        </template>
                    </el-table-column>

                    <!-- 备注 -->
                    <el-table-column prop="desc" :label="$t('default.Desc')">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.desc"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 可用 -->
                    <el-table-column prop="available_num" :label="$t('default.Available')"></el-table-column>
                    <!-- 在途 -->
                    <el-table-column prop="transit_num" :label="$t('default.In_Transit')"></el-table-column>

                    <!-- 操作 -->
                    <el-table-column prop="operate" :label="$t('default.Action')">
                        <template slot-scope="scope">
                            <!-- 删除 -->
                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <span v-if="error" style="color: red;font-size: 16px;">{{ error }}</span>
            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- 审核 -->
        <el-dialog title='审核' :visible.sync="auditVisible" width="70%">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.audit_desc"></el-input>

                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="savePass">审核通过</el-button>
                <el-button @click="saveFail">审核不通过</el-button>
            </span>
        </el-dialog>

        <!-- 联查 -->
        <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">
            <seledetail ref="seledetail"></seledetail>
        </el-dialog>
        <!-- 领料单 -->
        <el-dialog :visible.sync="PickingVisible" append-to-body width="90%" :title="$t('default.Requisition_Order')">
            <picking-detail ref="pickingDetail"></picking-detail>
        </el-dialog>
        <!-- 物料 -->
        <el-dialog :visible.sync="MaterialDetailVisible" append-to-body width="70%" :title="$t('default.Material')">
            <material-detail ref="materialDetail"></material-detail>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import PickingDetail from '../produce/PickingApplyDetail.vue';
import Seledetail from '../base/SelectOne.vue';
import MaterialDetail from '../material/MaterialDetail.vue';
import Vue from 'vue';

export default {
    name: 'basetable',
    components: {
        PickingDetail,
        Seledetail,
        MaterialDetail,

    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                create_time: [],
                token: '',
                status: 1,
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            applyDate: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,

            pageTotal: 0,
            form: {},
            rules: {
                mat_code: [
                    { required: true, message: '请输入物料编码', trigger: 'blur' },
                ],
                production_demand: [
                    { required: true, message: '请输入申请量', trigger: 'blur' },
                    { type: 'number', message: '需求量必须为数字值' }
                ],

            },
            options: [],
            value: [],
            list: [],
            loading: false,
            department_options: [],
            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            project_options: [],
            auditVisible: false,
            AddVisible: false,
            SelectOneVisible: false,
            MaterialDetailVisible: false,

            activeName: 'wait',
            fileList: [],
            download_file: '',
            user_options: [],
            mat_options: [],
            PickingApply_url: '',
            detailData: [],
            PickingVisible: false,
            error: '',



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

            this.axios.get('/pro/PickingApply/index', {

                params: this.query
            }).then((res) => {


                this.tableData = res.list.data;
                this.download_file = res.download_file;



                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;

            }).catch(() => {
                this.loading = false;
            })

        },
        handleShow(index, row) {
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));

            this.detailData = this.form.item_arr;



            // 设置弹出编辑框标记为true
            this.detailVisible = true;
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
                        case 6:
                        case 16:
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
        // 联查
        handleSelectOne() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length == 1) {
                let pi_code = '';
                for (let i = 0; i < length; i++) {
                    pi_code = this.multipleSelection[i].pi_code;
                }
                this.SelectOneVisible = true;
                let nextdata = {
                    pi_code: pi_code
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
        handleMaterialDetail(mat_code) {
            this.MaterialDetailVisible = true;

            this.$nextTick(() => {
                this.$refs.materialDetail.dataInitialization(mat_code);
            })
        },
        // 领料单
        handlePicking(pi_code) {
            this.PickingVisible = true;

            this.$nextTick(() => {
                this.$refs.pickingDetail.dataInitialization(pi_code);
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
        // 获取项目
        getProject() {
            // 获取采购员,部门，
            this.axios.post('/pur/Project/getProject', {
                token: localStorage.getItem("token"),
            }).then((res) => {
                this.project_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        // 新增
        handleadd() {

            this.applyDate = [];

            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};


            this.AddVisible = true;
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
                this.applyDate = file.data;
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
        getInventoryByMaterial() {
            this.axios.post('/pro/PickingApply/Verify', {
                token: localStorage.getItem("token"),
                applyDate: this.applyDate
            }).then((res) => {
                this.applyDate = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        VerifyToBuy() {
            this.axios.post('/pro/PickingApply/VerifyToBuy', {
                token: localStorage.getItem("token"),
                applyDate: this.applyDate
            }).then((res) => {
                this.applyDate = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        //增加行
        handleAddLine() {
            if (this.applyDate == undefined) {
                this.applyDate = new Array();
            }
            let obj = {};

            this.applyDate.push(obj);
        },
        //删除行
        handleDeleteLine(index) {
            console.log(index);
            this.applyDate.splice(index, 1)
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
        // 编辑
        handleEdit(index, row) {
            this.applyDate = row.item_arr;


            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // 设置弹出编辑框标记为true

            this.axios.post('/index/user/getUser', {
                token: localStorage.getItem("token"),
                name: this.form.picking_user
            }).then((res) => {
                this.user_options = res;
            }).catch(() => {
                this.loading = false;
            })
            this.editVisible = true;
        },

        // 删除
        // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
        handleDelete() {
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
                this.axios.post('/pro/PickingApply/delete', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    // params: this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success(res.msg);
                    this.editVisible = false;
                    this.getData();
                    // 为this.tableData新增属性
                    // this.$set(this.tableData, this.idx, this.form);
                    this.multipleSelection = [];
                }).catch(() => {
                    this.loading = false;
                })
                // this.$message.success(`删除了${str}`);

                // console.log(id_arr);
                // 将选中的选项置为空，即不再选中任何一项

            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
        },
        // 搜索,触发搜索按钮
        handleSearch() {
            // 为this.query新增属性，并更新视图
            this.$set(this.query, 'pageIndex', 1);
            // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
            this.getData();
        },
        handleSelectionChange(val) {
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
        // 保存编辑
        saveEdit() {
            var data_form = this.form;
            if (typeof (data_form.id) == 'undefined') {
                this.axios.post('/pro/PickingApply/save', {
                    token: localStorage.getItem("token"),
                    params: this.form,
                    applyDate: this.applyDate
                }).then((res) => {

                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    this.AddVisible = false;
                    this.getData();
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.axios.post('/pro/PickingApply/update', {
                    token: localStorage.getItem("token"),
                    params: this.form,
                    applyDate: this.applyDate
                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                    this.editVisible = false;
                    this.getData();
                    this.$set(this.tableData, this.idx, this.form);
                }).catch(() => {
                    this.loading = false;
                })
            }
            this.pictureList = [];
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
        handleAudit() {

            this.auditVisible = true;

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
                this.axios.post('/pro/PickingApply/auditPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,


                }).then((res) => {
                    console.log(res);
                    this.$message.success('审核成功');
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
                this.axios.post('/pro/PickingApply/auditFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,


                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
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
        handleClick(tab, event) {

            if (this.activeName == 'wait') {
                this.query.status = '1,2'
            } else if (this.activeName == 'pass') {
                this.query.status = 4
            } else if (this.activeName == 'all') {
                this.query.status = ''
            }

            // 重新获取数据
            this.getData();

        }
    },
    // 在钩子函数中调用getData方法
    created() {
        this.PickingApply_url = axios.defaults.baseURL + '/com/ExcelIn/PickingApply';


        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        this.query.create_time = [start, end];
        this.permission = JSON.parse(this.permission);
        this.getData();
        this.getDepartment();
        this.getProject();

    }
}
</script>
