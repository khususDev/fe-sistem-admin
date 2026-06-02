<template>
  <div v-if="links && links.length > 3" class="flex flex-wrap gap-1">
    <template v-for="(link, key) in links" :key="key">
      <div
        v-if="link.url === null"
        class="flex items-center justify-center rounded border border-stroke px-3 py-1.5 text-gray-400 dark:border-strokedark cursor-not-allowed"
        v-html="link.label"
      />
      <button
        v-else
        @click="$emit('change-page', link.url)"
        class="flex items-center justify-center rounded border border-stroke px-3 py-1.5 font-medium hover:bg-primary hover:text-white dark:border-strokedark dark:text-white transition"
        :class="{ 'bg-primary text-white border-primary': link.active }"
        v-html="link.label"
      />
    </template>
  </div>
</template>

<script setup>
// Buang import Link dari inertia
defineProps({ links: Array })
defineEmits(['change-page'])
</script>
