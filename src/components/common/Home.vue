<!-- 创建Home组件 -->
<template>
    <div class="wrapper">
        <!-- 头部组件 -->
        <v-header></v-header>
        <!-- 侧边栏 -->
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
        <!-- 标签栏 -->
        <v-tags></v-tags>
        <div class="content">
            <!-- 表示在旧元素离开新元素进入后添加过渡效果。 -->
            <transition name="move" mode="out-in">
                <!-- keep-alive是vue的内置组件，能在组件切换过程中将状态保留在内存中 -->
                <!-- include :字符串或正则表达式，只有匹配的组件会被缓存-->
                <!-- exclude：字符串或正则表达式，任何匹配的组件都不会被缓存 -->
                <keep-alive :include="tagsList">
                <!-- 次级出口，用于引入次级组件 -->
                <router-view></router-view>
                </keep-alive>
            </transition>
            <!-- 回到顶部，target为触发滚动的对象 -->
            <el-backtop target=".content"></el-backtop>
        </div>
    </div>
    </div>
</template>
<script>
import bus from '../../utils/bus';
import vHeader from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
export default {
    data(){
        return {
            tagsList:[],
            collapse:false
        };
    },
    components:{
        vHeader,
        vSidebar,
        vTags,
    },
    // 在生命周期中收取其他页面传递过来的侧边栏折叠状态，并对标签列表使用率keep-alive，实现打开标签后，在不关闭标签的情况下跳转其他页面，
    // 已经打开的标签不会丢失的效果
    created(){
        bus.$on('collapse-content',msg=>{
            this.collapse = msg;
        });
        // 只有在标签页列表的页面才使用keep-alive，即关闭标签之后就不保存到内存中了
        bus.$on('tags',msg=>{
            let arr = [];
            for(let i=0,len=msg.length;i<len;i++){
                msg[i].name && arr.push(msg[i].name)
            }
            this.tagsList = arr;
        })
    }
};
</script>
<style>

</style>