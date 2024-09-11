<template>
    <!-- 基础表格组件 -->
    <div>

        <div class="container">
            <!-- 操作栏 -->
            <div class="handle-box">


                <!-- 搜索输入框 双向绑定数据，实时搜索 -->
                <el-input v-model="query.mat_code" placeholder="物料编码" class="handle-input mr10"></el-input>
                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>
            </div>

            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 待审核 -->
                    <el-tab-pane :label="$t('default.Pending_Audit')" name="wait">
                        <el-button type="primary" class="handle-del mr10" @click="handleAudit"
                            v-if="permission.includes('SafeNumAudit:handleAudit')">{{ $t('default.Audit') }}</el-button><!-- 审核 -->
                        <br />
                        <br />
                    </el-tab-pane>
                    <el-tab-pane label="审核通过" name="pass"></el-tab-pane>
                    <el-tab-pane label="审核驳回" name="refuse"></el-tab-pane>
                    <!-- 全部 -->
                    <el-tab-pane :label="$t('default.All')" name="all"></el-tab-pane>
                </el-tabs>
            </div>


            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center"></el-table-column>

                <!-- 物料名称 -->
                <el-table-column prop="mat_name" :label="$t('default.Material_Name')" >
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.mat_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{scope.row.mat_name }}</el-button>                            </div>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.specifications}}</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column prop="new_safe_num" label="当前安全库存" width="120" >
                    
                </el-table-column>
                <el-table-column prop="safe_num" label="安全库存">
                    <template v-slot="scope">
                        <el-button type="text" class="handle-del mr10" @click="handleLog(scope.row.mat_code)"> {{
                            scope.row.safe_num }}</el-button>
                    </template>
                </el-table-column>

                <!-- 备注 -->
                <el-table-column prop="desc" :label="$t('default.Desc')" ></el-table-column>

                <el-table-column prop="audit_status_name" label="审核状态"></el-table-column>
                <el-table-column prop="audit_desc" label="审核备注"></el-table-column>
                <el-table-column prop="audit_user_name" label="审核人">

                    <template v-slot="scope">
                        {{ scope.row.audit_user_name }} <br />
                        {{ scope.row.audit_time }}
                    </template>

                </el-table-column>
             
                <!-- 创建时间 --> 
                <el-table-column prop="create_time" :label="$t('default.Creation_time')">
                    <template v-slot="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>{{ scope.row.create_user_name }}
                                {{ scope.row.create_time }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{ scope.row.create_user_name }}{{ scope.row.create_time }}</el-button>
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
                                <el-button type="text" style="color: rgb(39, 36, 36);">{{scope.row.update_user_name }}
{{ scope.row.update_time }}</el-button>

                            </div>
                        </el-popover>

                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页导航 -->
            <div class="pagination">
                <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 title：弹出对话框的标题。visible：是否显示 Dialog，支持 .sync 修饰符 -->
        <!-- title="编辑"  -->
        <el-dialog :title=dialogName :visible.sync="editVisible" width="70%">

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
            <safe-num ref="safeNum"></safe-num>
        </el-dialog>


    </div>
</template>

<script>
import SafeNum from '../material/SafeNumChange.vue';

export default {
    name: 'basetable',
    components: {
        SafeNum,
        
    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                token: '',
                audit_status: 1,
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            dialogName: '审核',
            pageTotal: 0,
            form: {
                name: ''
            },
            rules: {

            },

            idx: -1,
            id: -1,
            activeName: 'wait',
            DetailVisible: false,

        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {
            this.query.token = localStorage.getItem("token");
            this.axios.get('/infor/materialSafeNumAudit/index', {
                params: this.query
            }).then((res) => {
                this.tableData = res.list.data;
                this.pageTotal = res.list.total || 0;
            }).catch(() => {
                this.loading = false;
            })
        },
        handleLog(mat_code) {
            this.DetailVisible = true;
            this.$nextTick(() => {
                this.$refs.safeNum.dataInitialization(mat_code);
            })
        },
        handleClick(tab, event) {

            if (tab._props.label == '待审核') {
                this.query.audit_status = 1
            } else if (tab._props.label == '审核通过') {
                this.query.audit_status = 2
            } else if (tab._props.label == '审核驳回') {
                this.query.audit_status = 3
            } else if (tab._props.label == '全部') {
                this.query.audit_status = ''
            }

            // 重新获取数据
            this.getData();

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
            //选中数据的集合赋给this.mutipleSelection
            this.multipleSelection = val;
        },
        // 批量删除，对选中的选项数量进行判断，如果没有选中选项则弹出提示框，提示未选中选项，如果选中了选项之后将选中的选项全部删除
        handleAudit() {
            this.dialogName = '审核';
            this.editVisible = true;




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
                this.axios.post('/infor/materialSafeNumAudit/auditPass', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
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
                this.axios.post('/infor/materialSafeNumAudit/auditFail', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,
                    params: this.form

                }).then((res) => {
                    console.log(res);
                    // 弹出成功提示框
                    this.$message.success('审核成功');
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
        }




    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        this.permission = JSON.parse(this.permission);
    }
}
</script>



