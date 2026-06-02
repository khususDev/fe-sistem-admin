<script setup>
defineProps({
    modelValue: Boolean,
    label: String,
});

defineEmits(["update:modelValue"]);
</script>

<template>
    <label class="flex items-center gap-3 cursor-pointer">
        <input
            type="checkbox"
            :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)"
            class="h-5 w-5"
        />

        <span class="text-black dark:text-white">
            {{ label }}
        </span>
    </label>
</template>
