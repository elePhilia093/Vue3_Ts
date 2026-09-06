import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      meta: { title: '首页' },
      component: () => import('@/layout/index.vue'),
      redirect: '/dashboard',
      children: [
        // --- 仪表盘 (独立模块) ---
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'Dashboard', icon: 'dashboard' },
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: 'trade', // 对应 UI 上的 "交易管理"
          name: 'Trade',
          meta: { title: '交易管理', icon: 'money' },
          // 注意：这里不需要 component，或者使用 <router-view> 占位
          children: [
            {
              path: 'customers', // 路径变为 /trade/customers
              name: 'Customers',
              meta: { title: '客户信息' },
              component: () => import('@/views/trade/customers/index.vue'),
            },
            {
              path: 'orders', // 路径变为 /trade/orders
              name: 'Orders',
              meta: { title: '订单信息' },
              component: () => import('@/views/trade/orders/index.vue'),
            },
          ],
        },
        {
          path: 'system', // 对应 UI 上的 "系统管理"
          name: 'System',
          meta: {
            title: '系统管理',
            icon: 'setting',
            roles: ['admin'], // 关键：添加权限标识，只有管理员可见
          },
          children: [
            {
              path: 'user',
              name: 'UserManage',
              meta: { title: '用户管理' },
              component: () => import('@/views/system/user/index.vue'),
            },
            {
              path: 'role',
              name: 'RoleManage',
              meta: { title: '角色管理' },
              component: () => import('@/views/system/role/index.vue'),
            },
            {
              path: 'menu',
              name: 'MenuManage',
              meta: { title: '菜单管理' },
              component: () => import('@/views/system/menu/index.vue'),
            },
            {
              path: 'dept',
              name: 'DepManage',
              meta: { title: '部门管理' },
              component: () => import('@/views/system/dept/index.vue'),
            }
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
  ],
});


router.beforeEach((to) => {
  const authStore = useAuthStore();

  // 已登录用户访问登录页，直接进入首页
  if (to.path === '/login') {
    if (authStore.token) {
      return '/dashboard';
    }

    return true;
  }

  // 未登录用户访问其他页面，跳转登录页
  if (!authStore.token) {
    return '/login';
  }

  // 已登录，正常放行
  return true;
});
export default router;
