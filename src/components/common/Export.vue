<!-- 导出 -->
<template>
    <el-dialog :visible.sync="exportFields" width="70%" :before-close="handleClose">
        <template>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedFields" @change="handleCheckedExportFieldsChange">
                <el-checkbox v-for="valueFields in exportFieldsArr" :label="valueFields" :key="valueFields">{{
        valueFields }}</el-checkbox>
            </el-checkbox-group>
        </template>
        <span slot="footer" class="dialog-footer">
            <!-- 取 消 -->
            <el-button @click="exportFields = false">{{ $t('default.Cancel') }}</el-button>
            <!-- 确 定 -->
            <el-button type="primary" @click="handleExport()">{{ $t('default.Confirm') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>


const exportOptions = [];
export default {

    props: {
        // 弹窗是否打开
        visible: Boolean,

    },
    data() {
        return {

            form: {},
            url: '',
            query: [],

            checkedFields: [],
            exportFieldsArr: exportOptions,
            exportFields: false,
            loading: false,
            checkAll: true,
            isIndeterminate: false
        };
    },
    mounted() {

    },
    methods: {

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
        handleCheckedExportFieldsChange(value) {

            let checkedCount = value.length;

            this.checkAll = checkedCount === this.exportFieldsArr.length;

            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedFields.length;

        },

        
        handleCheckAllChange(val) {
            
            this.checkedFields = val ? this.exportFieldsArr : [];
            this.isIndeterminate = false;
        },
        closeDialog() {
            this.$emit("closeDialog"); // 触发 closeDialog 事件
        },

        // 列表导出
        handleExport() {

          

            this.query.checkedFields = this.checkedFields;

            this.query.token = localStorage.getItem("token");
            this.axios.post(this.url, {
                token: localStorage.getItem("token"),
                params: this.query
            }).then((res) => {
                window.open(res);
            }).catch(() => {
                this.loading = false;
            })
        },


        //初始化数据
        dataInitialization(query, exportFields_url, url) {
          
            this.query = query;


            this.url = url;
            this.axios.post(exportFields_url, {
                token: localStorage.getItem("token"),
                params:this.query
            }).then((res) => {
                // 
                this.exportFieldsArr = res;
                this.checkedFields = res;
                this.exportOptions = res;
             
                this.exportFields = true;

            }).catch(() => {
                this.loading = false;
            })

         

        },
    },

}
</script>
