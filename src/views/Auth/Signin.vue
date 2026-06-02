<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                class="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Back to dashboard
            </router-link>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>

              <div>
                <form @submit.prevent="handleLogin">
                  <div v-if="errorMessage" class="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
                    {{ errorMessage }}
                  </div>

                  <div class="mb-4">
                    <input
                      type="email"
                      v-model="form.email"
                      placeholder="Masukkan email"
                      required
                      class="w-full rounded border-2 border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div class="mb-6">
                    <input
                      type="password"
                      v-model="form.password"
                      placeholder="Masukkan password"
                      required
                      class="w-full rounded border-2 border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full cursor-pointer rounded-lg border border-primary bg-blue-600 p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
                  >
                    {{ isLoading ? 'Memproses...' : 'Sign In' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
          <div class="flex items-center justify-center z-1">
            <div class="flex flex-col items-center max-w-xs">
              <p class="text-center text-gray-400 dark:text-white/60">Sistem ERP Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Pastikan path ini sesuai dengan struktur folder Anda

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const response = await authStore.login(form.value)

  if (response.success) {
    router.push({ name: 'Dashboard' })
  } else {
    errorMessage.value = response.message
  }

  isLoading.value = false
}
</script>
