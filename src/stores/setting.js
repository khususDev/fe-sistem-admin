import { defineStore } from 'pinia'
import axios from 'axios'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: {
      app_name: 'Asset Management ERP',
      company_name: 'PT. Solusi Teknologi Nusantara',
      logo_lg: '/images/logo/logo-large.png',
      logo_sm: '/images/logo/logo-small.png',
    },
    loading: false,
  }),

  actions: {
    async fetchSettings() {
      this.loading = true
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/app/settings')
        if (response.data.success) {
          // Ganti state default dengan data asli dari database Laravel
          this.settings = response.data.data
        }
      } catch (error) {
        console.error('Gagal memuat konfigurasi aplikasi global:', error)
      } finally {
        this.loading = false
      }
    },

    // Fungsi pembantu untuk memperbarui state secara instan setelah admin menekan tombol simpan
    updateLocalSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
    },
  },
})
