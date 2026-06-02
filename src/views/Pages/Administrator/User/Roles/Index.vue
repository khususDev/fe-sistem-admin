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
const rolesData = ref({})
const allPermissions = ref([]) // Untuk menampung daftar master permission dari API
const isFetching = ref(false)

const apiUrl = 'http://127.0.0.1:8000/api/adm_roles'
const permissionsUrl = 'http://127.0.0.1:8000/api/adm_permissions'

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchRoles(),
)

// --- FETCH DATA ROLES ---
const fetchRoles = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    rolesData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data roles', error)
  } finally {
    isFetching.value = false
  }
}

// --- FETCH DATA MASTER PERMISSIONS (Untuk Checkbox) ---
const fetchAllPermissions = async () => {
  try {
    // Ambil semua permission (entries: 100) agar tampil semua di checkbox
    const response = await axios.get(permissionsUrl, { params: { entries: 100 } })
    allPermissions.value = response.data.data.data || response.data.data
  } catch (error) {
    console.error('Gagal load master permissions', error)
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
    permissions: [], // Array untuk menampung permission yang dicentang
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- CUSTOM OPEN EDIT (Agar Checkbox terisi otomatis) ---
const handleEdit = (role) => {
  // Spatie mengirim relasi permissions dalam bentuk array object [{id: 1, name: 'view-users'}]
  // Kita ubah menjadi array of string ['view-users', 'create-users'] agar Vue Checkbox mengenalnya
  const rolePermissions = role.permissions ? role.permissions.map((p) => p.name) : []

  openEdit({
    id: role.id,
    name: role.name,
    permissions: rolePermissions,
  })
}

// --- LIFECYCLE ---
onMounted(() => {
  fetchRoles()
  fetchAllPermissions()
})

const handleSubmit = () => {
  submit(fetchRoles)
}

const handleDelete = () => {
  confirmDelete(fetchRoles)
}
</script>

<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Roles Management" :crumbs="['System Administrator', 'Roles']" />

    <DataTable
      :headers="['Role Name', 'Guard', 'Total Permissions', 'Action']"
      :from="rolesData.from"
      :to="rolesData.to"
      :total="rolesData.total"
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
          Tambah Role
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="4" />

      <tr
        v-else
        v-for="role in rolesData.data"
        :key="role.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ role.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ role.guard_name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          <span
            class="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success"
          >
            {{ role.permissions ? role.permissions.length : 0 }} Kunci
          </span>
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="handleEdit(role)" @delete="openDelete(role.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!rolesData.data || rolesData.data.length === 0)"
        :colspan="4"
      />

      <template #pagination>
        <Pagination :links="rolesData.links" @change-page="fetchRoles" />
      </template>
    </DataTable>

    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Role & Permissions' : 'Tambah Role & Permissions'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-6">
        <FormInput
          label="Role Name"
          v-model="form.name"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="contoh: Kasir, Manager"
        />

        <div>
          <label class="mb-3 block text-sm font-medium text-black dark:text-white">
            Hak Akses (Permissions)
          </label>
          <div
            class="grid grid-cols-2 gap-3 rounded border border-stroke p-4 dark:border-strokedark"
          >
            <label
              v-for="perm in allPermissions"
              :key="perm.id"
              class="flex cursor-pointer items-center space-x-2"
            >
              <input
                type="checkbox"
                :value="perm.name"
                v-model="form.permissions"
                class="form-checkbox h-5 w-5 rounded border-gray-300 text-primary transition duration-150 ease-in-out"
              />
              <span class="text-sm text-black dark:text-white">{{ perm.name }}</span>
            </label>
          </div>
          <span v-if="errors?.permissions" class="text-sm text-danger mt-1 block">{{
            errors.permissions[0]
          }}</span>
        </div>
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
