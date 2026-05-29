<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <h2 class="mb-4 text-title-md2 font-semibold text-black dark:text-white">
      Selamat Datang, {{ authStore.user?.name || 'User' }}!
    </h2>
    <p class="text-bodydark2">
      Fondasi frontend Anda (Auth, Router, Menu Management) sudah berhasil berjalan. Anda sekarang
      siap masuk ke tahap pembuatan form dan tabel master data.
    </p>
  </div>
</template>
