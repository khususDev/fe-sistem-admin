import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueApexCharts from 'vue3-apexcharts'
import { createPinia } from 'pinia'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import axios from 'axios'

const app = createApp(App)
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 })
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(VueApexCharts)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  zIndex: 9999999,
})

import { onMounted } from 'vue'
import { useSettingStore } from '@/stores/setting.js' // Import store setting
const settingStore = useSettingStore() // Inisialisasi store setting
onMounted(() => {
  settingStore.fetchSettings() // Panggil fetchSettings saat aplikasi dimuat
})

// --- KONFIGURASI AXIOS ---
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

axios.interceptors.request.use((config) => {
  NProgress.start()
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers.Accept = 'application/json'
  return config
})

axios.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },
  (error) => {
    NProgress.done()
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('permissions')
      router.push({ name: 'Signin' })
    }
    return Promise.reject(error)
  },
) // <-- Tadi kurang kurung tutup di sini

app.mount('#app')
