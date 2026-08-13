import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../core/guards/permission.guard';

export const administrationRoutes:
  Routes =
[
  // =========================================================
  // USERS
  // /app/admin/users
  // =========================================================

  {
    path:
      'users',

    loadComponent:
      () =>
        import(
          './pages/users/users.page'
        )
          .then(
            module =>
              module.UsersPage
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'users.manage'
    }
  },

  // =========================================================
  // ROLES
  // /app/admin/roles
  // =========================================================

  {
    path:
      'roles',

    loadChildren:
      () =>
        import(
          './roles/roles.routes'
        )
          .then(
            module =>
              module.roleRoutes
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'roles.manage'
    }
  },

  // =========================================================
  // PERMISSIONS
  // /app/admin/permissions
  // =========================================================

  {
    path:
      'permissions',

    loadChildren:
      () =>
        import(
          './permissions/permissions.routes'
        )
          .then(
            module =>
              module.PERMISSION_ROUTES
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'permissions.manage'
    }
  },

  // =========================================================
  // NOTIFICATIONS
  // /app/admin/notifications
  // =========================================================

  {
    path:
      'notifications',

    loadComponent:
      () =>
        import(
          './pages/notifications/notifications.page'
        )
          .then(
            module =>
              module.NotificationsPage
          )
  },

  // =========================================================
  // REPORTS
  // /app/admin/reports
  // =========================================================

  {
    path:
      'reports',

    loadComponent:
      () =>
        import(
          '../finance/pages/reports/reports.page'
        )
          .then(
            module =>
              module.ReportsPage
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'reports.view'
    }
  },

  // =========================================================
  // AUDIT LOGS
  // /app/admin/audit-logs
  // =========================================================

  {
    path:
      'audit-logs',

    loadComponent:
      () =>
        import(
          '../../shared/pages/data-explorer/data-explorer.page'
        )
          .then(
            module =>
              module.DataExplorerPage
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'audit.view',

      title:
        'Audit Logs',

      endpoint:
        'audit-logs',

      columns:
      [
        {
          key:
            'createdAtUtc',

          label:
            'Time',

          type:
            'date'
        },

        {
          key:
            'userId',

          label:
            'User'
        },

        {
          key:
            'action',

          label:
            'Action'
        },

        {
          key:
            'entityType',

          label:
            'Entity'
        },

        {
          key:
            'entityId',

          label:
            'Entity ID'
        }
      ]
    }
  },

  // =========================================================
  // FEATURE FLAGS
  // /app/admin/feature-flags
  // =========================================================

  {
    path:
      'feature-flags',

    loadComponent:
      () =>
        import(
          '../../shared/resource/resource-page.component'
        )
          .then(
            module =>
              module.ResourcePageComponent
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      resource:
        'feature-flags',

      permission:
        'feature-flags.view'
    }
  },

  // =========================================================
  // SETTINGS
  // /app/admin/settings
  // =========================================================

  {
    path:
      'settings',

    loadComponent:
      () =>
        import(
          '../../shared/resource/resource-page.component'
        )
          .then(
            module =>
              module.ResourcePageComponent
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      resource:
        'settings',

      permission:
        'settings.view'
    }
  }
];
