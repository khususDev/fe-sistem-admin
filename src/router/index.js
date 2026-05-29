import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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
        component: () => import('@/views/Ecommerce.vue'), // Sementara pakai Ecommerce untuk testing
      },
      {
        path: 'roles',
        name: 'sys_roles',
        component: () => import('@/views/Ecommerce.vue'),
      },
      {
        path: 'permission',
        name: 'sys_permission',
        component: () => import('@/views/Ecommerce.vue'),
      },
      {
        path: 'document',
        name: 'sys_docs',
        component: () => import('@/views/Ecommerce.vue'),
      },
      {
        path: 'logs',
        name: 'sys_logs',
        component: () => import('@/views/Ecommerce.vue'),
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
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Signin' })
  } else if (to.name === 'Signin' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
