<script setup>
defineProps({
    colspan: {
        type: Number,
        default: 5,
    },

    message: {
        type: String,
        default: "Data tidak tersedia",
    },
});
</script>

<template>
    <tr>
        <td :colspan="colspan" class="px-4 py-10 text-center">
            <div class="flex flex-col items-center gap-2">
                <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-gray-400"
                >
                    <path
                        d="M3 7H21"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />

                    <path
                        d="M6 11H18"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />

                    <path
                        d="M10 15H14"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>

                <p class="text-sm text-gray-500">
                    {{ message }}
                </p>
            </div>
        </td>
    </tr>
</template>
