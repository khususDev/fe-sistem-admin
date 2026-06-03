<template>
  <div class="form-group">
    <label v-if="label" class="mb-2.5 block font-medium text-sm text-black dark:text-white">
      {{ label }}
    </label>

    <div
      class="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-dark border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
      @click="$refs.fileInput.click()"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-primary bg-primary/5': isDragging }"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        :accept="accept"
        @change="handleFileChange"
      />

      <div v-if="loading" class="text-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p class="text-xs text-gray-500">Mengunggah file ke server...</p>
      </div>

      <div
        v-else-if="modelValue"
        class="w-full flex items-center justify-between gap-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <img
            v-if="isImage(modelValue)"
            :src="modelValue"
            class="h-12 w-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
          <div
            v-else
            class="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold uppercase text-gray-500"
          >
            Doc
          </div>
          <div class="text-left overflow-hidden">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
              File Terunggah
            </p>
            <a
              :href="modelValue"
              target="_blank"
              class="text-[10px] text-primary hover:underline block"
            >
              Lihat File ↗
            </a>
          </div>
        </div>

        <button
          @click.stop="removeFile"
          class="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          Hapus
        </button>
      </div>

      <div v-else class="text-center">
        <div class="mx-auto mb-2 text-gray-400 dark:text-gray-500">
          <svg
            class="mx-auto h-10 w-10 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h20a4 4 0 004-4V20m-6-12l6 6m-6-6v6a1 1 0 011 1h6m-4 6a4 4 0 11-8 0 4 4 0 018 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          <span class="text-primary font-semibold">Klik untuk upload</span> atau seret file ke sini
        </p>
        <p class="text-[10px] text-gray-400 mt-1">Maksimal ukuran file: 5MB</p>
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500 text-left">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify' // 1. IMPORT TOAST DI SINI

const props = defineProps({
  label: String,
  modelValue: String,
  error: String,
  accept: {
    type: String,
    default: 'image/*',
  },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const loading = ref(false)
const isDragging = ref(false)

const isImage = (url) => {
  if (!url) return false
  return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.includes('uploads')
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) uploadToServer(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) uploadToServer(file)
}

const uploadToServer = async (file) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    emit('update:modelValue', response.data.data.url)
    toast.success('File successfully uploaded!')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error uploading file.')
  } finally {
    loading.value = false
  }
}

const removeFile = () => {
  emit('update:modelValue', '')
  if (fileInput.value) fileInput.value.value = ''
}
</script>
