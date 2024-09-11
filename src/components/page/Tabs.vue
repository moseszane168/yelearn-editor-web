<template>
    <!-- 顶部的面包屑以及下方拥有三个选项卡的标签页组成 -->
    <div class="">
        <div class="crumbs">
            <!-- 面包屑，显示当前页面的路径，快速返回之前的任何页面 -->
            <el-breadcrumb separator="/">
                <!-- separator决定分隔符，只能是字符串 -->
                <!-- 第一级标签 -->
                <el-breadcrumb-item>
                    <!-- 图标 -->
                    <i class="el-icon-document-copy">tab选项卡</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <!-- 创建标签页，tabs -->
                <!-- 第一个tab -->
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <!-- label为选项卡标题，name与选项卡绑定值value对应的标识符，表示选项卡别名 -->
                    <!-- l-table注入data对象数组，e-table-column使用prop来对应对象中的键名即可填入数据，label为列名，width为列宽 -->
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <!-- 第1列 -->
                        <el-table-column>
                            <!-- 通过v-slot动态分发数据 ，可以通过具名slot来实现自定义标签页的内容-->
                            <template v-slot="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <!-- 第2列 -->
                        <!-- el-table上绑定了data对象数组。通过prop键入对象中的键名即可填入数据 -->
                        <el-table-column prop="date" width="180"></el-table-column>
                        <!-- 第3列 -->
                        <el-table-column width="120">
                            <template v-slot="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">标记已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <!-- 通过type改变风格 -->
                        <el-button type="primary" @click="handleAllRead">全部标记已读</el-button>
                    </div>
                </el-tab-pane>

                <!-- 第二个tab -->
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <!-- label为选项卡标题，name与选项卡绑定值value对应的标识符，表示选项卡别名 -->
                    <!-- l-table注入data对象数组，e-table-column使用prop来对应对象中的键名即可填入数据，label为列名，width为列宽 -->
                    <!-- 对是否选中当前标签页进行判断 -->
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%;">
                            <!-- 第1列 -->
                            <el-table-column>
                                <!-- 通过v-slot动态分发数据 ，可以通过具名slot来实现自定义标签页的内容-->
                                <template v-slot="scope">
                                    <span class="message-title">{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <!-- 第2列 -->
                            <!-- el-table上绑定了data对象数组。通过prop键入对象中的键名即可填入数据 -->
                            <el-table-column prop="date" width="150"></el-table-column>
                            <!-- 第3列 -->
                            <el-table-column width="120">
                                <template v-slot="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">{{ $t('default.Delete') }}</el-button><!-- 删除 -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <!-- 通过type改变风格 -->
                            <!-- 删除 -->
                            <el-button type="danger" @click="handleAllDel">{{$t('default.Delete')}}
                            </el-button>
                        </div>
                    </template>
                </el-tab-pane>

                <!-- 第三个tab -->
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <!-- label为选项卡标题，name与选项卡绑定值value对应的标识符，表示选项卡别名 -->
                    <!-- l-table注入data对象数组，e-table-column使用prop来对应对象中的键名即可填入数据，label为列名，width为列宽 -->
                    <!-- 对是否选中当前标签页进行判断 -->
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%;">
                            <!-- 第1列 -->
                            <el-table-column>
                                <!-- 通过v-slot动态分发数据 ，可以通过具名slot来实现自定义标签页的内容-->
                                <template v-slot="scope">
                                    <span class="message-title">{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <!-- 第2列 -->
                            <!-- el-table上绑定了data对象数组。通过prop键入对象中的键名即可填入数据 -->
                            <el-table-column prop="date" width="150"></el-table-column>
                            <!-- 第3列 -->
                            <el-table-column width="120">
                                <template v-slot="scope">
                                    <!-- 声明一个插槽，将插槽的内容绑定到了父组件的scope变量上，当父组件渲染子组件时，它会将scope传递给子组件，子组件可以使用scope.$index来访问
                                    插槽内容的索引值 -->
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <!-- 通过type改变风格 -->
                            <el-button type="danger" @click="handleAllDelete">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import bus from '../../utils/bus';
export default {
    name: 'tabs',
    data() {
        return {
            message: 'first',
            showHeader: false,
            unread: [{
                date: '2021-04-19 20:00:00',
                title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
            }, {
                date: '2021-04-19 21:00:00',
                title: '今晚12点整发大红包，先到先得',
            }],
            read: [{
                date: '2021-04-19 19:00:00',
                title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
            }],
            recycle: [{
                date: '2021-04-19 18:00:00',
                title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
            }]
        }
    },
    methods: {
        // 操作对应信息，标为已读，获取传入的当前信息的索引
        handleRead(index) {
            // 将未读信息对象数组当前索引上的对象删除，并返回给item
            const item = this.unread.splice(index, 1);
            // 将item和存放已读信息的对象数组进行拼接
            this.read = item.concat(this.read);
            // 通过bus通信将当前未读信息的数量进行传递
            bus.$emit('msg', this.unread.length);
        },
        // 操作所有信息，标记已读
        handleAllRead() {
            // 将未读信息对象数组中的所有信息全部删除，并返回给item
            const item = this.unread.splice(0, this.unread.length);
            // 将item和存放已读信息的对象数组进行拼接
            this.read = item.concat(this.read);
            // 通过bus通信将当前未读信息的数量进行传递
            bus.$emit('msg', this.unread.length);
        },
        // 操作对应信息，标为回收，获取传入的当前信息的索引 
        handleDel(index) {
            // 将已读信息对象数组当前索引上的对象删除，并返回给item
            const item = this.read.splice(index, 1);
            // 将item和存放回收信息的对象数组进行拼接
            this.recycle = item.concat(this.recycle);
        },
        // 操作所有信息，标记回收
        handleAllDel() {
            // 将已读信息对象数组中的所有信息全部删除，并返回给item
            const item = this.read.splice(0, this.read.length);
             // 将item和存放回收信息的对象数组进行拼接
             this.recycle = item.concat(this.recycle);
        },
         // 操作对应信息，标为已读，获取传入的当前信息的索引 
        handleRestore(index) {
             // 将回收信息对象数组中的当前索引上的对象删除，并返回给item
             const item = this.recycle.splice(index, 1);
             // 将item和存放已读信息的对象数组进行拼接
             this.read = item.concat(this.read);
        },
        // 操作所有信息，彻底删除
        handleAllDelete() {
            // 将回收信息对象数组中所有信息全部删除
            this.recycle.splice(0,this.recycle.length)

        },
    },
    computed:{
        unreadNum(){
            return this.unread.length;
        },
    },
};
</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>