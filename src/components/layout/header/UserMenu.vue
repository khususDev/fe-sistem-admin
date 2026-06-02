<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/owner.jpg" alt="User" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">
        {{ authStore.user?.name || 'User' }}
      </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ authStore.user?.name || 'User' }}
        </span>

        <span
          class="mt-0.5 block text-theme-xs text-gray-500 uppercase dark:text-gray-400 font-semibold text-primary"
        >
          {{ authStore.user?.roles?.[0] || 'Guest' }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.text">
          <button
            v-if="item.text === 'Edit profile'"
            @click="openEditProfile"
            class="flex w-full items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </button>

          <router-link
            v-else
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>

      <button
        @click="signOut"
        class="flex w-full items-center gap-3 px-3 py-2 mt-3 font-medium text-left text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </button>
    </div>
  </div>

  <Modal :show="showProfileModal" title="Edit Profil Akun" @close="showProfileModal = false">
    <div class="p-6 flex flex-col gap-4 text-left">
      <FormInput
        label="Nama Lengkap"
        v-model="form.name"
        :error="errors?.name ? errors.name[0] : null"
      />

      <FormInput
        label="Alamat Email"
        type="email"
        v-model="form.email"
        :error="errors?.email ? errors.email[0] : null"
      />

      <hr class="border-gray-200 dark:border-gray-800 my-2" />
      <p class="text-xs text-gray-500 dark:text-gray-400 italic">
        *Kosongkan kolom password di bawah ini jika tidak ingin mengubah password saat ini.
      </p>

      <FormInput
        label="Password Baru"
        type="password"
        v-model="form.password"
        :error="errors?.password ? errors.password[0] : null"
      />

      <FormInput
        label="Konfirmasi Password Baru"
        type="password"
        v-model="form.password_confirmation"
        :error="errors?.password_confirmation ? errors.password_confirmation[0] : null"
      />
    </div>

    <template #footer>
      <button
        @click="showProfileModal = false"
        class="px-4 py-2 text-black dark:text-white text-sm"
      >
        Batal
      </button>
      <button
        @click="handleUpdateProfile"
        :disabled="loading"
        class="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 text-sm"
      >
        {{ loading ? 'Saving...' : 'Simpan' }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import axios from 'axios'

// Import Store & Komponen Pendukung Global Anda
import { useAuthStore } from '@/stores/auth'
import Modal from '@/Components/Modal/Modal.vue'
import FormInput from '@/Components/Form/FormInput.vue'

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const authStore = useAuthStore()
const router = useRouter()

// Mengambil fungsi $toast internal template secara aman
const { proxy } = getCurrentInstance()

// State Form & Validasi Modal Profile
const showProfileModal = ref(false)
const loading = ref(false)
const errors = ref(null)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Edit profile' },
  { href: '/chat', icon: SettingsIcon, text: 'Account settings' },
  { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

// Fungsi membuka modal & memindahkan nilai user saat ini ke formulir modal
const openEditProfile = () => {
  closeDropdown()
  errors.value = null

  form.value.name = authStore.user?.name || ''
  form.value.email = authStore.user?.email || ''
  form.value.password = ''
  form.value.password_confirmation = ''

  showProfileModal.value = true
}

// Fungsi eksekusi pengiriman data ke API Laravel
const handleUpdateProfile = async () => {
  loading.value = true
  errors.value = null

  try {
    const response = await axios.put('http://127.0.0.1:8000/api/adm_profile/update', form.value)

    // ==================================================================
    // SOLUSI AMPUH: Paksa Pinia Store mengambil ulang data user dari DB
    // ==================================================================
    // Cari fungsi fetch/get user bawaan di authStore Anda.
    // Biasanya bernama authStore.fetchUser(), authStore.getUser(), atau authStore.me()
    if (typeof authStore.fetchUser === 'function') {
      await authStore.fetchUser()
    } else if (typeof authStore.getUser === 'function') {
      await authStore.getUser()
    } else {
      // Jika nama fungsinya berbeda, alternatif saktinya adalah memperbarui target objek secara langsung:
      if (authStore.user) {
        authStore.user.name = response.data.data.name
        authStore.user.email = response.data.data.email
      }
      // Dan paksa localstorage ditulis ulang menggunakan state Pinia saat ini
      localStorage.setItem('auth', JSON.stringify({ user: authStore.user }))
    }

    showProfileModal.value = false

    // Pemicu Toast bawaan template
    if (proxy && proxy.$toast) {
      proxy.$toast.success('Profil Anda berhasil diperbarui!', { timeout: 3000 })
    } else {
      alert('Profil Anda berhasil diperbarui!')
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors
    } else {
      console.error('Gagal memperbarui profil:', error)
    }
  } finally {
    loading.value = false
  }
}

const signOut = () => {
  authStore.logout()
  closeDropdown()
  router.push({ name: 'Signin' })
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
