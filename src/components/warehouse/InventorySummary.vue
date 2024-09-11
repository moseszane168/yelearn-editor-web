<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <!-- 物料编码 -->
                {{$t('default.Material_Code')}}:
                <el-select v-model="query.mat_code" multiple filterable remote reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')"
                    :remote-method="remoteMaterial" :loading="loading">
                    <el-option v-for="item in mat_options" :key="item.mat_code" :label="item.mat_code"
                        :value="item.mat_code">
                        <span style="float: left">{{ item.mat_code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{
                            item.label }}</span>
                    </el-option>
                </el-select>
                <!--部门-->
                {{ $t('default.Department') }}：
                <el-select v-model="query.department_id" multiple filterable remote
                                                          :placeholder="$t('default.Please_enter_a_keyword')" @change="getWare()">
                <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
                </el-select>
                <!-- 仓库 -->
                {{ $t('default.Warehouse') }}：
                <el-select filterable v-model="query.ware_id" multiple :placeholder="$t('default.Please_select')">
                    <el-option v-for="item in query_ware_options" :key="item.ware_id" :label="item.name" :value="item.ware_id">
                    </el-option>
                </el-select>
                <!-- 创建时间 -->
                {{ $t('default.Creation_time') }}：<el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')" :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>

                <br />
                <br />

                <el-button type="primary" class="handle-del mr10" @click="handleExport">{{ $t('default.Export') }}</el-button><!-- 导出 -->

            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 料库 -->
                <el-table-column v-if="false" prop="mat_code_ware" :label="$t('default.No')" width="55"></el-table-column>
                <!-- 仓库 -->
                <el-table-column prop="ware_name" :label="$t('default.Warehouse')">
                  <template v-slot="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>{{ scope.row.ware_name }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.ware_name }}</el-button>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_code }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.mat_name }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 型号 -->
                <el-table-column prop="model" :label="$t('default.Model')" >
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
                <el-table-column prop="specifications" :label="$t('default.Specification')" >
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
                 <!-- 库存 -->
<!--                <el-table-column prop="real_num" :label="$t('default.Inventory')"></el-table-column> &ndash;&gt;-->
                <el-table-column prop="start_inventory" label="期初结存" width="105" sortable></el-table-column>
                <el-table-column prop="day_in_inventory_sum" label="本期收入" width="105" sortable></el-table-column>
                <el-table-column prop="day_out_inventory_sum" label="本期发出" width="105" sortable></el-table-column>
                <el-table-column prop="end_inventory" label="期末结存" width="105" sortable></el-table-column>
                <!-- 单价 -->
<!--                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')" width="75" sortable></el-table-column>-->
<!--                <el-table-column v-if=cost_show prop="sum_cost" label="结存金额" width="105" sortable></el-table-column>-->
            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]" :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'basetable',

    data() {
        return {
            query: {

                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            form: {},
            value: [],
            list: [],
            loading: false,
            image_path: '',
            idx: -1,
            id: -1,
            states: [],
            query_ware_options: [],
            department_options: [],
            cost_show: false,
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
            const create_time_1 = create_time[0];
            const create_time_2 = create_time[1];
           
            if(create_time_1){
                this.query.create_time1= Vue.prototype.FormatTime(create_time_1);
            }
            if(create_time_2){
                this.query.create_time2= Vue.prototype.FormatTime(create_time_2);
            }
           

            this.query.token = localStorage.getItem("token");
            this.axios.get('/ware/InventorySummary/index', {
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

        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                name: '',
                pageIndex: 1,
                pageSize: 20,
                create_time:[],
            }
        },
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
                this.options = [];
            }
        },

        // 搜索,触发搜索按钮
        handleSearch() {
            // 为this.query新增属性，并更新视图
            this.$set(this.query, 'pageIndex', 1);
            // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
            this.getData();
        },
        // 多选,对表格中的复选框列表做监听，当选择项发生变化则触发handleSelectionChange方法，val为选中数据的集合，通过this.multipleSelection.
        // prop字段取得每一个选项的值，prop字段就是表格子项的prop值。this.multipleSelection.length为选择了多少项
        handleSelectionChange(val) {
            // val表示当前选中的行数据组成的数组
            //选中数据的集合赋给 this.mutipleSelection
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
      // 获取部门
      getDepartment() {
        var token = localStorage.getItem("token");
        this.axios.post('/index/Department/department_data', {
          token: token
        }).then((res) => {
          this.department_options = res;
        }).catch(() => {
          this.loading = false;
        })
      },
         // 获取仓库
      getWare() {
        this.axios.post('/ware/warehouse/warelist_data', {
          token: localStorage.getItem("token"),
          params: this.query
        }).then((res) => {
          this.query_ware_options = res;
        }).catch(() => {
          this.loading = false;
        })
      },
      // 列表导出
      handleExport() {
        const length = this.multipleSelection.length;
        this.error = '';
        // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
        if (length) {
          let mat_code_ware = [];
          // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
          // this.delList = this.delList.concat(this.multipleSelection);
          for (let i = 0; i < length; i++) {
            mat_code_ware.push(this.multipleSelection[i].mat_code_ware);
          }
          this.query.mat_code_ware = mat_code_ware;

        }
        this.query.token = localStorage.getItem("token");
        this.axios.post('/ware/InventorySummary/handleExport1', {
          token: localStorage.getItem("token"),
          params: this.query
        }).then((res) => {
          window.open(res);
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
        this.getData();
        this.getWare();
        this.getDepartment();
    }
}
</script>
