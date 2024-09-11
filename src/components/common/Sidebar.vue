<!-- menu -->
<!-- 一级菜单 -->
<!-- 二级菜单 -->
<!-- 三级菜单 -->
<template>
    <div class="sidebar">
        <!--当前激活菜单的index 当前激活菜单的文字颜色 是否水平折叠收起菜单（默认为false）  -->
        <el-menu :default-active="onRoutes" active-text-color="#20a0ff" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" class="sidebar-el-menu" unique-opened router>
            <!-- 是否只保持一个子菜单的展开（默认为false） -->
            <!-- 是否被使用vue-router,会在激活导航时以index作为path进行路由跳转 -->
            <!-- 对items进行遍历 -->

            <template v-for="item in items">
                <!-- 使用v-if判定是否具有第二级菜单 -->
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <!-- 如果存在第二级导航，渲染第一级菜单标题 -->
                       
                            <span slot="title">{{ $t('title.'+item.title) }}</span>

                        </template>

                        <!-- 遍历二级菜单 -->
                        <template v-for="subItem in item.subs">
                            <!-- 使用v-if判定是否具有第三级菜单 -->
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <!-- 如果存在第三级导航，渲染第二级菜单标题 -->
                                <template slot="title">{{ $t('title.'+subItem.title) }}</template>
                                <!-- 遍历第三级菜单，并渲染第三级菜单标题 -->
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :index="threeItem.index"
                                    :key="i">{{ $t('title.'+threeItem.title) }}</el-menu-item>
                            </el-submenu>

                            <!-- 如果不存在第三级菜单，渲染第二级菜单标题 -->
                            <el-menu-item v-else :index="subItem.index" :key="subItem.inde">
                                {{ $t('title.'+subItem.title) }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <!-- 如果不存在第二级菜单，渲染第一级菜单标题 -->
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <!-- 如果存在第二级导航，渲染第一级菜单标题 -->
                        <span slot="title">
                            <!-- {{ item.title }} -->
                            {{ $t('title.'+item.title) }}
                        </span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { locale } from 'moment';
import bus from '../../utils/bus'



export default {
    data() {

        return {

            collapse: false,

            items: []
        };
    },
    methods: {
        getMenu() {

            var token = localStorage.getItem("token");

            // console.log(localStorage.getItem("token"));
            // return;
            this.axios.post('/index/menu/permission_menu', {
                token: token,
                locale: this.$i18n.locale
            }).then((res) => {

                // console.log(res)
                this.items = res;

            }).catch(() => {
                this.loading = false;
            })
        },
        getButton() {
            var token = localStorage.getItem("token");


            this.axios.post('/index/menu/permission_button', {
                token: token,
            }).then((res) => {
                var permission_button = JSON.stringify(res);
                sessionStorage.setItem('permission_button', permission_button);



            }).catch(() => {
                this.loading = false;
            })
        }
    },

    computed: {
        onRoutes() {
            // 返回当前路由
            return this.$route.path.replace('/', '');
            // 用于替换字符串中第一个斜杠 / 为空字符串，这样可以将路径中的斜杠删除，例如将 /home 转换为 home。
        }
    },
    created() {
        this.getMenu();
        this.getButton();

        // return


        // 通过Event Bus进行组件间通信，来折叠侧边栏。bus.$on()用于接收信息，bus.$emit()用于发送信息
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg)
        });


    }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar>ul {
    height: 100%;
}
</style>