<template>
  <div
    class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="border-b border-stroke px-4 py-4 md:px-6 xl:px-7.5 dark:border-strokedark">
      <div class="flex w-full items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <slot name="top-actions"></slot>
        </div>
        <div class="flex items-center gap-3">
          <slot name="right-actions"></slot>

          <div v-if="showSearch" class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                class="fill-body hover:fill-primary"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M19.225 17.8125L13.9125 12.5C14.9375 11.2375 15.5375 9.6375 15.5375 7.875C15.5375 3.65 12.1125 0.225 7.875 0.225C3.6375 0.225 0.225 3.65 0.225 7.875C0.225 12.1 3.65 15.525 7.875 15.525C9.6375 15.525 11.2375 14.925 12.5 13.9125L17.8125 19.225C18.0125 19.425 18.275 19.525 18.525 19.525C18.775 19.525 19.0375 19.425 19.225 19.225C19.6125 18.825 19.6125 18.2 19.225 17.8125ZM7.875 13.9125C4.525 13.9125 1.8375 11.2125 1.8375 7.875C1.8375 4.5375 4.525 1.8375 7.875 1.8375C11.225 1.8375 13.9125 4.5375 13.9125 7.875C13.9125 11.2125 11.225 13.9125 7.875 13.9125Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <input
              type="text"
              :value="search"
              @input="$emit('search', $event.target.value)"
              placeholder="Type to search..."
              class="w-48 rounded border border-stroke bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 md:w-64"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="m-4 rounded-lg border border-stroke dark:border-strokedark">
      <div
        class="flex flex-col gap-5 border-b border-stroke px-1 py-2 md:flex-row md:items-center md:justify-between md:px-2 dark:border-strokedark"
      >
        <div v-if="showEntries" class="flex items-center gap-3">
          <span class="text-sm font-medium text-black dark:text-white">Show</span>
          <div class="relative z-20 inline-block">
            <select
              v-model="entriesModel"
              @change="$event.target.blur()"
              class="peer relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-1.5 pl-3 pr-8 text-sm outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <span
              class="pointer-events-none absolute right-2 top-1/2 z-30 -translate-y-1/2 text-black dark:text-white"
            >
              <svg
                class="w-4 h-4 fill-current transition-transform duration-200 peer-focus:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto border border-stroke dark:border-strokedark">
        <table class="w-full table-auto whitespace-nowrap text-sm text-center">
          <thead>
            <tr class="bg-gray-2 text-center dark:bg-meta-4">
              <th
                v-for="header in headers"
                :key="header"
                class="border-r border-stroke px-4 py-4 font-bold uppercase tracking-wider text-black last:border-r-0 dark:border-strokedark dark:text-white"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <slot></slot>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showPagination"
      class="flex flex-col items-center justify-between gap-4 border-t border-stroke px-4 py-6 md:flex-row md:px-6 xl:px-7.5 dark:border-strokedark"
    >
      <p class="font-medium text-sm text-black dark:text-white">
        Showing {{ from ?? 0 }} to {{ to ?? 0 }} of {{ total ?? 0 }} entries
      </p>
      <div class="flex items-center gap-2">
        <slot name="pagination"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const emit = defineEmits(['search', 'update:entries'])
const props = defineProps({
  headers: Array,
  from: Number,
  to: Number,
  total: Number,
  search: String,
  entries: [String, Number],
  showEntries: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
})

const entriesModel = computed({
  get: () => props.entries,
  set: (value) => emit('update:entries', value),
})
</script>
