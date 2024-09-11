<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
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
                <!-- 申请主表编码 -->
                {{ $t('default.Request_Master_Table_Code') }}：
                <el-input v-model="query.ppm_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 申请编码 -->
                {{ $t('default.Application_Code') }}：
                <el-input v-model="query.ap_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10 w150"></el-input>
                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 创建时间 -->
                {{ $t('default.Creation_time') }}：
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')" :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>
                <!-- 创建人 -->
                {{ $t('default.Creator') }}：
                <el-select v-model="query.create_user" filterable multiple remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')" :remote-method="remoteMethodUser" :loading="loading">
                    <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />

               
                <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleDelete')"
                    @click="handleDelete">{{ $t('default.Cancel') }}</el-button>
                    <!-- 取消 -->
              

            </div>


            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- 操作 -->
                <el-table-column :label="$t('default.Action')" width="55">
                    <template v-slot="scope">

                        <el-button type="text" v-if="permission.includes('Apply:handleEdit')"
                            @click="handleEdit(scope.$index, scope.row, scope.row.ppm_code)">{{ $t('default.Edit') }}</el-button><!-- 编辑 -->

                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                
                <el-table-column prop="ppm_code" label="需求单号">
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handleApply(scope.row.ppm_code)"> {{
                    scope.row.ppm_code }}</el-button>
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


                <!-- 预警 -->
                <el-table-column prop="warning" :label="$t('default.Early_warning')">
                    <template v-slot="scope">
                        <div v-if="scope.row.warning == 'success'">
                            <!-- 正常 -->
                            <el-tag type="success">{{ $t('default.Normal') }}</el-tag>
                           
                        </div>
                        <div v-if="scope.row.warning == 'warning'">
                            <!-- 警告 -->
                            <el-tag type="warning">{{ $t('default.Warning') }}</el-tag>
                          
                        </div>
                        <div v-if="scope.row.warning == 'danger'">

                           
                            <el-tag type="danger">{{ $t('default.Dangerous') }}</el-tag>
                          
                        </div>

                    </template>
                </el-table-column> 



                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>


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
     


        <el-dialog :visible.sync="detailVisible" append-to-body width="70%" title="生产需求单">
            <apply ref="apply"></apply>
        </el-dialog>
        
        <!-- 物料 -->
        <el-dialog :visible.sync="MaterialDetailVisible" append-to-body width="70%" :title="$t('default.Material')">
            <material-detail ref="materialDetail"></material-detail>
        </el-dialog>

    </div>
</template>

<script>
import axios from 'axios'
import Apply from '../plan/ProduceApplyDetail.vue';

import MaterialDetail from '../material/MaterialDetail.vue';
import Vue from 'vue';

export default {
    name: 'basetable',
    components: {
        Apply,
        MaterialDetail,
        
    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                token: '',
                create_time: [],
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            applyDate: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            detailVisible: false,
            SelectOneVisible: false,
            MaterialDetailVisible: false,
            isedit: true,
            dialogName: '编辑',
            pageTotal: 0,
            form: {},
            rules: {
                mat_code: [
                    { required: true, message: '请输入物料编码', trigger: 'blur' },
                ],
                apply_num: [
                    { required: true, message: '请输入申请量', trigger: 'blur' },
                ],
            },
            options: [],
            value: [],
            list: [],
            loading: false,
            idx: -1,
            id: -1,
            states: [],
            department_options: [],
            activeName: 'all',
            fileList: [],
            download_file: '',
            planApply_url: '',
            cost_show: false,
            error: '',
            detailData: [],
            user_options: [],
            mat_options:[],
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

            if (create_time) {
              const create_time_1 = create_time[0];
              const create_time_2 = create_time[1];

              if (create_time_1) {
                this.query.create_time1 = Vue.prototype.FormatTime(create_time_1);
              }
              if (create_time_2) {
                this.query.create_time2 = Vue.prototype.FormatTime(create_time_2);
              }
            }

            this.query.token = localStorage.getItem("token");
            this.axios.get('/plan/ProduceApply/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.download_file = res.download_file;
                this.cost_show = res.cost_show
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
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length == 1) {
                let ppm_code = '';
                for (let i = 0; i < length; i++) {
                    ppm_code = this.multipleSelection[i].ppm_code;
                }
                this.SelectOneVisible = true;
                let nextdata = {
                    ppm_code: ppm_code
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
        handleMaterialDetail(mat_code) {
            this.MaterialDetailVisible = true;

            this.$nextTick(() => {
                this.$refs.materialDetail.dataInitialization(mat_code);
            })
        },
        // 列表导出
        handleExport() {
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let ppm_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    ppm_code_arr.push(this.multipleSelection[i].ppm_code);
                }
                this.query.ppm_code = ppm_code_arr;
               
            }


            this.axios.post('/plan/ProduceApply/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
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

        //设置菜单权限
        handleApply(ppm_code) {
            this.detailVisible = true;
            this.$nextTick(() => {
                this.$refs.apply.dataInitialization(ppm_code);
                // this.$refs.apply.tableRowClassName();
            })
        },

        // 新增
        handleadd() {
            this.isedit = true;
            var token = localStorage.getItem("token");
            this.axios.post('/index/Department/all_department', {
                token: token
            }).then((res) => {
                this.department_options = res;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal
            }).catch(() => {
                this.loading = false;
            })
            this.error = '';
            this.applyDate = [];
            // 将当前选项索引赋给this.idx
            this.idx = 0;
            // 将当前选项这一行的数据赋给this.form
            this.form = {};
            // 新增
            this.dialogName = this.$t('default.Add');
            this.editVisible = true;
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
        handleSearchClear() {
            this.query = {
                token: localStorage.getItem("token"),
                name: '',
                pageIndex: 1,
                pageSize: 20,
                create_time: [],
            }
        },
       

        handleSuccess(file, fileList, row) {

            if (file.code == 201) {
                this.$message.error(file.msg);
            } else {
                this.applyDate = file.data;
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

        // 搜索,触发搜索按钮
        handleSearch() {
            // 为this.query新增属性，并更新视图
            this.$set(this.query, 'pageIndex', 1);
            // 响应式更新数据，this.query是需要更新的对象，pageIndex是需要添加或者更新的属性名，1是需要添加或更新的属性值
            this.getData();
        },
        handleSelectionChange(val) {
            // val表示当前选中的行数据组成的数组
            //选中数据的集合赋给 this.mutipleSelection
            this.multipleSelection = val;
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
        

        // 删除
        // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
        handleDelete() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {

                this.axios.post('/plan/ProduceApply/delete', {
                    token: localStorage.getItem("token"),
                    // id_arr: id_arr,
                    params: this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success(res.msg);
                    this.editVisible = false;
                    this.getData();
                    // 为this.tableData新增属性
                    this.$set(this.tableData, this.idx, this.form);
                }).catch(() => {
                    this.loading = false;
                })
                // this.$message.success(`删除了${str}`);

                // console.log(id_arr);
                // 将选中的选项置为空，即不再选中任何一项
                this.multipleSelection = [];
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }
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
        downloadFile(fileUrl) {
            window.open(fileUrl);
        },
      
        remoteMethod(query) {
            if (query !== '') {
                this.axios.post('/infor/material/getMaterialByCodeName', {
                    token: localStorage.getItem("token"),
                    mat_code: query,
                    status: 1,
                }).then((res) => {
                    this.options = res;
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.options = [];
            }
        },


    },
    // 在钩子函数中调用getData方法
    created() {

        this.planApply_url = axios.defaults.baseURL + '/com/ExcelIn/planApply';
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        this.query.create_time = [start, end];
        this.getData();
        this.permission = JSON.parse(this.permission);
        this.getDepartment();
    }
}
</script>
