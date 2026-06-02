<script setup>
defineProps({
    modelValue: String,
    label: String,
    error: String,
});

defineEmits(["update:modelValue"]);
</script>

<template>
    <div>
        <label class="mb-2.5 block text-black dark:text-white">
            {{ label }}
        </label>

        <input
            type="date"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
        />

        <p v-if="error" class="mt-1 text-sm text-danger">
            {{ error }}
        </p>
    </div>
</template>
