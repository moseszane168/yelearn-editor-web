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
      redirect: '/dashboard',
    },
    {
      path: '/',
      // path:'/',
      component: () => import('../components/common/Home.vue'),
      meta: { title: '自述文件' },
      // 路由嵌套
      children: [
        {
          // 此时的系统首页是嵌套在home组件当中的
          // 系统首页
          path: 'dashboard',
          //使用children属性，实现子路由，同时子路由的path前面，不要带/,否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
          component: () => import('../components/page/Dashboard.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'supply',
          component: () => import('../components/supply/Index.vue'),
          meta: { title: 'supply' },
        },
        {
          path: 'material',
          component: () => import('../components/material/Index.vue'),
          meta: { title: 'material' },
        },
        {
          path: 'MaterialPicture',
          component: () => import('../components/material/MaterialPicture.vue'),
          meta: { title: 'MaterialPicture' }
        },
        {
          path: 'CostChange',
          component: () => import('../components/material/CostChange.vue'),
          meta: { title: 'CostChange' }
        },
        {
          path: 'Category',
          component: () => import('../components/material/Category.vue'),
          meta: { title: 'Category' }
        },
        {
          path: 'SafeNumAudit',
          component: () => import('../components/material/SafeNumAudit.vue'),
          meta: { title: 'SafeNumAudit' },
        },
        {
          path: 'MaterialCostHistory',
          component: () => import('../components/material/MaterialCostHistory.vue'),
          meta: { title: 'MaterialCostHistory' },
        },
        {
          path: 'userlist',
          // name: 'userlistManagement',
          component: () => import('../components/user/Index.vue'),
          meta: { title: 'userlist' },
        },
        {
          path: 'userUpdatePassword',
          component: () => import('../components/user/Password.vue'),
          meta: { title: 'userUpdatePassword' },
        },
        {
          path: 'menu',
          component: () => import('../components/user/Menu.vue'),
          meta: { title: 'Menu' },
        },
        {
          path: 'role',
          component: () => import('../components/user/Role.vue'),
          meta: { title: 'role' },
        },
        {
          path: 'permission',
          component: () => import('../components/page/Permission.vue'),
          meta: { title: 'permission', permission: true }
        },
        {
          path: 'warehouse',
          component: () => import('../components/warehouse/Warehouse.vue'),
          meta: { title: 'warehouse' }
        },
        {
          path: 'wareLocation',
          component: () => import('../components/warehouse/wareLocation.vue'),
          meta: { title: 'wareLocation' }
        },
        {
          path: 'MaterialLocation',
          component: () => import('../components/warehouse/MaterialLocation.vue'),
          meta: { title: 'MaterialLocation' }
        },
        {
          path: 'AssetsApply',
          component: () => import('../components/plan/AssetsApply.vue'),
          meta: { title: 'AssetsApply' }
        },
        {
          path: 'MaterialApply',
          component: () => import('../components/plan/MaterialApply.vue'),
          meta: { title: 'MaterialApply' }
        },
        {
          path: 'Apply',
          component: () => import('../components/plan/Apply.vue'),
          meta: { title: 'Apply' }
        },
        {
          path: 'ProduceApply',
          component: () => import('../components/plan/ProduceApply.vue'),
          meta: { title: 'ProduceApply' }
        },
        {
          path: 'Preparation',
          component: () => import('../components/plan/Preparation.vue'),
          meta: { title: 'Preparation' }
        },

        {
          path: 'Planning',
          component: () => import('../components/plan/Planning.vue'),
          meta: { title: 'Planning' }
        },
        {
          path: 'PurchaseOrder',
          component: () => import('../components/purchase/Purchase.vue'),
          meta: { title: 'PurchaseOrder' }
        },
        {
          path: 'SelectOne',
          component: () => import('../components/base/SelectOne.vue'),
          meta: { title: 'SelectOne' }
        },
        {
          path: 'Invoice',
          component: () => import('../components/purchase/Invoice.vue'),
          meta: { title: 'Invoice' }
        },
        {
          path: 'Return',
          component: () => import('../components/purchase/Return.vue'),
          meta: { title: 'Return' }
        },
        {
          path: 'PurchaseIn',
          component: () => import('../components/warehouse/PurchaseIn.vue'),
          meta: { title: 'PurchaseIn' }
        },
        
        {
          path: 'PickingApply',
          component: () => import('../components/produce/PickingApply.vue'),
          meta: { title: 'PickingApply' }
        },
        {
          path: 'Sales',
          component: () => import('../components/produce/Sales.vue'),
          meta: { title: 'Sales' }
        },

        {
          path: 'Department',
          component: () => import('../components/user/Department.vue'),
          meta: { title: 'Department' }
        },
        {
          path: 'Project',
          component: () => import('../components/purchase/Project.vue'),
          meta: { title: 'Project' }
        },
        {
          path: 'Warehousing',
          component: () => import('../components/warehouse/Warehousing.vue'),
          meta: { title: 'Warehousing' }
        },
        {
          path: 'FinishedWarehousing',
          component: () => import('../components/warehouse/FinishedWarehousing.vue'),
          meta: { title: 'FinishedWarehousing' }
        },
        {
          path: 'Inventory',
          component: () => import('../components/warehouse/Inventory.vue'),
          meta: { title: 'Inventory' }
        },
      
        {
          path: 'PickingOut',
          component: () => import('../components/warehouse/PickingOut.vue'),
          meta: { title: 'PickingOut' }
        },
        {
          path: 'BaseSet',
          component: () => import('../components/base/BaseSet.vue'),
          meta: { title: 'BaseSet' }
        },
        {
          path: 'Outbound',
          component: () => import('../components/warehouse/Outbound.vue'),
          meta: { title: 'Outbound' }
        },
        
        {
          path: 'InOutLog',
          component: () => import('../components/warehouse/InOutLog.vue'),
          meta: { title: 'InOutLog' }
        },
        {
          path: 'OutLog',
          component: () => import('../components/warehouse/OutLog.vue'),
          meta: { title: 'OutLog' }
        },
        {
          path: 'InLog',
          component: () => import('../components/warehouse/InLog.vue'),
          meta: { title: 'InLog' }
        },
        {
          path: 'Transfer',
          component: () => import('../components/warehouse/Transfer.vue'),
          meta: { title: 'Transfer' }
        },
        {
          path: 'AuditSummary',
          component: () => import('../components/warehouse/AuditSummary.vue'),
          meta: { title: 'AuditSummary' }
        },
       
        {
          path: 'ClientCompany',
          component: () => import('../components/base/ClientCompany.vue'),
          meta: { title: 'ClientCompany' }
        },
        {
          path: 'AssetInAudit',
          component: () => import('../components/warehouse/AssetInAudit.vue'),
          meta: { title: 'AssetInAudit' }
        },
        {
          path: 'FixedAssets',
          component: () => import('../components/warehouse/FixedAssets.vue'),
          meta: { title: 'FixedAssets' }
        },
        // 收发存汇总
        {
          path: 'InventorySummary',
          component: () => import('../components/warehouse/InventorySummary.vue'),
          meta: { title: 'InventorySummary' }
        },
        // 成品归并关系
        {
          path: 'ProductMerge',
          component: () => import('../components/customs/ProductMerge.vue'),
          meta: { title: 'ProductMerge' }
        },
        // 物料归并关系
        {
          path: 'MaterialMerge',
          component: () => import('../components/customs/MaterialMerge.vue'),
          meta: { title: 'MaterialMerge' }
        },
      //  物料入库
        {
          path: 'MaterialStorage',
          component: () => import('../components/customs/MaterialStorage.vue'),
          meta: { title: 'MaterialStorage' }
        },
        // 成品出库
        {
          path: 'ProductDelivery',
          component: () => import('../components/customs/ProductDelivery.vue'),
          meta: { title: 'ProductDelivery' }
        },
        // 保税仓库存
        {
          path: 'HgWare',
          component: () => import('../components/customs/HgWare.vue'),
          meta: { title: 'HgWare' }
        },
        // u8用户接口
        {
          path: 'U8Bdpsn',
          component: () => import('../components/u8capi/U8Bdpsn.vue'),
          meta: { title: 'U8Bdpsn' }
        },
        // u8仓库接口
        {
          path: 'U8Stordoc',
          component: () => import('../components/u8capi/U8Stordoc.vue'),
          meta: { title: 'U8Stordoc' }
        },
        // u8客商接口
        {
          path: 'U8Custmandoc',
          component: () => import('../components/u8capi/U8Custmandoc.vue'),
          meta: { title: 'U8Custmandoc' }
        },
        // u8材料出库接口
        {
          path: 'U8Materialout',
          component: () => import('../components/u8capi/U8Materialout.vue'),
          meta: { title: 'U8Materialout' }
        },
        // u8其他入库接口
        {
          path: 'U8Otherin',
          component: () => import('../components/u8capi/U8Otherin.vue'),
          meta: { title: 'U8Otherin' }
        },
        // u8其他出库接口
        {
          path: 'U8Otherout',
          component: () => import('../components/u8capi/U8Otherout.vue'),
          meta: { title: 'U8Otherout' }
        },
        // u8产成品入库接口
        {
          path: 'U8Productin',
          component: () => import('../components/u8capi/U8Productin.vue'),
          meta: { title: 'U8Productin' }
        },
        // u8采购入库接口
        {
          path: 'U8Purchasein',
          component: () => import('../components/u8capi/U8Purchasein.vue'),
          meta: { title: 'U8Purchasein' }
        },
        // u8转库接口
        {
          path: 'U8Special4k',
          component: () => import('../components/u8capi/U8Special4k.vue'),
          meta: { title: 'U8Special4k' }
        },
        // u8采购单接口
        {
          path: 'U8Order',
          component: () => import('../components/u8capi/U8Order.vue'),
          meta: { title: 'U8Order' }
        },
        // u8采购单审核接口
        {
          path: 'U8OrderAudit',
          component: () => import('../components/u8capi/U8OrderAudit.vue'),
          meta: { title: 'U8OrderAudit' }
        },
        // u8采购发票接口
        {
          path: 'U8Invoice',
          component: () => import('../components/u8capi/U8Invoice.vue'),
          meta: { title: 'U8Invoice' }
        },
        // 设置
        {
          path: 'BaseSettings',
          component: () => import('../components/base/BaseSettings.vue'),
          meta: { title: 'BaseSettings' }
        },

       
        {
          path: '404',
          component: () => import('../components/page/404.vue'),
          meta: { title: '404' }
        },
        {
          path: 'Test',
          component: () => import('../components/page/Test.vue'),
          meta: { title: 'Test' }
        },
        {
          path: '403',
          component: () => import('../components/page/403.vue'),
          meta: { title: '403' }
        }
      ],
    },
    {
      path: '/login',
      component: () => import('../components/page/Login.vue'),
      meta: { title: 'Login' },
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
});


