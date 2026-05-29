<template>
  <div class="min-h-screen xl:flex bg-gray-50 dark:bg-boxdark-2">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import Backdrop from './Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar.js'

const { isExpanded, isHovered } = useSidebar()
</script>
