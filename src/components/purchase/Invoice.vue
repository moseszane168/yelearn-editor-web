<template>
  <!-- 基础表格组件 -->
  <div>

    <div class="container">
      <!-- 操作栏 -->
      <div class="handle-box">
        {{ $t('default.Purchase_Order_Number') }}:<el-input v-model="query.pur_code" :placeholder="$t('default.Please_enter_a_keyword')"
                                                            class="handle-input w150"></el-input>
        <!-- 单据号 -->
        {{ $t('default.Incoming_Batch') }}:<el-input v-model="query.wi_code" :placeholder="$t('default.Please_enter_a_keyword')"
                                                     class="handle-input w150"></el-input>
        发票号:<el-input v-model="query.inv_code" placeholder="发票号" class="handle-input w150"></el-input>
        <!-- 部门 -->
        {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote
                                                  :placeholder="$t('default.Please_enter_a_keyword')">
        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
        <!-- 采购员 -->
        {{ $t('default.Purchaser') }}：
        <el-select v-model="query.pur_user" multiple filterable remote
                   :placeholder="$t('default.Please_select')" class="w120">
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
        {{ $t('default.Creation_time') }}：<el-date-picker v-model="query.create_time" type="daterange"
                                                          align="right" unlink-panels range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期"
                                                          size="mini">
      </el-date-picker>
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

      </div>

      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待制作发票" name="wait">
            <el-button type="primary" class="handle-del mr10"
                       v-if="permission.includes('Invoice:handleCreateInvoice')"
                       @click="handleCreateInvoice">创建采购发票</el-button>
            <!-- <el-button type="primary" class="handle-del mr10" @click="handleCreateInvoice"
                v-if="permission.includes('Invoice:handleCreateInvoice')">自制发票</el-button>  -->
            <!-- <el-button type="primary" class="handle-del mr10" @click="Cancel"
                v-if="permission.includes('Invoice:cancel')">创建自制发票</el-button>
            <el-button type="primary" class="handle-del mr10" @click="handleEnd"
                v-if="permission.includes('PickingApply:handleEnd')">{{ $t('default.Manual_Completion') }}</el-button>
         -->
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header" @selection-change="handleSelectionChange">

              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <!-- 序号 -->
              <el-table-column prop="no" :label="$t('default.No')" width="55"
                               align="center"></el-table-column>

              <el-table-column prop="wi_code" label="单据号" sortable>

                <template v-slot="scope">
                  <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)">
                    {{
                      scope.row.wi_code }}</el-button>
                </template>
              </el-table-column>



              <!-- 仓库 -->
              <el-table-column prop="ware_name" :label="$t('default.Warehouse')" sortable>

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

              <el-table-column prop="department_name" label="部门" sortable>

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
              <!-- 采购单号 -->
              <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')" sortable>

                <template v-slot="scope">
                  <el-button type="text" class="handle-del mr10"
                             @click="handlePurchase(scope.row.pur_code)"> {{
                      scope.row.pur_code }}</el-button>
                </template>
              </el-table-column>
              <!-- 采购员 -->
              <el-table-column prop="pur_name" :label="$t('default.Purchaser')" width="105"
                               sortable></el-table-column>
              <!-- 供应商 -->
              <el-table-column prop="sup_name" :label="$t('default.Supplier')" sortable>

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
          <el-tab-pane label="发票单" name="list">

            <el-button type="primary" class="handle-del mr10" @click="saveAuditPass"
                       v-if="permission.includes('Invoice:handleAudit')">{{
                $t('default.Signature') }}</el-button><!-- 签字 -->
            <el-button type="primary" class="handle-del mr10" @click="saveAuditFail"
                       v-if="permission.includes('Invoice:handleCancelAudit')">{{
                $t('default.Cancel_Signature') }}</el-button><!-- 取消签字 -->

            <el-button type="primary" class="handle-del mr10" @click="handleCrpustU8"
                       v-if="permission.includes('Purchase:handleCrpustU8')">{{ $t('default.Create_push_U8')
              }}</el-button><!-- 创建推送U8 -->
            <el-button type="primary" class="handle-del mr10" @click="Push"
                       v-if="permission.includes('Purchase:Push')">{{
                $t('default.Push') }}U8</el-button><!-- 推送U8 -->
            <!-- <el-button type="primary" class="handle-del mr10" @click="PuLLU8"
                v-if="permission.includes('Purchase:Push')">{{ $t('default.Pull')}}U8</el-button><!-- 拉取U8 -->


            <el-button type="primary" class="handle-del mr10" @click="handleSelectOne">{{
                $t('default.Manual_Completion')
              }}</el-button>
            <!-- 手动完成 -->

            <!-- 联查 -->
            <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleSelectOne')"
                       @click="handleSelectOne">{{ $t('default.Joint_Check') }}</el-button>

            <el-table :data="tableData" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header" @selection-change="handleSelectionChange">
              <!-- 操作 -->
              <el-table-column :label="$t('default.Action')" align="center">

                <template v-slot="scope">

                  <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                             v-if="scope.row.create_user == uid && scope.row.status == 1 && permission.includes('Invoice:handleEdit')">{{
                      $t('default.Edit') }}</el-button><!-- 编辑 -->
                  <el-button type="text" @click="handleCancel(scope.$index, scope.row)"
                             v-if="scope.row.create_user == uid && scope.row.status == 1 && permission.includes('Invoice:cancel')">{{
                      $t('default.Delete') }}</el-button><!-- 删除 -->

                </template>
              </el-table-column>
              <el-table-column type="selection" width="55" align="center">

              </el-table-column>

              <!-- 序号 -->
              <el-table-column prop="no" :label="$t('default.No')" width="55"
                               align="center"></el-table-column>

              <el-table-column prop="inv_code" label="发票号" sortable>

                <template v-slot="scope">


                  <el-button type="text" @click="handleInvoice(scope.row.inv_code)"> {{
                      scope.row.inv_code }}
                  </el-button>

                </template>
              </el-table-column>
              <el-table-column prop="department_name" label="部门" sortable>

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
              <!-- 采购员 -->
              <el-table-column prop="pur_name" :label="$t('default.Purchaser')"
                               width="70"></el-table-column>
              <!-- 供应商 -->
              <el-table-column prop="sup_name" :label="$t('default.Supplier')" sortable>

                <template v-slot="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.sup_name }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.sup_name
                        }}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="idiscounttaxtype_name" label="扣税类别"></el-table-column>
              <el-table-column prop="cbiztype_name" label="业务流程"></el-table-column>
              <!-- 税率 -->
              <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>
              <!-- 备注 -->
              <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>

              <!-- 签字状态 -->
              <el-table-column prop="status_name" :label="$t('default.Signature_Status')"
                               sortable></el-table-column>


              <!-- 创建时间 -->
              <el-table-column prop="create_time" :label="$t('default.Creation_time')">

                <template v-slot="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.create_user_name }}
                      {{ scope.row.create_time }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button type="text" style="color: rgb(39, 36, 36);">{{
                          scope.row.create_user_name
                        }}{{ scope.row.create_time }}</el-button>
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
        <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>



    <el-dialog title='创建采购发票' :visible.sync="InvoiceCreateVisible" width="90%">
      <el-form :inline="true" ref="form" :rules="order_rules" :model="form" size="mini" label-width="80px" >
        <el-form-item label="发票号" prop="inv_code">
          <el-input v-model="form.inv_code"></el-input>
        </el-form-item>
        <el-form-item label="发票日期" prop="dinvoicedate_show">
          <el-date-picker v-model="form.dinvoicedate_show" type="date"
                          :placeholder="$t('default.Select_Date')" style="width: 150px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="票到日期" prop="darrivedate_show">
          <el-date-picker v-model="form.darrivedate_show" type="date" :placeholder="$t('default.Select_Date')"
                          style="width: 150px;">
          </el-date-picker>
        </el-form-item>
        <!-- 扣税类别 -->
        <el-form-item :label="$t('default.Tax_Deduction_Category')" prop="tax_deduction">
          <el-select v-model="form.tax_deduction" :placeholder="$t('default.Please_select')" class="w150"
                     @change="handleTaxDeduction()" transfer="true" :popper-append-to-body="false">
            <el-option v-for="item in tax_deduction_options" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 整单税率 -->
        <el-form-item :label="$t('default.Tax_Rate')" prop="tax_rate">
          <el-input v-model="form.tax_rate" @blur="handleTaxRate()" class="w150"></el-input>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item :label="$t('default.Desc')">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>

      <template>

        <el-table :data="orderData" style="width: 100%" border class="table" ref="multipleTable"
                  header-cell-class-name="table-header" @selection-change="handleOrderSelectionChange" show-summary
                  :summary-method="getSummaries">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <!-- 序号 -->
          <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

          <!-- 采购单号 -->
          <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')" sortable>
            <template v-slot="scope">


              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.pur_code
                }}</el-button>

            </template>
          </el-table-column>
          <!-- 物料编码 -->
          <el-table-column prop="mat_code" :label="$t('default.Material_Code')" sortable>

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



          <el-table-column prop="ninvoicenum" label="开票数" sortable></el-table-column>
          <el-table-column prop="norgtaxprice" label="含税单价">
            <template v-slot="scope">
<!--              <el-input v-model.number="scope.row.norgtaxprice"></el-input>-->
              <el-input v-model="scope.row.norgtaxprice"
                        @blur="handleOrderChageRowTaxCost(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="noriginalcurprice" label="单价">
            <template v-slot="scope">
<!--              <el-input v-model.number="scope.row.noriginalcurprice"></el-input>-->
              <el-input v-model="scope.row.noriginalcurprice"
                        @blur="handleOrderChageRowCost(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <!-- 税率 -->
          <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')">
            <template v-slot="scope">
<!--              <el-input v-model.number="scope.row.tax_rate"></el-input>-->
              <el-input v-model="scope.row.tax_rate"
                        @blur="handleOrderChageRowTaxRate(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="false"  prop="idiscounttaxtype" label="扣税类别">
            <template v-slot="scope">
              <el-select @change="handleOrderChageRowTaxType(scope.$index, scope.row)"
                         v-model="scope.row.idiscounttaxtype"
                         :placeholder="$t('default.Please_select')"
                         transfer="true" :popper-append-to-body="false">
                <el-option v-for="item in idiscounttaxtype_options" :key="item.value" :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <!-- 金额 -->
          <el-table-column prop="total_price" label="金额" width="70"></el-table-column>
          <!-- 税额 -->
          <el-table-column prop="noriginaltaxmny" label="税额" width="70"></el-table-column>
          <!-- 税价总计 -->
          <el-table-column prop="ntaxpricemny" label="税价总计" width="70"></el-table-column>
          <el-table-column prop="wi_code" label="单据号" sortable>
            <template v-slot="scope">
              <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)">
                {{
                  scope.row.wi_code }}</el-button>
            </template>
          </el-table-column>
          <!-- 仓库 -->
          <el-table-column prop="ware_name" :label="$t('default.Warehouse')" sortable>

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

          <el-table-column prop="department_name" label="部门" sortable>

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
          <!-- 采购员 -->
          <el-table-column prop="pur_name" :label="$t('default.Purchaser')" width="70"></el-table-column>
          <!-- 供应商 -->
          <el-table-column prop="sup_name" :label="$t('default.Supplier')" sortable>

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


          <!-- <el-table-column prop="noriginalsummny" label="原币价税合计" width="110">

              <template v-slot="scope">
                  <el-input v-model.number="scope.row.noriginalsummny"></el-input>
              </template>
          </el-table-column> -->

          <!--  备注 -->
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
          </el-table-column> -->
          <!--  项目 -->
          <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">
            <template v-slot="scope">
              <el-select v-model="scope.row.pro_code" :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          -->
          <!-- <el-table-column prop="currtypecode" label="币种" width="150">

              <template v-slot="scope">
                  <el-select v-model="scope.row.currtypecode" filterable :placeholder="$t('default.Please_select')">
                      <el-option v-for="item in currtype_option" :key="item.currtypecode"
                          :label="item.currtypename" :value="item.currtypecode">
                      </el-option>
                  </el-select>
              </template>
          </el-table-column>  -->



        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
                <el-button @click="InvoiceCreateVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveInvoice">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
    </el-dialog>

    <el-dialog title='修改发票' :visible.sync="InvoiceUpdateVisible" width="90%">
      <el-form :inline="true" ref="form" :rules="rules" :model="form" size="mini" label-width="80px">

        <el-form-item label="供应商">
          {{ form.sup_name }}
        </el-form-item>

        <!-- 业务流程 -->
        <el-form-item :label="$t('default.Business_Process')" prop="cbiztype">
          {{ form.cbiztype_name }}

        </el-form-item>

        <!-- 部门 -->
        <el-form-item :label="$t('default.Department')">
          <el-select v-model="form.department_id" filterable remote reserve-keyword
                     :placeholder="$t('default.Please_enter_a_keyword')">
            <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('default.Tax_Deduction_Category')" prop="idiscounttaxtype">
          <el-select v-model="form.idiscounttaxtype" :placeholder="$t('default.Please_select')" class="w150"
                     @change="handleTaxDeductionEdit()" transfer="true" :popper-append-to-body="false">
            <el-option v-for="item in tax_deduction_options" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
<!--                         整单税率-->
        <el-form-item :label="$t('default.Tax_Rate')">
          <el-input v-model="form.tax_rate" @blur="handleTaxRate"></el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('default.Desc')">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>

      <template>
        <el-button type="primary" @click="handleAddOrderLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->

        <el-table :data="orderData" style="width: 100%" border class="table" ref="multipleTable"
                  header-cell-class-name="table-header"  show-summary
                  :summary-method="getSummariesEdit">
          <!-- 序号 -->
          <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

          <!-- 采购单号 -->
          <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')"></el-table-column>
          <!-- 物料编码 -->
          <el-table-column prop="mat_code" :label="$t('default.Material_Code')">

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



          <el-table-column prop="ninvoicenum" label="发票数量">

            <template v-slot="scope">
              <el-input v-model.number="scope.row.ninvoicenum" @blur="handleOrderChageRowNum(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="norgtaxprice" label="含税单价">
            <template v-slot="scope">
              <!--                            <el-input v-model.number="scope.row.norgtaxprice"></el-input>-->
              <el-input v-model="scope.row.norgtaxprice"
                        @blur="handleOrderChageRowTaxCost(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="noriginalcurprice" label="单价">
            <template v-slot="scope">
              <!--                            <el-input v-model.number="scope.row.noriginalcurprice"></el-input>-->
              <el-input v-model="scope.row.noriginalcurprice"
                        @blur="handleOrderChageRowCost(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <!-- 税率 -->
          <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')">
            <template v-slot="scope">
              <!--                            <el-input v-model.number="scope.row.tax_rate"></el-input>-->
              <el-input v-model="scope.row.tax_rate"
                        @blur="handleOrderChageRowTaxRate(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="false"  prop="idiscounttaxtype" label="扣税类别">
            <template v-slot="scope">
              <el-select @change="handleOrderChageRowTaxType(scope.$index, scope.row)" v-model="scope.row.idiscounttaxtype" :placeholder="$t('default.Please_select')">
                <el-option v-for="item in idiscounttaxtype_options" :key="item.value" :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <!--  税率 -->
          <!--                    <el-table-column prop="tax_rate" :label="$t('default.Tax_rate')">-->

          <!--                        <template v-slot="scope">-->

          <!--                            <el-input v-model.number="scope.row.tax_rate"></el-input>-->

          <!--                        </template>-->
          <!--                    </el-table-column>-->
<!--          <el-table-column prop="noriginalsummny" label="税价总计">-->

<!--            <template v-slot="scope">-->
<!--              <el-input v-model.number="scope.row.noriginalsummny"></el-input>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <!-- 金额 -->
          <el-table-column prop="total_price" label="金额" width="70"></el-table-column>
          <!-- 税额 -->
          <el-table-column prop="noriginaltaxmny" label="税额" width="70"></el-table-column>
          <!-- 税价总计 -->
          <el-table-column prop="ntaxpricemny" label="税价总计" width="70"></el-table-column>

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
          </el-table-column> -->
          <!-- <el-table-column prop="pro_code" label="项目" width="150">

              <template v-slot="scope">
                  <el-select v-model="scope.row.pro_code" :placeholder="$t('default.Please_select')">
                      <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </template>
          </el-table-column>
          <el-table-column prop="currtypecode" label="币种" width="150">

              <template v-slot="scope">
                  <el-select v-model="scope.row.currtypecode" filterable :placeholder="$t('default.Please_select')">
                      <el-option v-for="item in currtype_option" :key="item.currtypecode"
                          :label="item.currtypename" :value="item.currtypecode">
                      </el-option>
                  </el-select>
              </template>
          </el-table-column> -->



        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
                <el-button @click="InvoiceUpdateVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="updateInvoice">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
    </el-dialog>
    <el-dialog title='选择采购单号' :visible.sync="CheckInvoiceVisible" width="90%">
      <template>

        <el-table :data="checkInvoiceData" style="width: 100%" border class="table" ref="multipleTable"
                  header-cell-class-name="table-header" @selection-change="handleCheckInvoiceSelectionChange"
                  >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <!-- 序号 -->
          <el-table-column prop="id" v-if="false" label="ID" width="55"></el-table-column>
          <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

          <!-- 采购单号 -->
          <el-table-column prop="pur_code" :label="$t('default.Purchase_Order_Number')" sortable>
            <template v-slot="scope">


              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.pur_code
                }}</el-button>

            </template>
          </el-table-column>
          <!-- 物料编码 -->
          <el-table-column prop="mat_code" :label="$t('default.Material_Code')" sortable>

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
          <el-table-column prop="ninvoicenum" label="开票数" sortable></el-table-column>
          <el-table-column prop="norgtaxprice" label="含税单价">
<!--            <template v-slot="scope">-->
<!--              <el-input v-model="scope.row.norgtaxprice"-->
<!--                        @blur="handleOrderChageRowTaxCost(scope.$index, scope.row)"></el-input>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column prop="noriginalcurprice" label="单价">
<!--            <template v-slot="scope">-->
<!--              <el-input v-model="scope.row.noriginalcurprice"-->
<!--                        @blur="handleOrderChageRowCost(scope.$index, scope.row)"></el-input>-->
<!--            </template>-->
          </el-table-column>
          <!-- 税率 -->
          <el-table-column prop="tax_rate"  :label="$t('default.Tax_rate')">
<!--            <template v-slot="scope">-->
<!--              <el-input v-model="scope.row.tax_rate"-->
<!--                        @blur="handleOrderChageRowTaxRate(scope.$index, scope.row)"></el-input>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column prop="idiscounttaxtype" label="扣税类别">
            <template v-slot="scope">
              <el-select @change="handleOrderChageRowTaxType(scope.$index, scope.row)"
                         v-model="scope.row.idiscounttaxtype"
                         :placeholder="$t('default.Please_select')"
                         transfer="true" :popper-append-to-body="false">
                <el-option v-for="item in idiscounttaxtype_options" :key="item.value" :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <!-- 金额 -->
          <el-table-column prop="total_price" label="金额" width="70"></el-table-column>
          <!-- 税额 -->
          <el-table-column prop="noriginaltaxmny" label="税额" width="70"></el-table-column>
          <!-- 税价总计 -->
          <el-table-column prop="ntaxpricemny" label="税价总计" width="70"></el-table-column>
          <el-table-column prop="wi_code" label="单据号" sortable>
            <template v-slot="scope">
              <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)">
                {{
                  scope.row.wi_code }}</el-button>
            </template>
          </el-table-column>
          <!-- 仓库 -->
          <el-table-column prop="ware_name" :label="$t('default.Warehouse')" sortable>

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

          <el-table-column prop="department_name" label="部门" sortable>

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
          <!-- 采购员 -->
          <el-table-column prop="pur_name" :label="$t('default.Purchaser')" width="70"></el-table-column>
          <!-- 供应商 -->
          <el-table-column prop="sup_name" :label="$t('default.Supplier')" sortable>

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

          <!--  备注 -->
          <el-table-column prop="desc" :label="$t('default.Desc')">
            <template v-slot="scope">
              <el-input v-model="scope.row.desc"></el-input>
            </template>
          </el-table-column>

          <!-- 操作 -->
<!--          <el-table-column prop="operate" :label="$t('default.Action')">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button size="mini" type="danger" icon="el-icon-delete"-->
<!--                         @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}-->
<!--              </el-button>&lt;!&ndash; 删除 &ndash;&gt;-->
<!--            </template>-->
<!--          </el-table-column> &ndash;&gt;-->
          <!--  项目 -->
          <el-table-column prop="pro_code" :label="$t('default.Project')" width="150">
            <template v-slot="scope">
              <el-select v-model="scope.row.pro_code" :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                <el-option v-for="item in project_options" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
                <el-button @click="CheckInvoiceVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="SaveCheckInvoice">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
    </el-dialog>



    <el-dialog :visible.sync="InvoiceDetailVisible" append-to-body width="90%" title="发票">
      <invoice-detail ref="invoiceDetail"></invoice-detail>
    </el-dialog>

    <!-- 入库单 -->
    <el-dialog :visible.sync="WiVisible" append-to-body width="90%" :title="$t('default.Inventory')">
      <warehousing-detail ref="warehousingDetail"></warehousing-detail>
    </el-dialog>
    <!-- 采购单 -->
    <purchase-detail ref="purchaseDetail" :visible.sync="purchaseVisible" :data="current" @done="reload"
                     @refreshParent="refreshPage">
    </purchase-detail>

    <!-- 联查 -->
    <el-dialog :visible.sync="SelectOneVisible" append-to-body width="90%" :title="$t('default.Joint_Check')">

      <seledetail ref="seledetail"></seledetail>
    </el-dialog>

  </div>
</template>

<script>

import WarehousingDetail from '../warehouse/WarehousingDetail.vue';
import InvoiceDetail from '../purchase/InvoiceDetail.vue';
import PurchaseDetail from '../purchase/PurchaseDetail.vue';
import Seledetail from '../base/SelectOne.vue';
import Vue from 'vue';

export default {
  name: 'basetable',
  components: {
    InvoiceDetail,
    WarehousingDetail,
    PurchaseDetail,
    Seledetail,


  },
  data() {
    return {
      uid: localStorage.getItem("uid"),
      permission: sessionStorage.getItem('permission_button'),
      query: {
        token: '',
        address: '',
        username: '',
        create_time: [],
        sort: 'm.create_time',
        sort_type: 'desc',
        pageIndex: 1,
        pageSize: 20
      },
      tableData: [],
      multipleSelection: [],
      multipleOrderSelection: [],
      CheckInvoiceSelection: [],
      delList: [],
      sort_options: [],
      sort_type_options: [
        { value: 'asc', name: '升序' },
        { value: 'desc', name: '倒序' },
      ],
      current: {},
      InvoiceVisible: false,
      InvoiceCreateVisible: false,
      InvoiceUpdateVisible: false,
      CheckInvoiceVisible: false,
      purchaseVisible: false,
      SelectOneVisible: false,
      pageTotal: 0,
      form: {
        username: '',
        tax_deduction: '1',
      },
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
      rules: {

      },
      order_rules: {
        inv_code: [
          { required: true, message: '请输入发票号', trigger: 'blur' },
        ],
        dinvoicedate_show: [
          { required: true, message: '请输入发票日期', trigger: 'blur' },
        ],
        darrivedate_show: [
          { required: true, message: '请输入票到日期', trigger: 'blur' },
        ],

      },

      detailData: [],
      orderData: [],
      checkInvoiceData:[],
      loading: false,
      idx: -1,
      id: -1,
      cost_show: false,
      inv_code_edit:'',
      InvoiceDetailVisible: false,
      WiVisible: false,
      idiscounttaxtype_options: [],
      cbiztype_options: [],
      options: [],
      department_options: [],
      activeName: 'wait',
      pur_user_options: [],
      plan_options: [],
      infoData: [],
    };
  },
  methods: {
    // 获取easy-mock的模拟数据，将返回的数据进行存放处理
    getData() {
      this.query.token = localStorage.getItem("token");
      this.axios.get('/ware/Warehousing/InvoiceWait', {
        params: this.query
      }).then((res) => {


        this.tableData = res.list.data;
        this.cost_show = res.cost_show;
        this.sort_options = res.sort_options;
        // 将数据中的总条目数经过判断后赋给data中的pageTotal
        this.pageTotal = res.list.total || 0;

      }).catch(() => {
        this.loading = false;
      })

    },
    reload() {
      this.$refs.table.reload({ where: this.where });
    },
    handleCheckInvoiceSelectionChange(val) {
      this.CheckInvoiceSelection = val;
    },
    //编辑室增加
    handleAddOrderLine() {
      this.CheckInvoiceVisible = true;
      this.axios.post('/pur/Invoice/supplier_produce_invoice', {
        token: localStorage.getItem("token"),
        infoData:this.infoData,
        orderData:this.orderData,
        status: 1,
      }).then((res) => {
        // console.log('序号'+this.orderData.length)
        this.checkInvoiceData=res;

      }).catch(() => {

      })
    },
    getPlanning(query) {
      if (query !== '') {
        this.axios.post('/pur/Invoice/UpdateAdd', {
          token: localStorage.getItem("token"),
          mat_code: query,
          infoData: this.infoData,
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
    // 编辑时新增的
    SaveCheckInvoice() {
      // this.form ={};
      // 选项的选项数量
      const length = this.CheckInvoiceSelection.length;
      //
      if (length) {
        let warehousing_item_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.CheckInvoiceSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          warehousing_item_arr.push(this.CheckInvoiceSelection[i].id);
        }

        this.form = this.CheckInvoiceSelection[0];
        const end = new Date();
        this.form.dinvoicedate_show = this.form.darrivedate_show = end;
        this.axios.post('/pur/Invoice/get_check_warehousing', {
          token: localStorage.getItem("token"),
          selection: this.CheckInvoiceSelection,
          orderData:this.orderData
        }).then((res) => {
          this.orderData = res;
          console.log(this.orderData)
          this.CheckInvoiceVisible = false;
        }).catch(() => {
          this.loading = false;
        })
      }
      else {
        // 未选中选项！
        this.$message.error(this.$t('default.Unchecked_option'));
      }

    },
    //增加新的
    getPlanningOne(index, row,mat_code) {
      this.CheckInvoiceVisible = true;
      this.axios.post('/pur/Invoice/UpdateAdd', {
        token: localStorage.getItem("token"),
        mat_code: mat_code,
        infoData:this.infoData,
        status: 1,
      }).then((res) => {
        // console.log('序号'+this.orderData.length)
        var re_data = res[0];
        this.$set(this.orderData[index], 'no', this.orderData.length);
        this.$set(this.orderData[index], 'pur_code', re_data.pur_code);
        this.$set(this.orderData[index], 'inv_code', re_data.inv_code);
        this.$set(this.orderData[index], 'mat_name', re_data.name);
        this.$set(this.orderData[index], 'model', re_data.model);
        this.$set(this.orderData[index], 'specifications', re_data.specifications);
        this.$set(this.orderData[index], 'ninvoicenum', re_data.ninvoicenum);
        this.$set(this.orderData[index], 'norgtaxprice', re_data.norgtaxprice);
        this.$set(this.orderData[index], 'noriginalcurprice', re_data.noriginalcurprice);
        this.$set(this.orderData[index], 'noriginalsummny', re_data.noriginalsummny);
        this.$set(this.orderData[index], 'idiscounttaxtype', re_data.idiscounttaxtype);

        this.$set(this.orderData[index], 'total_price', re_data.total_price);
        this.$set(this.orderData[index], 'noriginaltaxmny', re_data.noriginaltaxmny);
        this.$set(this.orderData[index], 'ntaxpricemny', re_data.ntaxpricemny);

        this.$set(this.orderData[index], 'tax_rate', re_data.tax_rate);

      }).catch(() => {

      })
    },
    //删除行
    handleDeleteLine(index) {
      console.log(index);
      this.orderData.splice(index, 1)
    },
    handleOrderChageRowNum(index, row){
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form

      var row_d = JSON.parse(JSON.stringify(row));
      console.log(row_d)
      row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;

      row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
      // row_d.noriginaltaxmny = row_d.ntaxpricemny - row_d.total_price;
      row_d.noriginaltaxmny = Math.round((row_d.ntaxpricemny - row_d.total_price) * 100) / 100;;
      this.$set(this.orderData[index], 'total_price', row_d.total_price);//
      this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);//
      this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);//
    },
    handleOrderChageRowTaxType(index, row){
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form

      var row_d = JSON.parse(JSON.stringify(row));
      // console.log(row_d.idiscounttaxtype);
      // console.log(row);
      switch (row_d.idiscounttaxtype) {
        case 0://应税内含
          row_d.noriginalcurprice = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 1://应税外加

          row_d.noriginalcurprice = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 2://不计税
          row_d.noriginalcurprice = row_d.norgtaxprice;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;


      }
      row_d.noriginalcurprice = Math.floor(row_d.noriginalcurprice * 1000000) / 1000000;
      row_d.total_price = Math.round(row_d.total_price * 100) / 100;
      row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
      row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

      this.$set(this.orderData[index], 'noriginalcurprice', row_d.noriginalcurprice);
      this.$set(this.orderData[index], 'noriginalsummny', row_d.total_price);//税价合计
      this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
      this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);
      this.$set(this.orderData[index], 'total_price', row_d.total_price);
    },
    handleOrderChageRowTaxCost(index, row) {
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form

      var row_d = JSON.parse(JSON.stringify(row));
      switch (row_d.idiscounttaxtype) {
        case 0://应税内含
          row_d.noriginalcurprice = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 1://应税外加

          row_d.noriginalcurprice = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 2://不计税
          row_d.noriginalcurprice = row_d.norgtaxprice;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;


      }
      row_d.noriginalcurprice = Math.floor(row_d.noriginalcurprice * 1000000) / 1000000;
      row_d.total_price = Math.round(row_d.total_price * 100) / 100;
      row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
      row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

      this.$set(this.orderData[index], 'noriginalcurprice', row_d.noriginalcurprice);
      this.$set(this.orderData[index], 'noriginalsummny', row_d.total_price);//税价合计
      this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
      this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);
      this.$set(this.orderData[index], 'total_price', row_d.total_price);


    },
    handleOrderChageRowCost(index, row) {
      var row_d = JSON.parse(JSON.stringify(row));

      switch (row_d.idiscounttaxtype) {
        case 0:

          // 98
          row_d.norgtaxprice = row_d.noriginalcurprice / (100 - row_d.tax_rate) * 100;

          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;


          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 1:
          row_d.norgtaxprice = row_d.noriginalcurprice * (100 + row_d.tax_rate * 1) / 100;
          // row_d.cost = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 2:
          row_d.norgtaxprice = row_d.noriginalcurprice;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;


      }
      row_d.norgtaxprice = Math.floor(row_d.norgtaxprice * 1000000) / 1000000;
      row_d.total_price = Math.round(row_d.total_price * 100) / 100;
      row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
      row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

      this.$set(this.orderData[index], 'norgtaxprice', row_d.norgtaxprice);
      this.$set(this.orderData[index], 'noriginalsummny', row_d.total_price);
      this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
      this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);
      this.$set(this.orderData[index], 'total_price', row_d.total_price);


    },
    // 税率
    handleOrderChageRowTaxRate(index, row) {
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form

      var row_d = JSON.parse(JSON.stringify(row));

      switch (row_d.idiscounttaxtype) {
        case 0:
          row_d.noriginalcurprice = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 1:
          row_d.noriginalcurprice = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;
        case 2:
          row_d.noriginalcurprice = row_d.norgtaxprice;
          row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
          row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
          row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
          break;


      }
      row_d.noriginalcurprice = Math.floor(row_d.noriginalcurprice * 1000000) / 1000000;
      row_d.total_price = Math.round(row_d.total_price * 100) / 100;
      row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
      row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

      this.$set(this.orderData[index], 'noriginalcurprice', row_d.noriginalcurprice);
      this.$set(this.orderData[index], 'noriginalsummny', row_d.total_price);
      this.$set(this.orderData[index], 'noriginaltaxmny', row_d.noriginaltaxmny);
      this.$set(this.orderData[index], 'ntaxpricemny', row_d.ntaxpricemny);
      this.$set(this.orderData[index], 'total_price', row_d.total_price);



    },

    refreshPage() {
      // 这里实现页面的更新逻辑
      // console.log('父页面刷新');
      this.getData();
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

    // 创建推送U8
    handleCrpustU8() {

      // 选项的选项数量
      const length = this.multipleSelection.length;
      // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
      if (length) {
        let inv_code_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.multipleSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          inv_code_arr.push(this.multipleSelection[i].inv_code);
        }
        this.axios.post('/pur/Invoice/crpustU8', {
          token: localStorage.getItem("token"),
          inv_code_arr: inv_code_arr,
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
        let inv_code_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.multipleSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          inv_code_arr.push(this.multipleSelection[i].inv_code);
        }
        this.axios.post('/u8api/U8Invoice/Pust', {
          token: localStorage.getItem("token"),
          inv_code_arr: inv_code_arr,
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
        let inv_code_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.multipleSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          inv_code_arr.push(this.multipleSelection[i].inv_code);
        }
        this.axios.post('/u8api/U8Purchasein/PuLL', {
          token: localStorage.getItem("token"),
          inv_code_arr: inv_code_arr,
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
    handleSearchClear() {
      this.query = {
        token: localStorage.getItem("token"),
        pageIndex: 1,
        pageSize: 20,
        create_time: [],
        sort: 'm.create_time',
        sort_type: 'desc',
      }
    },
    handleOrderSelectionChange(val) {
      this.multipleOrderSelection = val;
    },
    // 创建采购发票
    handleCreateInvoice() {
      // this.form ={};
      // 选项的选项数量
      const length = this.multipleSelection.length;
      //
      if (length) {
        let pur_code_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.multipleSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          pur_code_arr.push(this.multipleSelection[i].pur_code);
        }

        this.form = this.multipleSelection[0];
        const end = new Date();
        this.form.dinvoicedate_show = this.form.darrivedate_show = end;
        this.options = this.form.sup_options;
        this.orderData = [];

        this.axios.post('/pur/Invoice/handleInvoice', {
          token: localStorage.getItem("token"),
          pur_code_arr: pur_code_arr,
          // selection: this.multipleSelection,

        }).then((res) => {
          this.InvoiceCreateVisible = true;
          this.orderData = res.orderData;

          // this.form.department_id = this.multipleSelection[0].department_id;
        }).catch(() => {
          this.loading = false;
        })
      }
      else {
        // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
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

      // console.log(localStorage.getItem("token"));
      this.query.token = localStorage.getItem("token");
      // return;
      this.axios.get('/pur/Invoice/index', {

        params: this.query
      }).then((res) => {


        this.tableData = res.list.data;
        this.cost_show = res.cost_show;


        // 将数据中的总条目数经过判断后赋给data中的pageTotal
        this.pageTotal = res.list.total || 0;

      }).catch(() => {
        this.loading = false;
      })

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
        let inv_code = '';
        for (let i = 0; i < length; i++) {
          // id_arr.push(this.multipleSelection[i].id);
          inv_code = this.multipleSelection[i].inv_code;
        }
        this.SelectOneVisible = true;
        let nextdata = {
          inv_code: inv_code
        };
        this.$nextTick(() => {
          this.$refs.seledetail.dataInitialization(nextdata);
        })

        console.log(inv_code);
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
    handleInvoice(inv_code) {
      this.InvoiceDetailVisible = true;

      this.$nextTick(() => {
        this.$refs.invoiceDetail.dataInitialization(inv_code);
      })
    },
    handlePurchase(pur_code) {

      this.purchaseVisible = true;

      this.$nextTick(() => {
        this.$refs.purchaseDetail.dataInitialization(pur_code);
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
    handleTaxDeduction() {

      this.orderData.forEach((row_d, i) => {
        console.log(this.form.tax_deduction)
        this.$set(this.orderData[i], 'idiscounttaxtype', this.form.tax_deduction);
        switch (this.form.tax_deduction) {
          case 0:
            console.log('应税内含');
            row_d.noriginalcurprice = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
          case 1:
            console.log('应税外加');
            row_d.noriginalcurprice = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
          case 2:
            row_d.noriginalcurprice = row_d.norgtaxprice;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
        }
        row_d.noriginalcurprice = Math.floor(row_d.noriginalcurprice * 1000000) / 1000000;
        row_d.total_price = Math.round(row_d.total_price * 100) / 100;
        row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
        row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

        this.$set(this.orderData[i], 'noriginalcurprice', row_d.noriginalcurprice);
        this.$set(this.orderData[i], 'noriginalsummny', row_d.total_price);
        this.$set(this.orderData[i], 'noriginaltaxmny', row_d.noriginaltaxmny);
        this.$set(this.orderData[i], 'ntaxpricemny', row_d.ntaxpricemny);

      });

    },
    handleTaxDeductionEdit() {

      this.orderData.forEach((row_d, i) => {
        console.log(this.form.idiscounttaxtype)
        this.$set(this.orderData[i], 'idiscounttaxtype', this.form.idiscounttaxtype);
        switch (this.form.idiscounttaxtype) {
          case 0:
            console.log('应税内含');
            row_d.noriginalcurprice = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
          case 1:
            console.log('应税外加');
            row_d.noriginalcurprice = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
          case 2:
            row_d.noriginalcurprice = row_d.norgtaxprice;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
        }
        row_d.noriginalcurprice = Math.floor(row_d.noriginalcurprice * 1000000) / 1000000;
        row_d.total_price = Math.round(row_d.total_price * 100) / 100;
        row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
        row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

        this.$set(this.orderData[i], 'noriginalcurprice', row_d.noriginalcurprice);
        this.$set(this.orderData[i], 'noriginalsummny', row_d.total_price);
        this.$set(this.orderData[i], 'noriginaltaxmny', row_d.noriginaltaxmny);
        this.$set(this.orderData[i], 'ntaxpricemny', row_d.ntaxpricemny);

      });

    },
    handleTaxRate() {

      this.orderData.forEach((e, i) => {


        this.$set(this.orderData[i], 'tax_rate', this.form.tax_rate);



        var row_d = e;



        // var row_d = JSON.parse(JSON.stringify(row));

        switch (row_d.idiscounttaxtype) {
          case 0:
            row_d.noriginalcurprice = row_d.norgtaxprice * (100 - row_d.tax_rate) / 100;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
          case 1:
            row_d.noriginalcurprice = row_d.norgtaxprice / (100 + row_d.tax_rate * 1) * 100;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;
          case 2:
            row_d.noriginalcurprice = row_d.norgtaxprice;
            row_d.total_price = row_d.noriginalcurprice * row_d.ninvoicenum;
            row_d.noriginaltaxmny = (row_d.norgtaxprice - row_d.noriginalcurprice) * row_d.ninvoicenum;
            row_d.ntaxpricemny = row_d.norgtaxprice * row_d.ninvoicenum;
            break;


        }
        row_d.noriginalcurprice = Math.floor(row_d.noriginalcurprice * 1000000) / 1000000;
        row_d.total_price = Math.round(row_d.total_price * 100) / 100;
        row_d.noriginaltaxmny = Math.round(row_d.noriginaltaxmny * 100) / 100;
        row_d.ntaxpricemny = Math.round(row_d.ntaxpricemny * 100) / 100;

        this.$set(this.orderData[i], 'noriginalcurprice', row_d.noriginalcurprice);
        this.$set(this.orderData[i], 'noriginalsummny', row_d.total_price);
        this.$set(this.orderData[i], 'noriginaltaxmny', row_d.noriginaltaxmny);
        this.$set(this.orderData[i], 'ntaxpricemny', row_d.ntaxpricemny);

      });

    },

    //合计数据
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
            // case 8:
            // case 9:

            case 12:
            case 13:
            case 14:
              let total = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = Math.round(total * 100) / 100;


              break;


            default: '';
          }

        } else {

        }
      });

      return sums;
    },
    getSummariesEdit(param) {
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
            // case 7:
            // case 8:
            // case 9:
            case 11:
            case 12:
            case 13:

              let total = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = Math.round(total * 100) / 100;


              break;


            default: '';
          }

        } else {

        }
      });

      return sums;
    },

    // 修改发票
    saveInvoice() {

      const length = this.multipleOrderSelection.length;
      console.log(length);
      if (length) {
        if (this.form.dinvoicedate_show) {
          this.form.dinvoicedate = Vue.prototype.FormatTime(this.form.dinvoicedate_show);

        }

        if (this.form.darrivedate_show) {
          this.form.darrivedate = Vue.prototype.FormatTime(this.form.darrivedate_show);
        }

        this.axios.post('/pur/Invoice/save', {
          token: localStorage.getItem("token"),
          params: this.form,
          orderData: this.multipleOrderSelection


        }).then((res) => {
          this.InvoiceCreateVisible = false;
          if (this.activeName == 'wait') {
            this.getData();
          } else if (this.activeName == 'list') {
            this.getListData();
          }

        }).catch(() => {
          this.loading = false;
        })
      }else {
        // 未选中选项！
        this.$message.error(this.$t('default.Unchecked_option'));
      }

    },
    // 修改发票
    updateInvoice() {

      this.axios.post('/pur/Invoice/update', {
        token: localStorage.getItem("token"),
        params: this.form,
        orderData: this.orderData,
        inv_code_edit: this.inv_code_edit,

      }).then((res) => {
        this.InvoiceUpdateVisible = false;
        if (this.activeName == 'wait') {
          this.getData();
        } else if (this.activeName == 'list') {
          this.getListData();
        }
        // this.orderData = res.orderData;
        // this.form.department_id = this.multipleSelection[0].department_id;
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
        let inv_code_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.multipleSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          inv_code_arr.push(this.multipleSelection[i].inv_code);
        }
        this.axios.post('/pur/Invoice/auditPass', {
          token: localStorage.getItem("token"),
          inv_code_arr: inv_code_arr,
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
        let inv_code_arr = [];
        // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
        this.delList = this.delList.concat(this.multipleSelection);
        // 对选中的选项进行循环，获取其中的name值
        for (let i = 0; i < length; i++) {
          inv_code_arr.push(this.multipleSelection[i].inv_code);
        }
        this.axios.post('/pur/Invoice/auditFail', {
          token: localStorage.getItem("token"),
          inv_code_arr: inv_code_arr,
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
    // 获取供应商
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
    // 获取币种
    getCbiztype() {
      var token = localStorage.getItem("token");
      this.axios.post('/pur/Purchase/cbiztypeArr', {
        token: token
      }).then((res) => {
        this.cbiztype_options = res;
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
    getTaxDeductionOptions() {
      this.axios.post('/pur/Purchase/TaxDeductionOptions', {
        token: localStorage.getItem("token"),
        // params: data_form
      }).then((res) => {
        console.log(res);
        // 弹出成功提示框

        this.idiscounttaxtype_options = res;

      }).catch(() => {
        this.loading = false;
      })
    },
    ShowCost() {
      this.axios.post('/index/user/ShowCost', {
        token: localStorage.getItem("token"),
        // params: data_form
      }).then((res) => {
        console.log(res);
        // 弹出成功提示框

        this.show_cost = res;

      }).catch(() => {
        this.loading = false;
      })
    },


    // 搜索,触发搜索按钮
    handleSearch() {
      // 为this.query新增属性，并更新视图
      this.$set(this.query, 'pageIndex', 1);
      // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
      // this.getData();
      if (this.activeName == 'wait') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }
    },
    // 多选,对表格中的复选框列表做监听，当选择项发生变化则触发handleSelectionChange方法，val为选中数据的集合，通过this.multipleSelection.
    // prop字段取得每一个选项的值，prop字段就是表格子项的prop值。this.multipleSelection.length为选择了多少项
    handleSelectionChange(val) {
      // val表示当前选中的行数据组成的数组
      //选中数据的集合赋给this.mutipleSelection
      this.multipleSelection = val;
    },
    // 编辑
    handleEdit(index, row) {



      // 将当前选项索引赋给this.idx
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      this.form = JSON.parse(JSON.stringify(row));


      this.axios.post('/pur/Invoice/InvoiceDetail', {
        token: localStorage.getItem("token"),
        inv_code: this.form.inv_code,
        // Selection: this.multipleSelection
      }).then((res) => {
        this.inv_code_edit=this.form.inv_code;
        this.orderData = res.list;
        this.infoData = res.info;

      }).catch(() => {
        this.loading = false;
      })
      // this.orderData = this.form.children;
      // 设置弹出编辑框标记为true
      this.InvoiceUpdateVisible = true;
    },
    // 删除
    handleCancel_back(index, row) {
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      this.form = JSON.parse(JSON.stringify(row));

      this.axios.post('/pur/Invoice/Delete', {
        token: localStorage.getItem("token"),
        inv_code: this.form.inv_code,

        Selection: this.multipleSelection

      }).then((res) => {
        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
        this.editVisible = false;
        this.getListData();
        this.multipleSelection = [];

      }).catch(() => {
        this.loading = false;
      })


    },
    handleCancel(index, row) {
      this.idx = index;
      // 将当前选项这一行的数据赋给this.form
      this.form = JSON.parse(JSON.stringify(row));
      this.$confirm('确认要删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/pur/Invoice/Delete', {
          token: localStorage.getItem("token"),
          inv_code: this.form.inv_code,
          Selection: this.multipleSelection
        }).then((res) => {
          // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
          this.editVisible = false;
          this.getListData();
          this.multipleSelection = [];

        }).catch(() => {
          this.loading = false;
        })
      }).catch(() => {
        this.loading = false;
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },

    // 页面改变,分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      if (this.activeName == 'wait') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }
    },
    handleSizeChange(val) {
      this.$set(this.query, 'pageSize', val);
      if (this.activeName == 'wait') {
        this.getData();
      } else if (this.activeName == 'list') {
        this.getListData();
      }
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
    handleClick(tab, event) {
      if (this.activeName == 'wait') {
        // 重新获取数据
        this.getData();
      } else if (this.activeName == 'list') {
        // this.query.status = ''
        this.query.type = 2
        this.getListData();
      }

    },
    // 保存编辑
    saveEdit() {
      if (typeof (this.form.id) == 'undefined') {

        this.axios.post('/pur/Project/save', {

          token: localStorage.getItem("token"),
          params: this.form
        }).then((res) => {
          // console.log(res);
          // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
          this.editVisible = false;
          this.getData();
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.axios.post('/pur/Project/update', {
          token: localStorage.getItem("token"),
          params: this.form
        }).then((res) => {

          // 弹出成功提示框
          // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
          this.editVisible = false;
          this.getData();
          // 为this.tableData新增属性
          this.$set(this.tableData, this.idx, this.form);
        }).catch(() => {
          this.loading = false;
        })
      }
    },
  },
  // 在钩子函数中调用getData方法
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

    this.query.create_time = [start, end];

    this.getData();
    this.permission = JSON.parse(this.permission);
    this.ShowCost();
    this.getTaxDeductionOptions();
    this.getDepartment();
    this.getProject();
    this.getCurrtype();
    this.getCbiztype();
    this.getPurUser();
  }
}
</script>
