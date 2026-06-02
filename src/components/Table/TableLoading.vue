<script setup>
defineProps({
    rows: {
        type: Number,
        default: 5,
    },

    cols: {
        type: Number,
        default: 5,
    },
});
</script>

<template>
    <tr
        v-for="n in rows"
        :key="n"
        class="animate-pulse border-b border-stroke dark:border-strokedark"
    >
        <td v-for="c in cols" :key="c" class="px-4 py-5">
            <div class="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
    </tr>
</template>
