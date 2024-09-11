<template>

  <el-dialog append-to-body width="90%" :visible="visible" :title="$t('default.Purchase_Order')"
             :destroy-on-close="true" :lock-scroll="false" @update:visible="updateVisible">

    <el-button type="primary" @click="Cancel(form.id)"
               v-if="permission.includes('Purchase:cancel') && (form.status == 1 || form.status == 2 || form.status == 3)">{{
        $t('default.Order_cancellation') }}</el-button>
    <el-descriptions class="margin-top" :column="8">


      <!-- 采购单号 -->
      <el-descriptions-item :label="$t('default.Purchase_Order_Number')">{{ form.pur_code
        }}</el-descriptions-item>


      <!-- 币种 -->
      <el-descriptions-item :label="$t('default.Currency')" v-if=cost_show>{{ form.currtype_name
        }}</el-descriptions-item>

      <!-- 总价 -->
      <el-descriptions-item :label="$t('default.Total_Price')" v-if=cost_show>{{ form.total_price
        }}</el-descriptions-item>

      <!-- 部门 -->
      <el-descriptions-item :label="$t('default.Department')">{{ form.department_name
        }}</el-descriptions-item>
      <!-- 状态 -->
      <el-descriptions-item :label="$t('default.Status')">{{ form.status_name }}</el-descriptions-item>
      <!-- 采购员 -->
      <el-descriptions-item :label="$t('default.Purchaser')">{{ form.pur_name }}</el-descriptions-item>
      <!-- 需求交期 -->
      <el-descriptions-item :label="$t('default.Demand_Delivery')">{{ form.estimated_delivery_time
        }}</el-descriptions-item>
      <!-- 审核人 -->
      <el-descriptions-item :label="$t('default.Auditor')">{{ form.audit_user_name }}</el-descriptions-item>
      <!-- 审核时间 -->
      <el-descriptions-item :label="$t('default.AuditTime')">{{ form.audit_time }}</el-descriptions-item>
      <!-- 审核备注 -->
      <el-descriptions-item :label="$t('default.Audit_Remarks')">{{ form.audit_desc }}</el-descriptions-item>
      <!-- 扣税类别 -->
      <el-descriptions-item :label="$t('default.Tax_Deduction_Category')">{{ form.tax_deduction_name
        }}</el-descriptions-item>


      <!-- 创建时间 -->
      <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>


      <!-- 更新时间 -->
      <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>

      <!-- 备注 -->
      <el-descriptions-item :label="$t('default.Desc')">{{ form.desc }}</el-descriptions-item>
      <!-- 供应商 -->
      <el-descriptions-item :label="$t('default.Supplier')">{{ form.sup_name }}</el-descriptions-item>

    </el-descriptions>


    <el-table :data="detailData" border class="table" style="width: 100%" max-height="500px" show-summary
              :summary-method="getSummaries">

      <!-- 序号 -->
      <el-table-column prop="no" :label="$t('default.No')" fixed width="55"></el-table-column>

      <!-- 物料编码 -->
      <el-table-column prop="mat_code" :label="$t('default.Material_Code')" fixed width="105" sortable>

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

      <el-table-column prop="mat_name" fixed :label="$t('default.Material_Name')">

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
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications
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
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.project_name
                }}</el-button>
            </div>
          </el-popover>

        </template>

      </el-table-column>



      <!-- 实购 -->
      <el-table-column prop="real_num" :label="$t('default.Purchased')" width="75" sortable></el-table-column>
      <!-- 已入 -->
      <el-table-column  class-name="in_num" prop="in_num" :label="$t('default.Input')" width="75" sortable>
        <template v-slot="scope">
          <el-button  type="text" style="color: #409EFF;">{{ scope.row.in_num }}</el-button>
        </template>
      </el-table-column>

      <!-- 未入 -->
      <el-table-column  class-name="wait_in_num" prop="wait_in_num" :label="$t('default.Not_entered')" width="75" sortable>
        <template v-slot="scope">
          <el-button  v-if="scope.row.wait_in_num > 0" type="text" class="red">{{ scope.row.wait_in_num }}</el-button>
          <!--                    <el-button v-if="scope.row.wait_in_num == 0" type="text" style="color: rgb(39, 36, 36);">{{ scope.row.wait_in_num }}</el-button>-->
          <el-button v-if="scope.row.wait_in_num == 0" type="text" class="red">{{ scope.row.wait_in_num }}</el-button>
        </template>
      </el-table-column>
      <!-- 退货 -->
      <el-table-column prop="return_num" :label="$t('default.Returns')" width="75" sortable></el-table-column>
      <!-- 原单价 -->
      <el-table-column v-if=cost_show prop="old_cost" :label="$t('default.Original_Order_Price')" width="90"
                       sortable>
        <template v-slot="scope">
          <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.old_cost
            }}</el-button>
        </template>
      </el-table-column>
      <!-- 单价 -->
      <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')" width="75" sortable>
        <template v-slot="scope">
          <el-button v-if="scope.row.cost <= scope.row.old_cost" type="text" style="color: rgb(39, 36, 36);">{{
              scope.row.cost
            }}</el-button>
          <el-button v-if="scope.row.cost > scope.row.old_cost" type="text" class="red">{{
              scope.row.cost
            }}</el-button>
        </template>
      </el-table-column>
      <!-- 税率 -->
      <el-table-column v-if=cost_show prop="tax_rate" :label="$t('default.Tax_rate')"></el-table-column>
      <!-- 含税单价 -->
      <el-table-column v-if=cost_show prop="norgtaxprice" :label="$t('default.Including_tax_unit_price')"
                       width="105" sortable>
        <template v-slot="scope">
          <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.norgtaxprice
            }}</el-button>
        </template>
      </el-table-column>
      <!-- 金额 -->
      <el-table-column v-if=cost_show prop="total_price" :label="$t('default.Amount')" width="75" sortable>
        <template v-slot="scope">
          <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.total_price
            }}</el-button>
        </template>
      </el-table-column>
      <!-- 税额 -->
      <el-table-column v-if=cost_show prop="noriginaltaxmny" :label="$t('default.Tax_amount')" width="75"
                       sortable>
        <template v-slot="scope">
          <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.noriginaltaxmny
            }}</el-button>
        </template>
      </el-table-column>
      <!-- 价税合计 -->
      <el-table-column v-if=cost_show prop="ntaxpricemny" :label="$t('default.Total_price_and_tax')" width="105"
                       sortable>
        <template v-slot="scope">
          <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ntaxpricemny
            }}</el-button>
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
      <el-table-column prop="desc" :label="$t('default.Desc')">

        <template v-slot="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.desc }}</p>
            <div slot="reference" class="name-wrapper">
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.desc }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 单价审核备注 -->
      <el-table-column prop="price_audit_desc" :label="$t('default.Unit_Price_Audit_Remarks')" width="120">
        <template v-slot="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.price_audit_desc }}</p>
            <div slot="reference" class="name-wrapper">
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.price_audit_desc
                }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>


      <!-- 类型 -->
      <el-table-column prop="type_name" :label="$t('default.Type')" width="70"></el-table-column>

      <!-- 可用 -->
      <el-table-column prop="available_num" :label="$t('default.Available')" width="75"
                       sortable></el-table-column>
      <!-- 在途 -->
      <el-table-column prop="transit_num" :label="$t('default.In_Transit')" width="75" sortable></el-table-column>
      <!-- 安全 -->
      <el-table-column prop="safe_num" :label="$t('default.Security')" width="75" sortable></el-table-column>
    </el-table>
    <br />
    <!-- 送货单 -->

    <el-table :data="deliveryData" border class="table" style="width: 100%">

      <!-- 送货单号 -->
      <el-table-column prop="order_no" :label="$t('default.Delivery_Order_Number')" width="180">

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
    </el-table>
    <!-- 采购入库单 -->
    <el-button v-if="PurchaseInData_show" @click="PurchaseInShow" type="text">{{ $t('default.Purchase_Receipt')
      }}</el-button>
    <br v-if="PurchaseInData_show" />
    <el-table v-if="PurchaseInVisible" :data="PurchaseInData" border class="table" style="width: 100%"
              max-height="550px" show-summary>
      <!-- 单据号 -->
      <el-table-column prop="wi_code" :label="$t('default.Incoming_Batch')" width="120" sortable>
        <template v-slot="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.wi_code }}</p>
            <div slot="reference" class="name-wrapper">
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.wi_code
                }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 物料编码 -->
      <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="105" sortable>
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
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications
                }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 入库数 -->
      <el-table-column prop="in_num" :label="$t('default.Inventory_Number')" width="90"
                       sortable></el-table-column>
      <!-- 签字状态 -->
      <el-table-column prop="status_name" :label="$t('default.Signature_Status')" width="105"
                       sortable></el-table-column>


      <!-- 备注 -->
      <el-table-column prop="desc" :label="$t('default.Desc') "></el-table-column>
    </el-table>

  </el-dialog>
</template>


<script>

import WarehousingDetail from '../warehouse/WarehousingDetail.vue';

export default {
  components: {

    WarehousingDetail,

  },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    // data: Object,
    // configList: Object,
    // // // 栏目数据
    // cateList: Array
  },
  data() {
    return {

      permission: sessionStorage.getItem('permission_button'),
      deliveryData: [],
      pur_code: "",
      cost_show: false,
      form: [],
      detailData: [],
      PurchaseInData: [],
      PurchaseInData_show: false,
      DetailVisible: false,
      PurchaseInVisible: false,



    };
  },

  methods: {

    handleWi(wi_code) {
      this.DetailVisible = true;

      this.$nextTick(() => {
        this.$refs.warehousingDetail.dataInitialization(wi_code);
      })
    },
    //初始化数据
    dataInitialization(pur_code) {
      var token = localStorage.getItem("token");
      this.PurchaseInVisible = false;

      if (Array.isArray(this.permission)) {

      } else {
        this.permission = JSON.parse(this.permission);
      }

      let that = this;
      that.pur_code = pur_code;
      that.axios
          .get(
              "/pur/Purchase/Detail?pur_code=" + pur_code + '&token=' + token
          )
          .then(res => {
            // that.fromData = res.data.data.fromData;
            // that.toData = res.data.data.toData;
            // console.info("this id ");
            this.deliveryData = res.delivery_array;
            this.detailData = res.list;
            this.form = res.purchase_order_info;
            this.cost_show = res.cost_show;
            this.PurchaseInData = res.warehousing_item_list;
            this.PurchaseInData_show = res.PurchaseInData_show;


          })
          .catch(err => {
            that.$notify.error({
              title: "错误",
              message: err
            });
            console.log(err);
          });
    },
    PurchaseInShow() {
      if (this.PurchaseInVisible) {
        this.PurchaseInVisible = false;
      } else {
        this.PurchaseInVisible = true;
      }
    },
    Cancel(id) {

      let id_arr = [id];


      this.axios.post('/pur/Purchase/Cancel', {
        token: localStorage.getItem("token"),
        id_arr: id_arr,
        params: this.form

      }).then((res) => {
        this.$message.success(res);
        // this.editVisible = false;
        // this.getData();
        // this.multipleSelection = [];
        // this.$emit('refreshParent');
        this.updateVisible(false);
        this.notifyParent();


      }).catch(() => {
        this.loading = false;
      })


    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    closeDialog() {
      this.$emit("closeDialog"); // 触发 closeDialog 事件
    },
    notifyParent() {
      this.$emit('refreshParent');
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
              // case 13:
            case 14:
            case 15:
            case 16:
              let total = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = Math.floor(total * 1000000) / 1000000;


              break;


            default: '';
          }

        } else {

        }
      });

      return sums;
    },
  },

}
</script>
