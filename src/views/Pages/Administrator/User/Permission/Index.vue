<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const permissionsData = ref({})
const isFetching = ref(false)

// URL mengarah ke endpoint yang baru saja kita perbaiki
const apiUrl = 'http://127.0.0.1:8000/api/adm_permissions'

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchPermissions(),
)

// --- FETCH DATA ---
const fetchPermissions = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    permissionsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data', error)
  } finally {
    isFetching.value = false
  }
}

// --- SETUP CRUD ---
const {
  form,
  errors,
  showModal,
  showDeleteModal,
  isEdit,
  loading,
  openCreate,
  openEdit,
  closeModal,
  submit,
  openDelete,
  closeDeleteModal,
  confirmDelete,
} = useCrud({
  initialForm: {
    name: '',
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchPermissions()
})

const handleSubmit = () => {
  submit(fetchPermissions)
}

const handleDelete = () => {
  confirmDelete(fetchPermissions)
}
</script>

<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Permissions" :crumbs="['System Administrator', 'Permissions']" />

    <DataTable
      :headers="['Permission Name', 'Guard', 'Action']"
      :from="permissionsData.from"
      :to="permissionsData.to"
      :total="permissionsData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button
          @click="openCreate"
          class="rounded bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Tambah Permission
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="3" :cols="3" />

      <tr
        v-else
        v-for="permission in permissionsData.data"
        :key="permission.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ permission.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ permission.guard_name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEdit(permission)" @delete="openDelete(permission.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!permissionsData.data || permissionsData.data.length === 0)"
        :colspan="3"
      />

      <template #pagination>
        <Pagination :links="permissionsData.links" @change-page="fetchPermissions" />
      </template>
    </DataTable>

    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Permission' : 'Tambah Permission'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="Permission Name (Gunakan format kebab-case)"
          v-model="form.name"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="contoh: create-users, view-laporan"
        />
      </div>

      <template #footer>
        <button @click="closeModal" class="px-4 py-2 text-black dark:text-white">Cancel</button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {{ loading ? 'Saving...' : 'Simpan' }}
        </button>
      </template>
    </Modal>

    <ConfirmModal :show="showDeleteModal" @close="closeDeleteModal" @confirm="handleDelete" />
  </div>
</template>
