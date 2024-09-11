<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 客商名称 -->
                {{ $t('default.Merchant_Name') }}：<el-input v-model="query.name" :placeholder="$t('default.Please_enter_a_keyword')"
                    class="handle-input mr10 w150"></el-input>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
<!--              <el-button type="primary" class="handle-del mr10" @click="handleadd"
                         v-if="permission.includes('supply:handleadd')">{{ $t('default.Add') }}</el-button>-->
              <!-- 新增 -->
<!--              <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleBatchAdd"
                         v-if="permission.includes('supply:handleBatchAdd')">{{ $t('default.Batch_Import')
                }}</el-button>-->
              <!-- 批量导入 -->

            </div>
            <el-table :data="tableData" height="400" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="110" align="center">
                    <template v-slot="scope">
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
                            v-if="permission.includes('supply:handleEdit')">{{ $t('default.Edit') }}
                        </el-button><!-- 编辑 -->
                        <el-button type="text" class="red" :title="$t('default.Are_you_sure_you_want_to_delete')"
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if="permission.includes('supply:handleDelete') || scope.row.create_user == uid">
                          {{ $t('default.Delete') }}
                        </el-button><!-- 删除 -->
                    </template>
                </el-table-column>

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                <!-- 客商编码 -->
                <el-table-column prop="code" :label="$t('default.Merchant_Code')"  align="center">
                  <template v-slot="scope">
                    <el-button type="text" @click="handleSupplyDetail(scope.row.code)">
                      {{ scope.row.code }}
                    </el-button>
                  </template>
                </el-table-column>
                <!-- 客商名称 -->
                <el-table-column prop="name" :label="$t('default.Merchant_Name')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.name }}</el-button>

                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 简称 -->
                <el-table-column prop="local_code" :label="$t('default.Abbreviation')"></el-table-column>
                <!-- 币种 -->
                <el-table-column prop="currtypename" :label="$t('default.Currency')"></el-table-column>
                <!-- 物料类型 -->
                <el-table-column prop="material_type" :label="$t('default.Material_Type')"></el-table-column>
                <!-- 联系人 -->
                <el-table-column prop="contacts_user" v-if="contact_show"
                    :label="$t('default.Contact_Person')"></el-table-column>
                <!-- 电话 -->
                <el-table-column prop="tel" v-if="contact_show" :label="$t('default.Phone_number')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.tel }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.tel }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 手机 -->
                <el-table-column v-if="contact_show" prop="phone" :label="$t('default.Mobile_phone')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.phone }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.phone }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 邮箱 -->
                <el-table-column prop="email" v-if="contact_show" :label="$t('default.Email')"></el-table-column>
                <!-- 付款方式 -->
                <el-table-column prop="payment_method" :label="$t('default.Payment_Method')"></el-table-column>
                <!-- 开户行 -->
                <el-table-column prop="bank" :label="$t('default.Bank_account')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.bank }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.bank }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 银行账号 -->
                <el-table-column prop="bank_account" :label="$t('default.Bank_account_number')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.bank_account }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.bank_account }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 地址 -->
                <el-table-column prop="address" :label="$t('default.Address')">
                    <template v-slot="scope">
                        <el-popover trigger="click" placement="top">
                            <p>{{ scope.row.address }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">--</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 经营范围 -->
                <el-table-column prop="business_scope" :label="$t('default.Business_Scope')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.business_scope }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.business_scope }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 交货周期 -->
                <el-table-column prop="lead_time" :label="$t('default.Delivery_cycle')"></el-table-column>
                <!-- 开票资料 -->
                <el-table-column prop="invoicing_information" :label="$t('default.Invoicing_information')">
                    <template v-slot="scope">
                        <!-- 查阅 -->
                        <span style="color: #409EFF;" v-if="scope.row.invoicing_information_url"
                            @click="downloadFile(scope.row.invoicing_information_url)">{{ $t('default.Check') }}</span>
                    </template>
                </el-table-column>
                <!-- 合同 -->
                <el-table-column prop="invoicing_information" :label="$t('default.Contract')">
                    <template v-slot="scope">
                        <!-- 查阅 -->
                      <div>
                        <ul>
                          <li v-for="(contract_url, key) in scope.row.contract_urls" :key="key">
                            <span style="color: #409EFF;" v-if="contract_url" @click="downloadFile(contract_url)">{{
                                $t('default.Check') }}</span>
                          </li>
                        </ul>
                      </div>
<!--                      <span v-if="scope.row.contract_url" @click="downloadFile(scope.row.contract_url)">{{
                          $t('default.Check') }}</span>-->
                    </template>
                </el-table-column>
              <!-- 营业执照 -->
              <el-table-column prop="license" :label="$t('default.Business_Licence')">
                <template v-slot="scope">
                  <!-- 查阅 -->
                  <span style="color: #409EFF;" v-if="scope.row.license"
                        @click="downloadFile(scope.row.license)">
                    {{ $t('default.Check') }}</span>
                </template>
              </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="note" :label="$t('default.Desc')"></el-table-column>
                <!-- 创建时间 -->
                <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.create_user_name }}
                                {{ scope.row.create_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">
                                  {{ scope.row.create_user_name }}{{ scope.row.create_time }}
                                </el-button>
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
                                    {{ scope.row.update_time }}
                                </el-button>
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
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 客商名称 -->
                <el-form-item :label="$t('default.Merchant_Name')" prop="name">
                    <el-input v-model="form.name" readonly></el-input>
                </el-form-item>
                <!-- 简称 -->
                <el-form-item :label="$t('default.Abbreviation')" prop="local_code">
                    <el-input v-model="form.local_code" readonly></el-input>
                </el-form-item>
                <!-- 客商编码 -->
                <el-form-item :label="$t('default.Merchant_Code')" prop="code">
                    <el-input v-model="form.code" readonly></el-input>
                </el-form-item>
                <!-- 地区分类编码 -->
                <el-form-item :label="$t('default.Regional_classification_code')" prop="pk_areacl">
                    <el-input v-model="form.pk_areacl" readonly></el-input>
                </el-form-item>
                <!-- 联系人 -->
                <el-form-item :label="$t('default.Contact_Person')" prop="contact_person">
                    <el-input v-model="form.contacts_user" readonly></el-input>
                </el-form-item>
                <!-- 电话 -->
                <el-form-item :label="$t('default.Phone_number')" prop="phone_number">
                    <el-input @input="tel" v-model="form.tel" readonly></el-input>
                </el-form-item>
                <!-- 手机 -->
                <el-form-item :label="$t('default.Mobile_phone')" prop="mobile_phone">
                    <el-input style="height:32px;"
                        placeholder="请输入手机号码"
                        v-model="form.phone"
                        type="number"
                        oninput="if(value.length>11)value=value.slice(0,11)"
                        onkeyup="this.value = this.value.replace(/[^\d]/g,'');"
                        size="mini"
                        clearable
                        readonly
                    >
                </el-input>
                </el-form-item>
                <!-- 邮件 -->
                <el-form-item :label="$t('default.Email')" prop="email">
                    <el-input v-model="form.email" readonly></el-input>
                </el-form-item>
                <!-- 地址 -->
                <el-form-item :label="$t('default.Address')" prop="address">
                    <el-input v-model="form.address" readonly></el-input>
                </el-form-item>
                <!-- 币种 -->
                <el-form-item :label="$t('default.Currency')" prop="currency">

                    <el-select v-model="form.currtypecode" filterable :placeholder="$t('default.Please_select')" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in currtype_option" :key="item.currtypecode" :label="item.currtypename"
                            :value="item.currtypecode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 物料类型 -->
                <el-form-item :label="$t('default.Material_Type')" prop="material_type">
                    <el-input v-model="form.material_type" readonly></el-input>
                </el-form-item>
                <!-- 付款方式 -->
                <el-form-item :label="$t('default.Payment_Method')" prop="payment_method">
                    <el-input v-model="form.payment_method" readonly></el-input>
                </el-form-item>
                <!-- 交货周期 -->
                <el-form-item :label="$t('default.Delivery_cycle')" prop="delivery_cycle">
                    <el-input v-model="form.lead_time" readonly></el-input>
                </el-form-item>
                <!-- 经营范围 -->
                <el-form-item :label="$t('default.Business_Scope')" prop="business_scope">
                    <el-input v-model="form.business_scope" readonly></el-input>
                </el-form-item>
                <!-- 营业执照 -->
                <el-form-item :label="$t('default.Business_Licence')">
                    <el-upload v-model="form.license" :file-list="pictureList" class="upload-demo"
                        :action="el_upload_url" :limit="1" :on-exceed="handleExceed" :on-success="handleSuccess"
                        list-type="picture">
                        <el-button type="primary">{{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
                        <template #tip>
                            <div class="el-upload__tip">
                                <!-- 只能上传jpg/png文件，且不超过500kb -->
                                {{ $t('default.Only_jpg_png_files_can_be_uploaded_and_it_should_not_exceed_500kb') }}
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <!-- 开票资料 -->
                <el-form-item :label="$t('default.Invoicing_information')">
                    <el-upload class="upload-demo" :action="uploadFile_url" :on-remove="handleRemove" multiple
                        :limit="1" :on-exceed="handleExceed" :file-list="fileList" :on-success="handleFileSuccess">
                        <!-- 点击上传 -->
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload')
                            }}</el-button>
                        <!-- 不能超过500kb -->
                        <div slot="tip" class="el-upload__tip">{{ $t('default.Cannot_exceed_500kb') }}</div>
                    </el-upload>
                </el-form-item>
                <!-- 合同 -->
                <el-form-item :label="$t('default.Contract')">
<!--                  :limit="1"-->
                  <el-upload
                      class="upload-demo"
                      :action="uploadFile_url"
                      :on-remove="handleRemove"
                      multiple
                      :on-exceed="handleExceed"
                      :file-list="contractFileList"
                      :on-success="handleContractFileSuccess">
                        <el-button size="small" type="primary">{{ $t('default.Click_to_upload')
                            }}</el-button><!-- 点击上传 -->
                        <!-- 不能超过500kb @click="downloadFile(contract_url) -->
                        <div slot="tip" class="el-upload__tip">{{ $t('default.Cannot_exceed_500kb') }}</div>
                    </el-upload>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input v-model="form.note"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>

        <!-- 批量导入客商 -->
        <el-dialog :label="$t('default.Batch_import_suppliers')" :visible.sync="editBatchVisible" width="70%">
            <el-button type="primary" @click="downloadFile(download_file)">
              {{ $t('default.Download_Import_Template')}}
            </el-button><!-- 下载导入模板 -->
            <el-upload :on-success="handleExcelInSuccess" :action="supplyBatchAdd_url">
                <el-button size="small" type="primary">
                  {{ $t('default.Click_to_upload') }}</el-button><!-- 点击上传 -->
            </el-upload>
            <template>
                <el-table :data="orderData" style="width: 100%">
                    <!-- 客商名称 -->
                    <el-table-column prop="name" :label="$t('default.Merchant_Name')"></el-table-column>
                    <!-- 简称 -->
                    <el-table-column prop="local_code" :label="$t('default.Abbreviation')"></el-table-column>
                    <!-- 客商编码 -->
                    <el-table-column prop="code" :label="$t('default.Merchant_Code')"></el-table-column>
                    <!-- 币种 -->
                    <el-table-column prop="currtypename" :label="$t('default.Currency')"></el-table-column>
                    <!-- 物料类型 -->
                    <el-table-column prop="material_type" :label="$t('default.Material_Type')"></el-table-column>
                    <!-- 联系人 -->
                    <el-table-column prop="contacts_user" l:label="$t('default.Contact_Person')"></el-table-column>
                    <!-- 电话 -->
                    <el-table-column prop="tel" :label="$t('default.Phone_number')"></el-table-column>
                    <!-- 手机 -->
                    <el-table-column prop="phone" :label="$t('default.Mobile_phone')"></el-table-column>
                    <!-- 邮箱 -->
                    <el-table-column prop="email" :label="$t('default.Email')"></el-table-column>
                    <!-- 付款方式 -->
                    <el-table-column prop="payment_method" :label="$t('default.Payment_Method')"></el-table-column>
                    <!-- 开户行 -->
                    <el-table-column prop="bank" :label="$t('default.Bank_account')"></el-table-column>
                    <!-- 银行账号 -->
                    <el-table-column prop="bank_account" :label="$t('default.Bank_account_number')"></el-table-column>
                    <!-- 地址 -->
                    <el-table-column prop="address" :label="$t('default.Address')"></el-table-column>
                    <!-- 经营范围 -->
                    <el-table-column prop="business_scope" :label="$t('default.Business_Scope')"></el-table-column>
                    <!-- 交货周期 -->
                    <el-table-column prop="lead_time" :label="$t('default.Delivery_cycle')"></el-table-column>
                    <!-- 备注 -->
                    <el-table-column prop="note" :label="$t('default.Desc')"></el-table-column>
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
            </template>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editBatchVisible = false">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                <el-button type="primary" @click="BatchsaveEdit">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            </span>
        </el-dialog>

      <!-- 客商档案详情 -->
      <el-dialog :visible.sync="SupplyDetailVisible" append-to-body width="70%" :title="$t('title.supply')">
        <supply-detail ref="supplyDetail"></supply-detail>
      </el-dialog>
    </div>
</template>
<style>
.el-table td.el-table__cell div {
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-table th.el-table__cell>.cell {
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script>
import axios from 'axios';
import SupplyDetail from "../supply/SupplyDetail.vue";
export default {
    name: 'basetable',
    components: {
      SupplyDetail

    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {
                name: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 250, message: '长度不能超过250个字符', trigger: 'blur' }
                ],
                code: [
                  { required: true, message: '请输入客商编码', trigger: 'blur' },
                  { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
                ],
            },
            pictureList: [],
            fileList: [],
            contractFileList: [],
            image_path: '',
            idx: -1,
            id: -1,
            uploadFile_url: '',
            download_file: '',
            editBatchVisible: false,
            supplyBatchAdd_url: '',
            orderData: [],
            currtype_option: [],
            contact_show: false,
            // isManager:false,
            uid: localStorage.getItem("uid"),
            contractArray: [],
            contractFileListArray: [],
            SupplyDetailVisible: false,
        };
    },

    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/infor/supply/index', {
                params: this.query
            }).then((res) => {
                console.log(res);


                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.contact_show = res.contact_show;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;

                console.log(uid);

            }).catch(() => {
                this.loading = false;
            })

        },
        //商户档案
        handleSupplyDetail(code) {
          this.SupplyDetailVisible = true;

          this.$nextTick(() => {
            this.$refs.supplyDetail.dataInitialization(code);
          })
        },
        downloadFile(fileUrl) {
            window.open(fileUrl);
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
        handleExcelInSuccess(file, fileList, row) {
            if (file.code == 201) {
                this.$message.warning(file.msg);
            } else if (file.code == 200) {
                // 上传成功
                this.$message.success(this.$t('default.Uploaded_successfully'));
                this.orderData = file.data;
            }

        },
        // 新增
        handleadd() {
            this.pictureList = [];
            this.fileList = [];
            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};
            // this.form

            // 新增
            this.dialogName = this.$t('default.Add');
            // 设置弹出编辑框标记为true

            this.editVisible = true;

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
        // 批量新增
        handleBatchAdd() {
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form

            this.orderData = [];
            this.editBatchVisible = true;
        },
        // 批量新增保存
        BatchsaveEdit() {
            this.axios.post('/infor/supply/BatchSave', {

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

      getFileNameFromPath(path) {
        // 使用lastIndexOf和substring方法获取文件名
        const fileName = path.substring(path.lastIndexOf('/') + 1);
        return fileName;
      },


      // 编辑
        handleEdit(index, row) {
            if (row.license) {
                this.pictureList = [
                    {
                        //name: row.license,
                        name: "营业执照" + this.getFileNameFromPath(row.license),
                        url: row.license_url,
                    },
                ];
            } else {
                this.pictureList = [];
            }

            console.log(row)
            if (row.invoicing_information) {
                this.fileList = [
                    {
                        //name: row.invoicing_information,
                        name: "开票资料" + this.getFileNameFromPath(row.invoicing_information),
                        url: row.invoicing_information_url,
                    },
                ];
            } else {
                this.fileList = [];
            }

            //contractFileList
            if (row.contract_urls) {
              for (let contract_url of row.contract_urls) {
                console.log(contract_url)
                this.contractFileList.push([
                  {
                    //name: contract_url,
                    name: "合同" + this.getFileNameFromPath(contract_url),
                    url: contract_url,
                  },
                ]);
              }
              console.log(this.contractFileList)
            } else {
              this.contractFileList = [];
            }


            // 编辑
            this.dialogName = this.$t('default.Edit');
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            // 设置弹出编辑框标记为true
            this.editVisible = true;
        },
        // 删除
        // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
        handleDelete(index, row) {



            // 二次确认删除
            this.$confirm(this.$t('default.Are_you_sure_you_want_to_delete'), this.$t('default.Prompts'), {
                // this.$confirm方法返回一个promise对象，promise通常用来解决异步操作的问题，一般都是通过.then()或.catch()方法进行调用
                type: 'warning'
            })
                //     // promise的链式调用语法
                .then(() => {
                    // console.log(11123);
                    this.axios.post('/infor/supply/delete', {
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
            // 表示在promise对象执行失败时所需执行的函数，也就是用户点击了二次确认框中的取消按钮，不需要进行任何操作
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
                // console.log('新增');
                this.axios.post('/infor/supply/save', {

                    token: localStorage.getItem("token"),
                    params: data_form
                }).then((res) => {
                    console.log(res);
                    // 保存成功
                    this.$message.success(this.$t('default.Save_Success'));
                    this.editVisible = false;
                    this.getData();
                    this.contractFileList = [];
                    this.contractArray = [];
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                console.log(data_form)
                this.axios.post('/infor/supply/update', {
                    token: localStorage.getItem("token"),
                    params: data_form
                }).then((res) => {
                    console.log(res);
                    // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                    this.editVisible = false;
                    this.getData();
                    // 为this.tableData新增属性
                    this.$set(this.tableData, this.idx, this.form);
                    this.contractFileList = [];
                    this.contractArray = [];
                }).catch(() => {
                    this.loading = false;
                })
            }

            this.pictureList = [];
        },


        handleExceed(files, pictureList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + pictureList.length} 个文件`);
        },
        handleRemove(file, fileList) {
            // return this.$confirm(`确定移除 ${file.name}？`);
            console.log(file);
            console.log(fileList);
        },

        handleSuccess(file, pictureList, row) {
            this.form.license = pictureList.response.data;

        },

        handleFileSuccess(file, fileList, row) {
            this.form.invoicing_information = fileList.response.data;
        },

        handleContractFileSuccess(file, contractFileList, row) {
            this.contractArray.push(contractFileList.response.data);
            this.form.contract = this.contractArray;
        }


    },
    // 在钩子函数中调用getData方法
    created() {
        this.el_upload_url = axios.defaults.baseURL + '/com/upload/uploadPicture';
        this.uploadFile_url = axios.defaults.baseURL + '/com/upload/uploadFile';
        this.supplyBatchAdd_url = axios.defaults.baseURL + '/com/ExcelIn/supplyBatchAdd';

        this.getData();
        this.getCurrtype();
        this.permission = JSON.parse(this.permission);
    }
}
</script>
