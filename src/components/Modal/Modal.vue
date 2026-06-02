<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
  >
    <div
      class="flex w-full max-w-md flex-col rounded-lg bg-white shadow-lg dark:bg-boxdark max-h-[85vh]"
    >
      <div
        class="flex items-center justify-between border-b border-stroke px-5 py-3 dark:border-strokedark"
      >
        <h3 class="text-base font-semibold text-black dark:text-white">
          {{ title }}
        </h3>
        <button @click="$emit('close')" class="text-2xl hover:text-danger leading-none">
          &times;
        </button>
      </div>

      <div class="overflow-y-auto px-5 py-4">
        <slot></slot>
      </div>

      <div class="flex justify-end gap-3 border-t border-stroke px-5 py-3 dark:border-strokedark">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, title: String })
defineEmits(['close'])
</script>
