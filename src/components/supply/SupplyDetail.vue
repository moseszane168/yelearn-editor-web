<template>
    <el-container>
        <el-header height="300">
            <el-descriptions>
                <!-- 客商名称 -->
                <el-descriptions-item :label="$t('default.Merchant_Name')">{{ form.name }}</el-descriptions-item>
                <!-- 简称 -->
                <el-descriptions-item :label="$t('default.Abbreviation')">{{ form.code }}</el-descriptions-item>
                <!-- 客商编码 -->
                <el-descriptions-item :label="$t('default.Merchant_Code')">{{ form.local_code }}</el-descriptions-item>
                <!-- 地区分类编码 -->
                <el-descriptions-item :label="$t('default.Regional_classification_code')">{{ form.pk_areacl }}</el-descriptions-item>
                <!-- 联系人 -->
                <el-descriptions-item :label="$t('default.Contact_Person')">{{ form.contacts_user }}</el-descriptions-item>
                <!-- 电话 -->
                <el-descriptions-item :label="$t('default.Phone_number')">{{ form.tel }}</el-descriptions-item>
                <!-- 手机 -->
                <el-descriptions-item :label="$t('default.Mobile_phone')">{{ form.phone }}</el-descriptions-item>
                <!-- 邮箱 -->
                <el-descriptions-item :label="$t('default.Email')">{{ form.email }}</el-descriptions-item>
                <!-- 地址 -->
                <el-descriptions-item :label="$t('default.Address')">{{ form.address }}</el-descriptions-item>
                <!-- 币种 -->
                <el-descriptions-item :label="$t('default.Currency')">{{ form.currtypecode }}</el-descriptions-item>
                <!-- 物料类型 -->
                <el-descriptions-item :label="$t('default.Material_Type')">{{ form.material_type }}</el-descriptions-item>
                <!-- 付款方式 -->
                <el-descriptions-item :label="$t('default.Payment_Method')">{{ form.payment_method }}</el-descriptions-item>
                <!-- 交货周期 -->
                <el-descriptions-item :label="$t('default.Delivery_cycle')">{{ form.lead_time }}</el-descriptions-item>
                <!-- 经营范围 -->
                <el-descriptions-item :label="$t('default.Business_Scope')">{{ form.business_scope }}</el-descriptions-item>
            </el-descriptions>
        </el-header>

        <el-main>
            <!-- 营业执照 -->
           营业执照:
              <div class="preview-img" v-if="form.license_url">
<!--                <el-image
                    :src="form.license_url"
                    fit="cover"
                    :preview-src-list="licenseList"
                    style="width: 100px; height: 100px">
                </el-image>-->
                <!-- 查阅 -->
                <span style="color: #409EFF;" v-if="form.license_url"
                      @click="downloadFile(form.license_url)">
                    {{ form.license_url }}</span>
              </div>
              <div v-else>
                <!-- 无图 -->
                {{ $t('default.No_Picture') }}
              </div>
        </el-main>

      <el-main>
        <!-- 开票资料 -->
        开票资料:
        <div v-if="form.invoicing_information_url">
<!--          <el-dialog title="PDF 文件" :visible.sync="dialogVisible" width="80%" >
            <iframe
                :src="form.invoicing_information_url"
                style="width: 100%; height: 500px;"
                frameborder="0">
            </iframe>
          </el-dialog>
          <el-button @click="dialogVisible = true">{{ form.invoicing_information_url }}</el-button>-->
          <span style="color: #409EFF;" v-if="form.invoicing_information_url"
                @click="downloadFile(form.invoicing_information_url)">
                    {{ form.invoicing_information_url }}</span>
        </div>
        <div v-else>
          <!-- 无图 -->
          {{ $t('default.No_Picture') }}
        </div>
      </el-main>
      <el-main>
        <!-- 合同 -->
        合同:
        <div class="preview-img" v-if="contractList !=''">
<!--          <el-image
              v-for="(imageUrl, index) in contractList"
              :key="index"
              :src="imageUrl"
              fit="cover"
              :preview-src-list="contractList"
              style="width: 100px; height: 100px; margin: 10px;">
          </el-image>-->
          <div v-for="(contract_url, index) in contractList" class="contractList">
            <span style="color: #409EFF;" v-if="contract_url"
                  @click="downloadFile(contract_url)">
                    {{ contract_url }}</span>
          </div>
        </div>
        <div v-else>
          <!-- 无图 -->
          {{ $t('default.No_Picture') }}
        </div>
      </el-main>
    </el-container>
</template>
<script>


import axios from "axios";

export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            sub_code: "",
            form: [],
            licenseList: [],
            contractList:[],
        };
    },
    mounted() {},
    methods: {
        downloadFile(fileUrl) {
          window.open(fileUrl);
        },
        //初始化数据
        dataInitialization(sub_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.sub_code = sub_code;
            that.axios
                .get(
                    "/infor/supply/getSupplyDetail?sup_code=" + sub_code + '&token=' + token
                )
                .then(res => {
                    this.form = res;
                    this.licenseList = [res.license_url];
                    this.contractList = res.contract_urls;
                })
                .catch(err => {
                    that.$notify.error({
                        title: "错误",
                        message: err
                    });
                    console.log(err);
                });
        },
    }
}
</script>

<style>
.contractList {
  margin-bottom: 30px; /* 或者使用 padding-bottom，取决于你的布局需求 */
}
</style>
