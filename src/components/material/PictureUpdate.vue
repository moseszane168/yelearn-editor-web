<!--  -->
<template>
    <el-dialog title="图片上传" :visible="visible" width="85%" :destroy-on-close="true" :lock-scroll="false"
        @update:visible="updateVisible">

        <el-upload class="upload-demo" drag :action="upload_url" multiple :on-success="handleSuccess">
            <i class="el-icon-upload"></i>
            <!-- 图片命名规则 sku+序号 -->
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">图片命名规则:sku+序号,如27042510_01.jpg,27042510_11.png</div>
            <!-- <div class="el-upload__tip" slot="tip"><!-- 只能上传jpg/png文件，且不超过500kb -->
                                {{ $t('default.Only_jpg_png_files_can_be_uploaded_and_it_should_not_exceed_500kb') }}
                            </div> -->
        </el-upload>
        

       

    </el-dialog>
</template>


<script>

import PurchaseIn from '../warehouse/PurchaseIn.vue';
import axios from 'axios';

export default {
    components: {
        PurchaseIn,
        
    },
    props: {
        // 弹窗是否打开
        visible: Boolean,
        // 修改回显的数据
    },
    data() {
        return {
            form: [],
            upload_url: '',
            loading: false,
        };
    },
    mounted() {
        // this.list = this.states.map(item => {
        //     return { value: `${item}`, label: `${item}` };
        // });

    },
    methods: {
        handleSuccess(file, fileList, row) {
            console.log(file);
            console.log(file.code);
            // console.log(row);
            // console.log(fileList);
            if(file.code==201){
                this.$message.error(file.msg);
            }else{
                this.$message.success(file.msg);
            }
            
            // this.form.picture = fileList.response.data;
            // this.fileList = row;

        },
        closeDialog() {
            this.$emit("closeDialog"); // 触发 closeDialog 事件
        },

        /* 更新visible */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        // 其他入库保存
        handleSave() {
            this.axios.post('/ware/Warehousing/update', {
                token: localStorage.getItem("token"),
                params: this.form,
                orderData: this.orderData
            }).then((res) => {
                // 修改成功
                    this.$message.success(this.$t('default.Modify_Succeed'));
                this.updateVisible(false);
                // this.$emit('done');

            }).catch(() => {
                this.loading = false;
            })
        },

        //初始化数据
        dataInitialization() {
            this.upload_url = axios.defaults.baseURL + '/com/upload/uploadMatPicture';
            var token = localStorage.getItem("token");
            
            this.updateVisible(true);
            // that.axios
            //     .get(
            //         "/ware/Warehousing/Detail?wi_code=" + wi_code + '&token=' + token
            //     )
            //     .then(res => {

            //         this.orderData = res.list;

            //         this.form = res.info;

            //         this.location_options = res.location_arr;



            //     })
            //     .catch(err => {
            //         that.$notify.error({
            //             title: "错误",
            //             message: err
            //         });
            //         console.log(err);
            //     });
        },
    },

}
</script>
