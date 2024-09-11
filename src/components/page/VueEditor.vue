<!-- 富文本编辑器 -->
<template>
    <div>
        <!-- 面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i>文件处理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    文本编辑器
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    富文本编辑器
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
                访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>
            </div>
            <!-- :options指定文本编辑器的配置项，这个配置项可以在组件实例的 editorOption 变量中进行设置 -->
            <!-- @change监听了文本编辑器的内容更改事件，当编辑器中的内容发生变化时，就会触发onEditorChange进行处理 -->
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"
                @change="onEditorChange"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    placeholder: 'Hello World'
                }
            }
        },
        components: {
            quillEditor
        },
        methods: {
            // 编辑器文本发生变化触发,将渲染成 HTML 标签后的文本内容赋给编辑器文本的内容
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(){
                console.log(this.content);
                this.$message.success('提交成功！');
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>