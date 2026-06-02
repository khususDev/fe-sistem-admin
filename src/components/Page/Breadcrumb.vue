<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router' // Gunakan vue-router

const props = defineProps({
  pageTitle: String,
  crumbs: { type: Array, default: () => [] },
})

const route = useRoute() // Pengganti usePage()

const dynamicCrumbs = computed(() => {
  if (props.crumbs && props.crumbs.length > 0) return props.crumbs

  const path = route.path
  let segments = path.split('/').filter(Boolean)
  segments.pop()

  return segments.map((segment) => {
    return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  })
})
</script>

<template>
  <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h3 class="text-title-md2 font-bold text-black dark:text-white uppercase tracking-wide text-xl">
      {{ pageTitle }}
    </h3>
    <nav>
      <ol class="flex items-center gap-2 text-sm font-small text-gray-500">
        <li>
          <router-link to="/dashboard" class="hover:text-primary transition">Home</router-link>
        </li>
        <li v-for="(crumb, index) in dynamicCrumbs" :key="index" class="flex items-center gap-2">
          <span>/</span>
          <span class="cursor-default">{{ crumb }}</span>
        </li>
        <li class="flex items-center gap-2 text-primary font-semibold">
          <span>/</span>
          <span>{{ pageTitle }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>
