<template>
    <section class="main">
        <div class="crumbs">
            <!-- 面包屑 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-rank"></i>拖拽组件
                </el-breadcrumb-item>
                <el-breadcrumb-item>拖拽弹窗</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <p>通过指令 v-dialogDrag 使 Dialog 对话框具有可拖拽的功能。</p>
            <el-button type="primary" @click="visible = true;">点我弹窗</el-button>
        </div>

        <!--dialog对话框，在保留当前页面状态的情况下，告知用户并承载相关的操作 -->
        <!-- center对头部和底部采用居中布局 visible是否显示dialog，.sync现父组件和子组件之间的数据双向绑定-->
        <el-dialog v-dialogDrag title="拖拽弹窗" center :visible.sync="visible" width="30%">
            我是一个可拖拽的对话框
            <span slot="footer" class="dialog-footer">
                <!-- 匿名函数，由于这个处理函数只包含一条简单的赋值语句，因此没有必要为它单独定义一个函数名。 -->
                <el-button @click="visible = false;">{{ $t('default.Cancel') }}</el-button>
                    <!-- 取消 -->
                <el-button type="primary" @click="visible = false;">确定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
export default {
    data() {
        return {
            visible:false,
        }
    },
};
</script>
<style>
</style>