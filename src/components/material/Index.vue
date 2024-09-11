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


                <!-- 物料名称 -->
                {{ $t('default.Material_Name') }}:<el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')"
                    class="handle-input w150"></el-input>
                <!-- 分类 -->
                {{ $t('default.Category') }}:
                <el-select v-model="query.c_id" multiple filterable class="w150" remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 型号 -->
                {{ $t('default.Model') }}：
                <el-input v-model="query.model" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w80"></el-input>
                <!-- 规格 -->
                {{ $t('default.Specification') }}：
                <el-input v-model="query.specifications" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w80"></el-input>
                <!-- 丝印 -->
                {{ $t('default.Silkscreen') }}：
                <el-input v-model="query.silk" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w80"></el-input>
                <!-- 采购单价 -->
                {{ $t('default.Purchase_Unit_Price') }}：
                <el-input v-model="query.cost1" placeholder="价格区间" class="handle-input mr10 w80"></el-input>
                <el-input v-model="query.cost2" placeholder="价格区间" class="handle-input mr10 w80"></el-input>
                <!-- 工治具 -->
                {{ $t('default.Jig') }}：
                <el-select v-model="query.tools" class="w80">
                    <el-option v-for="item in tools_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 创建人 -->
                {{ $t('default.Creator') }}：
                <el-select v-model="query.create_user" class="w120" filterable multiple remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser"
                    :loading="loading">
                    <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>

                <!-- 仓库 -->
                {{ $t('default.Warehouse') }}：<el-select multiple filterable v-model="query.ware_id"
                    :placeholder="$t('default.Please_select')">
                    <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name"
                        :value="item.ware_id">
                    </el-option>
                </el-select>

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
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search')
                    }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleadd"
                    v-if="permission.includes('material:handleadd')">{{ $t('default.Add') }}</el-button><!-- 新增 -->
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleBatchAdd"
                    v-if="permission.includes('material:handleBatchAdd')">{{ $t('default.Batch_Import')
                    }}</el-button><!-- 批量导入 -->
                <!-- 拉取最新物料信息 -->
                <el-button type="primary" class="handle-del mr10" @click="handleGetNew">{{
                    $t('default.Pull_latest_material_information') }}</el-button>
                <el-button type="primary" class="handle-del mr10" @click="handleExport"
                    v-if="permission.includes('material:handleExport')">{{ $t('default.Export')
                    }}</el-button><!-- 导出 -->
                <!-- 安全库存(单价)批量导入 -->
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleLSBatchAdd"
                    v-if="permission.includes('material:handleLSBatchAdd')">安全库存(单价)批量导入</el-button>
                <!-- 导入物料库位 -->
                <el-button type="primary" class="handle-del mr10" @click="handleBatchMaterialLocation"
                    v-if="permission.includes('MaterialLocation:handleBatchAdd')">{{
                    $t('default.Import_Material_Location') }}</el-button>

                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="PictureUpdate"
                    v-if="permission.includes('material:PictureUpdate')">{{ $t('default.Image_Upload')
                    }}</el-button><!-- 图片上传 -->
                <!-- 停用 -->
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleStop"
                    v-if="permission.includes('material:handleStop')">{{ $t('default.Deactivate') }}</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">


                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" align="center">
                    <template v-slot="scope">
                        <!-- 主sku操作 -->
                        <div v-if="isManager || scope.row.create_user == uid">
                            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                                v-if="permission.includes('material:handleEdit')">{{ $t('default.Edit')
                                }}</el-button><!-- 编辑 -->
<!--                            <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"-->
<!--                                @click="handleDelete(scope.$index, scope.row)"-->
<!--                                v-if="permission.includes('material:handleDelete')">{{ $t('default.Delete')-->
<!--                                }}</el-button>&lt;!&ndash; 删除 &ndash;&gt;-->
                        </div>


                    </template>

                </el-table-column>
                <el-table-column type="selection" width="50" align="center"></el-table-column>

                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="50"
                    align="center"></el-table-column>

                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center" width="105"
                    sortable>

                    <template v-slot="scope">

                        <el-button type="text" @click="handleMaterialDetail(scope.row.mat_code)"> {{ scope.row.mat_code
                            }}
                        </el-button>

                    </template>
                </el-table-column>




                <!-- 物料名称 -->

                <el-table-column prop="name" :label="$t('default.Name')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.name }}</el-button>
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
                <!--  规格 -->
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
                <!-- 丝印 -->
                <el-table-column prop="silk" :label="$t('default.Silkscreen')"></el-table-column>

                <!-- 分类 -->
                <el-table-column prop="c_name" :label="$t('default.Category')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.c_name }}</p>
                            <div slot="reference" class="name-wrapper">

                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.c_name
                                    }}</el-button>

                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 工治具 -->
                <el-table-column prop="tools_name" width="90" :label="$t('default.Jig')" sortable></el-table-column>

                <!-- 安全库存 -->
                <el-table-column prop="safe_num" :label="$t('default.Safety_Stock')" sortable width="105">
                    <template v-slot="scope">
                        {{ scope.row.safe_num }}
                        <el-button type="text" icon="el-icon-edit" @click="handleSafeNum(scope.$index, scope.row)"
                            v-if="permission.includes('material:handleSafeNum')"></el-button>
                    </template>

                </el-table-column>


                <!-- 单价 -->
                <el-table-column prop="cost" :label="$t('default.Unit_Price')" v-if=cost_show sortable width="80">
                    <template v-slot="scope">
                        {{ scope.row.cost }}
                        <el-button type="text" icon="el-icon-edit" @click="handleCost(scope.$index, scope.row)"
                            v-if="permission.includes('material:handleCost')"></el-button>
                    </template>
                </el-table-column>

                <!-- 库位 -->
                <el-table-column :label="$t('default.Location')" prop="location_name" width="80" sortable>
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.location_name_str }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.location_name
                                    }}</el-button>

                                <el-button type="text" icon="el-icon-edit"
                                    @click="handleLocation(scope.$index, scope.row)"
                                    v-if="permission.includes('MaterialLocation:handleBatchAdd')"></el-button>

                            </div>
                        </el-popover>

                    </template>

                </el-table-column>
                <el-table-column prop="status" :label="$t('default.Status')" sortable>
                    <template v-slot="scope">
                        <div v-if="scope.row.status == 1">
                            <el-tag type="success">{{ scope.row.status_name }}</el-tag>
                        </div>
                        <div v-if="scope.row.status == 2">
                            <el-tag type="danger">{{ scope.row.status_name }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <!-- 仓库 -->
                <el-table-column prop="ware_name" :label="$t('default.Warehouse')" width="70">
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
                <!-- 库存 -->
                <el-table-column prop="ware_real_num" :label="$t('default.Inventory')" width="80" sortable>
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.ware_real_num }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ware_real_num
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 日志 -->
                <el-table-column prop="mat_code" align="center" :label="$t('default.Logbook')" width="50">

                    <template v-slot="scope">

                        <el-button type="text" icon="el-icon-document"
                            @click="showLog(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>


                <!-- 图片 -->
                <el-table-column prop="picture" :label="$t('default.Picture')" align="center">
                    <template v-slot="scope">


                        <div v-if=scope.row.picture>
                            <el-image class="table-td-thumb" :src="scope.row.picture_url"
                                :preview-src-list="scope.row.picture_arr"></el-image>
                        </div>
                        <div v-else>
                            <!-- 无图 -->
                            {{ $t('default.No_Picture') }}
                        </div>
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


        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%" :before-close="handleClose">

            <!-- 物料编码 -->
            <!-- 空值则由系统自动生成 -->
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <el-form-item :label="$t('default.Material_Code')" prop="mat_code">
                    <el-input v-model="form.mat_code"
                        :placeholder="$t('default.Empty_values_are_automatically_generated_by_the_system')"></el-input>
                </el-form-item>
                <!-- 物料名称 -->
                <el-form-item :label="$t('default.Material_Name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <!-- 分类 -->
                <el-form-item :label="$t('default.Category')" prop="c_list">

                    <el-cascader :options="options" v-model="form.c_list"></el-cascader>

                </el-form-item>
                <!-- 型号 -->
                <el-form-item :label="$t('default.Model')" prop="model">
                    <el-input v-model="form.model"></el-input>
                </el-form-item>
                <!-- 丝印 -->
                <el-form-item :label="$t('default.Silkscreen')" prop="silk">
                    <el-input v-model="form.silk"></el-input>
                </el-form-item>
                <!-- 耗料比 -->
                <el-form-item :label="$t('default.Consumption_Ratio')" prop="consumption_ratio">
                    <el-input v-model="form.consumption_ratio"></el-input>
                </el-form-item>
                <!-- 保质期 -->
                <el-form-item :label="$t('default.Shelf_life')" prop="quality_day">
                    <el-input v-model.number="form.quality_day" class="w80"></el-input> 天
                </el-form-item>
                <!-- 单位 -->
                <el-form-item :label="$t('default.Unit')" prop="unit">

                    <el-select v-model="form.unit" filterable :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in unit_option" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- 规格 -->
                <el-form-item :label="$t('default.Specification')" prop="specification">
                    <el-input type="textarea" v-model="form.specifications"></el-input>
                </el-form-item>
                <!-- 工治具 -->
                <el-form-item :label="$t('default.Jig')" prop="jig">
                    <el-select v-model="form.tools" filterable :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in tools_options" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 固资 -->
                <el-form-item :label="$t('default.Fixed_Assets')" prop="fixed_assets">
                    <el-select v-model="form.asset" filterable :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in tools_options" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 描述 -->
                <el-form-item :label="$t('default.Descripción')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.note"></el-input>
                </el-form-item>
                <!-- 使用机型 -->
                <el-form-item :label="$t('default.Use_Model')">
                    <el-button type="primary" @click="handleAddModelLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="ModelData" style="width: 100%">
                            <!-- 机型 -->
                            <el-table-column prop="name" :label="$t('default.Use_Model')" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 排序 -->
                            <el-table-column prop="sort" :label="$t('default.Sort_by')" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.sort"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteModelLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-form-item>
                <!-- 替代料 -->
                <el-form-item :label="$t('default.Substitute')">
                    <el-button type="primary" @click="handleAddReplaceLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="ReplaceData" style="width: 100%">
                            <el-table-column prop="name" :label="$t('default.Substitute')" width="180">
                                <template slot-scope="scope">
<!--                                    <el-input v-model="scope.row.name" :remote-method="remoteMaterial"></el-input>-->
                                  <el-select v-model="scope.row.name" filterable class="w150" remote reserve-keyword
                                             :placeholder="$t('default.Please_enter_a_keyword')"
                                             :remote-method="remoteMaterial"
                                             :loading="loading"
                                             transfer="true" :popper-append-to-body="false">
                                    <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                                               :value="item.mat_code">
                                      <span style="float: left">{{ item.mat_code }}</span>
                                      <span style="float: right; color: #8492a6; font-size: 13px">{{
                                          item.label }}</span>
                                    </el-option>
                                  </el-select>
                                </template>

                            </el-table-column>
                            <!-- 排序 -->
                            <el-table-column prop="sort" :label="$t('default.Sort_by')" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.sort"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteReplaceLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-form-item>
                <!-- 客户编码 -->
                <el-form-item :label="$t('default.Customer_Code')">
                    <el-button type="primary" @click="handleAddCodeLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="clientCodeTableData" style="width: 100%">
                            <!-- 客户公司 -->
                            <el-table-column prop="cli_id" :label="$t('default.ClientCompany')" width="180">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.cli_id" remote reserve-keyword
                                        :placeholder="$t('default.Please_enter_a_keyword')"
                                        transfer="true" :popper-append-to-body="false">
                                        <el-option v-for="item in cli_options" :key="item.id" :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <!-- 客户编码 -->
                            <el-table-column prop="code" :label="$t('default.Customer_Code')" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.code"></el-input>
                                </template>
                            </el-table-column>

                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">

                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteCodeLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>

                        </el-table>
                    </template>
                </el-form-item>


            </el-form>

            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="安全库存修改申请"  -->
        <el-dialog :title="$t('default.Safety_Stock_Modification_Request')" :visible.sync="safeNumVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="safe_num_rules" :model="form" label-width="200px">
                <!-- 安全库存 -->
                <el-form-item :label="$t('default.Safety_Stock')" prop="safe_num">
                    <el-input v-model.number="form.safe_num"></el-input>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="safeNumVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="safeNumVisibleEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <!-- 修改采购单价申请 -->
        <el-dialog :title="$t('default.Modify_Purchase_Unit_Price')" :visible.sync="costVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="cost_rules" :model="form" label-width="200px">
                <!-- 采购单价  -->
                <el-form-item :label="$t('default.Purchase_Unit_Price')" prop="cost">
                    <el-input v-model.number="form.cost"></el-input>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>



            <span slot="footer" class="dialog-footer">
                <el-button @click="costVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveCost">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>



        <el-dialog :title=dialogSKUName :visible.sync="SKUVisible" width="70%" :before-close="handleClose">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">

                <!-- 物料名称 -->
                <el-form-item :label="$t('default.Material_Name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>


                <el-form-item label="规格">
                    <el-input type="textarea" v-model="form.specifications"></el-input>
                </el-form-item>

                <el-form-item label="使用机型">
                    <el-button type="primary" @click="handleAddModelLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="ModelData" style="width: 100%">
                            <el-table-column prop="name" label="机型" width="180">

                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 排序 -->
                            <el-table-column prop="sort" :label="$t('default.Sort_by')" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.sort"></el-input>
                                </template>
                            </el-table-column>

                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">

                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteModelLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>

                        </el-table>
                    </template>
                </el-form-item>

                <!-- 替代料 -->
                <el-form-item :label="$t('default.Substitute')">
                    <el-button type="primary" @click="handleAddReplaceLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="ReplaceData" style="width: 100%">
                            <el-table-column prop="name" :label="$t('default.Substitute')" width="180">

                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>
                            <!-- 排序 -->
                            <el-table-column prop="sort" :label="$t('default.Sort_by')" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.sort"></el-input>
                                </template>
                            </el-table-column>

                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">

                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteReplaceLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>

                        </el-table>
                    </template>
                </el-form-item>

                <el-form-item :label="$t('default.Customer_Code')">
                    <el-button type="primary" @click="handleAddCodeLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
                    <template>
                        <el-table :data="clientCodeTableData" style="width: 100%">
                             <!-- 客户公司 -->
                            <el-table-column prop="cli_id" :label="$t('default.ClientCompany')" width="180">

                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.cli_id" remote reserve-keyword
                                        :placeholder="$t('default.Please_enter_a_keyword')">
                                        <el-option v-for="item in cli_options" :key="item.id" :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <!-- 客户编码 -->
                            <el-table-column prop="code" :label="$t('default.Customer_Code')" width="180">

                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.code"></el-input>
                                </template>
                            </el-table-column>

                            <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                                <template slot-scope="scope">

                                    <el-button size="mini" type="danger" icon="el-icon-delete"
                                        @click="handleDeleteCodeLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                                </template>
                            </el-table-column>

                        </el-table>
                    </template>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="SKUVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="saveSKUEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>
        <!-- 批量导入物料 -->
        <el-dialog :title="$t('default.Batch_Import_Material')" :visible.sync="editBatchVisible" width="70%" :before-close="handleClose">
            <el-form ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 物料列表 -->
                <el-form-item :label="$t('default.Material_List')">

                    <el-button type="primary" @click="downloadFile(download_file)">{{ $t('default.Download_Import_Template') }}</el-button><!-- 下载导入模板 -->
                    <el-upload :on-success="handleExcelInSuccess" :action="materialBatchAdd_url" style="float: right;">
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                    </el-upload>

                </el-form-item>



            </el-form>
            <el-table :data="orderData" style="width: 100%">

                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.mat_code }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="name" :label="$t('default.Material_Name')"></el-table-column>
                <!-- 分类 -->
                <el-table-column prop="c_name" :label="$t('default.Category')"></el-table-column>
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
                <!-- 丝印 -->
                <el-table-column prop="silk" :label="$t('default.Silkscreen')"></el-table-column>
                <!-- 耗料比 -->
                <el-table-column prop="consumption_ratio" :label="$t('default.Consumption_Ratio')"></el-table-column>
                <!-- 保质期 -->
                <el-table-column prop="quality_day" :label="$t('default.Shelf_life')"></el-table-column>


                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
                <!-- 使用机型1 -->
                <el-table-column prop="material_model0" :label="$t('default.Use_Model_1')"></el-table-column>
                <!-- 使用机型2 -->
                <el-table-column prop="material_model1" :label="$t('default.Use_Model_2')"></el-table-column>
                <!-- 使用机型3 -->
                <el-table-column prop="material_model2" :label="$t('default.Use_Model_3')"></el-table-column>
                <!-- 使用机型4 -->
                <el-table-column prop="material_model3" :label="$t('default.Use_Model_4')"></el-table-column>
                <!-- 使用机型5 -->
                <el-table-column prop="material_model4" :label="$t('default.Use_Model_5')"></el-table-column>
                <!-- 替代料1 -->
                <el-table-column prop="material_replace0" :label="$t('default.Substitute_1')"></el-table-column>
                <!-- 替代料2 -->
                <el-table-column prop="material_replace1" :label="$t('default.Substitute_2')"></el-table-column>
                <!-- 替代料3 -->
                <el-table-column prop="material_replace2" :label="$t('default.Substitute_3')"></el-table-column>

                <!-- 操作 -->
                <el-table-column prop="operate" :label="$t('default.Action')">
                    <template slot-scope="scope">

                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                    </template>
                </el-table-column>
                <!-- 异常 -->
                <el-table-column prop="error" :label="$t('default.Abnormal')"></el-table-column>

            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editBatchVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="BatchsaveEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <el-dialog title='批量修改安全库存（单价）' :visible.sync="editBatchLSVisible" width="70%" :before-close="handleClose">
            <el-form ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 物料列表 -->
                <el-form-item :label="$t('default.Material_List')">

                    <el-button type="primary" @click="downloadFile(ls_download_file)">{{ $t('default.Download_Import_Template') }}</el-button><!-- 下载导入模板 -->
                    <el-upload :on-success="handleExcelInSuccess" :action="materialBatchUpdate_url"
                        style="float: right;">
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                    </el-upload>

                </el-form-item>
            </el-form>
            <el-table :data="orderData" style="width: 100%">
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.mat_code }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="safe_num" label="安全库存"></el-table-column>
                <!-- 单价 -->
                    <el-table-column prop="cost" :label="$t('default.Unit_Price')"></el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')"></el-table-column>
                <!-- 操作 -->
                <el-table-column prop="operate" :label="$t('default.Action')">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                    </template>
                </el-table-column>
                <!-- 异常 -->
                <el-table-column prop="error" :label="$t('default.Abnormal')"></el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editBatchLSVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="BatchLSsaveEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <!-- 日志 -->
        <el-dialog :title="$t('default.Logbook')" :visible.sync="LogVisible" width="70%">

            <el-table :data="LogData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
             
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center"></el-table-column>

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
                <!-- 操作类型 -->
                <el-table-column prop="type_name" :label="$t('default.Operation_Type')"></el-table-column>

                <!-- 备注 -->
                <el-table-column prop="note" :label="$t('default.Desc')"></el-table-column>

                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')"></el-table-column>
                <!-- 操作人 -->
                <el-table-column prop="create_user_name" :label="$t('default.Operator')"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title='批量导入物料库位' :visible.sync="MaterialLocationVisible" width="70%" :before-close="handleClose">
        
            <el-button type="primary" @click="downloadFile(MaterialLocation_download_file)">{{ $t('default.Download_Import_Template') }}</el-button><!-- 下载导入模板 -->
            <el-upload :on-success="handleExcelInSuccess" :action="MaterialLocation_url" style="float: right;">
                <el-button size="small" type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
            </el-upload>
            

            <el-table :data="orderData" style="width: 100%">

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
                <el-table-column prop="location" :label="$t('default.Location')"></el-table-column>

                <!-- 操作 -->
                <el-table-column prop="operate" :label="$t('default.Action')">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                    </template>
                </el-table-column>
            </el-table>





            <span slot="footer" class="dialog-footer">
                <el-button @click="MaterialLocationVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="batchMaterialLocationSave">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

        <el-dialog title='物料库位设置' :visible.sync="LocationVisible" width="70%" :before-close="handleClose">

            <el-button type="primary" @click="handleAddOrderLine">{{ $t('default.Add') }}</el-button><!-- 添加 -->
            <el-table :data="orderData" style="width: 100%">


                <el-table-column prop="location" :label="$t('default.Location')">
                    <template v-slot="scope">
                        <el-select v-model="scope.row.loc_id" remote filterable allow-create default-first-option
                            :placeholder="$t('default.Please_select')" :remote-method="remoteLocation">
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





            <span slot="footer" class="dialog-footer">
                <el-button @click="LocationVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="LocationSave">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>
        <!-- LocationVisible -->

        <!-- 物料 -->
        <el-dialog :visible.sync="MaterialDetailVisible" append-to-body width="70%" :title="$t('default.Material')">
            <material-detail ref="materialDetail"></material-detail>
        </el-dialog>

        <picture-update ref="pictureUpdate" :visible.sync="PictureUpdateVisible" @done="reload"></picture-update>




    </div>
</template>

<script>
import MaterialDetail from '../material/MaterialDetail.vue';
import PictureUpdate from '../material/PictureUpdate.vue';
import axios from 'axios';

export default {
    name: 'basetable',
    components: {
        MaterialDetail,
        PictureUpdate,
        
    },
    data() {
        return {

            permission: sessionStorage.getItem('permission_button'),
            query: {
                token: '',
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20,
                sort: 'm.create_time',
                sort_type: 'desc',
            },
            tableData: [],
            orderData: [],
            LogData: [],
            multipleSelection: [],
            clientCodeTableData: [],
            ModelData: [],
            ReplaceData: [],
            delList: [],
            editVisible: false,
            costVisible: false,
            safeNumVisible: false,
            editBatchVisible: false,
            detailVisible: false,
            editBatchLSVisible: false,
            LogVisible: false,
            cost_show: false,
            MaterialDetailVisible: false,
            PictureUpdateVisible: false,
            download_file: '',
            ls_download_file: '',
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            sku_form: {},
            rules: {
                name: [
                    { required: true, message: '请输入物料名称', trigger: 'blur' },
                    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
                ],
                c_list: [
                    { required: true, message: '请选择分类', trigger: 'blur' },
                ],
            },
            safe_num_rules: {
                safe_num: [
                    { type: 'number', message: '安全库存必须为数字值' },
                    { required: true, message: '请输入安全库存', trigger: 'blur' },

                ],
            },
            cost_rules: {
                cost: [
                    { type: 'number', message: '采购单价必须为数字值' },
                    { required: true, message: '请输入采购单价', trigger: 'blur' },


                ],
            },
            pictureList: [],
            image_path: '',
            idx: -1,
            id: -1,
            SKUVisible: false,
            LocationVisible: false,
            dialogSKUName: '',
            query_ware_options: [],

            options: [],
            size: '',
            cli_options: [],
            el_upload_url: '',
            materialBatchAdd_url: '',
            materialBatchUpdate_url: '',
            MaterialLocation_url: '',
            unit_option: [],
            tools_options: [],
            MaterialLocationVisible: false,
            fileList: [],
            location_options: [],
            user_options: [],
            isManager: false,
            loading: false,
            uid: localStorage.getItem("uid"),
            mat_options: [],
            sort_options: [],
            sort_type_options: [
                { value: 'asc', name: '升序' },
                { value: 'desc', name: '倒序' },
            ],

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            const token = localStorage.getItem('token'); // 从本地存储获取token，这里使用localStorage作为示例
            const headers = {
                Authorization: `Bearer ${token}`, // 在请求头中添加Authorization字段，值为token
            };
            this.query.token = localStorage.getItem("token");
            this.axios.get('/infor/material/index', {
                params: this.query,

            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.ls_download_file = res.ls_download_file;
                this.tools_options = res.tools_options;
                this.pageTotal = res.list.total || 0;
                this.MaterialLocation_download_file = res.MaterialLocation_download_file;
                this.cost_show = res.cost_show;
                this.isManager = res.isManager;
                this.sort_options = res.sort_options;
            }).catch(() => {
                this.loading = false;
            })

        },
        handleMaterialDetail(mat_code) {
            this.MaterialDetailVisible = true;

            this.$nextTick(() => {
                this.$refs.materialDetail.dataInitialization(mat_code);
            })
        },
        // 获取分类
        getCategory() {

            var token = localStorage.getItem("token");
            this.axios.post('/infor/Category/all_category', {
                token: token
            }).then((res) => {
                this.options = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
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
        // 获取客户公司
        getClientCompany() {
            var token = localStorage.getItem("token");
            this.axios.post('/infor/ClientCompany/getClientCompany', {
                token: token
            }).then((res) => {
                this.cli_options = res;
            }).catch(() => {
                this.loading = false;
            })
        },
        reload() {
            this.$refs.table.reload({ where: this.where });
        },
        // 库位
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
        PictureUpdate() {
            this.PictureUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.pictureUpdate.dataInitialization();

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
        handleBatchMaterialLocation() {
            this.MaterialLocationVisible = true;
        },
        // 保存编辑
        batchMaterialLocationSave() {
            this.axios.post('/ware/materialLocation/batchSave', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
            }).then((res) => {

                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                // this.batchVisible = false;
                this.MaterialLocationVisible = false;
                this.getData();
            }).catch(() => {
                this.loading = false;
            })
        },

        // 搜索,触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
        // 新增
        handleadd() {
            // 获取分类
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Category/all_category', {
                token: token
            }).then((res) => {
                this.options = res;
            }).catch(() => {
                this.loading = false;
            })
            this.pictureList = [];

            this.clientCodeTableData = [];
            this.ModelData = [];
            this.ReplaceData = [];
            this.idx = 0;
            this.form = {};
            // 新增
            this.dialogName = this.$t('default.Add');
            this.editVisible = true;


        },

        // 批量新增
        handleBatchAdd() {


            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};
            this.orderData = [];

            this.editBatchVisible = true;

        },

        /**
        * @description: ；拉取最新物料信息
        * @author: 陈思璇 
        * @date: 2023-12-18
        */
        handleGetNew() {
            this.axios.post('/infor/material/getNew', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {
                this.$message.success('拉取成功');
                this.getData();


            }).catch(() => {
                this.loading = false;
            })
        },

        // 显示日志
        showLog(index, row) {



            this.form = JSON.parse(JSON.stringify(row));
            this.axios.post('/infor/MaterialLog/showLog', {
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

        // 批量新增
        handleLSBatchAdd() {
            this.orderData = [];
            this.editBatchLSVisible = true;
        },
        // 编辑安全库存
        handleSafeNum(index, row) {
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // 设置弹出编辑框标记为true
            this.safeNumVisible = true;
        },
        
        handleEdit(index, row) {

            if (row.picture) {
                this.pictureList = this.form.fileList;
                this.fileList = this.pictureList;
            } else {
                this.pictureList = [];
            }


            // 获取分类
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Category/all_category', {
                token: token
            }).then((res) => {

                this.options = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));


            this.clientCodeTableData = this.form.client_code_arr;
            this.ReplaceData = this.form.material_replace_arr;
            this.ModelData = this.form.material_model_arr;
            this.editVisible = true;

        },
        // 停用
        handleStop() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let mat_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    mat_code_arr.push(this.multipleSelection[i].mat_code);
                }
                this.axios.post('/infor/material/handleStop', {
                    token: localStorage.getItem("token"),
                    mat_code_arr: mat_code_arr,
                    // params: this.form

                }).then((res) => {
                    // console.log(res);
                    // 弹出成功提示框
                    // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                    this.editVisible = false;
                    this.getData();
                    // 为this.tableData新增属性
                    // this.$set(this.tableData, this.idx, this.form);
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

        //删除行
        handleDeleteLine(index) {
            console.log(index);
            this.orderData.splice(index, 1)
        },
        handleSKUAdd(index, row) {

            this.pictureList = [];


            this.clientCodeTableData = [];
            this.ModelData = [];
            this.ReplaceData = [];

            this.dialogSKUName = '新增子SKU'
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // 设置弹出编辑框标记为true
            this.SKUVisible = true;
            this.form.id = '';
        },
        handleSKUEdit(index, row) {
            this.form = JSON.parse(JSON.stringify(row));

            this.clientCodeTableData = this.form.client_code_arr;
            this.ReplaceData = this.form.material_replace_arr;
            this.ModelData = this.form.material_model_arr;
            if (row.picture) {
                this.pictureList = [
                    {
                        name: row.picture,
                        url: row.picture_url,
                    },
                ];
            } else {
                this.pictureList = [];
            }
            this.dialogSKUName = '编辑子SKU'
            this.idx = index;
            this.SKUVisible = true;
        },
        handleExport() {
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
              let mat_code_arr = [];
              // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
              // this.delList = this.delList.concat(this.multipleSelection);
              for (let i = 0; i < length; i++) {
                mat_code_arr.push(this.multipleSelection[i].mat_code);
              }
              this.query.mat_code = mat_code_arr;

            }
            console.log(this.query)
            this.query.token = localStorage.getItem("token");
            this.axios.post('/infor/material/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {

                window.open(res);

            }).catch(() => {
                this.loading = false;
            })
        },

        // 编辑采购单价
        handleCost(index, row) {

            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // 设置弹出编辑框标记为true
            this.costVisible = true;
        },

        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
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
        // 安全库存修改申请
        safeNumVisibleEdit() {
            var data_form = this.form;
            this.axios.post('/infor/materialSafeNumAudit/apply', {
                token: localStorage.getItem("token"),
                params: data_form
            }).then((res) => {
                console.log(res);
                // 弹出成功提示框
                this.$message.success('申请成功');
                this.safeNumVisible = false;
                this.getData();
                // 为this.tableData新增属性
                this.$set(this.tableData, this.idx, this.form);
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
                this.query_ware_options = res;
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })
        },
        // 保存编辑
        saveEdit() {

            let picture_arr = [];
            if (this.fileList === this.pictureList) {

            } else {
                const length = this.fileList.length;

                if (length) {
                    for (let i = 0; i < length; i++) {

                        var pictureInfo = this.fileList[i];
                        // console.log(pictureInfo);
                        // if(pictureInfo.includes('response')){
                        let response = pictureInfo.response;
                        // console.log(response);
                        if (response) {
                            picture_arr.push(response.data);
                        } else {
                            picture_arr.push(pictureInfo.name);
                        }
                    }
                }
            }

            this.form.picture_arr = picture_arr;
            var data_form = this.form;
            if (typeof (data_form.id) == 'undefined') {
                this.axios.post('/infor/material/save', {
                    token: localStorage.getItem("token"),
                    params: data_form,
                    clientCodeTableData: this.clientCodeTableData,
                    ModelData: this.ModelData,
                    ReplaceData: this.ReplaceData,
                }).then((res) => {
                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    this.editVisible = false;
                    this.getData();
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.axios.post('/infor/material/update', {
                    token: localStorage.getItem("token"),
                    params: data_form,

                    clientCodeTableData: this.clientCodeTableData,
                    ModelData: this.ModelData,
                    ReplaceData: this.ReplaceData,

                }).then((res) => {
                    console.log(res);
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

            this.pictureList = [];
        },
        LocationSave() {
            this.axios.post('/ware/materialLocation/LocationSave', {
                token: localStorage.getItem("token"),
                orderData: this.orderData,
                params: this.form,
            }).then((res) => {

                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                // this.batchVisible = false;
                this.LocationVisible = false;
                this.getData();
            }).catch(() => {
                this.loading = false;
            })
        },
        BatchLSsaveEdit() {
            this.axios.post('/infor/material/BatchUpdate', {

                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,

            }).then((res) => {
                console.log(res);

                this.$message.success(res.msg);
                this.editBatchLSVisible = false;
                this.getData();
            }).catch(() => {
                this.loading = false;
            })
        },
        // 批量新增保存
        BatchsaveEdit() {
            this.axios.post('/infor/material/BatchSave', {

                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData,

            }).then((res) => {

                // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                this.editBatchVisible = false;
                this.getData();
            }).catch(() => {
                this.loading = false;
            })
        },

        saveSKUEdit() {
            var data_form = this.form;
            if (data_form.id == '') {

                this.axios.post('/infor/material/saveSon', {

                    token: localStorage.getItem("token"),
                    params: data_form,

                    clientCodeTableData: this.clientCodeTableData,
                    ModelData: this.ModelData,
                    ReplaceData: this.ReplaceData,
                }).then((res) => {
                    console.log(res);
                    // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                    this.SKUVisible = false;
                    this.getData();
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.axios.post('/infor/material/updateSon', {
                    token: localStorage.getItem("token"),
                    params: data_form,

                    clientCodeTableData: this.clientCodeTableData,
                    ModelData: this.ModelData,
                    ReplaceData: this.ReplaceData,
                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                    this.SKUVisible = false;
                    this.getData();
                    // 为this.tableData新增属性
                    this.$set(this.tableData, this.idx, this.form);
                }).catch(() => {
                    this.loading = false;
                })
            }
        },
        handleLocation(index, row) {
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));

            this.axios.post('/ware/materialLocation/handleLocation', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {
                // console.log(res);
                // 弹出成功提示框
                // this.$message.success('申请成功');
                // this.costVisible = false;
                this.orderData = res.material_location;
                this.location_options = res.location_arr;
                // this.getData();
                // 为this.tableData新增属性
                // this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })

            this.LocationVisible = true;

        },
        saveCost() {
            this.axios.post('/infor/materialCostAudit/apply', {
                token: localStorage.getItem("token"),
                params: this.form
            }).then((res) => {
                // console.log(res);
                // 弹出成功提示框
                this.$message.success('申请成功');
                this.costVisible = false;
                this.getData();
                // 为this.tableData新增属性
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
                this.loading = false;
            })

        },



        handleExceed(files, fileList) {
            this.$message.warning('当前限制选择 5 个文件');
        },


        handleSuccess(file, fileList, row) {
            // console.log(file);
            // console.log(row);
            // console.log(fileList);
            this.form.picture = fileList.response.data;
            this.fileList = row;

        },
        handleRemove(file, fileList) {

            // console.log(file, fileList);
            this.fileList = fileList;
        },
        handleExcelInSuccess(file, fileList, row) {
            if (file.code == 201) {
                this.$message.warning(file.msg);
            } else if (file.code == 200) {
                // 上传成功
                this.$message.success(this.$t('default.Uploaded_successfully'));
                this.orderData = file.data;
            }

        },
        // 获取币种
        getUnit() {
            var token = localStorage.getItem("token");
            this.axios.post('/infor/Unit/getUnit', {
                token: token
            }).then((res) => {
                this.unit_option = res;

            }).catch(() => {
                this.loading = false;
            })
        },
        // 库位
        handleAddOrderLine() {
            if (this.orderData == undefined) {
                this.orderData = new Array();
            }
            let obj = {};
            this.orderData.push(obj);
        },

        // 使用机型
        handleAddModelLine() {
            if (this.ModelData == undefined) {
                this.ModelData = new Array();
            }
            let obj = {};

            this.ModelData.push(obj);
        },
        handleDeleteModelLine(index) {
            this.ModelData.splice(index, 1)
        },
        // 替换料
        handleAddReplaceLine() {
            if (this.ReplaceData == undefined) {
                this.ReplaceData = new Array();
            }
            let obj = {};

            this.ReplaceData.push(obj);
        },
        handleDeleteReplaceLine(index) {
            this.ReplaceData.splice(index, 1)
        },
        // 客户编码增加行
        handleAddCodeLine() {
            if (this.clientCodeTableData == undefined) {
                this.clientCodeTableData = new Array();
            }
            let obj = {};

            this.clientCodeTableData.push(obj);
        },
        //删除行
        handleDeleteCodeLine(index) {

            this.clientCodeTableData.splice(index, 1)
        },
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/infor/material/delete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getData();
                        // this.tableData.splice(index, 1);
                    }).catch(() => {
                        this.loading = false;
                    })

                })
                .catch(() => { })
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
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
        handleSkuDelete(index, row) {
            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
                type: 'warning'
            })
                .then(() => {
                    this.axios.post('/infor/material/sonDelete', {
                        token: localStorage.getItem("token"),
                        params: row
                    }).then((res) => {
                        // 删除成功
                        this.$message.success(this.$t('default.Delete_Successfully'));
                        this.editVisible = false;
                        this.getData();
                        // this.tableData.splice(index, 1);
                    }).catch(() => {
                        this.loading = false;
                    })

                })
                .catch(() => { })
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
        },




    },
    // 在钩子函数中调用getData方法
    created() {
        this.el_upload_url = axios.defaults.baseURL + '/com/upload/uploadPicture';
        this.materialBatchAdd_url = axios.defaults.baseURL + '/com/ExcelIn/materialBatchAdd';
        this.materialBatchUpdate_url = axios.defaults.baseURL + '/com/ExcelIn/materialBatchUpdate';
        this.MaterialLocation_url = axios.defaults.baseURL + '/com/ExcelIn/materialLocation';
        this.getData();
        this.getCategory();
        this.getClientCompany();
        this.getUnit();
        this.permission = JSON.parse(this.permission);
        this.DepartmentChange();
    }
}
</script>
