<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number, Boolean],
        default: "",
    },

    options: {
        type: Array,
        default: () => [],
    },

    placeholder: {
        type: String,
        default: "Pilih",
    },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <select
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
        class="rounded-lg border border-stroke bg-transparent px-4 py-2 pr-10 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
    >
        <option value="">
            {{ placeholder }}
        </option>

        <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
        >
            {{ option.label }}
        </option>
    </select>
</template>
