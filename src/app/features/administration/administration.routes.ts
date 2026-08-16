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
  path: 'users',

  loadChildren: () =>
    import(
      './users/users.routes'
    )
      .then(
        module =>
          module.userRoutes
      ),

  canActivate: [
    permissionGuard
  ],

  data: {
    permission: 'users.manage'
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

    loadChildren:
      () =>
        import(
          './notifications/notifications.routes'
        )
          .then(
            module =>
              module.notificationRoutes
          )
  },

  // =========================================================
  // REPORTS
  // /app/admin/reports
  // =========================================================

  {
    path:
      'reports',

    loadChildren:
      () =>
        import(
          './Reports/reports.routes'
        )
          .then(
            module =>
              module.reportsRoutes
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

    loadChildren:
      () =>
        import(
          './audit-logs/audit-logs.routes'
        )
          .then(
            module =>
              module.auditLogsRoutes
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'audit.view'
    }
  },

  // =========================================================
  // FEATURE FLAGS
  // /app/admin/feature-flags
  // =========================================================

  {
    path:
      'feature-flags',

    loadChildren:
      () =>
        import(
          './feature-flags/feature-flags.routes'
        )
          .then(
            module =>
              module.featureFlagsRoutes
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
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

    loadChildren:
      () =>
        import(
          './settings/settings.routes'
        )
          .then(
            module =>
              module.settingsRoutes
          ),

    canActivate:
    [
      permissionGuard
    ],

    data:
    {
      permission:
        'settings.view'
    }
  }
];
