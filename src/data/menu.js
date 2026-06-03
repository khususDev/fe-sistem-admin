export const menuData = [
  // ---------------- GRUP 1 ----------------
  {
    groupName: 'MENU UTAMA',
    menus: [
      {
        label: 'Dashboard',
        routeName: 'Dashboard',
        roles: ['superadmin', 'admin', 'user'],
        submenus: [],
      },
    ],
  },

  {
    groupName: 'System Administrator',
    menus: [
      {
        label: 'Users & Security',
        routeName: null,
        roles: ['superadmin', 'admin_gudang'],
        submenus: [
          {
            label: 'Users Account',
            routeName: 'sys_account',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Roles',
            routeName: 'sys_roles',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Permissions',
            routeName: 'sys_permission',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
        ],
      },
      {
        label: 'Technical Config',
        routeName: null,
        roles: ['superadmin', 'admin_gudang'],
        submenus: [
          {
            label: 'System Setting',
            routeName: 'sys_setting',
            roles: ['superadmin'],
            submenus: [],
          },
          {
            label: 'Document Numbering',
            routeName: 'sys_docs',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'System Logs',
            routeName: 'sys_logs',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
        ],
      },
    ],
  },

  // Tambahkan Grup 4, 5, 6, dst di bawah sini...
]
