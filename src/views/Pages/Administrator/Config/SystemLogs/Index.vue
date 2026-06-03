<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'

// Import Komponen Global Sesuai Standar Template Anda
import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Import Composables Bawaan Template
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const logsData = ref({})
const usersList = ref([]) // Menampung daftar nama user untuk dropdown select
const isFetching = ref(false)

const apiUrl = '/sys_logs'
const usersApiUrl = '/adm_users' // Endpoint user Anda untuk isi dropdown

// State Filter
const selectedDate = ref('')
const selectedUser = ref('')

// --- SETUP TABLE (Search & Entries Bawaan Template) ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchLogs(),
)

const isDark = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// --- FETCH DATA LOGS ---
const fetchLogs = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: {
        search: search.value,
        entries: entries.value,
        date: selectedDate.value, // Kirim parameter tanggal spesifik
        causer_id: selectedUser.value, // Kirim parameter ID user pelaku
      },
    })
    logsData.value = response.data.data
  } catch (error) {
    console.error('Gagal memuat data system logs', error)
  } finally {
    isFetching.value = false
  }
}

// --- FETCH DATA USERS (Untuk Dropdown) ---
const fetchUsersList = async () => {
  try {
    // Ambil data user, kita set entries 100 agar semua nama user ditarik masuk dropdown
    const response = await axios.get(usersApiUrl, { params: { entries: 100 } })
    usersList.value = response.data.data.data || response.data.data
  } catch (error) {
    console.error('Gagal memuat daftar user untuk filter', error)
  }
}

// --- REAKTIF WATCHER ---
// Ketika filter tanggal atau select nama user diganti, otomatis refresh tabel secara instan
watch([selectedDate, selectedUser], () => {
  fetchLogs()
})

// Fungsi Reset Filter
const resetFilter = () => {
  selectedDate.value = ''
  selectedUser.value = ''
}

// --- HELPER FORMATTING UTILS ---
const filterKeys = (attributes) => {
  if (!attributes) return {}
  const ignoredKeys = [
    'password',
    'remember_token',
    'created_at',
    'updated_at',
    'deleted_at',
    'email_verified_at',
  ]
  const filtered = {}

  for (const key in attributes) {
    if (!ignoredKeys.includes(key)) {
      filtered[key] = attributes[key]
    }
  }
  return filtered
}

const formatKey = (key) => {
  return key.replace(/_/g, ' ')
}

// --- LIFECYCLE ---
onMounted(() => {
  fetchLogs()
  fetchUsersList() // Jalankan pengisian dropdown saat halaman dibuka
})
</script>

<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="System Logs" :crumbs="['System Administrator', 'Technical Config']" />

    <DataTable
      :headers="['Date & Time', 'Actor', 'Action', 'Module', 'Change Details']"
      :from="logsData.from"
      :to="logsData.to"
      :total="logsData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <div class="flex flex-wrap items-center gap-3">
          <div class="w-48">
            <VueDatePicker
              v-model="selectedDate"
              position="top"
              :teleport="true"
              model-type="yyyy-MM-dd"
              format="dd MMMM yyyy"
              placeholder="Pilih Tanggal"
              :dark="isDark"
              class="text-sm"
            />
          </div>

          <div class="w-52">
            <select
              v-model="selectedUser"
              class="w-full rounded border border-stroke bg-gray py-2 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary text-sm cursor-pointer"
            >
              <option value="">Pilih User</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <button
            v-if="selectedDate || selectedUser"
            @click="resetFilter"
            class="text-xs font-medium text-danger hover:underline ml-1"
          >
            Clear Filter
          </button>
        </div>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="5" />

      <tr
        v-else
        v-for="log in logsData.data"
        :key="log.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center text-sm text-black dark:text-white dark:border-strokedark whitespace-nowrap"
        >
          {{ log.created_at }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white dark:border-strokedark"
        >
          {{ log.causer }}
        </td>
        <td class="border-r border-stroke px-4 py-5 text-center dark:border-sn">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
            :class="{
              'bg-success/10 text-success': log.description === 'created',
              'bg-primary/10 text-primary': log.description === 'updated',
              'bg-danger/10 text-danger': log.description === 'deleted',
              'bg-warning/10 text-warning': !['created', 'updated', 'deleted'].includes(
                log.description,
              ),
            }"
          >
            {{ log.description.toUpperCase() }}
          </span>
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center font-semibold uppercase text-black dark:text-white dark:border-strokedark"
        >
          {{ log.subject }}
        </td>

        <td class="px-4 py-5 text-left text-sm align-top text-black dark:text-white">
          <div
            v-if="log.description === 'created' && log.changes?.attributes"
            class="flex flex-col"
          >
            <span class="font-semibold text-success mb-1 text-xs">Menambahkan data baru:</span>
            <ul class="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="(val, key) in filterKeys(log.changes.attributes)" :key="key">
                <span class="capitalize font-medium text-black dark:text-white"
                  >{{ formatKey(key) }}:</span
                >
                {{ val || '-' }}
              </li>
            </ul>
          </div>

          <div
            v-else-if="log.description === 'updated' && log.changes?.attributes"
            class="flex flex-col"
          >
            <span class="font-semibold text-primary mb-1 text-xs">Mengubah data berikut:</span>
            <ul class="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="(val, key) in filterKeys(log.changes.attributes)" :key="key">
                <span class="capitalize font-medium text-black dark:text-white"
                  >{{ formatKey(key) }}:</span
                >

                <template v-if="log.changes.old">
                  <span class="line-through text-danger mx-1">{{
                    log.changes.old[key] || '(kosong)'
                  }}</span>
                  <span class="text-success font-medium">➔ {{ val || '(dikosongkan)' }}</span>
                </template>

                <template v-else>
                  <span class="text-success font-medium mx-1"
                    >➔ Diperbarui menjadi: {{ val || '(dikosongkan)' }}</span
                  >
                </template>
              </li>
            </ul>
          </div>

          <div v-else-if="log.description === 'deleted'" class="flex flex-col">
            <span class="font-semibold text-danger mb-1 text-xs">Menghapus data:</span>
            <ul class="list-disc pl-4 text-gray-600 dark:text-gray-400 space-y-1">
              <li
                v-for="(val, key) in filterKeys(log.changes.old || log.changes.attributes)"
                :key="key"
              >
                <span class="capitalize font-medium text-black dark:text-white"
                  >{{ formatKey(key) }}:</span
                >
                {{ val || '-' }}
              </li>
            </ul>
          </div>

          <span v-else class="text-gray-400 italic text-xs">Tidak ada detail perubahan</span>
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!logsData.data || logsData.data.length === 0)"
        :colspan="5"
      />

      <template #pagination>
        <Pagination :links="logsData.links" @change-page="fetchLogs" />
      </template>
    </DataTable>
  </div>
</template>
