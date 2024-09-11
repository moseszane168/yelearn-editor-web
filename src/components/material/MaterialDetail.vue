<template>
    <el-container>
        <el-header height="300">
            <el-descriptions>
                <!-- 物料编码 -->
                <el-descriptions-item :label="$t('default.Material_Code')">{{ form.mat_code }}</el-descriptions-item>
                <!-- 物料名称 -->
                <el-descriptions-item :label="$t('default.Material_Name')">{{ form.name }}</el-descriptions-item>
                <!-- 型号 -->
                <el-descriptions-item :label="$t('default.Model')">{{ form.model }}</el-descriptions-item>
                <!-- 规格 -->
                <el-descriptions-item :label="$t('default.Specification')">{{ form.specifications }}</el-descriptions-item>
                <!-- 分类 -->
                <el-descriptions-item :label="$t('default.Category')">{{ form.c_name }}</el-descriptions-item>
                <!-- 单位 -->
                <el-descriptions-item :label="$t('default.Unit')">{{ form.unit }}</el-descriptions-item>
                <!-- 安全库存 -->
                <el-descriptions-item :label="$t('default.Safety_Stock')">{{ form.safe_num }}</el-descriptions-item>
                <!-- 工治具 -->
                <el-descriptions-item :label="$t('default.Jig')">{{ form.tools_name }}</el-descriptions-item>
                <!-- 丝印 -->
                <el-descriptions-item :label="$t('default.Silkscreen')">{{ form.silk }}</el-descriptions-item>
                <!-- 采购单价 -->
                <el-descriptions-item v-if="cost_show" :label="$t('default.Unit_Price')">{{ form.cost }}</el-descriptions-item>
                <!-- 耗料比 -->
                <el-descriptions-item :label="$t('default.Consumption_Ratio')">{{ form.consumption_ratio }}</el-descriptions-item>
                <!-- 保质期 -->
                <el-descriptions-item :label="$t('default.Shelf_life')">{{ form.quality_day }}天</el-descriptions-item>
                <!-- 图片 -->
                <el-descriptions-item :label="$t('default.Picture')">
                    <div v-if=form.picture>
                        <el-image class="table-td-thumb" :src="form.picture_arr[0]"
                            :preview-src-list="form.picture_arr"></el-image>
                    </div>
                    <div v-else>
                        <!-- 无图 -->
                        {{ $t('default.No_Picture') }}
                    </div>

                </el-descriptions-item>

                <!-- 描述 -->
                <el-descriptions-item :label="$t('default.Descripción')">{{ form.desc }}</el-descriptions-item>
                <!-- 备注 -->
                <el-descriptions-item :label="$t('default.Desc')">{{ form.note }}</el-descriptions-item>
                <!-- 创建人 -->
                <el-descriptions-item :label="$t('default.Creator')">{{ form.create_user_name }}</el-descriptions-item>
                <!-- 更新人 -->
                <el-descriptions-item :label="$t('default.Updated_by')">{{ form.update_user_name }}</el-descriptions-item>
                <!-- 创建时间 -->
                <el-descriptions-item :label="$t('default.Creation_time')">{{ form.create_time }}</el-descriptions-item>
                <!-- 更新时间 -->
                <el-descriptions-item :label="$t('default.Update_Time')">{{ form.update_time }}</el-descriptions-item>
                <!-- 使用机型 -->
                <el-descriptions-item :label="$t('default.Use_Model')">
                    <el-tag v-for="item in material_model_arr" type="info">{{ item.name }}</el-tag>
                </el-descriptions-item>
                <!-- 替代料 -->
                <el-descriptions-item :label="$t('default.Substitute')">
                    <el-tag v-for="item in material_replace_arr" type="info">{{ item.name }}</el-tag>
                </el-descriptions-item>
                <!-- 库位 -->
                <el-descriptions-item :label="$t('default.Location')">
                    <el-tag v-for="item in mat_location_arr" type="info">{{ item }}</el-tag>
                </el-descriptions-item>
            </el-descriptions>

        </el-header>
        <el-main>
            <!-- 库存 -->
            <el-descriptions class="margin-top" :title="$t('default.Inventory')" :column="3" border>

                <el-descriptions-item>
                    <template slot="label">
                        <!-- 可用 -->
                        {{ $t('default.Available') }}
                    </template>
                    {{ inventory.available_num }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <!-- 在途 -->
                        {{ $t('default.In_Transit') }}
                    </template>
                    {{ inventory.transit_num }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <!-- 冻结 -->
                        {{ $t('default.Frozen') }}
                    </template>
                    {{ inventory.freeze_num }}
                </el-descriptions-item>

            </el-descriptions>

        </el-main>
        <el-main>
            <el-table :data="inventory_ware_arr" border class="table" style="width: 100%">


                <!-- 仓库 -->
                <el-table-column prop="ware_name" :label="$t('default.Warehouse')">
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
                <el-table-column prop="real_num" :label="$t('default.Inventory')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.real_num }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.real_num
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

            </el-table>
        </el-main>

        <el-main>
            <el-table :data="client_code_list" border class="table" style="width: 100%">

                <!-- 公司 -->
                <el-table-column prop="cli_name" :label="$t('default.Company')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.cli_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.cli_name
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 客户编码 -->
                <el-table-column prop="code" :label="$t('default.Customer_Code')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.code }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.code }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

            </el-table>
        </el-main>
        <el-main>
            <el-table :data="replace_ware_arr" border class="table" style="width: 100%">
                <!-- 替换料 -->
                <el-table-column prop="name" :label="$t('default.Substitute')">
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
                <!-- 仓库 -->
                <el-table-column prop="ware_name" :label="$t('default.Warehouse')">
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
                <el-table-column prop="real_num" :label="$t('default.Inventory')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.real_num }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.real_num
                                    }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

            </el-table>
        </el-main>

    </el-container>
</template>
<script>


export default {
    components: {
        
    },
    data() {
        return {

            // permission: sessionStorage.getItem('permission_button'),

            deliveryData: [],
            mat_code: "",
            cost_show: false,
            form: [],
            // detailData: [],
            inventory_ware_arr: [],
            client_code_list: [],
            material_replace_arr: [],
            material_model_arr: [],
            mat_location_arr: [],
            inventory: [],
            replace_ware_arr: [],



        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });
    },
    methods: {


        //初始化数据
        dataInitialization(mat_code) {
            var token = localStorage.getItem("token");
            let that = this;
            that.mat_code = mat_code;
            that.axios
                .get(
                    "/infor/material/Detail?mat_code=" + mat_code + '&token=' + token
                )
                .then(res => {


                    // this.detailData = res.list;
                    this.form = res.info;
                    this.cost_show = res.cost_show;
                    this.inventory_ware_arr = res.inventory_ware_arr;
                    this.client_code_list = res.client_code_list;
                    this.material_replace_arr = res.material_replace_arr;
                    this.material_model_arr = res.material_model_arr;
                    this.mat_location_arr = res.mat_location_arr;
                    this.inventory = res.inventory;
                    this.replace_ware_arr = res.replace_ware_arr;



                    // console.info(res);
                    // that.$notify({
                    //     title: "成功",
                    //     message: "--",
                    //     type: "success"
                    // });
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
    // created() {

    // this.getData();
    // this.dataInitialization();


    // }
}
</script>
