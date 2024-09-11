import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyLoad from 'vue-lazyload'
import VueCookie from 'vue-cookie'
// 引入Element UI 的全局引入
import ElementUI from 'element-ui';
import { Message } from 'element-ui'

// 单独引入样式文件
import 'element-ui/lib/theme-chalk/index.css';
// 加载拖拽组件
import './utils/directives'
// import env from './env'


// 执行Element UI
Vue.use(ElementUI, {
  size: 'small',
});
// 引入Element UI时，可以通过传入一个配置对象，来对Element UI进行配置
import VueI18n from 'vue-i18n';
// 引入国际化插件设定的不同语言的文本
// import { messages } from './utils/i18n';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// $t('login.title')
// import local from './local'

// import locale from 'element-ui/lib/locale'

// this.$i18n.mergeLocaleMessage('en', local.en)
// VueI18n.mergeLocaleMessage('zh', local.zh)

// 引入国际化插件
Vue.use(VueI18n);

const messages = {
  en: {
    message: 'hello',
    ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
  },
  zh: {
    message: '你好',
    ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
  }
};
// 实例化国际化插件,用于实现多语言功能
const i18n = new VueI18n({
  locale: 'en',
  // 指定当前使用的语言
  messages,
  // 包含了不同语言文本的对象
});
Vue.config.productionTip = false
//加载图标样式
import './assets/css/icon.css';
import './assets/css/Icon-css/iconfont.css'
//加载拖拽组件
import './utils/directives';
//加载语法编辑器
import 'babel-polyfill';
// 路由的导航守卫，它的作用便是通过跳转或取消的方式守卫导航。我们可以通过router.beforeEach来注册一个全局前置守卫，对路由的跳转进行一些设置




// axios.defaults.basePicURL = 'http://192.168.3.206:81/';
axios.defaults.timeout = 10000;

axios.defaults.basePicURL = 'http://127.0.0.1:81/';

axios.defaults.baseURL = axios.defaults.basePicURL + 'index.php';

// 根据环境变量获取不同的请求地址
// axios.defaults.baseURL = env.baseURL;




// 接口错误拦截
axios.interceptors.response.use(


  function (response) {
    let res = response.data;


    if (res.code == 200) {

      return res.data;
    }
    else if (res.code == 403) {
      next('/403');
    }

    else if (res.code == 401) {
      window.location.href = '/#/login';
      return Promise.reject(res);
    } else if (res.code == 201) {
      // window.location.href = '/#/login';
      // this.$message.error(res);
      Message.error(res.msg);
      this.$message.error(res);
      return Promise.reject(res);
    } else {
      Message.warning(res.msg);
      return Promise.reject(res);
    }
  }, (error) => {
    let res = error.response;
    console.log(error);
    Message.error(res.msg);
    // Message.error(res.data.message);
    return Promise.reject(error);
  });





//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const role = localStorage.getItem('ms_username');
  if (!role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'AsunaCC' ? next() : next('/403');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
});

Vue.use(VueAxios, axios);
Vue.use(VueCookie);
Vue.use(VueLazyLoad, {
  loading: '/imgs/loading-svg/loading-bars.svg'
})
Vue.prototype.$message = Message;
Vue.config.productionTip = false;

// 在Vue初始化之前添加原型方法
Vue.prototype.FormatTime = function (time) {
 
  const dateObj = new Date(time);

  // 获取年、月、日等信息
  const year = dateObj.getFullYear(); // 年份
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份（注意月份从0开始计算）
  const day = dateObj.getDate().toString().padStart(2, '0'); // 天数

  time = `${year}-${month}-${day}`;
  // console.log(time);

  return time;
}



new Vue({
  // 挂载插件
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')

// Vue.locale('en', enLocale);