<template>
    <div class="header">
        <!-- 侧边栏折叠按钮 ,折叠和展开,通过变量collaspse来控制-->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <!-- 系统logo，标题 -->
        <!-- 畅思得ERP系统 -->
        <div class="logo">畅思得{{ $t('default.ERP_System')}}</div>
        <!-- 全屏显示按钮 ，使用tooltip-->
        <div class="header-right">
            <div class="header-user-con">
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                    <!-- effect提供的主题，content显示的内容，palcement出现的位置 -->
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell" style="display: none;">
                    <el-tooltip effect="dark" :content="message ? `有${message}条未读信息` : `消息中心`" placement="bottom">
                        <!-- 点击后路由跳转 -->
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <!-- 通过对message的判定，来决定是否显示小红点 -->
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/img.jpg" alt="">
                </div>
                <!-- 用户名下拉菜单使用dropdown -->
                <el-dropdown trigger="click" class="user-name" @command="handleCommand">
                    <!-- command 点击菜单项触发的事件回调 -->
                    <span class="el-dropdown-link">
                        {{ username }}<i class="el-icon-caret-bottom"></i>
                    </span>
                    <!-- slot设置下拉列表 -->
                    <el-dropdown-menu slot="dropdown">
                        <a href="#" target="_blank">
                            <!-- 项目仓库 -->
                            <el-dropdown-item>{{ $t('default.Project_Warehouse')}}</el-dropdown-item>
                        </a>
                        <!-- 退出登录 -->
                        <el-dropdown-item divided command="loginout">{{ $t('default.Logout')}}</el-dropdown-item>

                        <!-- divided添加分割线来分隔菜单项。默认为 false -->
                        <!--command在点击菜单项时，将被派发到 dropdown 组件的 command 事件中。在执行相关操作时可以通过这个属性来判断用户点击了哪个菜单项-->
                    </el-dropdown-menu>

                 
                </el-dropdown>

               

                <el-dropdown :hide-on-click="false" @command="handleLanguage">
                    <span class="el-dropdown-link">
                        {{ language_name }}<i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="cn">中文</el-dropdown-item>
                        <el-dropdown-item command="en">English</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <sidebar ref="sidebar"></sidebar>
    </div>

</template>

<script>
// 加载bus实现组件通信
import bus from '../../utils/bus';
import Sidebar from './Sidebar.vue';



export default {
    components: {
        Sidebar
    },
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: 'AsunaCC',
            message: 2,
            options: [{
                value: 'cn',
                label: '中文'
            }, {
                value: 'en',
                label: 'English'
            }],
            language: 'cn',
            language_name: '中文',
        };
    },
    // 监控自定义属性
    computed: {
        username() {
            // 从本地存储中获取值
            let username = localStorage.getItem('ms_username');
            // 对获取到的值进行判断，如果从本地存储能够获取值，则使用该值，如果不能获取到，则使用data中设置的值
            return username ? username : this.name;
        },
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            // 退出登录事件
            if (command == 'loginout') {
                // 从本地存储中删除用户名
                localStorage.removeItem('ms_username');
                // 跳转到登录页面
                this.$router.push('/login');
            }
        },
        handleLanguage(command) {
            // 退出登录事件
            if (command == 'cn') {
                this.language_name = '中文';
                this.$i18n.locale = 'zh';
            }
            if (command == 'en') {
                this.language_name = 'English';
                this.$i18n.locale = 'en';
            }
            this.$refs.sidebar.getMenu();
            this.$refs.sidebar.$forceUpdate();
        },

        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            // 通过bus发送信息
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            // 获取文档对象的根元素
            let element = document.documentElement;
            if (this.fullscreen) {
                // 设置不同浏览器的退出全屏模式
                // -webkit兼容Chrome和Safari
                // -moz-兼容firefox
                // -ms-兼容IE浏览器
                // -o- 兼容Opera
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullScreen) {
                    document.msExitFullScreen();
                }
            } else {
                // 设置不同浏览器下的进入全屏模式
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullScreen) {
                    // IE11
                    element.msRequestFullScreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
    },
    // 初始化页面完成后，对页面可见区域宽度进行判定，如果页面宽度小于1500，则触发collapsChange方法
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
        // 通过bus通信获取message的值
        bus.$on('msg', (e) => {
            this.message = e;
        });
    },
};
</script>

<style>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}

.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}

.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}

.header-right {
    float: right;
    padding-right: 50px;
}

.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}

.btn-fullscreen {
    transform: rotate(45deg);
    /* 元素将以自己的中心点为中心，顺时针旋转 45 度 */
    margin-right: 5px;
    font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}

.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}

.btn-bell .el-icon-bell {
    color: #fff;
}

.user-name {
    margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
}

.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}

.el-dropdown-menu_item {
    text-align: center;
}
</style>