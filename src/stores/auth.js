import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },
  actions: {
    login(username, password) {
      if (username === 'admin' && password === 'admin') {
        const mockUser = { id: 1, name: 'Super Admin', role: 'superadmin' }
        const mockToken = 'dummy-token-superadmin'

        this.user = mockUser
        this.token = mockToken
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('token', mockToken)
        return true
      }
      return false
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
