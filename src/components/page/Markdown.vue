<!-- markdown编辑器 -->
<template>
    <div>
        <!-- 面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-folder"></i>文件处理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    文本编辑器
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    markdown编辑器
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="plugins-tips">
                mavonEditor:基于Vue的markdown编辑器。
                访问地址：<a href="https://github.com/hinesboy/mavonEditor" target="_blank">mavonEditor</a>
            </div>

            <!-- imgAdd：图片文件添加回调事件 change：编辑区发生变化的回调事件 -->
            <!-- ref组件的引用名称，可以通过this.$refs.md来获取到组件的实例对象 -->
            <!-- @imgAdd="$imgAdd"监听了编辑器中插入图片的事件，@change="change"监听了编辑器的内容更改事件-->
            <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px" />
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    name: 'markdown',
    data: function () {
        return {
            // Markown 编辑器的文档内容，通过 v-model 进行双向绑定 
            content: '',
            html: ''
        }
    },
    components: {
        mavonEditor
    },
    methods: {
        // 将图片上传到服务器，返回地址替换到md中
        // 绑定@imgAdd event
        $imgAdd(pos, $file) {
            // pos插入图片的位置，即光标所在位置，$file要插入的图像文件对象
            // FormData对象用以将数据编译成键值对。
            var formdata = new FormData();
            //  FormData 对象，它是 XMLHttpRequest 中用于发送 HTTP 请求时传输的一种格式，可以将数据编译为键值对的形式。
            // 第一步.将图片上传到服务器.
            formdata.append('file', $file);
            // 将 $file 添加到 FormData 对象中作为一个键值对，即将图片文件添加到 formdata 对象中。第一个参数是该键值对的键，这里设定为 'file'，第二个参数是要添加的值，也就是要上传的图片文件，
            // 它的类型是 Blob，$file 是一个 Blob 对象或 File 对象，它包含了要上传的图片的二进制数据及其元数据，如文件名、大小等。
            // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
            // 使用 axios 发送 POST 请求将图片文件上传到服务器
            this.$axios({
                url: '/common/upload',//接口地址，即上传图片的接口。
                method: 'post',//请求方法，这里设置为 post，表示要发送一个 POST 请求。
                data: formdata,//请求携带的数据，这里是前面创建的 formdata 对象，它包含了要上传的文件
                headers: { 'Content-Type': 'multipart/form-data' },
                //请求头信息，这里指定了 Content-Type:multipart/form-data，表示要上传的数据是一个多部件表单数据，其中包含二进制图片文件数据。
            }).then((url) => {
                // 异步 当上传成功后，服务器返回的数据会传递到 then 方法中，这里可以是上传成功后的处理逻辑
                // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
                /**
                 * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                 * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                 * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                 */
                this.$refs.md.$img2Url(pos, url);
                // 将上传成功后的图片 url 插入到 Markdown 编辑器中
                // 插入图片，第一个参数 pos 是要插入的位置，一般为当前光标位置，第二个参数 url 是要插入的图片链接地址。
                // 这个方法会将图片地址添加到 Markdown 编辑器当前光标位置的文本内容中，以 ![]() 的格式插入图片，其中括号中的内容就是图片的链接地址。这样，图片就能够在 Markdown 编辑器中正常显示了。

            })
        },
        change(value, render) {
            // render 为 markdown 解析后的结果
            this.html = render;
        },
        submit() {
            this.$message.success('提交成功！');
        }
    }
}
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}
</style>