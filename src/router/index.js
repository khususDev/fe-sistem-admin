import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [
  {
    path: '/login',
    name: 'Signin',
    component: () => import('@/views/Auth/Signin.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        // HANYA BOLEH ADA SATU PATH KOSONG SEBAGAI DEFAULT REDIRECT
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Ecommerce.vue'),
      },
      {
        path: 'account',
        name: 'sys_account', // <-- Nama harus sama persis dengan routeName di menu.js
        component: () => import('@/views/Pages/Administrator/User/Account/Index.vue'), // Sementara pakai Ecommerce untuk testing
      },
      {
        path: 'roles',
        name: 'sys_roles',
        component: () => import('@/views/Pages/Administrator/User/Roles/Index.vue'),
      },
      {
        path: 'permission',
        name: 'sys_permission',
        component: () => import('@/views/Pages/Administrator/User/Permission/Index.vue'),
      },
      {
        path: 'document',
        name: 'sys_docs',
        component: () => import('@/views/Pages/Administrator/Config/DocsNumb/Index.vue'),
      },
      {
        path: 'logs',
        name: 'sys_logs',
        component: () => import('@/views/Pages/Administrator/Config/SystemLogs/Index.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Signin' })
  } else if (to.name === 'Signin' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
