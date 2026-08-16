import {
  Routes
} from '@angular/router';

export const auditLogsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/audit-logs-list/audit-logs-list.page'
      )
        .then(
          module =>
            module.AuditLogsListPage
        )
  }
];
