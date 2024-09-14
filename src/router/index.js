import Vue from 'vue'
// import VueRouter from 'vue-router'
// 引入路由插件
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      // 设置重定向，将Dashboard组件设为默认路由组件
      redirect: '/index',
    },

    {
      path: '/index',
      component: () => import('../views/editor/index.vue'),
      meta: { title: 'index' }
    },

    {
      path: '/course-packs',
      //使用children属性，实现子路由，同时子路由的path前面，不要带/,否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
      component: () => import('../views/editor/course-packs/index.vue'),
      meta: { title: 'course-packs' },
    },
    {
      path: '/course-packs/:coursePackId',
      component: () => import('../views/editor/courses/index.vue'),
      meta: { title: 'courses' },
    },
    {
      path: '/course-packs/:coursePackId/courses/:courseId',
      component: () => import('../views/editor/statements/index.vue'),
      meta: { title: 'statements' },
    },

    /*{
      path: '/login',
      component: () => import('../components/page/Login.vue'),
      meta: { title: 'Login' },
    },*/

    {
      path: '*',
      redirect: '/404'
    }
  ],
});


