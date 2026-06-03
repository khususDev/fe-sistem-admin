<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb
      pageTitle="System Configuration"
      :crumbs="['System Administrator', 'Technical Config']"
    />

    <div v-if="isPageLoading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-primary mb-4"></div>
      <p class="text-sm text-gray-500 font-medium">Loading system configuration...</p>
    </div>

    <div v-else>
      <div class="flex gap-4 border-b border-stroke dark:border-strokedark mb-6">
        <button
          @click="activeTab = 'settings'"
          class="py-3 px-4 text-sm font-medium border-b-2 transition-all"
          :class="
            activeTab === 'settings'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'
          "
        >
          Application Settings
        </button>
        <button
          @click="activeTab = 'backup'"
          class="py-3 px-4 text-sm font-medium border-b-2 transition-all"
          :class="
            activeTab === 'backup'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'
          "
        >
          Database Backup
        </button>
        <button
          @click="activeTab = 'email'"
          class="py-3 px-4 text-sm font-medium border-b-2 transition-all"
          :class="
            activeTab === 'email'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'
          "
        >
          Konfigurasi Email (SMTP)
        </button>
      </div>
      <div
        v-if="activeTab === 'settings'"
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-7"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-5 text-left">
            <FormInput label="Application Name" v-model="formSettings.app_name" />
            <FormInput label="Company Name" v-model="formSettings.company_name" />

            <button
              @click="saveSettings"
              :disabled="saveLoading"
              class="rounded bg-primary py-2.5 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 text-sm w-40 mt-4"
            >
              {{ saveLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <div
            class="flex flex-col gap-6 text-left border-l border-stroke dark:border-strokedark pl-0 md:pl-6"
          >
            <FileUpload
              label="App Logo (Large Logo)"
              v-model="formSettings.logo_lg"
              accept="image/*"
            />
            <FileUpload
              label="App Logo Mini (Small Logo)"
              v-model="formSettings.logo_sm"
              accept="image/*"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="activeTab === 'backup'"
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <div class="text-left">
          <h3 class="font-semibold text-black dark:text-white text-base">Backup History</h3>
          <p class="text-xs text-gray-500 mt-0.5">
            All backup files with .sql extension are securely stored on the server.
          </p>
        </div>
        <button
          @click="generateBackup"
          :disabled="backupLoading"
          class="rounded bg-warning py-2 px-4 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 text-xs flex items-center gap-2"
        >
          <span
            v-if="backupLoading"
            class="animate-spin inline-block h-3 w-3 border-b-2 border-white rounded-full"
          ></span>
          {{ backupLoading ? 'Processing...' : 'Backup Database' }}
        </button>
      </div>

      <div v-if="backupProgress > 0 || backupLoading" class="w-full mb-6">
        <div class="flex justify-between mb-1 text-xs font-medium dark:text-white">
          <span class="text-primary">{{
            backupProgress === 100 ? 'Backup Completed!' : 'Extracting Database...'
          }}</span>
          <span>{{ backupProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: backupProgress + '%' }"
          ></div>
        </div>
      </div>

      <div
        class="max-w-full overflow-x-auto border border-stroke dark:border-strokedark rounded-lg mt-2"
      >
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="py-3 px-4 font-medium text-black dark:text-white text-xs">
                SQL File Name
              </th>
              <th class="py-3 px-4 font-medium text-black dark:text-white text-xs">Data Size</th>
              <th class="py-3 px-4 font-medium text-black dark:text-white text-xs">Backup Time</th>
              <th class="py-3 px-4 font-medium text-black dark:text-white text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="backups.length === 0">
              <td colspan="4" class="py-6 text-center text-xs text-gray-500 italic">
                No backup files available.
              </td>
            </tr>
            <tr
              v-else
              v-for="file in backups"
              :key="file.filename"
              class="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
            >
              <td class="py-3 px-4 text-xs font-medium text-black dark:text-white">
                {{ file.filename }}
              </td>
              <td class="py-3 px-4 text-xs text-gray-600 dark:text-gray-400">{{ file.size }}</td>
              <td class="py-3 px-4 text-xs text-gray-600 dark:text-gray-400">
                {{ file.created_at }}
              </td>
              <td class="py-3 px-4 text-center flex justify-center gap-3">
                <a
                  :href="'http://127.0.0.1:8000/api/database/backup/download/' + file.filename"
                  class="text-xs text-primary hover:underline font-semibold"
                >
                  Download
                </a>
                <button
                  @click="openConfirmModal(file.filename)"
                  class="text-xs text-danger hover:underline font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="activeTab === 'email'"
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-7"
    >
      <h3 class="font-semibold text-black dark:text-white text-base mb-5">
        Server Pengiriman Email (SMTP)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormInput label="SMTP Host (cth: smtp.gmail.com)" v-model="formSettings.mail_host" />
        <FormInput label="SMTP Port (cth: 587 atau 465)" v-model="formSettings.mail_port" />
        <FormInput label="SMTP Username (Email)" v-model="formSettings.mail_username" />
        <FormInput
          label="SMTP Password (App Password)"
          type="password"
          v-model="formSettings.mail_password"
        />
        <FormInput label="Enkripsi (tls / ssl)" v-model="formSettings.mail_encryption" />
      </div>
      <hr class="border-stroke dark:border-strokedark mb-6" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Nama Pengirim (Sender Name)" v-model="formSettings.mail_from_name" />
        <FormInput
          label="Alamat Pengirim (Sender Email)"
          v-model="formSettings.mail_from_address"
        />
      </div>

      <button
        @click="saveSettings"
        :disabled="saveLoading"
        class="rounded bg-primary py-2.5 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 text-sm w-40 mt-6"
      >
        {{ saveLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </div>
    <ConfirmModal
      :show="showConfirmModal"
      title="Remove Backup File"
      :message="`Are you sure you want to delete the file ${selectedFile}? This action will delete it permanently.`"
      @close="closeModal"
      @confirm="executeDeleteBackup"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useSettingStore } from '@/stores/setting'
import { toast } from 'vue3-toastify' // Import Toast yang Benar
import ConfirmModal from '@/Components/modal/ConfirmModal.vue'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import FileUpload from '@/Components/Form/FileUpload.vue'

const settingStore = useSettingStore()

const activeTab = ref('settings')

const saveLoading = ref(false)
const backupLoading = ref(false)
const backupProgress = ref(0)
let progressInterval = null
const isPageLoading = ref(true)

const backups = ref([])
const formSettings = ref({
  app_name: '',
  company_name: '',
  logo_lg: '',
  logo_sm: '',
})

// STATE KHUSUS UNTUK MODAL HAPUS
const showConfirmModal = ref(false)
const selectedFile = ref(null)

// FUNGSI 1: Membuka Modal
const openConfirmModal = (filename) => {
  selectedFile.value = filename
  showConfirmModal.value = true
}

// FUNGSI 2: Menutup Modal
const closeModal = () => {
  showConfirmModal.value = false
  selectedFile.value = null
}

// FUNGSI 3: Mengeksekusi Penghapusan (Pengganti deleteBackup lama)
const executeDeleteBackup = async () => {
  if (!selectedFile.value) return

  try {
    await axios.delete(`http://127.0.0.1:8000/api/database/backup/${selectedFile.value}`)
    toast.success('Backup file has been successfully deleted.')
    fetchBackupsList()
  } catch (err) {
    toast.error('Something went wrong: ' + (err.response?.data?.message || err.message))
  } finally {
    // Tutup modal setelah proses selesai (baik sukses maupun error)
    closeModal()
  }
}

const loadCurrentSettings = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/app_settings')

    formSettings.value = {
      app_name: res.data.data.app_name || '',
      company_name: res.data.data.company_name || '',
      logo_lg: res.data.data.logo_lg || '',
      logo_sm: res.data.data.logo_sm || '',

      // --- TAMBAHAN SMTP ---
      mail_host: res.data.data.mail_host || '',
      mail_port: res.data.data.mail_port || '',
      mail_username: res.data.data.mail_username || '',
      mail_password: res.data.data.mail_password || '',
      mail_encryption: res.data.data.mail_encryption || '',
      mail_from_address: res.data.data.mail_from_address || '',
      mail_from_name: res.data.data.mail_from_name || '',
    }

    settingStore.updateLocalSettings(formSettings.value)
  } catch (err) {
    toast.error(
      'Something went wrong while loading current settings: ' +
        (err.response?.data?.message || err.message),
    )
  }
}

const saveSettings = async () => {
  saveLoading.value = true
  try {
    const res = await axios.put('http://127.0.0.1:8000/api/app_settings', formSettings.value)

    settingStore.updateLocalSettings(formSettings.value)

    toast.success(res.data.message || 'System settings updated successfully!')
  } catch (err) {
    toast.error(
      'Something went wrong while saving settings: ' +
        (err.response?.data?.error_detail || err.response?.data?.message || 'Server Error'),
    )
  } finally {
    saveLoading.value = false
  }
}

const fetchBackupsList = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/database/backups')
    backups.value = res.data.data
  } catch (err) {
    toast.error(
      'Something went wrong while fetching backups: ' +
        (err.response?.data?.message || err.message),
    )
  }
}

const startProgress = () => {
  backupProgress.value = 0
  progressInterval = setInterval(() => {
    if (backupProgress.value < 90) {
      backupProgress.value += Math.floor(Math.random() * 10) + 1
    }
  }, 400)
}

const generateBackup = async () => {
  backupLoading.value = true
  startProgress()

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/database/backup')

    if (res.data.success) {
      clearInterval(progressInterval)
      backupProgress.value = 100

      setTimeout(() => {
        // PERBAIKAN: Hanya gunakan vue3-toastify (Swal & proxy.$toast dihapus)
        toast.success('Backup database successfully generated!')

        fetchBackupsList()
        backupLoading.value = false

        setTimeout(() => {
          backupProgress.value = 0
        }, 1500)
      }, 400)
    }
  } catch (err) {
    clearInterval(progressInterval)
    backupProgress.value = 0
    backupLoading.value = false
    toast.error(
      'Something went wrong while generating backup: ' +
        (err.response?.data?.message || err.message),
    )
  }
}

onMounted(async () => {
  isPageLoading.value = true
  await Promise.all([loadCurrentSettings(), fetchBackupsList()])
  isPageLoading.value = false
})
</script>
