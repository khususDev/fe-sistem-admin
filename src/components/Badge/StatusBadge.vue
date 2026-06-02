<script setup>
defineProps({
    active: Boolean, // Ubah 'value' menjadi 'active'
});
</script>

<template>
    <span
        :class="
            active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        "
        class="inline-flex rounded-full px-3 py-1 text-sm font-medium"
    >
        {{ active ? "Active" : "Inactive" }}
    </span>
</template>
