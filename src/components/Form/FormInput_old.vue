<template>
    <div class="mb-4.5">
        <label class="mb-2.5 block text-black dark:text-white">
            {{ label }} <span v-if="required" class="text-meta-1">*</span>
        </label>
        <input
            :type="type"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder"
            :disabled="disabled"
            :class="[
                'w-full rounded border-[1.5px] bg-transparent px-5 py-3 outline-none transition active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input',
                error
                    ? 'border-danger focus:border-danger'
                    : 'border-stroke focus:border-primary dark:border-form-strokedark dark:focus:border-primary',
            ]"
        />
        <p v-if="error" class="mt-1 text-xs text-danger">{{ error }}</p>
    </div>
</template>

<script setup>
defineProps({
    modelValue: [String, Number],
    label: String,
    type: { type: String, default: "text" },
    placeholder: String,
    error: String,
    required: Boolean,
    disabled: Boolean,
});
defineEmits(["update:modelValue"]);
</script>
