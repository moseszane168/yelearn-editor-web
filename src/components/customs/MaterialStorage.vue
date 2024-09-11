<template>
    <!-- 基础表格组件 -->
    <div>
       
        <div class="container">
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
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                
                <el-table-column prop="material_cd" label="物料编码" align="center"></el-table-column>
                <el-table-column prop="material_desc" label="物料名称" width="180"></el-table-column>
                <el-table-column prop="stotage_type_name" label="类型"></el-table-column>
                <el-table-column prop="book_num" label="帐册编号"></el-table-column>
                <el-table-column prop="calc_unit" label="计量单位"></el-table-column>
                <el-table-column prop="storage_cnt" label="入库数"></el-table-column>
                <el-table-column prop="inventory" label="核准清单号"></el-table-column>
                <el-table-column prop="inventory_order_no" label="核准清单项次号"></el-table-column>
                <!-- 报关单号 -->
                <el-table-column prop="hscode" :label="$t('default.Customs_declaration_number')"></el-table-column>
            
                <el-table-column prop="storage_tm" label="入库时间"></el-table-column>
               
            </el-table>
           
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20,50,100, 200, 300, 400]" :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>
       

    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'basetable',

    data() {
        return {
            query: {
                token: '',
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
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
            download_file: '',
            ls_download_file: '',
            loading:false,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            mat_options: [],
            idx: -1,
            id: -1,
         

            options: [],
            size: '',
            cli_options: [],
            el_upload_url: '',
            materialBatchAdd_url: '',
          
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
            this.axios.get('/cust/MaterialStorage/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;

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






        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
        },


        



    },
    // 在钩子函数中调用getData方法
    created() {

        this.materialBatchAdd_url = axios.defaults.baseURL + '/com/ExcelIn/materialMergeSave';

        this.getData();


    }
}
</script>

