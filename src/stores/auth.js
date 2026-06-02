import { defineStore } from 'pinia'
import axios from 'axios'
// 1. TAMBAHKAN IMPORT ROUTER
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    permissions: JSON.parse(localStorage.getItem('permissions')) || [],
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    
    can: (state) => (permissionName) => {
      return state.permissions.includes(permissionName)
    }
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/login', credentials)
        
        if (response.data.success) {
          const { user, token } = response.data.data
          
          this.user = user
          this.token = token
          this.permissions = user.permissions

          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('token', token)
          localStorage.setItem('permissions', JSON.stringify(user.permissions))
          
          return { success: true }
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat login' 
        }
      }
    },

    async logout() {
      try {
        await axios.post('/logout')
      } catch (error) {
        console.error('Logout error API', error)
      } finally {
        // Hapus data dari state Pinia
        this.user = null
        this.token = null
        this.permissions = []

        // Bersihkan LocalStorage
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('permissions')

        // 2. PERINTAH SAKTI: Pindah ke halaman Signin secara instan!
        router.push({ name: 'Signin' })
      }
    }
  }
})