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
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                    </el-option>
                </el-select>
                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote reserve-keyword
                    :placeholder="$t('default.Please_enter_a_keyword')">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 创建时间 v-show="false" -->
                {{ $t('default.Creation_Date') }}：
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>

                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />

                <el-button type="primary" class="handle-del mr10" v-if="permission.includes('Apply:handleadd')"
                    @click="handleadd">{{ $t('default.Demand_Request') }}</el-button>
                    <!-- 需求申请 -->
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange" max-height="550px">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                <!-- 部门 -->
                <el-table-column prop="department_name" :label="$t('default.Department')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.department_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.department_name }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" sortable width="105">
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
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
                    <template v-slot="scope">

                        <el-button type="text" @click="handleMaterialDetail(scope.row.mat_code)"> {{ scope.row.mat_name }}
                        </el-button>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{
                    scope.row.specifications
                }}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 建议 -->
                <el-table-column prop="plan_num" :label="$t('default.Recommended')" width="75" sortable></el-table-column>


                <!-- 可用 -->
                <el-table-column prop="available_num" :label="$t('default.Available')" width="75" sortable></el-table-column>
                <!-- 部门可用 -->
                <el-table-column prop="real_num" :label="$t('default.Available_for_department')"  width="110" sortable></el-table-column>
                <!-- 在途 -->
                <el-table-column prop="transit_num" :label="$t('default.In_Transit')" width="75" sortable></el-table-column>
                <!-- 安全 -->
                <el-table-column prop="safe_num" :label="$t('default.Security')" width="75" sortable></el-table-column>
                <!-- 单价 -->
                <el-table-column v-if=cost_show prop="cost" :label="$t('default.Cost')" width="75" sortable></el-table-column>






                


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


            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]"
                    :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>
        <el-dialog :title=dialogName :visible.sync="editVisible" width="100%" :before-close="handleClose">

            <el-form ref="form" :rules="rules" :model="form" label-width="200px">
                <!-- 部门 -->
                    <el-form-item :label="$t('default.Department')" prop="department_id">
                    <el-select v-model="form.department_id" @change="department_change()" placeholder="空值默认为用户当前部门" transfer="true" :popper-append-to-body="false">
                        <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('default.Desc')">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                

            </el-form>

           
            <el-button v-if="isedit" type="primary" @click="getInventoryByMaterial">{{ $t('default.Inventory_Enquiry') }}</el-button><!-- 库存查询 -->
         


            <el-table :data="applyDate" style="width: 100%">

                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55"></el-table-column>

                <!-- 部门 -->
                <el-table-column prop="department_list" :label="$t('default.Department')">
                    <template slot-scope="scope">
                       <el-select v-model="scope.row.department_id" placeholder="空值默认为用户当前部门"
                                  popper-class="messageIndex"
                                  transfer="true" :popper-append-to-body="false">
                            <el-option v-for="item in department_options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" width="180">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.mat_code" filterable remote reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')"
                            :remote-method="remoteMethod" :loading="loading" @change="getInventoryByMaterial()"
                            popper-class="messageIndex" transfer="true" :popper-append-to-body="false">
                            <el-option v-for="item in options" :key="item.mat_code" :label="item.mat_code" :value="item.mat_code">
                                <span style="float: left">{{ item.mat_code }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                            </el-option>
                        </el-select>

                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
                    <template v-slot="scope">
                        <el-button type="text" @click="handleMaterialDetail(scope.row.mat_code)"> {{ scope.row.mat_name }}
                        </el-button>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">
                                  {{ scope.row.specifications }}
                                </el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 申请量 -->
                <el-table-column prop="apply_num" :label="$t('default.Requested_quantity')" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.apply_num"></el-input>
                    </template>
                </el-table-column>
                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.desc"></el-input>
                    </template>
                </el-table-column>

                <!-- 可用 -->
                <el-table-column prop="available_num" :label="$t('default.Available')"></el-table-column>
                <!-- 本部门可用 -->
                <!-- 本部门可用 -->
                <el-table-column prop="real_num" :label="$t('default.Available_in_this_department')"></el-table-column>
                <!-- real_num -->
                <!-- 在途 -->
                <el-table-column prop="transit_num" :label="$t('default.In_Transit')"></el-table-column>
                <!-- 操作 -->
                            <el-table-column prop="operate" :label="$t('default.Action')">
                    <template slot-scope="scope">

                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDeleteLine(scope.$index, scope.row)">{{ $t('default.Delete') }}
                                    </el-button><!-- 删除 -->
                    </template>
                </el-table-column>

            </el-table>

            <span v-if="error" style="color: red;font-size: 16px;">{{ error }}</span>
            

            <span slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="editVisible = false">{{ $t('default.Cancel') }}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" :disabled=checkSubmit @click="saveEdit">{{ $t('default.Confirm') }}</el-button>
            </span>
        </el-dialog>




        <!-- 物料 -->
        <el-dialog :visible.sync="MaterialDetailVisible" append-to-body width="70%" :title="$t('default.Material')">
            <material-detail ref="materialDetail"></material-detail>
        </el-dialog>

    </div>
</template>

<script>
import axios from 'axios'

import MaterialDetail from '../material/MaterialDetail.vue';
import Vue from 'vue';

export default {
    name: 'basetable',
    components: {

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
            mat_options:[],
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
            checkSubmit:false,
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

            this.query.token = localStorage.getItem("token");
            this.axios.get('/plan/Preparation/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                // this.download_file = res.download_file;
                // this.cost_show = res.cost_show
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
                let apm_code = '';
                for (let i = 0; i < length; i++) {
                    apm_code = this.multipleSelection[i].apm_code;
                }
                this.SelectOneVisible = true;
                let nextdata = {
                    apm_code: apm_code
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
        handleClose(done) {
            // 确认关闭？
            this.$confirm(this.$t('default.Confirm_to_close'))
                .then(_ => {
                    done();
                })
                .catch(_ => { });
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
        // 列表导出
        handleExport() {
            this.axios.post('/plan/PlanApply/handleExport1', {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },
        handleSelectedExport() {
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let apm_code_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                // this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    apm_code_arr.push(this.multipleSelection[i].apm_code);
                }
                this.query.apm_code = apm_code_arr;
                this.axios.post('/plan/PlanApply/handleExport1', {
                    token: localStorage.getItem("token"),
                    params: this.query
                }).then((res) => {
                    window.open(res);
                }).catch(() => {
                    this.loading = false;
                })
            }
            else {
                // 未选中选项！
                this.$message.error(this.$t('default.Unchecked_option'));
            }


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
        handleApply(apm_code) {
            this.detailVisible = true;
            this.$nextTick(() => {
                this.$refs.apply.dataInitialization(apm_code);
                // this.$refs.apply.tableRowClassName();
            })
        },

        // 新增
        handleadd() {
            this.error = '';
            this.applyDate = [];
            this.isedit = true;
            var token = localStorage.getItem("token");
            const length = this.multipleSelection.length;
            this.error = '';
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                // let mat_code_arr = [];
                for (let i = 0; i < length; i++) {
                    this.applyDate.push(this.multipleSelection[i]);
                }

                // this.form.mat_code_arr = mat_code_arr;
                this.axios.post('/ware/inventory/getInventoryByMaterialArr', {
                    token: localStorage.getItem("token"),
                    params: this.form,
                    applyDate: this.applyDate
                }).then((res) => {
                    this.applyDate = res;
                    this.checkSubmit = false;
                }).catch(() => {
                    this.loading = false;
                })

              // 新增
              this.dialogName = this.$t('default.Add');
              this.editVisible = true;

            }
            else {
                // 未选中选项！
                this.checkSubmit = true;
                this.$message.error(this.$t('default.Unchecked_option'));
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
        // 整单部门
        department_change() {
            this.axios.post('/plan/PlanApply/handleDepartment', {
                token: localStorage.getItem("token"),
                params: this.form,
                applyDate: this.applyDate,
            }).then((res) => {
                this.applyDate = res;
            }).catch(() => {
                this.loading = false;
            })
        },


        handleSuccess(file, fileList, row) {

            if (file.code == 201) {
                this.$message.error(file.msg);
            } else {
                this.applyDate = file.data;
            }


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
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },

        getInventoryByMaterial() {
            this.axios.post('/ware/inventory/getInventoryByMaterialArr', {
                token: localStorage.getItem("token"),
                params: this.form,
                applyDate: this.applyDate
            }).then((res) => {

                this.applyDate = res;


            }).catch(() => {
                this.loading = false;
            })
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
        //增加行
        handleAddLine() {
            if (this.applyDate == undefined) {
                this.applyDate = new Array();
            }
            let obj = {};

            this.applyDate.push(obj);
        },
        //删除行
        handleDeleteLine(index) {
            console.log(index);
            this.applyDate.splice(index, 1)
        },

        // 编辑
        handleEdit(index, row, apm_code) {
            this.error = '';
            this.isedit = false;
            var token = localStorage.getItem("token");
            this.axios.post('/plan/PlanApply/Detail', {
                token: token,
                apm_code: apm_code
            }).then((res) => {


                this.applyDate = res.list;
                // this.form = res.info;
                // 将数据中的总条目数经过判断后赋给data中的pageTotal

            }).catch(() => {
                this.loading = false;
            })


            // 编辑
            this.dialogName = this.$t('default.Edit');
            // 将当前选项索引赋给this.idx
            this.idx = index;
            // 将当前选项这一行的数据赋给this.form
            this.form = JSON.parse(JSON.stringify(row));
            if (this.form.department_id == 0) {
                this.form.department_id = '';
            }
            // 设置弹出编辑框标记为true
            this.editVisible = true;
        },

        // 删除
        // 对表格进行删除操作，根据索引进行选择对应的数据，弹出提示框进行二次确认删除，接收返回的确认结果，如果确认删除，则调用splice方法进行删除
        handleDelete() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {

                this.axios.post('/plan/PlanApply/delete', {
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
        // 保存编辑
        saveEdit() {

            if (typeof (this.form.id) == 'undefined') {
                this.axios.post('/plan/PlanApply/save', {
                    token: localStorage.getItem("token"),
                    params: this.form,
                    applyDate: this.applyDate
                }).then((res) => {
                    if (res.code == '200') {
                        // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                        this.editVisible = false;
                        this.getData();
                    } else {
                        this.applyDate = res.applyDate;
                        this.error = res.msg;
                    }


                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.axios.post('/plan/PlanApply/update', {
                    token: localStorage.getItem("token"),
                    params: this.form,
                    applyDate: this.applyDate
                }).then((res) => {
                    if (res.code == '200') {
                        // 保存成功
                        this.$message.success(this.$t('default.Save_Success'));
                        this.editVisible = false;
                        this.getData();
                    } else {
                        this.applyDate = res.applyDate;
                        this.error = res.msg;
                    }

                }).catch(() => {
                    this.loading = false;
                })
            }

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
        //start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        this.query.create_time = [start, end];
        this.getData();
        this.permission = JSON.parse(this.permission);
        this.getDepartment();
    }
}
</script>

<style>
.custom-width {
  width: 3000px;
}
</style>
