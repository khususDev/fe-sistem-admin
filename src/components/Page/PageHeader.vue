<script setup>
defineProps({
    title: String,
    subtitle: String,
});
</script>

<template>
    <div class="mb-6">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
            {{ title }}
        </h2>

        <p class="text-sm text-bodydark2">
            {{ subtitle }}
        </p>
    </div>
</template>
