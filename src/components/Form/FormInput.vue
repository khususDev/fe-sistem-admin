<script setup>
defineProps({
    modelValue: String,
    label: String,
    type: {
        type: String,
        default: "text",
    },
    placeholder: String,
    error: String,
    disabled: Boolean,
});

defineEmits(["update:modelValue"]);
</script>

<template>
    <div>
        <label
            class="mb-1 block text-sm font-medium text-black dark:text-white"
        >
            {{ label }}
        </label>

        <input
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-2 dark:border-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-meta-4"
        />

        <p v-if="error" class="mt-1 text-xs text-danger">
            {{ error }}
        </p>
    </div>
</template>
