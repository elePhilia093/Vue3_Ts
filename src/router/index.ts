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
      redirect: '/visualization',
      children: [
        // --- 仪表盘 (独立模块) ---
        // {
        //   path: 'dashboard',
        //   name: 'Dashboard',
        //   meta: { title: 'Dashboard', icon: 'dashboard' },
        //   component: () => import('@/views/dashboard/index.vue'),
        // },
        // --- 可视化分析 (独立模块) ---
        {
          path: 'visualization',
          name: 'Visualization',
          meta: { title: '可视化分析', icon: 'chart' },
          component: () => import('@/views/visualization/index.vue'),
        },
        // --- 工资管理 (独立模块) ---
        {
          path: 'salary',
          name: 'Salary',
          meta: { title: '工资管理', icon: 'money' },
          component: () => import('@/views/salary/index.vue'),
        },
        // --- 公告管理 (独立模块) ---
        {
          path: 'announcement',
          name: 'Announcement',
          meta: { title: '公告管理', icon: 'notification' },
          component: () => import('@/views/announcement/index.vue'),
        },
        {
          path: 'trade', 
          name: 'Trade',
          meta: { title: '交易管理', icon: 'money' },
          children: [
            {
              path: 'customers',
              name: 'Customers',
              meta: { title: '客户信息' },
              component: () => import('@/views/trade/customers/index.vue'),
            },
            {
              path: 'orders',
              name: 'Orders',
              meta: { title: '订单信息' },
              component: () => import('@/views/trade/orders/index.vue'),
            },
          ],
        },
        // --- 个人中心 (独立模块) ---
        {
          path: 'profile',
          name: 'Profile',
          meta: { title: '个人中心', icon: 'user' },
          children: [
            {
              path: 'info',
              name: 'Info',
              meta: { title: '个人信息' },
              component: () => import('@/views/profile/info/index.vue'),
            },
            {
              path: 'password',
              name: 'Password',
              meta: { title: '修改密码' },
              component: () => import('@/views/profile/password/index.vue'),
            },
          ],
        },
        {
          path: 'hrm',
          name: 'Hrm',
          meta: { title: '人事管理', icon: 'user' },
          children: [
            {
              path: 'employee',
              name: 'Employee',
              meta: { title: '员工管理' },
              component: () => import('@/views/hrm/employee/index.vue'),
            },
          ],
        },
        {
          path: 'attendance',
          name: 'Attendance',
          meta: { title: '考勤管理', icon: 'calendar' },
          children: [
            {
              path: 'record',
              name: 'Record',
              meta: { title: '考勤记录' },
              component: () => import('@/views/attendance/record/index.vue'),
            },
            {
              path: 'apply',
              name: 'Apply',
              meta: { title: '请假管理' },
              component: () => import('@/views/attendance/apply/index.vue'),
            }
          ]

        },
        {
          path: 'system',
          name: 'System',
          meta: {
            title: '系统管理',
            icon: 'setting',
            roles: ['admin'],
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
    // if (authStore.token) {
    //   return '/dashboard';
    // }

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
