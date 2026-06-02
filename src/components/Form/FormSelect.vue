<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => [], // Format array: [{ id: 1, name: 'Admin' }, ...]
  },
  error: String,
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mb-4.5">
    <label class="mb-2.5 block text-black dark:text-white">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      :class="{ 'border-danger': error }"
    >
      <option value="" disabled>Pilih {{ label }}</option>
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
    <span v-if="error" class="text-sm text-danger mt-1 block">{{ error }}</span>
  </div>
</template>
