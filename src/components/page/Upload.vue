<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-folder"></i>文件处理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    文件上传
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 支持拖拽和裁剪-->
        <div class="container">、
            <!-- 支持拖拽 -->
            <div class="content-title">支持拖拽</div>
            <div class="plugins-tips">
                Element UI自带上传组件。
                访问地址：<a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a>
            </div>
            <!-- upload上传 drag采用拖拽上传 action必选参数上传的地址 multiple是否支持多选文件 -->
            <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip"><!-- 只能上传jpg/png文件，且不超过500kb -->
                                {{ $t('default.Only_jpg_png_files_can_be_uploaded_and_it_should_not_exceed_500kb') }}
                            </div>
            </el-upload>
            <!-- 支持裁剪 -->
            <div class="content-title">支持裁剪</div>
            <div class="plugins-tips">
                vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
            </div>
            <div class="crop-demo">
                <img :src="cropImg" class="pre-img">
                <div class="crop-demo-btn">选择图片
                    <!-- accept属性用于指定文件上传的类型，image/*表示只允许上传图片类型的文件，*表示通配符，表示所有的图片类型 -->
                    <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                </div>
            </div>

            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <!-- src：图片来源，
                ready：ready事件的快捷方式，当目标图像已加载且裁剪器实例已准备好进行操作时，将触发此事件。
                cropmove：cropmove事件的快捷方式 ，更改画布（图像包装器）或裁切框时，将触发此事件。
                zoom：zoom事件的快捷方式 裁剪器实例开始放大或缩小其画布（图像包装器）时，将触发此事件。-->
                <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                    style="width:100%;height:300px;"></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">{{ $t('default.Cancel') }}</el-button><!-- 取消 -->
                    <el-button type="primary" @click="dialogVisible=false">{{ $t('default.Confirm') }}</el-button><!-- 确定 -->
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'upload',
        data: function(){
            return {
                defaultSrc: require('../../assets/img/img.jpg'),
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
            }
        },
        components: {
            VueCropper
        },
        methods:{
            setImage(e){
                // 获取第一张 input 选择的图片的一些参数
                const file = e.target.files[0];
                // 对匹配的类型做判断是否以 image/ 开头
                if (!file.type.includes('image/')) {
                    return;
                }
                // 创建 FileReader 对象，用于将文件内容读入内存，通过一系列异步接口，可以在主线程中访问本地文件。
                const reader = new FileReader();
                // 当读取操作完成时的回调函数
                reader.onload = (event) => {
                    // 用于将弹窗显示出来
                    this.dialogVisible = true;
                    // target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口。
                    this.imgSrc = event.target.result;
                    // event.target.result 是 FileReader 对象读取完文件后返回的结果
                    // 判断 ref 绑定的节点是否存在，如果存在则将其替换为我们读取到的节点的返回结果。
                    // 将裁剪框中的图片替换为上传的新图片。replace() 方法是在 vue-cropperjs 组件中定义的一个方法，用于替换裁剪框中的图片。它需要传入一个参数，即需要替换的图片的地址。
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                // 将读取到的文件编码成 Data URL，内嵌到网页中。
                reader.readAsDataURL(file);
                // 从 File 类型的文件中读取内容，并将其转换成 base64 编码的字符串格式
            },
            cropImage () {
                // .getCroppedCanvas()：获取画布以绘制裁剪后的图像（有损压缩）。如果未裁剪，则返回绘制整个图像的画布。
                // .toDataURL()：返回一个包含图片展示的 data URI
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            // 图片上传成功后调用此方法，res为返回值为服务器存放图片的路径
            imageuploaded(res) {
                console.log(res)
            },
            // 图片上失败后调用此方法
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        },
        created(){
            this.cropImg = this.defaultSrc;
        }
    }
</script>
<style>
@import url("//unpkg.com/element-ui@2.15.13/lib/theme-chalk/index.css");
.content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>