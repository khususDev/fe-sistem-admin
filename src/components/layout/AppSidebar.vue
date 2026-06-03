<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div :class="['py-8 flex', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
      <router-link to="/">
        <template v-if="isExpanded || isHovered || isMobileOpen">
          <img
            :src="settingStore.settings.logo_lg"
            alt="Logo"
            class="max-h-11 object-contain dark:brightness-100"
            :class="{
              'dark:invert': settingStore.settings.logo_lg === '/images/logo/logo-large.png',
            }"
          />
        </template>

        <template v-else>
          <img
            :src="settingStore.settings.logo_sm"
            alt="Logo Icon"
            class="h-8 w-8 object-contain"
          />
        </template>
      </router-link>
    </div>

    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in mappedMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>

            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems && item.subItems.length > 0"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ item.name }}
                  </span>
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
                      },
                    ]"
                  />
                </button>

                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ item.name }}
                  </span>
                </router-link>

                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          v-if="!subItem.subItems || subItem.subItems.length === 0"
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                        </router-link>

                        <div v-else>
                          <div
                            class="menu-dropdown-item menu-dropdown-item-inactive cursor-default text-gray-500 font-semibold mt-2"
                          >
                            {{ subItem.name }}
                          </div>
                          <ul
                            class="mt-1 space-y-1 ml-4 border-l border-gray-200 dark:border-gray-800"
                          >
                            <li v-for="subSubItem in subItem.subItems" :key="subSubItem.name">
                              <router-link
                                :to="subSubItem.path"
                                :class="[
                                  'menu-dropdown-item text-sm pl-4',
                                  {
                                    'menu-dropdown-item-active': isActive(subSubItem.path),
                                    'menu-dropdown-item-inactive': !isActive(subSubItem.path),
                                  },
                                ]"
                              >
                                - {{ subSubItem.name }}
                              </router-link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>

    <div
      v-if="isExpanded || isHovered || isMobileOpen"
      class="p-4 text-center text-[10px] text-gray-400 border-t border-gray-100 dark:border-gray-800 mt-auto"
    >
      &copy; {{ new Date().getFullYear() }} <br />
      {{ settingStore.settings.company_name }}
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebar } from '@/composables/useSidebar'

// Impor data menu external Anda
import { menuData } from '@/data/menu.js'

import { GridIcon, ChevronDownIcon, HorizontalDots } from '../../icons'
import SidebarWidget from './SidebarWidget.vue'
import { useSettingStore } from '@/stores/setting'

const settingStore = useSettingStore()
const route = useRoute()
const authStore = useAuthStore()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()

// Translator: Mengubah struktur menuData menjadi format yang dipahami oleh Template
const mappedMenuGroups = computed(() => {
  const userRoles = authStore.user?.roles || []

  const hasAccess = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true

    return allowedRoles.some((allowed) =>
      userRoles.some(
        (userRole) =>
          userRole.toLowerCase().replace(/\s/g, '') === allowed.toLowerCase().replace(/\s/g, ''),
      ),
    )
  }

  return menuData
    .map((group) => {
      const items = group.menus
        .filter((menu) => hasAccess(menu.roles))
        .map((menu) => {
          return {
            name: menu.label,
            icon: GridIcon,
            path: menu.routeName ? { name: menu.routeName } : null,

            subItems: menu.submenus
              ?.filter((sub) => hasAccess(sub.roles))
              .map((sub) => {
                return {
                  name: sub.label,
                  path: sub.routeName ? { name: sub.routeName } : null,

                  subItems: sub.submenus
                    ?.filter((sub2) => hasAccess(sub2.roles))
                    .map((sub2) => {
                      return {
                        name: sub2.label,
                        path: sub2.routeName ? { name: sub2.routeName } : null,
                      }
                    }),
                }
              }),
          }
        })

      return {
        title: group.groupName,
        items: items,
      }
    })
    .filter((group) => group.items.length > 0)
})

const isActive = (pathObj) => {
  if (pathObj && pathObj.name) {
    return route.name === pathObj.name
  }
  return false
}

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isAnySubmenuRouteActive = computed(() => {
  return mappedMenuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => {
          const isLevel2Active = isActive(subItem.path)
          const isLevel3Active =
            subItem.subItems && subItem.subItems.some((sub3) => isActive(sub3.path))
          return isLevel2Active || isLevel3Active
        }),
    ),
  )
})

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      mappedMenuGroups.value[groupIndex]?.items[itemIndex]?.subItems?.some((subItem) => {
        const isLevel2Active = isActive(subItem.path)
        const isLevel3Active =
          subItem.subItems && subItem.subItems.some((sub3) => isActive(sub3.path))
        return isLevel2Active || isLevel3Active
      }))
  )
}

const startTransition = (el) => {
  el.style.height = 'auto'
  const height = el.scrollHeight
  el.style.height = '0px'
  el.offsetHeight // force reflow
  el.style.height = height + 'px'
}

const endTransition = (el) => {
  el.style.height = ''
}
</script>
