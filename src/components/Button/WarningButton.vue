<script setup>
const props = defineProps({
    size: {
        type: String,
        default: "md",
    },
});

const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2 text-base",
};
</script>

<template>
    <button
        :class="[
            'inline-flex items-center justify-center rounded-md bg-warning font-medium text-white hover:bg-opacity-90',
            sizeClasses[props.size],
        ]"
    >
        <slot />
    </button>
</template>
