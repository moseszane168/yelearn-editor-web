<template>
  <!-- 基础表格组件 -->
  <div>

    <div class="container">
      <!-- 操作栏 -->
      <div class="handle-box">
        <!-- 单据号 -->
        {{ $t('default.Incoming_Batch') }}:
        <el-input v-model="query.wi_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>


        <!-- 采购单号 -->
        {{ $t('default.Purchase_Order_Number') }}:<el-input v-model="query.pur_code" :placeholder="$t('default.Please_enter_a_keyword')"
          class="handle-input mr10 w150"></el-input>

        <!-- 物料编码 -->
        {{ $t('default.Material_Code') }}:<el-input v-model="query.mat_code" :placeholder="$t('default.Please_enter_a_keyword')"
          class="handle-input mr10 w150"></el-input>


        <!-- 部门 -->
        {{ $t('default.Department') }}：
        <el-select v-model="query.department_id" multiple filterable remote reserve-keyword class="w150"
          :placeholder="$t('default.Please_enter_a_keyword')" @change="changeIndex()">
          <el-option v-for="item in department_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 仓库 -->
        {{ $t('default.Warehouse') }}：<el-select multiple filterable v-model="query.ware_id"
          :placeholder="$t('default.Please_select')" class="w150">
          <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name" :value="item.ware_id">
          </el-option>
        </el-select>
        <!-- 采购员 -->
        {{ $t('default.Purchaser') }}：
        <el-select v-model="query.pur_user" multiple filterable remote
          :placeholder="$t('default.Please_enter_a_keyword')" class="w150">
          <el-option v-for="item in pur_user_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 供应商 -->
        {{ $t('default.Supplier') }}：
        <el-select v-model="query.sup_code" filterable remote reserve-keyword
          :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteSupply" :loading="loading">
          <el-option v-for="item in sup_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 项目 -->
        {{ $t('default.Project') }}:
        <el-select v-model="query.pro_code" :placeholder="$t('default.Please_select')" multiple class="w150">
          <el-option v-for="item in project_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 签字状态 -->
        {{ $t('default.Signature_Status') }}:
        <el-select v-model="query.status" :placeholder="$t('default.Please_select')" clearable class="w150">
          <el-option v-for="item in status_options" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
        <!-- 推送状态 -->
        {{ $t('default.Push_Status') }}:
        <el-select filterable v-model="query.push" :placeholder="$t('default.Please_select')" clearable class="w150">
          <el-option v-for="item in push_options" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
        <!-- 创建人 -->
        {{ $t('default.Creator') }}：
        <el-select v-model="query.create_user" filterable multiple remote reserve-keyword
          :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser" :loading="loading"
          class="w150">
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


      </div>

      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">

          <!-- 待入库 -->
          <el-tab-pane :label="$t('default.To_be_stocked')" name="picked">
            <!-- 物料入库 -->
            <el-button type="primary" class="handle-del mr10" @click="handleMatIn"
              v-if="permission.includes('PurchaseIn:handleMatIn')">{{ $t('default.Material_Inbound')
              }}</el-button>
            <!-- 固资入库 -->
            <el-button type="primary" class="handle-del mr10" @click="handleAssetIn"
              v-if="permission.includes('PurchaseIn:handleAssetIn')">{{ $t('default.Fixed_Assets_Inbound')
              }}</el-button>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
              @selection-change="handleSelectionChange">

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
          scope.row.specifications
        }}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- 实购数 -->
              <el-table-column prop="real_num" :label="$t('default.Purchase_Number')" width="90"
                sortable></el-table-column>

              <!-- 可用 -->
              <el-table-column prop="available_num" :label="$t('default.Available')" width="75"
                sortable></el-table-column>
              <!-- 在途 -->
              <el-table-column prop="transit_num" :label="$t('default.In_Transit')" width="75"
                sortable></el-table-column>
              <!-- 安全 -->
              <el-table-column prop="safe_num" :label="$t('default.Security')" width="75" sortable></el-table-column>
              <!-- 已入 -->
              <el-table-column prop="in_num" :label="$t('default.Input')" width="75" sortable></el-table-column>
              <!-- 未入 -->
              <el-table-column prop="wait_in_num" :label="$t('default.Not_entered')" width="75"
                sortable></el-table-column>
              <!-- 退货 -->
              <el-table-column prop="return_num" :label="$t('default.Returns')" width="75" sortable></el-table-column>


              <!-- 采购员 -->
              <el-table-column prop="pur_name" :label="$t('default.Purchaser')"></el-table-column>
              <!-- 供应商 -->
              <el-table-column prop="sup_name" :label="$t('default.Supplier')">

                <template v-slot="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.sup_name }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.sup_name
        }}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- 项目 -->
              <el-table-column prop="project_name" :label="$t('default.Project')">

                <template v-slot="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.project_name }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.project_name
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
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.department_name
        }}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- 类型 -->
              <el-table-column prop="type_name" :label="$t('default.Type')"></el-table-column>
              <!-- 备注 -->
              <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
              <!-- 创建时间 -->
              <el-table-column prop="create_time" :label="$t('default.Creation_time')">

                <template v-slot="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.create_user_name }}
                      {{ scope.row.create_time }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.create_user_name }}{{
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
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.update_user_name }}
                        {{ scope.row.update_time }}</el-button>

                    </div>
                  </el-popover>

                </template>
              </el-table-column>

            </el-table>

          </el-tab-pane>

          <!-- 采购入库单 -->
          <el-tab-pane :label="$t('default.Purchase_Receipt')" name="list">

            <el-button type="primary" class="handle-del mr10" @click="saveAuditPass"
              v-if="permission.includes('PurchaseIn:handleAudit')">{{
          $t('default.Signature') }}</el-button><!-- 签字 -->
            <el-button type="primary" class="handle-del mr10" @click="saveAuditFail"
              v-if="permission.includes('PurchaseIn:handleCancelAudit')">{{
          $t('default.Cancel_Signature') }}</el-button><!-- 取消签字 -->

            <el-button type="primary" class="handle-del mr10" @click="handleExportCheck"
                       v-if="permission.includes('PurchaseIn:handleAssetIn')">{{ $t('default.Export')
              }}</el-button><!-- 导出 -->

            <el-button type="primary" class="handle-del mr10" @click="handleCrpustU8"
              v-if="permission.includes('Purchase:handleCrpustU8')">{{ $t('default.Create_push_U8')
              }}</el-button><!-- 创建推送U8 -->
            <el-button type="primary" class="handle-del mr10" @click="Push"
              v-if="permission.includes('Purchase:Push')">{{
          $t('default.Push') }}U8</el-button><!-- 推送U8 -->
            <el-button type="primary" class="handle-del mr10" @click="PuLLU8"
              v-if="permission.includes('Purchase:Push')">{{
          $t('default.Pull') }}U8</el-button><!-- 拉取U8 -->

            <el-button type="primary" class="handle-del mr10" @click="handleSelectOne">{{
          $t('default.Manual_Completion')
        }}</el-button>
            <!-- 手动完成 -->

            <!-- 联查 -->
            <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleSelectOne')"
                       @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
              @selection-change="handleSelectionChange">
              <!-- 操作 -->
              <el-table-column :label="$t('default.Action')" align="center">

                <template v-slot="scope">
                  <div v-if="isWareSuper || scope.row.create_user == uid">
                    <el-button type="text" @click="handleEdit(scope.row.wi_code,scope.row.department_id)"
                      v-if="scope.row.status == 2 && permission.includes('PurchaseIn:updateIn')">{{
          $t('default.Edit') }}</el-button><!-- 编辑 -->
                    <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                      @click="handleDelete(scope.$index, scope.row)"
                      v-if="scope.row.status == 2 && permission.includes('PurchaseIn:DeleteIn')">{{
          $t('default.Delete') }}</el-button><!-- 删除 -->
                    <!-- 退货 -->
<!--                    <el-button type="text" @click="handleReturn(scope.$index, scope.row)"-->
<!--                               v-if="permission.includes('Purchase:handleReturn')">{{ $t('default.Returns') }}</el-button>-->

                  </div>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <!-- 序号 -->
              <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>

              <el-table-column prop="wi_code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->

                <template v-slot="scope">
                  <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)">
                    {{
          scope.row.wi_code }}</el-button>
                </template>
              </el-table-column>



              <!-- 仓库 -->
              <el-table-column prop="ware_name" :label="$t('default.Warehouse')">

                <template v-slot="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.ware_name }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.ware_name
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
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
          scope.row.department_name
        }}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

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

              <!-- U8状态 -->
              <el-table-column prop="fbillflag_name" width="105" :label="$t('default.U8Status')" sortable>

                <template v-slot="scope">

                  <i v-if="scope.row.vbillcode" class="el-icon-top"></i>


                  <el-popover v-if="scope.row.push == 3" trigger="hover" placement="top">
                    <p>{{ scope.row.return_date }}</p>
                    <div slot="reference" class="name-wrapper">
                      <i class="el-icon-warning" style="color: red;"></i>
                    </div>
                  </el-popover>

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
          scope.row.create_user_name }}{{
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
          :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]" :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
        </el-pagination>
      </div>
    </div>


    <el-dialog :title=dialogName :visible.sync="orderVisible" width="90%" :before-close="handleClose">
      <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
        <!-- 部门 -->
        <el-form-item :label="$t('default.Department')">
          <el-select v-model="form.department_id" @change="DepartmentChange()" transfer="true" :popper-append-to-body="false">
            <el-option v-for="item in department_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 仓库 -->
        <el-form-item :label="$t('default.Warehouse')" prop="ware_id">
          <el-select filterable v-model="form.ware_id" :placeholder="$t('default.Please_select')" @change="wareChange()"
            clearable transfer="true" :popper-append-to-body="false">
            <el-option v-for="item in ware_options" :key="item.ware_id" :label="item.name" :value="item.ware_id">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-show="bonded_show">
          <!-- 保税入库类型 -->
          <el-form-item :label="$t('default.Bonded_In_Type')">
            <el-select v-model="form.stotage_type" :placeholder="$t('default.Please_select')" clearable>
              <el-option v-for="item in BondedWarehousingType_options" :key="item.value" :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 备注 -->
        <el-form-item :label="$t('default.Desc')">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>

      <template>
       
        <el-tooltip class="item" effect="dark"
          :content="$t('default.Batch_synchronization_of_customs_declaration_number_and_endorsement_list')"
          placement="top-start">
          <el-button type="primary" @click="syncHg">{{ $t('default.Batch_synchronisation')
            }}</el-button><!-- 批同 -->
        </el-tooltip>
        <br />
        <br />
        <el-table :data="orderData" style="width: 100%" @selection-change="handleOrderSelectionChange" border
          class="table" ref="multipleTable" header-cell-class-name="table-header" show-summary
                    :summary-method="getSummaries"  max-height="550px">

          <el-table-column type="selection" width="55" align="center"></el-table-column>
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
          <!-- 采购单号 -->
          <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')"></el-table-column>
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

          <!-- 可用 -->
          <el-table-column prop="available_num" :label="$t('default.Available')" width="55"></el-table-column>
          <!-- 在途 -->
          <el-table-column prop="transit_num" :label="$t('default.In_Transit')" width="55"></el-table-column>
          <!-- 安全 -->
          <el-table-column prop="safe_num" :label="$t('default.Security')" width="55"></el-table-column>
          <!-- 已入 -->
          <el-table-column prop="in_num" :label="$t('default.Input')" width="55"></el-table-column>
          <!-- 未入 -->
          <el-table-column prop="wait_in_num" :label="$t('default.Not_entered')" width="55"></el-table-column>
          <!-- 退货 -->
          <el-table-column prop="return_num" :label="$t('default.Returns')" width="55"></el-table-column>

          <!-- 入库数 -->
          <el-table-column prop="real_in_num" :label="$t('default.In_Stock')">

            <template v-slot="scope">
              <el-input v-model.number="scope.row.real_in_num"></el-input>
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
                <el-option v-for="item in location_options" :key="item.id" :label="item.p_name" :value="item.id">
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
        <el-button @click="orderVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
        <el-button type="primary" @click="saveOrder">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
      </span>
    </el-dialog>
    <!-- 采购单 -->
 
    <purchase-detail ref="purchaseDetail" :visible.sync="purchaseVisible" :data="current" @done="reload"
      @refreshParent="refreshPage">
    </purchase-detail>
    <!-- 入库单 -->
    <el-dialog :visible.sync="WiVisible" append-to-body width="90%" :title="$t('default.Warehouse_receipt')">
      <warehousing-detail ref="warehousingDetail"></warehousing-detail>
    </el-dialog>
    <!-- 联查 -->
    <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">

      <seledetail ref="seledetail"></seledetail>
    </el-dialog>

    <!-- 导出 -->
    <el-dialog  :visible.sync="exportFields" width="70%" :before-close="handleClose">

      <template>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedFields"  @change="handleCheckedExportFieldsChange">
          <el-checkbox v-for="(valueFields,indexFields) in exportFieldsArr" :key="valueFields.id" :label="valueFields">{{valueFields.name}}</el-checkbox>
         
        </el-checkbox-group>
      </template>



      <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="exportFields = false">{{ $t('default.Cancel') }}</el-button>
        <!-- 确 定 -->
                <el-button type="primary" @click="handleExport()">{{ $t('default.Confirm') }}</el-button>
            </span>
    </el-dialog>

    <warehousing-update ref="warehousingUpdate" :data="current" :visible.sync="WarehousingUpdateVisible"
      @done="reload"></warehousing-update>

    <el-dialog title='退货' :visible.sync="returnVisible" width="75%" :before-close="handleClose">
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
          <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')"></el-table-column>
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
          <el-table-column prop="pro_name" label="退款金额"></el-table-column>
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



  </div>
</template>

<script>

import PurchaseDetail from '../purchase/PurchaseDetail.vue';

import WarehousingDetail from '../warehouse/WarehousingDetail.vue';
import Seledetail from '../base/SelectOne.vue';

import WarehousingUpdate from '../warehouse/WarehousingUpdate.vue';
import Vue from 'vue';

export default {
  // name: 'basetable',
  components: {
    WarehousingUpdate,
    PurchaseDetail,
    WarehousingDetail,
    Seledetail,

    // ...mapState(['WarehousingUpdateVisible']),
  },

  data() {

    return {
      wareSelectedOption: null,
      uid: localStorage.getItem("uid"),
      department_id: localStorage.getItem("department_id"),
      permission: sessionStorage.getItem('permission_button'),
      query: {
        status: '',
        wait_in_num: '1',
        token: '',
        create_time: [],
        pageIndex: 1,
        pageSize: 20
      },
      current: {},
      query_ware_options: [],
      tableData: [],
      orderData: [],
      multipleSelection: [],
      delList: [],
      project_options: [],
      pur_user_options: [],
      editVisible: false,
      orderVisible: false,
      purchaseVisible: false,
      SelectOneVisible: false,
      exportFields: false,
      WiVisible: false,
      WiUpdateVisible: false,
      WarehousingUpdateVisible: false,
      dialogName: '物料入库',
      pageTotal: 0,
      form: {},
      current: {},
      rules: {
        real_num: [
          { required: true, message: '请输入实购数', trigger: 'blur' },
          // { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
          { type: 'number', message: '实购数必须为数字值' }
        ],
        ware_id: [
          { required: true, message: '请选择仓库', trigger: 'blur' },
        ]
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
      value: [],
      exportFieldsArr: [],
      list: [],
      loading: false,
      idx: -1,
      id: -1,
      states: [],
      activeName: 'picked',
      ware_options: [],
      department_options: [],
      location_options: [],
      BondedWarehousingType_options: [],
      bonded_show: false,
      multipleOrderSelection: [],
      user_options: [],
      sup_options: [],
      status_options: [],
      isWareSuper: false,
      push_options: [],
      checkedFields: [],
      checkAll: true,
      isIndeterminate: true,
      returnVisible: false,
      cost_show: true,
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
      this.axios.get('/ware/PurchaseIn/index', {
        params: this.query
      }).then((res) => {
        this.tableData = res.list.data;
        // 将数据中的总条目数经过判断后赋给data中的pageTotal
        this.pageTotal = res.list.total || 0;
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
    getPustArr() {
      this.axios.post('/u8api/U8Order/getPustArr', {
        token: localStorage.getItem("token"),
      }).then((res) => {
        this.push_options = res;
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
    //退货
    handleReturn(index, row) {
      this.idx = index;
      this.form = JSON.parse(JSON.stringify(row));
      this.orderData = this.form.children;
      console.log()
      this.returnVisible = true;
      this.axios.post('/pur/PurchaseReturn/getReturnData', {
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
      // this.axios.post('/pur/PurchaseReturn/getReturnData', {
      //   token: localStorage.getItem("token"),
      //   params: this.form,
      //   orderData: this.orderData,
      //
      // }).then((res) => {
      //   this.form = res.info;
      //   this.orderData = res.orderData;
      // }).catch(() => {
      //   this.loading = false;
      // })
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
        this.axios.post('/ware/PurchaseIn/crpustU8', {
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
        this.axios.post('/u8api/U8Purchasein/Pust', {
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
        this.axios.post('/u8api/U8Purchasein/PuLL', {
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
    // 获取供应商
    remoteSupply(query) {
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
    reload() {
      this.$refs.table.reload({ where: this.where });
    },
    handleWi(wi_code) {
      this.WiVisible = true;

      this.$nextTick(() => {
        this.$refs.warehousingDetail.dataInitialization(wi_code);
      })
    },
    //设置菜单权限
    handlePurDetail(pur_code) {

      this.purchaseVisible = true;
      // this.dataInitialization(pur_code);
      this.$nextTick(() => {
        this.$refs.purchaseDetail.dataInitialization(pur_code);
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
            this.getListData();
          }).catch(() => {
            this.loading = false;
          })

        })
        .catch(() => { })
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


    handleSearchClear() {
      this.query = {
        token: localStorage.getItem("token"),
        name: '',
        pageIndex: 1,
        pageSize: 20,
        create_time: [],
      }
    },
    handleOrderSelectionChange(val) {
      this.multipleOrderSelection = val;
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

    // 物料入库
    handleMatIn() {
      this.form = {};
      this.dialogName = '物料入库';
      // 选项的选项数量
      const length = this.multipleSelection.length;
      // console.log(this.department_id);
      if (this.form.department_id) {
      } else {
        this.form.department_id = this.department_id;
      }
      console.log(this.form);

      if (length) {
        this.orderData = [];
        this.orderVisible = true;
        this.axios.post('/ware/PurchaseIn/handleIn', {
          token: localStorage.getItem("token"),
          form: this.form,
          selection: this.multipleSelection,
          type: 1,
        }).then((res) => {
          this.orderData = res.orderData;

          this.location_options = res.location_arr;
          // this.form=res.form;
        }).catch(() => {
          this.loading = false;
        })


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
                        case 7:
                        case 12:
                        // case 13:
                        case 14:
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
    // 固资入库
    handleAssetIn() {
      this.form = {};
      this.dialogName = '固资入库';
      // 选项的选项数量
      const length = this.multipleSelection.length;
      if (this.form.department_id) {
      } else {
        this.form.department_id = this.department_id;
      }

      if (length) {
        this.orderData = [];
        this.orderVisible = true;
        this.axios.post('/ware/PurchaseIn/handleIn', {
          token: localStorage.getItem("token"),
          form: this.form,
          selection: this.multipleSelection,
          type: 2,
        }).then((res) => {
          this.orderData = res.orderData;
          // this.form=res.form;
          // this.form.department_id = this.multipleSelection[0].department_id;
          this.location_options = res.location_arr;
        }).catch(() => {
          this.loading = false;
        })

      }
      else {
        // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
      }
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
    //删除行
    handleDeleteLine(index) {
      this.orderData.splice(index, 1)
    },
    // 获取库位
    wareChange() {
      //this.wareSelectedOption = this.options.find(option => option.value === value);
      console.log(this.form);
      this.axios.post('/ware/PurchaseIn/handleIn', {
        token: localStorage.getItem("token"),
        // selection: this.multipleSelection,
        params: this.form,
        orderData: this.orderData,
      }).then((res) => {
        this.orderData = res.orderData;
        this.location_options = res.location_options;
        this.bonded_show = res.bonded_show;

      }).catch(() => {
        this.loading = false;
      })

      this.getDepartmentByWare(this.form)

    },
    changeIndex() {
      this.axios.post('/ware/warehouse/ware_list_base_department', {
        token: localStorage.getItem("token"),
        params: this.query
      }).then((res) => {
        this.query_ware_options = res;
      }).catch(() => {
        this.loading = false;
      })
      this.$forceUpdate();
    },
    // 获取仓库
    getWare() {
      this.axios.post('/ware/warehouse/warelist', {
        token: localStorage.getItem("token"),
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
        this.$set(this.tableData, this.idx, this.form);
      }).catch(() => {
        this.loading = false;
      })
    },

    // 根据仓库获取部门
    getDepartmentByWare(params) {
      var token = localStorage.getItem("token");
      console.log(params)
      this.axios.post('/index/Department/get_department_by_ware', {
        token: token,
        params: params
      }).then((res) => {
        this.department_options = res;
      }).catch(() => {
        this.loading = false;
      })
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
    getDefaultLocation() {
      this.axios.post('/ware/wareLocation/getDefaultLocation', {
        token: localStorage.getItem("token"),
        orderData: this.orderData,
        ware_id: this.form.ware_id,
      }).then((res) => {
        console.log(res);
        this.orderData = res;

        this.$set(this.tableData, this.idx, this.form);
      }).catch(() => {
        this.loading = false;
      })
    },
    downloadFile(fileUrl) {
      window.open(fileUrl);
    },
    refreshPage() {
      // 这里实现页面的更新逻辑
      if (this.activeName == 'picked') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }
    },
    handleSearch() {

      this.$set(this.query, 'pageIndex', 1);
      if (this.activeName == 'picked') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },



    // 页面改变,分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      if (this.activeName == 'picked') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }
    },
    handleSizeChange(val) {
      this.$set(this.query, 'pageSize', val);
      if (this.activeName == 'picked') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }
    },
    getListData() {
      const create_time = this.query.create_time;
      const create_time_1 = create_time[0];
      const create_time_2 = create_time[1];

      if (create_time_1) {
        this.query.create_time1 = Vue.prototype.FormatTime(create_time_1);
      }
      if (create_time_2) {
        this.query.create_time2 = Vue.prototype.FormatTime(create_time_2);
      }

      this.query.type = '1,2';
      this.query.token = localStorage.getItem("token");
      this.axios.get('/ware/Warehousing/index', {

        params: this.query
      }).then((res) => {
        this.tableData = res.list.data;
        this.pageTotal = res.list.total || 0;
      }).catch(() => {
        this.loading = false;
      })
    },



    saveOrder() {
      if (this.dialogName == "固资入库") {
        this.axios.post('/ware/PurchaseIn/Assetsave', {
          token: localStorage.getItem("token"),
          params: this.form,
          orderData: this.orderData

        }).then((res) => {

          this.$message.success('入库成功');
          this.orderVisible = false;
          this.getData();

        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.axios.post('/ware/PurchaseIn/save', {
          token: localStorage.getItem("token"),
          params: this.form,
          orderData: this.orderData

        }).then((res) => {

          this.$message.success('入库成功');
          this.orderVisible = false;
          this.getData();

        }).catch(() => {
          this.loading = false;
        })
      }
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
          // console.log(res);
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
          this.$message.success(res);
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
      // console.log(this.checkedFields.length);
      if (this.checkedFields.length == 0){
        this.$message.error('未选中选项！');
      }

      this.query.checkedFields = this.checkedFields;

      this.query.token = localStorage.getItem("token");
      this.axios.post('/ware/Warehousing/handleExport1', {
        token: localStorage.getItem("token"),
        params: this.query
      }).then((res) => {
        window.open(res);
      }).catch(() => {
        this.loading = false;
      })
    },
    // 获取导出字段
    getExportFields() {
      this.axios.post('/ware/Warehousing/exportFields', {
        token: localStorage.getItem("token"),
      }).then((res) => {
        this.exportFieldsArr = res;
        this.checkedFields = this.exportFieldsArr;
      }).catch(() => {
        this.loading = false;
      })
    },
    handleExportCheck() {
      this.exportFields = true;
    },
    handleCheckAllChange(val) {
     
      this.checkedFields = val ? this.exportFieldsArr : [];
      this.isIndeterminate = false;
    },
    handleCheckedExportFieldsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkedFields.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedFields.length;
    },


    handleClick(tab, event) {
      if (this.activeName == 'picked') {

        this.query.wait_in_num = '1';
        // 重新获取数据
        this.getData();

      } else if (this.activeName == 'list') {
        // this.query.status = ''
        this.query.wait_in_num = '';
        this.getListData();


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


  },
  // 在钩子函数中调用getData方法
  created() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();

    this.query.create_time = [start, end];


    this.permission = JSON.parse(this.permission);
    this.getisWareSuper();
    this.getData();
    this.getDepartment();
    this.getWare();
    this.DepartmentChange();

    this.BondedWarehousingType();
    this.getProject();
    this.getPurUser();
    this.getStatusArr();
    this.department_id = parseInt(this.department_id);
    this.getPustArr();
    this.getExportFields();

  }
}
</script>
