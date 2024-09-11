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

                <!-- 搜索按钮 type="primary" 设置风格为主要按钮 -->
                <!-- 搜索 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('default.Search') }}</el-button>
                <!-- 清空 -->
                <el-button type="primary" @click="handleSearchClear">{{ $t('default.Clear') }}</el-button>

                <br /><br />
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="PictureUpdate"
                    v-if="permission.includes('material:PictureUpdate')">{{ $t('default.Image_Upload') }}</el-button><!-- 图片上传 -->
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="handleCancel"
                    v-if="permission.includes('material:handleCancel')">{{ $t('default.Delete') }}</el-button><!-- 删除 -->
            </div>



            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <!-- type="selection" 设置多选框 如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮-->
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <!-- 物料编码 -->
                <el-table-column prop="mat_code" :label="$t('default.Material_Code')" align="center"></el-table-column>
                <!-- 图片名称 -->
                <el-table-column prop="name" :label="$t('default.Picture_Name')" align="center"></el-table-column>


                <!-- 图片 -->
                            <el-table-column prop="picture" :label="$t('default.Picture')" align="center">
                    <template v-slot="scope">
                        <el-image class="table-td-thumb" :src="scope.row.picture_url"
                            :preview-src-list="[scope.row.picture_url]"></el-image>
                    </template>

                </el-table-column>
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
                <!-- background：是否添加背景色。layout：组件布局，子组件名用逗号分隔。current-page：当前页数。page-size：每页显示条目个数。total：总条目数。current-change：currentPage 改变时会触发  -->
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <picture-update ref="pictureUpdate"  :visible.sync="PictureUpdateVisible"
            @done="reload"></picture-update>

    </div>
</template>

<script>
import PictureUpdate from '../material/PictureUpdate.vue';

export default {
    name: 'basetable',
    components: {
        PictureUpdate,
        
    },
    data() {
        return {
            permission: sessionStorage.getItem('permission_button'),
            query: {
                audit_status: 1,
                token: '',
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            PictureUpdateVisible:false,
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
            mat_options: [],
            loading: false,
        };
    },
    methods: {
        // 获取easy-mock的模拟数据，将返回的数据进行存放处理
        getData() {

            // console.log(localStorage.getItem("token"));
            this.query.token = localStorage.getItem("token");
            // return;
            this.axios.get('/infor/MaterialPicture/index', {
                // headers: {
                //     Authorization: "Bearer " + localStorage.getItem("token"),
                // },
                // headers:localStorage.getItem("token"),
                params: this.query
            }).then((res) => {


                this.tableData = res.list.data;

                // 将数据中的总条目数经过判断后赋给data中的pageTotal
                this.pageTotal = res.list.total || 0;

            }).catch(() => {
                this.loading = false;
            })

        },
        PictureUpdate() {
            this.PictureUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.pictureUpdate.dataInitialization();
               
            })
        },
        reload() {
            this.$refs.table.reload({ where: this.where });
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
        handleCancel() {
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
                this.axios.post('/infor/MaterialPicture/delete', {
                    token: localStorage.getItem("token"),
                    id_arr: id_arr,


                }).then((res) => {

                    // 弹出成功提示框
                    this.$message.success(res);
                    // this.editVisible = false;
                    this.getData();
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


        // 页面改变,分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
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


    },
    // 在钩子函数中调用getData方法
    created() {
        this.getData();
        this.permission = JSON.parse(this.permission);
    }
}
</script>


