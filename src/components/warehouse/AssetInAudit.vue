<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">

                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <el-input v-model="query.wi_code" :placeholder="$t('default.Please_enter_a_keyword')" class="handle-input mr10"></el-input>
                <el-input v-model="query.pur_code" placeholder="采购单号" class="handle-input mr10"></el-input>

                <el-input v-model="query.mat_code" placeholder="物料编码" class="handle-input mr10"></el-input>


                <!-- 部门 -->
                {{ $t('default.Department') }}：<el-select v-model="query.department_id" multiple filterable remote reserve-keyword :placeholder="$t('default.Please_enter_a_keyword')">
                    <el-option v-for="item in department_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 创建时间 -->
                {{ $t('default.Creation_Date') }}：
                <el-date-picker v-model="query.create_time" type="daterange" align="right" unlink-panels
                    :range-separator="$t('default.To')" :start-placeholder="$t('default.Application_Start_Date')"
                    :end-placeholder="$t('default.Application_End_Date')">
                </el-date-picker>

                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
                <br />
                <br />
                <el-button type="primary" class="handle-del mr10" @click="savePass"
                    v-if="permission.includes('AssetInAudit:handleAudit')">{{ $t('default.Signature')}}</el-button><!-- 签字 -->
                <el-button type="primary" class="handle-del mr10" @click="saveFail"
                    v-if="permission.includes('AssetInAudit:handleCancelAudit')">{{ $t('default.Cancel_Signature')}}</el-button><!-- 取消签字 -->
            </div>
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 全部 -->
                    <el-tab-pane :label="$t('default.All')" name="all"></el-tab-pane>
                    <el-tab-pane label="待签字" name="wait"></el-tab-pane>
                    <el-tab-pane label="已签字" name="pass"></el-tab-pane>
                    <!-- <el-tab-pane label="审核驳回" name="refuse"></el-tab-pane> -->
                </el-tabs>
            </div>
            <!-- row-key="id" 
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55" align="center">

                </el-table-column>
                <!-- 序号 -->
                <el-table-column prop="no" :label="$t('default.No')" width="55" align="center"></el-table-column>
                
                <el-table-column prop="wi_code" :label="$t('default.Incoming_Batch')"><!-- 单据号 -->
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handleWi(scope.row.wi_code)"> {{
                            scope.row.wi_code }}</el-button>
                    </template>
                </el-table-column>



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

                <!-- 状态 -->
                <el-table-column prop="status_name" :label="$t('default.Status')"></el-table-column>
                <!-- 收发类别 -->
                            <el-table-column prop="cdispatcherid_name" :label="$t('default.Receiving_and_Sending_Category')"></el-table-column>


                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>


                <!-- 创建时间 --> 
                <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.create_user_name }}
                                {{ scope.row.create_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.create_user_name }}{{
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
                    :current-page="query.pageIndex" :page-sizes="[20, 50, 100, 200, 300, 400]" :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog title='审核' :visible.sync="editVisible" width="70%">

            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="200px">

                <el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.audit_desc"></el-input>

                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">

                <el-button type="primary" @click="savePass">审核通过</el-button>
                <el-button @click="saveFail">审核不通过</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="DetailVisible" append-to-body width="80%" title="入库单">
            <warehousing-detail ref="warehousingDetail"></warehousing-detail>
        </el-dialog>


    </div>
</template>

<script>
import WarehousingDetail from '../warehouse/WarehousingDetail.vue';

export default {
    name: 'basetable',
    components: {
        // quillEditor,
        WarehousingDetail,
        
    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                status: 2,
                token: '',
                create_time: [],
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            orderData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            rules: {},
            value: [],
            list: [],
            loading: false,
            idx: -1,
            id: -1,
            states: [],
            department_options: [],
            activeName: 'wait',
            DetailVisible: false,
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
            this.axios.get('/ware/WarehousingAudit/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
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
        handleAudit() {
            this.editVisible = true;
        },
        handleWi(wi_code) {
            this.DetailVisible = true;

            this.$nextTick(() => {
                this.$refs.warehousingDetail.dataInitialization(wi_code);
            })
        },
        // 审核通过
        savePass() {

            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/ware/WarehousingAudit/auditPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,
                    // multipleSelection:this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.editVisible = false;
                    this.getData();
                    // 为this.tableData新增属性
                    this.$set(this.tableData, this.idx, this.form);
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
        // 审核不通过
        saveFail() {
            // 选项的选项数量
            const length = this.multipleSelection.length;
            // 对选中的选项数量做判断，如果没有选中选项则直接弹出提示框
            if (length) {
                let id_arr = [];
                // 将选中的选项中的数据集合与delList数组连接起来,是为了将需要删除的数据保存起来,在删除选中的数据时，只需删除 delList 中的数据即可，而不需要对整个表格数据重新进行操作。
                this.delList = this.delList.concat(this.multipleSelection);
                // 对选中的选项进行循环，获取其中的name值
                for (let i = 0; i < length; i++) {
                    id_arr.push(this.multipleSelection[i].id);
                }
                this.axios.post('/ware/WarehousingAudit/auditFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form,
                    multipleSelection: this.multipleSelection

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
                    this.editVisible = false;
                    this.getData();
                    this.$set(this.tableData, this.idx, this.form);
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
        handleClick(tab, event) {
            if (this.activeName == 'wait') {
                this.query.status = 2
            } else if (this.activeName == 'pass') {
                this.query.status = 1
            }  else if (this.activeName == 'all') {
                this.query.status = ''
            }

            // 重新获取数据
            this.getData();

        }


    },
    // 在钩子函数中调用getData方法
    created() {


        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        this.query.create_time = [start, end];

        this.permission = JSON.parse(this.permission);
        this.getData();
        this.getDepartment();

    }
}
</script>
