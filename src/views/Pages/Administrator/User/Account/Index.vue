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
import FormCheckbox from '@/Components/Form/FormCheckbox.vue'
import FormSelect from '@/Components/Form/FormSelect.vue' // Komponen baru
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'
import FileUpload from '@/Components/Form/FileUpload.vue' // Komponen baru untuk upload file

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const usersData = ref({})
const rolesList = ref([]) // State untuk menampung daftar Role di dropdown
const isFetching = ref(false)

const apiUrl = 'http://127.0.0.1:8000/api/adm_users'
const rolesUrl = 'http://127.0.0.1:8000/api/adm_roles' // Sesuaikan jika endpoint role Anda sudah diubah namanya

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchUsers(),
)

// --- FETCH DATA USERS ---
const fetchUsers = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    usersData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data', error)
  } finally {
    isFetching.value = false
  }
}

// --- FETCH DATA ROLES (Untuk Dropdown Form) ---
const fetchRolesList = async () => {
  try {
    // Ambil data role tanpa batas pagination untuk mengisi dropdown
    const response = await axios.get(rolesUrl, { params: { entries: 100 } })
    rolesList.value = response.data.data.data || response.data.data
  } catch (error) {
    console.error('Gagal load roles', error)
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
    email: '',
    password: '',
    role_id: '',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchUsers()
  fetchRolesList()
})

const handleSubmit = () => {
  submit(fetchUsers)
}

const handleDelete = () => {
  confirmDelete(fetchUsers)
}
</script>

<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="User Account" :crumbs="['System Administrator', 'Users & Security']" />

    <DataTable
      :headers="['Name', 'Email', 'Role', 'Status', 'Action']"
      :from="usersData.from"
      :to="usersData.to"
      :total="usersData.total"
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
          Tambah User
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="5" />

      <tr
        v-else
        v-for="user in usersData.data"
        :key="user.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ user.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ user.email }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center uppercase text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ user.role ? user.role.name : '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="user.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEdit(user)" @delete="openDelete(user.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!usersData.data || usersData.data.length === 0)"
        :colspan="5"
      />

      <template #pagination>
        <Pagination :links="usersData.links" @change-page="fetchUsers" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit User' : 'Tambah User'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="Full Name"
          v-model="form.name"
          :error="errors?.name ? errors.name[0] : null"
        />

        <FormInput
          label="Email Address"
          type="email"
          v-model="form.email"
          :error="errors?.email ? errors.email[0] : null"
        />

        <FormInput
          :label="isEdit ? 'Password (Kosongkan jika tidak diubah)' : 'Password'"
          type="password"
          v-model="form.password"
          :error="errors?.password ? errors.password[0] : null"
        />

        <FormSelect
          label="Role"
          v-model="form.role_id"
          :options="rolesList"
          :error="errors?.role_id ? errors.role_id[0] : null"
        />

        <FormCheckbox label="Active" v-model="form.is_active" />
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
