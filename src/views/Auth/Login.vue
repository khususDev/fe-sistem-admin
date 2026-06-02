<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State form
const form = ref({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

// Fungsi eksekusi login
const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  // Memanggil aksi login dari Pinia Store
  const response = await authStore.login(form.value)

  if (response.success) {
    // Jika sukses, arahkan ke halaman Dashboard (atau halaman utama)
    router.push('/')
  } else {
    // Jika gagal, tampilkan pesan error dari backend
    errorMessage.value = response.message
  }

  isLoading.value = false
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100 dark:bg-boxdark-2">
    <div
      class="w-full max-w-md rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Sistem ERP Administrator
        </h2>
        <p class="text-sm text-gray-500 mt-2">Silakan login untuk melanjutkan</p>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 rounded border border-danger bg-danger/10 p-3 text-center text-sm text-danger"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="mb-2.5 block font-medium text-black dark:text-white">Email</label>
          <div class="relative">
            <input
              v-model="form.email"
              type="email"
              placeholder="Masukkan email Anda"
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="mb-2.5 block font-medium text-black dark:text-white">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              type="password"
              placeholder="Masukkan password Anda"
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
        </div>

        <div class="mb-5">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full cursor-pointer rounded bg-primary py-3 px-5 text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
          >
            {{ isLoading ? 'Memproses...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
