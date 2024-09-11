<template>
  <!-- 修改出库单 -->
  <el-dialog :title="$t('default.Modify_Outbound_Order')" :visible="visible" width="85%" :destroy-on-close="true"
             :lock-scroll="false" @update:visible="updateVisible" :before-close="handleClose">
    <el-form :inline="true" ref="form" :rules="rules" :model="{ form }" size="mini" label-width="80px">
      <!-- 部门 -->
<!--      <el-form-item :label="$t('default.Department')" prop="department_id">-->
<!--        {{ form.department_name }}-->

<!--      </el-form-item>-->
      <el-form-item :label="$t('default.Department')">
        <template v-slot="scope">
          <el-select v-model="form.department_id"  @change="changeIndex()">
            <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

        </template>
      </el-form-item>
      <!-- 仓库 -->
      <el-form-item :label="$t('default.Warehouse')">
        <!-- {{ form.ware_name }} -->
        <el-select filterable v-model="form.ware_id" :placeholder="$t('default.Please_select')">
          <el-option v-for="item in ware_options" :key="item.ware_id" :label="item.name"
                     :value="item.ware_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('default.Document_date')">
        <el-date-picker v-model="form.dbilldate_w" type="date" :placeholder="$t('default.Select_Date')">
        </el-date-picker>
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
              <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.model }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <!-- 出库数 -->
      <el-table-column prop="out_num" :label="$t('default.Number_of_outgoing_goods')">
        <template v-slot="scope">
          <el-input v-model.number="scope.row.out_num"></el-input>
        </template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column prop="desc" :label="$t('default.Desc')">
        <template v-slot="scope">
          <el-input v-model.number="scope.row.desc"></el-input>
        </template>
      </el-table-column>
      <!-- 库位 -->
      <el-table-column :label="$t('default.Location')" width="120">
        <template v-slot="scope">
          <el-select v-model="scope.row.loc_id" remote filterable allow-create default-first-option
                     :placeholder="$t('default.Please_select')" :remote-method="remoteLocation">
            <el-option v-for="item in location_options" :key="item.id" :label="item.p_name"
                       :value="item.id">
            </el-option>
          </el-select>
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
    <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
            <el-button @click="updateVisible(false)">{{ $t('default.Cancel') }}</el-button>
      <!-- 取消 -->
        </span>
  </el-dialog>
</template>


<script>

import Vue from 'vue';
export default {

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

      form: {},

      deliveryData: [],
      pur_code: "",
      cost_show: false,
      // visible: false,
      form: [],
      detailData: [],
      purchaseVisible: false,
      rules: {

      },
      department_options: [],
      ware_options: [],

      BondedWarehousingType_options: [],
      bonded_show: false,
      orderData: [],
      location_options: [],
      mat_options: [],
      loading: false,

    };
  },
  mounted() {
    // this.list = this.states.map(item => {
    //     return { value: `${item}`, label: `${item}` };
    // });

  },
  methods: {
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
    handleClose(done) {
      // 确认关闭？
      this.$confirm(this.$t('default.Confirm_to_close'))
          .then(_ => {
            done();
          })
          .catch(_ => { });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    remoteMethod(query) {
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
    handleOrderSelectionChange(val) {
      this.multipleOrderSelection = val;
    },
    // 其他入库保存
    handleSave() {
      this.form.dbilldate = Vue.prototype.FormatTime(this.form.dbilldate_w);
      this.axios.post('/ware/Outbound/update', {
        token: localStorage.getItem("token"),
        params: this.form,
        orderData: this.orderData
      }).then((res) => {
        // 修改成功
        this.$message.success(this.$t('default.Modify_Succeed'));
        this.updateVisible(false);
        // this.$emit('done');

      }).catch(() => {
        this.loading = false;
      })
    },
    closeDialog() {
      this.$emit("closeDialog"); // 触发 closeDialog 事件
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
    //获取部门下的仓库
    changeIndex() {
      this.axios.post('/ware/warehouse/ware_list_base_department', {
        token: localStorage.getItem("token"),
        params: this.form
      }).then((res) => {
        this.ware_options = res;
      }).catch(() => {
        this.loading = false;
      })
      this.$forceUpdate();
    },

    syncHg() {
      this.axios.post('/ware/Transfer/sync', {
        token: localStorage.getItem("token"),
        orderData: this.orderData,
        OrderSelection: this.multipleOrderSelection
      }).then((res) => {
        this.orderData = res;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 出库收发存
    getOutSendReceiving() {
      var token = localStorage.getItem("token");
      this.axios.post('/ware/SendReceiving/OutSendReceiving', {
        token: token
      }).then((res) => {
        this.send_receiving_options = res;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 根据部门获取仓库
    UpdateWare(department_id) {
      this.axios.post('/ware/warehouse/UpdateWare', {
        token: localStorage.getItem("token"),
        department_id: department_id
      }).then((res) => {
        this.ware_options = res;

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
        this.orderData = res.orderData;
        this.location_options = res.location_options;
        this.bonded_show = res.bonded_show;
      }).catch(() => {
        this.loading = false;
      })

    },


    //初始化数据
    dataInitialization(ob_code) {
      var token = localStorage.getItem("token");
      let that = this;
      that.ob_code = ob_code;
      this.updateVisible(true);
      that.axios
          .get(
              "/ware/Outbound/Detail?ob_code=" + ob_code + '&token=' + token
          )
          .then(res => {
            this.orderData = res.list;
            this.form = res.info;

            this.location_options = res.location_arr;
            this.ware_options = res.info.department_ware_list;
          })
          .catch(err => {
            that.$notify.error({
              title: "错误",
              message: err
            });
            console.log(err);
          });


    },
  },
  // 在钩子函数中调用getData方法
  created() {

    this.getDepartment();


  }
}
</script>
